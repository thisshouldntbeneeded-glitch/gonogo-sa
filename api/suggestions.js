// Vercel Serverless Function: /api/suggestions
// Generates AI-powered, brand-specific improvement suggestions using Perplexity
// Cached in Supabase — refreshable once per 7 days

const SUPABASE_URL = 'https://fnpxaneextqidbessnej.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_132Gl37kwIXtdJc5VHtGCw_iXPxa6cW';
const PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY || '';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const {
    brandSlug,
    brandName,
    categoryName,
    score,
    verdict,
    frameworkBreakdown,
    keyConcerns,
    keyStrengths,
    topNegativeTheme
  } = req.body || {};

  if (!brandSlug || !brandName) {
    return res.status(400).json({ error: 'brandSlug and brandName required' });
  }

  // Check 7-day gate — return cached if still fresh
  const existing = await fetchExisting(brandSlug);
  if (existing && existing.ai_suggestions && existing.ai_suggestions_updated_at) {
    const updatedAt = new Date(existing.ai_suggestions_updated_at).getTime();
    if (Date.now() - updatedAt < SEVEN_DAYS_MS) {
      const nextRefresh = new Date(updatedAt + SEVEN_DAYS_MS).toISOString();
      return res.status(200).json({
        ok: true,
        cached: true,
        suggestions: existing.ai_suggestions,
        last_updated: existing.ai_suggestions_updated_at,
        can_refresh: false,
        next_refresh: nextRefresh
      });
    }
  }

  if (!PERPLEXITY_KEY) {
    return res.status(500).json({
      error: 'PERPLEXITY_API_KEY not configured in Vercel environment variables.'
    });
  }

  // Build context strings
  const frameworkText = (frameworkBreakdown || []).map(function(f) {
    return '- ' + f.category + ': ' + f.score + (f.description ? ' — ' + f.description : '');
  }).join('\n');

  const concernsText = (keyConcerns || []).length
    ? (keyConcerns || []).join('; ')
    : 'none listed';

  const strengthsText = (keyStrengths || []).length
    ? (keyStrengths || []).join('; ')
    : 'none listed';

  const themeText = topNegativeTheme
    ? '\nMost repeated customer complaint: "' + topNegativeTheme + '"'
    : '';

  const prompt = `You are a brand improvement advisor for GoNoGo, South Africa's independent brand rating platform.

BRAND: "${brandName}"
INDUSTRY: ${categoryName || 'General'}
GONOGO SCORE: ${score}/100 (${verdict})

FRAMEWORK SCORES:
${frameworkText || 'No framework data available'}

KEY CONCERNS: ${concernsText}
KEY STRENGTHS: ${strengthsText}${themeText}

Your task: Generate a structured improvement plan with exactly 6 categories matching these names exactly:
Compliance, Customer Satisfaction, Product Value, Innovation, Customer Support, Accessibility & Security

For each category, provide exactly 2 actionable steps. Each step must be:
- Specific to "${brandName}" and their actual score/situation above (not generic advice)
- Immediately actionable — something they can start this week
- The "how" field must explain the implementation in 2–3 practical sentences with specific details

Return ONLY valid JSON in this exact format, nothing else:
{
  "categories": [
    {
      "name": "Compliance",
      "steps": [
        {"title": "Concise specific action title", "how": "2-3 sentence practical explanation of exactly how to do this."},
        {"title": "Concise specific action title", "how": "2-3 sentence practical explanation of exactly how to do this."}
      ]
    },
    {
      "name": "Customer Satisfaction",
      "steps": [...]
    },
    {
      "name": "Product Value",
      "steps": [...]
    },
    {
      "name": "Innovation",
      "steps": [...]
    },
    {
      "name": "Customer Support",
      "steps": [...]
    },
    {
      "name": "Accessibility & Security",
      "steps": [...]
    }
  ]
}`;

  try {
    const pplxRes = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + PERPLEXITY_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a precise brand improvement advisor. Return only valid JSON with no markdown fences or extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2000
      })
    });

    if (!pplxRes.ok) {
      const errText = await pplxRes.text();
      return res.status(500).json({ error: 'Perplexity API error', details: errText });
    }

    const pplxData = await pplxRes.json();
    const content = pplxData.choices && pplxData.choices[0]
      ? pplxData.choices[0].message.content
      : '';

    let suggestions;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(jsonStr);
    } catch (e) {
      return res.status(500).json({
        error: 'Failed to parse suggestions response',
        raw: content.substring(0, 500)
      });
    }

    // Validate basic structure
    if (!suggestions.categories || !Array.isArray(suggestions.categories)) {
      return res.status(500).json({ error: 'Invalid suggestions structure returned', raw: content.substring(0, 300) });
    }

    const today = new Date().toISOString();
    await supabasePatch(brandSlug, {
      ai_suggestions: suggestions,
      ai_suggestions_updated_at: today
    });

    return res.status(200).json({
      ok: true,
      cached: false,
      suggestions: suggestions,
      last_updated: today,
      can_refresh: false,
      next_refresh: new Date(Date.now() + SEVEN_DAYS_MS).toISOString()
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function fetchExisting(slug) {
  try {
    const url = SUPABASE_URL + '/rest/v1/brands?slug=eq.' + encodeURIComponent(slug) +
      '&region=eq.za&select=ai_suggestions,ai_suggestions_updated_at&limit=1';
    const r = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      }
    });
    if (!r.ok) return null;
    const rows = await r.json();
    return (rows && rows[0]) ? rows[0] : null;
  } catch (e) {
    return null;
  }
}

async function supabasePatch(slug, data) {
  const url = SUPABASE_URL + '/rest/v1/brands?slug=eq.' + encodeURIComponent(slug) + '&region=eq.za';
  const r = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error('Supabase PATCH failed: ' + text);
  }
}
