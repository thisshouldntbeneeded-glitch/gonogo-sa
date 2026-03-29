/* ============================================================
   admin-scoring.js — GoNoGo SA Scoring Engine (ALL 21 Industries)
   Generated 2026-03-28 — replaces Banking-only seed
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     SEED DATA — 21 live SA industry rubrics
     ────────────────────────────────────────────── */
  const RUBRICS = [

    /* ── 1. Accounting Software ── */
    {
      id: 'sa_accounting_software',
      name: 'South Africa — Accounting Software',
      market: 'SA',
      industry: 'Accounting Software',
      slug: 'accounting-software',
      icon: 'fa-calculator',
      status: 'active',
      description: 'Scoring rubric for SA accounting and cloud-based financial software providers.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 20, customer_satisfaction: 20, product_value: 25, innovation: 10, customer_support: 15, accessibility_security: 10 },
          changeSummary: 'Initial rubric mapped from SaaS scoring framework.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Regulatory compliance and legal standing for Accounting Software in South Africa.',
          anchors: {
            go: 'Full FCA authorization, no restrictions, clean regulatory record; Full FSCS protection (£85k), ring-fenced funds, strong safeguarding; Clean record, no major fines/sanctions in 24+ months',
            caution: 'Authorized with minor restrictions or e-money license; Good protection with minor gaps in coverage; Minor regulatory actions or historical issues',
            noGo: 'Pending authorization or operating with limited oversight; Limited or unclear fund protection; Recent major fines, ongoing investigations'
          }
        },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Overall customer sentiment and satisfaction for Accounting Software providers.',
          anchors: {
            go: '4.5+ ratings, strong positive sentiment, low complaint rates.',
            caution: '3.5–4.4 ratings, mixed sentiment.',
            noGo: 'Below 3.5 ratings, predominantly negative sentiment.'
          }
        },
        { category: 'Product Value', key: 'product_value', definition: 'Value proposition, pricing fairness, and feature set for Accounting Software.',
          anchors: {
            go: 'Excellent value, transparent pricing, comprehensive features.',
            caution: 'Reasonable value with some pricing concerns.',
            noGo: 'Poor value, hidden fees, limited features.'
          }
        },
        { category: 'Innovation', key: 'innovation', definition: 'Technology adoption and innovation in Accounting Software.',
          anchors: {
            go: 'Industry-leading innovation, regular meaningful updates.',
            caution: 'Average innovation, follows industry trends.',
            noGo: 'Outdated offerings, minimal innovation.'
          }
        },
        { category: 'Customer Support', key: 'customer_support', definition: 'Support quality, availability, and resolution for Accounting Software.',
          anchors: {
            go: 'Multi-channel support, fast resolution, highly responsive.',
            caution: 'Adequate support with some gaps.',
            noGo: 'Poor support, slow resolution, limited channels.'
          }
        },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Digital accessibility and security posture for Accounting Software.',
          anchors: {
            go: 'Excellent app experience, strong security, inclusive design.',
            caution: 'Adequate with minor gaps.',
            noGo: 'Poor accessibility or security concerns.'
          }
        }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['SARS registration records', 'CIPC compliance databases', 'POPIA audit reports'], rules: ['Verify current SARS-compliant status', 'Check POPIA data handling certifications'] },
        { category: 'Customer Satisfaction', sources: ['Trustpilot & Google reviews', 'G2 and Capterra ratings', 'Social media sentiment'], rules: ['Aggregate minimum 3 platforms', 'Weight recency — last 6 months priority'] },
        { category: 'Product Value', sources: ['Pricing pages & plan comparisons', 'Feature matrices from vendor sites', 'Independent reviews'], rules: ['Compare at per-user pricing tier', 'Flag hidden fees or lock-in clauses'] },
        { category: 'Innovation', sources: ['Product changelogs', 'Tech press coverage', 'Integration marketplace'], rules: ['Track feature releases over 12 months', 'Assess API ecosystem maturity'] },
        { category: 'Customer Support', sources: ['Mystery shopping tests', 'Public response time data', 'Community forums'], rules: ['Test at least 2 support channels', 'Record time to first response'] },
        { category: 'Accessibility & Security', sources: ['App store ratings', 'WCAG audit reports', 'Security certifications'], rules: ['Verify SOC 2 or ISO 27001 where applicable', 'Test mobile accessibility'] }
      ],
      prompts: [
        { id: 'p-accsw-1', type: 'research', title: 'Accounting Software Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African brand analyst. Research {brand}, an accounting software provider, across compliance, customer satisfaction, product value, innovation, customer support, and accessibility/security. Use SA-specific regulatory context (SARS, POPIA). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use only verifiable South African sources', 'Score each of the 6 categories independently', 'Provide evidence URLs where possible'] },
        { id: 'p-accsw-2', type: 'scoring', title: 'Accounting Software Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Accounting Software rubric weights: Compliance 20, Customer Satisfaction 20, Product Value 25, Innovation 10, Customer Support 15, Accessibility/Security 10. Compute the weighted GoNoGo score (0-100). Return JSON with final score, verdict (Go/Caution/No-Go), and per-category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules before final verdict', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go regardless of total' }
      ]
    },

    /* ── 2. Airports ── */
    {
      id: 'sa_airports',
      name: 'South Africa — Airports',
      market: 'SA',
      industry: 'Airports',
      slug: 'airports',
      icon: 'fa-plane',
      status: 'active',
      description: 'Scoring rubric for SA airports and airline service experiences.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 20, customer_satisfaction: 17, product_value: 30, innovation: 8, customer_support: 10, accessibility_security: 15 },
          changeSummary: 'Initial rubric derived from Airlines scoring framework.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Evaluates compliance aspects of the brand.',
          anchors: {
            go: 'Full CAA certification, IATA membership in good standing, clean safety record',
            caution: 'Valid certifications with minor audit findings or pending renewals',
            noGo: 'Suspended or revoked certifications, serious safety violations'
          }
        },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Evaluates customer satisfaction aspects of the brand.',
          anchors: {
            go: '4.5+ Skytrax/Google ratings, strong NPS, low complaint volumes',
            caution: '3.5–4.4 ratings, moderate complaint levels',
            noGo: 'Below 3.5 ratings, high complaint volumes, viral negative incidents'
          }
        },
        { category: 'Product Value', key: 'product_value', definition: 'Evaluates product value aspects of the brand.',
          anchors: {
            go: 'Competitive fares, transparent baggage/fee policy, excellent route network',
            caution: 'Average pricing, some hidden fees or limited routes',
            noGo: 'Expensive with hidden surcharges, limited domestic coverage'
          }
        },
        { category: 'Innovation', key: 'innovation', definition: 'Evaluates innovation aspects of the brand.',
          anchors: {
            go: 'Modern fleet, digital boarding, self-service kiosks, sustainability initiatives',
            caution: 'Average technology adoption, basic digital services',
            noGo: 'Ageing fleet, minimal digital investment'
          }
        },
        { category: 'Customer Support', key: 'customer_support', definition: 'Evaluates customer support aspects of the brand.',
          anchors: {
            go: '24/7 multi-channel support, fast rebooking, proactive disruption management',
            caution: 'Adequate support with delays during peak disruption',
            noGo: 'Unreachable support, poor disruption handling'
          }
        },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Evaluates accessibility/security aspects of the brand.',
          anchors: {
            go: 'Full PRM assistance, accessible facilities, strong cybersecurity, biometric processing',
            caution: 'Basic accessibility compliance, standard security',
            noGo: 'Poor accessibility, data breach history'
          }
        }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['SACAA records', 'IATA safety audit database', 'Skytrax safety ratings'], rules: ['Verify current AOC status', 'Check IOSA registration'] },
        { category: 'Customer Satisfaction', sources: ['Skytrax reviews', 'Google/Trustpilot ratings', 'Hellopeter complaints'], rules: ['Aggregate 3+ platforms', 'Track 6-month trend'] },
        { category: 'Product Value', sources: ['Fare comparison sites', 'Route network data', 'Baggage policy pages'], rules: ['Benchmark against 3 competitors', 'Flag hidden surcharges'] },
        { category: 'Innovation', sources: ['Fleet age databases', 'Press releases', 'App store ratings'], rules: ['Assess digital maturity', 'Note sustainability commitments'] },
        { category: 'Customer Support', sources: ['Mystery shopping', 'Social media response audits', 'Hellopeter data'], rules: ['Test 2+ channels', 'Measure disruption response'] },
        { category: 'Accessibility & Security', sources: ['Accessibility audit reports', 'PRM service records', 'Cybersecurity disclosures'], rules: ['Verify PRM compliance', 'Check breach history'] }
      ],
      prompts: [
        { id: 'p-air-1', type: 'research', title: 'Airport/Airline Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African travel analyst. Research {brand}, an airport/airline operating in SA, across compliance, customer satisfaction, product value, innovation, customer support, and accessibility/security. Use SA-specific context (SACAA, ACSA). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['SA regulatory context required', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-air-2', type: 'scoring', title: 'Airport/Airline Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Airports rubric weights: Compliance 20, Customer Satisfaction 17, Product Value 30, Innovation 8, Customer Support 10, Accessibility/Security 15. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and per-category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 3. Armed Response ── */
    {
      id: 'sa_armed_response',
      name: 'South Africa — Armed Response',
      market: 'SA',
      industry: 'Armed Response',
      slug: 'armed-response',
      icon: 'fa-shield',
      status: 'active',
      description: 'Scoring rubric for SA armed response and private security providers.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { licensing_compliance: 20, response_time: 25, technology_monitoring: 15, customer_satisfaction: 15, value_contracts: 15, coverage_reliability: 10 },
          changeSummary: 'Initial rubric for armed response industry.'
        }
      ],
      anchors: [
        { category: 'Licensing & Compliance', key: 'licensing_compliance', definition: 'PSIRA registration and regulatory compliance.',
          anchors: { go: 'Full PSIRA registration, clean compliance record, proper firearm licensing.', caution: 'Registered with minor compliance issues or pending renewals.', noGo: 'Unregistered, lapsed PSIRA, or serious compliance violations.' } },
        { category: 'Response Time & Performance', key: 'response_time', definition: 'Average response times and incident resolution.',
          anchors: { go: 'Sub-5-minute average response, documented performance metrics, high resolution rate.', caution: '5–10 minute response, adequate resolution.', noGo: '10+ minute response or undocumented performance.' } },
        { category: 'Technology & Monitoring', key: 'technology_monitoring', definition: 'Alarm systems, app features, and monitoring centre capability.',
          anchors: { go: '24/7 control room, modern alarm tech, real-time app tracking.', caution: 'Basic monitoring with limited app features.', noGo: 'Outdated systems, no digital monitoring.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Client reviews, retention rates, and complaint handling.',
          anchors: { go: '4.5+ ratings, high retention, fast complaint resolution.', caution: '3.5–4.4 ratings, moderate retention.', noGo: 'Below 3.5, high churn, unresolved complaints.' } },
        { category: 'Value & Contracts', key: 'value_contracts', definition: 'Pricing transparency, contract flexibility, and value for money.',
          anchors: { go: 'Transparent pricing, flexible contracts, excellent value.', caution: 'Reasonable pricing with some lock-in clauses.', noGo: 'Opaque pricing, long lock-in, poor value.' } },
        { category: 'Coverage & Reliability', key: 'coverage_reliability', definition: 'Geographic coverage, uptime, and service reliability.',
          anchors: { go: 'Wide metro coverage, 99.9% uptime, redundant systems.', caution: 'Good coverage with occasional gaps.', noGo: 'Limited coverage, frequent outages.' } }
      ],
      playbooks: [
        { category: 'Licensing & Compliance', sources: ['PSIRA registry', 'SAPS firearm licence records', 'Consumer complaints databases'], rules: ['Verify active PSIRA grade', 'Check firearm licence validity'] },
        { category: 'Response Time & Performance', sources: ['Company SLA documents', 'Independent audits', 'Client testimonials'], rules: ['Request documented response time data', 'Verify with at least 3 client references'] },
        { category: 'Technology & Monitoring', sources: ['Product spec sheets', 'App store ratings', 'Control room certifications'], rules: ['Assess monitoring centre redundancy', 'Test app functionality'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'Social media'], rules: ['Aggregate 3+ platforms', 'Focus on last 12 months'] },
        { category: 'Value & Contracts', sources: ['Published price lists', 'Contract templates', 'Competitor benchmarks'], rules: ['Compare like-for-like packages', 'Flag cancellation penalties'] },
        { category: 'Coverage & Reliability', sources: ['Coverage maps', 'Uptime reports', 'Municipal area data'], rules: ['Map against major metros', 'Check rural/peri-urban reach'] }
      ],
      prompts: [
        { id: 'p-arm-1', type: 'research', title: 'Armed Response Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African security industry analyst. Research {brand}, an armed response provider, across licensing & compliance, response time & performance, technology & monitoring, customer satisfaction, value & contracts, and coverage & reliability. Use SA-specific context (PSIRA, SAPS). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['SA regulatory context required (PSIRA)', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-arm-2', type: 'scoring', title: 'Armed Response Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Armed Response rubric weights: Licensing & Compliance 20, Response Time 25, Technology & Monitoring 15, Customer Satisfaction 15, Value & Contracts 15, Coverage & Reliability 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and per-category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'PSIRA hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Licensing & Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 4. Banks ── */
    {
      id: 'sa_banks',
      name: 'South Africa — Banks',
      market: 'SA',
      industry: 'Banks',
      slug: 'banking',
      icon: 'fa-building-columns',
      status: 'active',
      description: 'Comprehensive scoring rubric for South African retail and digital banking brands.',
      owner: 'GoNoGo SA',
      versions: [        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 25, customer_satisfaction: 15, product_value: 20, innovation: 10, customer_support: 10, accessibility_security: 20 },
          changeSummary: 'Initial banking rubric based on SA retail/digital bank evaluation framework.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Regulatory compliance and prudential soundness for banks in South Africa.',
          anchors: {
            go: 'Fully licensed by SARB/Prudential Authority, clean enforcement history, strong solvency signals.',
            caution: 'Licensed but with historical issues, mild enforcement, or weaker prudential profile.',
            noGo: 'Regulatory breaches, unresolved prudential concerns, or major enforcement action.'
          }
        },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Overall customer sentiment and satisfaction for SA banking brands.',
          anchors: {
            go: 'Strong satisfaction scores, low complaint volumes, positive consumer trust.',
            caution: 'Mixed reviews and moderate complaint rates.',
            noGo: 'Persistent poor service sentiment and widespread complaints.'
          }
        },
        { category: 'Product Value', key: 'product_value', definition: 'Pricing fairness, account value, and product competitiveness.',
          anchors: {
            go: 'Transparent fees, strong value, competitive product bundle.',
            caution: 'Average pricing or some complexity in pricing structure.',
            noGo: 'Poor value, excessive fees, or opaque pricing.'
          }
        },
        { category: 'Innovation', key: 'innovation', definition: 'Digital innovation and forward-looking banking capability.',
          anchors: {
            go: 'Strong digital products, app quality, useful new features, innovation leadership.',
            caution: 'Reasonable digital offering but not market-leading.',
            noGo: 'Outdated digital offering and weak innovation profile.'
          }
        },
        { category: 'Customer Support', key: 'customer_support', definition: 'Support responsiveness, branch/service consistency, complaint resolution.',
          anchors: {
            go: 'Responsive omni-channel support and strong resolution outcomes.',
            caution: 'Adequate support with some delays or inconsistency.',
            noGo: 'Poor responsiveness, unresolved complaints, weak support system.'
          }
        },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Security controls, fraud protection, and inclusive accessibility.',
          anchors: {
            go: 'Strong fraud controls, secure platforms, broad accessibility and inclusive design.',
            caution: 'Adequate controls with some accessibility/security gaps.',
            noGo: 'Security concerns, repeated breaches, or poor accessibility.'
          }
        }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['SARB Prudential Authority notices', 'FSCA publications', 'Bank annual reports'], rules: ['Verify licence status', 'Flag enforcement notices from last 24 months'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'consumer surveys'], rules: ['Weight recent complaints more heavily', 'Separate branch vs digital service issues'] },
        { category: 'Product Value', sources: ['Published fee guides', 'product brochures', 'competitor comparisons'], rules: ['Compare equivalent entry-level and premium products', 'Flag hidden/conditional charges'] },
        { category: 'Innovation', sources: ['App store ratings', 'product launches', 'industry press'], rules: ['Assess mobile app maturity', 'Track last 12 months of launches'] },
        { category: 'Customer Support', sources: ['Mystery shopping', 'contact centre tests', 'public complaint forums'], rules: ['Test 2+ channels', 'Record response and resolution quality'] },
        { category: 'Accessibility & Security', sources: ['Security disclosures', 'fraud education pages', 'accessibility claims'], rules: ['Check MFA/biometrics availability', 'Assess disability access and language support'] }
      ],
      prompts: [
        { id: 'p-bank-1', type: 'research', title: 'Bank Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African banking analyst. Research {brand}, a banking provider in South Africa, across compliance, customer satisfaction, product value, innovation, customer support, and accessibility/security. Use SA-specific regulatory context (SARB, Prudential Authority, FSCA). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use only verifiable SA-relevant sources', 'Score all 6 categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-bank-2', type: 'scoring', title: 'Bank Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Banks rubric weights: Compliance 25, Customer Satisfaction 15, Product Value 20, Innovation 10, Customer Support 10, Accessibility/Security 20. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict (Go/Caution/No-Go), and per-category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules before final verdict', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go regardless of total' }
      ]
    },

    /* ── 5. Car Insurance ── */
    {
      id: 'sa_car_insurance',
      name: 'South Africa — Car Insurance',
      market: 'SA',
      industry: 'Car Insurance',
      slug: 'car-insurance',
      icon: 'fa-car',
      status: 'active',
      description: 'Scoring rubric for SA car insurance brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 20, customer_satisfaction: 20, product_value: 25, claims_support: 20, innovation: 5, accessibility_security: 10 },
          changeSummary: 'Initial rubric for SA short-term car insurance.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Insurance licensing, underwriting integrity, and regulatory standing.',
          anchors: { go: 'FSCA-compliant, licensed insurer/UMA, strong regulatory standing.', caution: 'Licensed with minor issues or historic complaints.', noGo: 'Regulatory breaches, unclear licensing, serious enforcement.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Customer reviews and trust for car insurers.',
          anchors: { go: 'High satisfaction, positive renewal sentiment, low complaint rates.', caution: 'Mixed reviews, moderate complaints.', noGo: 'Consistently poor reviews and trust signals.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Premium fairness, excess structure, and cover quality.',
          anchors: { go: 'Competitive premium, clear excess, broad cover and add-ons.', caution: 'Reasonable pricing but some exclusions or weak clarity.', noGo: 'Poor value, expensive excess, weak cover.' } },
        { category: 'Claims Support', key: 'claims_support', definition: 'Claims process speed, transparency, and outcomes.',
          anchors: { go: 'Fast, transparent, supportive claims process.', caution: 'Acceptable claims handling with some delays.', noGo: 'Frequent claims disputes or major delays.' } },
        { category: 'Innovation', key: 'innovation', definition: 'Telematics, app use, and policy innovation.',
          anchors: { go: 'Strong digital claims flow, telematics/value-added innovation.', caution: 'Some innovation but basic experience.', noGo: 'Outdated or manual-heavy service.' } },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Access to service, policy security, and digital trust.',
          anchors: { go: 'Easy access, strong digital security, inclusive servicing.', caution: 'Adequate but some service or security gaps.', noGo: 'Poor access, trust, or security concerns.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['FSCA records', 'insurer disclosures', 'policy wording'], rules: ['Verify insurer/underwriter identity', 'Check licence standing'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'consumer forums'], rules: ['Separate quote-stage and claim-stage complaints', 'Prioritize recent reviews'] },
        { category: 'Product Value', sources: ['Quote flows', 'policy schedules', 'competitor premium comparisons'], rules: ['Benchmark comparable risk profiles', 'Flag exclusions and excess traps'] },
        { category: 'Claims Support', sources: ['Claims FAQs', 'review complaints', 'case studies'], rules: ['Assess turnaround transparency', 'Track repudiation themes'] },
        { category: 'Innovation', sources: ['Apps', 'telematics products', 'press releases'], rules: ['Note app-enabled claims/reporting', 'Check value-added benefits'] },
        { category: 'Accessibility & Security', sources: ['Website/app trust signals', 'contact channels', 'security notices'], rules: ['Check MFA/security hygiene', 'Assess accessibility of quote and claims journey'] }
      ],
      prompts: [
        { id: 'p-carins-1', type: 'research', title: 'Car Insurance Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African insurance analyst. Research {brand}, a car insurance provider in South Africa, across compliance, customer satisfaction, product value, claims support, innovation, and accessibility/security. Use SA-specific context (FSCA, underwriting standards). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-carins-2', type: 'scoring', title: 'Car Insurance Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Car Insurance rubric weights: Compliance 20, Customer Satisfaction 20, Product Value 25, Claims Support 20, Innovation 5, Accessibility/Security 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 6. Courier Services ── */
    {
      id: 'sa_courier_services',
      name: 'South Africa — Courier Services',
      market: 'SA',
      industry: 'Courier Services',
      slug: 'courier-services',
      icon: 'fa-truck-fast',
      status: 'active',
      description: 'Scoring rubric for SA courier and parcel delivery brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 15, customer_satisfaction: 20, delivery_performance: 30, product_value: 15, customer_support: 10, technology_tracking: 10 },
          changeSummary: 'Initial rubric for courier service evaluation.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Operating compliance and legal standing.',
          anchors: { go: 'Strong legal standing, compliant operations, reliable business conduct.', caution: 'Minor issues or limited transparency.', noGo: 'Repeated legal/compliance concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Customer reviews and parcel experience sentiment.',
          anchors: { go: 'Strong reviews and trust, low complaint rates.', caution: 'Mixed sentiment.', noGo: 'Persistent poor delivery sentiment.' } },
        { category: 'Delivery Performance', key: 'delivery_performance', definition: 'On-time delivery, parcel handling, and network reliability.',
          anchors: { go: 'Excellent on-time performance, low loss/damage rates.', caution: 'Moderate delays or occasional parcel issues.', noGo: 'Frequent delays, losses, or damage.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Price fairness and service range.',
          anchors: { go: 'Competitive pricing, clear service levels, strong value.', caution: 'Average value with some pricing concerns.', noGo: 'Poor value or opaque pricing.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Issue resolution and service responsiveness.',
          anchors: { go: 'Fast support, clear escalation, strong resolution quality.', caution: 'Adequate but inconsistent support.', noGo: 'Unhelpful support and poor issue resolution.' } },
        { category: 'Technology & Tracking', key: 'technology_tracking', definition: 'Tracking quality and digital operational visibility.',
          anchors: { go: 'Real-time tracking, useful notifications, excellent digital UX.', caution: 'Basic tracking with limited visibility.', noGo: 'Poor or unreliable tracking.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Company disclosures', 'consumer regulator records', 'B-BBEE/company registration'], rules: ['Check business legitimacy', 'Flag serious unresolved legal complaints'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'Hellopeter', 'social complaints'], rules: ['Separate B2B and consumer sentiment if possible', 'Weight recency'] },
        { category: 'Delivery Performance', sources: ['Service promises', 'customer reports', 'seller feedback'], rules: ['Compare stated SLA vs public outcomes', 'Track parcel loss/damage mentions'] },
        { category: 'Product Value', sources: ['Rate cards', 'competitor pricing', 'merchant comparisons'], rules: ['Compare similar parcel sizes/lanes', 'Flag surcharge complexity'] },
        { category: 'Customer Support', sources: ['Support channel tests', 'complaint forums', 'social replies'], rules: ['Test at least email/phone/chat where available', 'Measure escalation clarity'] },
        { category: 'Technology & Tracking', sources: ['Tracking portals', 'apps', 'notification flows'], rules: ['Check milestone visibility', 'Assess UX friction in tracing a parcel'] }
      ],
      prompts: [
        { id: 'p-cour-1', type: 'research', title: 'Courier Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African logistics analyst. Research {brand}, a courier service provider in South Africa, across compliance, customer satisfaction, delivery performance, product value, customer support, and technology/tracking. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-cour-2', type: 'scoring', title: 'Courier Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Courier Services rubric weights: Compliance 15, Customer Satisfaction 20, Delivery Performance 30, Product Value 15, Customer Support 10, Technology/Tracking 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Delivery hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Delivery Performance < 30 → automatic No-Go' }
      ]
    },

    /* ── 7. Data / Internet Providers ── */
    {
      id: 'sa_data_internet_providers',
      name: 'South Africa — Data / Internet Providers',
      market: 'SA',
      industry: 'Data / Internet Providers',
      slug: 'data-internet-providers',
      icon: 'fa-wifi',
      status: 'active',
      description: 'Scoring rubric for SA ISPs, fibre providers, and mobile data networks.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 15, customer_satisfaction: 15, network_performance: 30, product_value: 20, customer_support: 10, innovation: 10 },
          changeSummary: 'Initial rubric for connectivity providers.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Licensing and lawful operation within SA telecom frameworks.',
          anchors: { go: 'ICASA-compliant, transparent terms, no serious enforcement issues.', caution: 'Licensed but some transparency or complaint concerns.', noGo: 'Serious compliance issues or unclear legal standing.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Public sentiment and subscriber satisfaction.',
          anchors: { go: 'Strong ratings and service sentiment.', caution: 'Mixed reviews and moderate churn/complaints.', noGo: 'Poor reviews and persistent dissatisfaction.' } },
        { category: 'Network Performance', key: 'network_performance', definition: 'Speed, uptime, reliability, and real-world service quality.',
          anchors: { go: 'Strong uptime, fast real-world speeds, reliable performance.', caution: 'Adequate but inconsistent performance.', noGo: 'Frequent outages or underperformance.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Pricing fairness, package flexibility, and value.',
          anchors: { go: 'Competitive plans, transparent pricing, good value.', caution: 'Average value or some pricing complexity.', noGo: 'Poor value, hidden costs, weak package quality.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Support response, fault handling, and service recovery.',
          anchors: { go: 'Fast issue resolution and strong support experience.', caution: 'Acceptable support with delays.', noGo: 'Weak fault handling and poor support.' } },
        { category: 'Innovation', key: 'innovation', definition: 'Network upgrades, digital tools, and product innovation.',
          anchors: { go: 'Forward-looking infrastructure and excellent digital service tools.', caution: 'Moderate innovation.', noGo: 'Stagnant product and weak digital capability.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['ICASA records', 'provider T&Cs', 'consumer commission references'], rules: ['Verify licence status where applicable', 'Review fair-use and cancellation terms'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'broadband communities'], rules: ['Separate installation complaints from steady-state service issues', 'Weight recent reports'] },
        { category: 'Network Performance', sources: ['Speed test rankings', 'outage reports', 'community forums'], rules: ['Use multiple speed/latency sources', 'Track outage frequency and duration'] },
        { category: 'Product Value', sources: ['Plan pages', 'competitor offers', 'promo terms'], rules: ['Compare similar speed tiers', 'Flag router/install/exit fees'] },
        { category: 'Customer Support', sources: ['Support tests', 'fault escalation reports', 'social media'], rules: ['Test response through at least 2 channels', 'Assess outage communication quality'] },
        { category: 'Innovation', sources: ['Coverage expansion announcements', 'app capabilities', 'product launches'], rules: ['Check self-service maturity', 'Track last 12 months of upgrades'] }
      ],
      prompts: [
        { id: 'p-isp-1', type: 'research', title: 'ISP / Data Provider Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African telecom analyst. Research {brand}, a data/internet provider in South Africa, across compliance, customer satisfaction, network performance, product value, customer support, and innovation. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-isp-2', type: 'scoring', title: 'ISP / Data Provider Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Data/Internet Providers rubric weights: Compliance 15, Customer Satisfaction 15, Network Performance 30, Product Value 20, Customer Support 10, Innovation 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Network hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Network Performance < 30 → automatic No-Go' }
      ]
    },

    /* ── 8. Department Stores ── */
    {
      id: 'sa_department_stores',
      name: 'South Africa — Department Stores',
      market: 'SA',
      industry: 'Department Stores',
      slug: 'department-stores',
      icon: 'fa-store',
      status: 'active',
      description: 'Scoring rubric for SA department store and general merchandise retailers.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 25, assortment_availability: 20, customer_support: 10, omni_channel_experience: 15 },
          changeSummary: 'Initial rubric for department store evaluation.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Retail compliance and responsible business conduct.',
          anchors: { go: 'Strong legal standing and consumer compliance.', caution: 'Minor issues or limited transparency.', noGo: 'Repeated consumer protection concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Store and online customer sentiment.',
          anchors: { go: 'Strong reviews, positive brand trust, low complaint levels.', caution: 'Mixed reviews.', noGo: 'Frequent service dissatisfaction.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Pricing fairness and value-for-money.',
          anchors: { go: 'Competitive pricing and strong perceived value.', caution: 'Average value.', noGo: 'Poor value or misleading promotions.' } },
        { category: 'Assortment & Availability', key: 'assortment_availability', definition: 'Range quality, stock depth, and availability.',
          anchors: { go: 'Broad, relevant range with strong stock availability.', caution: 'Good range with patchy stock issues.', noGo: 'Weak range or chronic stock problems.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Returns, in-store help, and support responsiveness.',
          anchors: { go: 'Helpful service, easy returns, good complaint handling.', caution: 'Adequate but inconsistent support.', noGo: 'Difficult returns and poor support.' } },
        { category: 'Omni-channel Experience', key: 'omni_channel_experience', definition: 'Integration of store, online, and fulfilment journeys.',
          anchors: { go: 'Strong web/store integration, click-and-collect, reliable fulfilment.', caution: 'Basic omni-channel support.', noGo: 'Poor online/store integration.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Consumer complaints records', 'company disclosures', 'returns policy'], rules: ['Review CPA alignment', 'Flag misleading promo patterns'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'Hellopeter', 'social sentiment'], rules: ['Separate online complaints from store complaints', 'Weight recent trend'] },
        { category: 'Product Value', sources: ['Price comparisons', 'promo catalogues', 'competitor baskets'], rules: ['Benchmark common basket items', 'Flag fake discounting'] },
        { category: 'Assortment & Availability', sources: ['E-commerce assortment', 'store observations', 'stock-out mentions'], rules: ['Check depth across major categories', 'Track stock-out frequency'] },
        { category: 'Customer Support', sources: ['Returns terms', 'service desk testing', 'complaint sites'], rules: ['Test return/contact flow', 'Assess refund clarity'] },
        { category: 'Omni-channel Experience', sources: ['Website/app', 'click-and-collect flow', 'delivery experience'], rules: ['Evaluate checkout to delivery journey', 'Assess inventory visibility'] }
      ],
      prompts: [
        { id: 'p-dept-1', type: 'research', title: 'Department Store Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African retail analyst. Research {brand}, a department store retailer in South Africa, across compliance, customer satisfaction, product value, assortment & availability, customer support, and omni-channel experience. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-dept-2', type: 'scoring', title: 'Department Store Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Department Stores rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 25, Assortment & Availability 20, Customer Support 10, Omni-channel Experience 15. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' }
      ]
    },    /* ── 9. Food Delivery ── */
    {
      id: 'sa_food_delivery',
      name: 'South Africa — Food Delivery',
      market: 'SA',
      industry: 'Food Delivery',
      slug: 'food-delivery',
      icon: 'fa-bag-shopping',
      status: 'active',
      description: 'Scoring rubric for SA food delivery apps and services.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, delivery_performance: 25, product_value: 20, restaurant_partner_quality: 15, app_experience: 10 },
          changeSummary: 'Initial rubric for food delivery platforms.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Business conduct, pricing transparency, and legal standing.',
          anchors: { go: 'Strong legal standing, transparent pricing/fees, no major compliance concerns.', caution: 'Minor issues or occasional fee transparency concerns.', noGo: 'Repeated serious consumer or legal concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Customer sentiment and repeat-use trust.',
          anchors: { go: 'Strong reviews, high satisfaction, positive retention signals.', caution: 'Mixed satisfaction or occasional issues.', noGo: 'Persistent dissatisfaction and weak trust.' } },
        { category: 'Delivery Performance', key: 'delivery_performance', definition: 'On-time delivery, order accuracy, and reliability.',
          anchors: { go: 'Consistently timely deliveries and high order accuracy.', caution: 'Moderate delays or some order issues.', noGo: 'Frequent delays, missing items, or unreliable service.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Fee fairness, promo value, and total basket economics.',
          anchors: { go: 'Fair delivery/service fees and strong customer value.', caution: 'Average value with some fee concerns.', noGo: 'Poor value or excessive fee stacking.' } },
        { category: 'Restaurant Partner Quality', key: 'restaurant_partner_quality', definition: 'Breadth and quality of partner ecosystem.',
          anchors: { go: 'Strong restaurant mix, good quality partners, broad relevance.', caution: 'Adequate choice with some gaps.', noGo: 'Weak partner mix or poor quality control.' } },
        { category: 'App Experience', key: 'app_experience', definition: 'App usability, support, tracking, and digital UX.',
          anchors: { go: 'Easy ordering, clear tracking, intuitive and reliable app.', caution: 'Usable app with some friction.', noGo: 'Buggy app, poor UX, weak order visibility.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Consumer complaints', 'pricing pages', 'terms and fees'], rules: ['Check transparency of service/delivery fees', 'Flag unfair surcharge patterns'] },
        { category: 'Customer Satisfaction', sources: ['App store reviews', 'Google reviews', 'social media'], rules: ['Separate courier issues from restaurant issues', 'Weight recent trend heavily'] },
        { category: 'Delivery Performance', sources: ['Customer reports', 'service claims', 'partner feedback'], rules: ['Track lateness frequency', 'Flag missing/damaged order complaints'] },
        { category: 'Product Value', sources: ['Basket comparisons', 'promo terms', 'competitor apps'], rules: ['Compare full basket cost, not menu item only', 'Include tip/service/delivery fees'] },
        { category: 'Restaurant Partner Quality', sources: ['App catalogues', 'restaurant coverage', 'quality sentiment'], rules: ['Assess breadth and relevance by metro', 'Note exclusives and premium partners'] },
        { category: 'App Experience', sources: ['App store ratings', 'UX walkthroughs', 'support flows'], rules: ['Test checkout/tracking/refund flows', 'Assess crash or bug frequency from reviews'] }
      ],
      prompts: [
        { id: 'p-food-1', type: 'research', title: 'Food Delivery Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African consumer platform analyst. Research {brand}, a food delivery service in South Africa, across compliance, customer satisfaction, delivery performance, product value, restaurant partner quality, and app experience. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-food-2', type: 'scoring', title: 'Food Delivery Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Food Delivery rubric weights: Compliance 10, Customer Satisfaction 20, Delivery Performance 25, Product Value 20, Restaurant Partner Quality 15, App Experience 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Delivery hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Delivery Performance < 30 → automatic No-Go' }
      ]
    },

    /* ── 10. Gyms / Fitness Clubs ── */
    {
      id: 'sa_gyms_fitness_clubs',
      name: 'South Africa — Gyms / Fitness Clubs',
      market: 'SA',
      industry: 'Gyms / Fitness Clubs',
      slug: 'gyms-fitness-clubs',
      icon: 'fa-dumbbell',
      status: 'active',
      description: 'Scoring rubric for SA gyms and fitness club brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 20, facilities_equipment: 25, customer_support: 10, accessibility_convenience: 15 },
          changeSummary: 'Initial rubric for gyms and fitness clubs.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Contract fairness, legal compliance, and safety standards.',
          anchors: { go: 'Clear terms, fair consumer practices, strong safety compliance.', caution: 'Minor contract or consumer concerns.', noGo: 'Repeated unfair contract/safety issues.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Member sentiment and reputation.',
          anchors: { go: 'Strong member satisfaction and retention sentiment.', caution: 'Mixed experience across branches.', noGo: 'Persistent dissatisfaction and churn complaints.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Membership value relative to access and offering.',
          anchors: { go: 'Strong value, flexible plans, fair pricing.', caution: 'Average value.', noGo: 'Poor value, excessive lock-in, weak offering.' } },
        { category: 'Facilities & Equipment', key: 'facilities_equipment', definition: 'Quality, cleanliness, maintenance, and availability.',
          anchors: { go: 'Clean, modern, well-maintained facilities and equipment.', caution: 'Adequate but inconsistent maintenance or crowding.', noGo: 'Poorly maintained facilities or chronic equipment issues.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Front-desk support, billing help, and issue resolution.',
          anchors: { go: 'Helpful service and quick resolution of billing/member issues.', caution: 'Average support.', noGo: 'Difficult issue resolution or poor support culture.' } },
        { category: 'Accessibility & Convenience', key: 'accessibility_convenience', definition: 'Location convenience, hours, app/booking ease, inclusivity.',
          anchors: { go: 'Convenient access, strong hours, easy booking and broad usability.', caution: 'Adequate convenience with some gaps.', noGo: 'Poor convenience or weak accessibility.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Membership contracts', 'consumer complaints', 'club rules'], rules: ['Check cancellation/freeze fairness', 'Flag unusual contract traps'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'Hellopeter', 'social media'], rules: ['Separate branch-level issues where possible', 'Weight recent comments'] },
        { category: 'Product Value', sources: ['Membership pricing', 'benefit structures', 'competitor comparisons'], rules: ['Compare base plans and premium plans separately', 'Include joining/admin fees'] },
        { category: 'Facilities & Equipment', sources: ['Member reviews', 'club tours', 'facility photos'], rules: ['Assess crowding, cleanliness, maintenance themes', 'Check class/amenity quality'] },
        { category: 'Customer Support', sources: ['Front-desk contact tests', 'billing complaints', 'member feedback'], rules: ['Test billing/support response', 'Track cancellation friction'] },
        { category: 'Accessibility & Convenience', sources: ['Club maps', 'hours', 'app booking systems'], rules: ['Review branch footprint by metro', 'Assess digital booking/member management UX'] }
      ],
      prompts: [
        { id: 'p-gym-1', type: 'research', title: 'Gym / Fitness Club Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African fitness industry analyst. Research {brand}, a gym or fitness club in South Africa, across compliance, customer satisfaction, product value, facilities & equipment, customer support, and accessibility & convenience. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-gym-2', type: 'scoring', title: 'Gym / Fitness Club Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Gyms/Fitness Clubs rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 20, Facilities & Equipment 25, Customer Support 10, Accessibility & Convenience 15. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' }
      ]
    },

    /* ── 11. Healthcare / Medical Aid ── */
    {
      id: 'sa_healthcare_medical_aid',
      name: 'South Africa — Healthcare / Medical Aid',
      market: 'SA',
      industry: 'Healthcare / Medical Aid',
      slug: 'healthcare-medical-aid',
      icon: 'fa-heart-pulse',
      status: 'active',
      description: 'Scoring rubric for SA healthcare schemes, administrators, and medical aid brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 25, customer_satisfaction: 15, product_value: 20, claims_support: 20, network_quality: 10, accessibility_security: 10 },
          changeSummary: 'Initial rubric for medical aid and healthcare schemes.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'CMS compliance, scheme governance, and legal standing.',
          anchors: { go: 'Strong CMS compliance, sound governance, clean material standing.', caution: 'Compliant but with some complaints or governance concerns.', noGo: 'Serious compliance/governance concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Member sentiment and trust.',
          anchors: { go: 'Strong member satisfaction and trust signals.', caution: 'Mixed satisfaction.', noGo: 'Persistent dissatisfaction or trust issues.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Contribution fairness relative to benefits and cover quality.',
          anchors: { go: 'Strong value and clear benefit design.', caution: 'Average value or complex benefit design.', noGo: 'Poor value or weak clarity.' } },
        { category: 'Claims Support', key: 'claims_support', definition: 'Claims administration, authorization experience, and dispute handling.',
          anchors: { go: 'Reliable claims and auth support, fair resolution.', caution: 'Acceptable but sometimes slow or complex.', noGo: 'Frequent claims frustration or disputes.' } },
        { category: 'Network Quality', key: 'network_quality', definition: 'Quality and reach of hospitals/providers/network partners.',
          anchors: { go: 'Strong provider access and network quality.', caution: 'Adequate network with some access gaps.', noGo: 'Weak or restrictive network experience.' } },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Digital access, inclusivity, and protection of sensitive data.',
          anchors: { go: 'Strong digital self-service, inclusive design, strong privacy/security.', caution: 'Adequate digital access with some gaps.', noGo: 'Weak access or trust/security concerns.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Council for Medical Schemes', 'scheme reports', 'legal notices'], rules: ['Verify scheme status', 'Flag governance/intervention issues'] },
        { category: 'Customer Satisfaction', sources: ['Member reviews', 'consumer forums', 'public complaints'], rules: ['Separate admin complaints from clinical network complaints', 'Weight recent trend'] },
        { category: 'Product Value', sources: ['Benefit brochures', 'contribution tables', 'scheme comparisons'], rules: ['Compare equivalent plan tiers', 'Assess co-pay and gap burden'] },
        { category: 'Claims Support', sources: ['Claims guides', 'member complaints', 'support tests'], rules: ['Track authorization friction', 'Flag repeated claim rejection themes'] },
        { category: 'Network Quality', sources: ['Provider networks', 'hospital lists', 'member reports'], rules: ['Assess network breadth in major metros', 'Check specialist access themes'] },
        { category: 'Accessibility & Security', sources: ['App/web portals', 'privacy notices', 'support channels'], rules: ['Assess digital claims/member self-service', 'Check data protection signals'] }
      ],
      prompts: [
        { id: 'p-health-1', type: 'research', title: 'Healthcare / Medical Aid Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African healthcare analyst. Research {brand}, a healthcare/medical aid brand in South Africa, across compliance, customer satisfaction, product value, claims support, network quality, and accessibility/security. Use SA-specific context (Council for Medical Schemes). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-health-2', type: 'scoring', title: 'Healthcare / Medical Aid Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Healthcare/Medical Aid rubric weights: Compliance 25, Customer Satisfaction 15, Product Value 20, Claims Support 20, Network Quality 10, Accessibility/Security 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 12. Hotel Groups ── */
    {
      id: 'sa_hotel_groups',
      name: 'South Africa — Hotel Groups',
      market: 'SA',
      industry: 'Hotel Groups',
      slug: 'hotel-groups',
      icon: 'fa-hotel',
      status: 'active',
      description: 'Scoring rubric for SA hotel groups and hospitality brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 20, property_quality: 25, customer_support: 10, booking_digital_experience: 15 },
          changeSummary: 'Initial rubric for hotel groups and hospitality.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Hospitality compliance, consumer fairness, and basic governance.',
          anchors: { go: 'Strong operating and consumer compliance, transparent booking terms.', caution: 'Minor issues or some policy friction.', noGo: 'Repeated serious consumer/legal concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Guest sentiment and trust.',
          anchors: { go: 'Strong guest reviews and repeat-stay sentiment.', caution: 'Mixed guest sentiment.', noGo: 'Persistent poor guest experience.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Rate fairness relative to stay quality and inclusions.',
          anchors: { go: 'Good value and transparent pricing/inclusions.', caution: 'Average value.', noGo: 'Poor value or hidden booking costs.' } },
        { category: 'Property Quality', key: 'property_quality', definition: 'Room quality, maintenance, amenities, and consistency.',
          anchors: { go: 'Consistently high-quality properties and amenities.', caution: 'Variable quality across properties.', noGo: 'Weak property standards or chronic maintenance issues.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Booking support, front-desk service, issue resolution.',
          anchors: { go: 'Strong support before/during/after stay.', caution: 'Adequate support with inconsistency.', noGo: 'Poor service recovery or support responsiveness.' } },
        { category: 'Booking & Digital Experience', key: 'booking_digital_experience', definition: 'Website/app booking experience and digital convenience.',
          anchors: { go: 'Easy booking flow, strong digital UX, useful guest tools.', caution: 'Basic digital experience.', noGo: 'Poor booking UX or unreliable digital journey.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Booking terms', 'consumer complaints', 'company disclosures'], rules: ['Review cancellation/refund fairness', 'Flag misleading room/rate practices'] },
        { category: 'Customer Satisfaction', sources: ['Google', 'Tripadvisor', 'Booking.com reviews'], rules: ['Use multiple review platforms', 'Weight recent review mix'] },
        { category: 'Product Value', sources: ['Rate comparisons', 'OTA listings', 'brand website rates'], rules: ['Compare direct vs OTA pricing', 'Include inclusions/extras'] },
        { category: 'Property Quality', sources: ['Guest reviews', 'property photos', 'brand standards'], rules: ['Assess consistency across portfolio', 'Flag cleanliness/maintenance patterns'] },
        { category: 'Customer Support', sources: ['Call/email tests', 'guest complaints', 'social channels'], rules: ['Test pre-booking support and complaint escalation', 'Assess response quality'] },
        { category: 'Booking & Digital Experience', sources: ['Website/app walkthrough', 'booking engine UX', 'app reviews'], rules: ['Test booking on mobile', 'Assess confirmation/change/cancel flow'] }
      ],
      prompts: [
        { id: 'p-hotel-1', type: 'research', title: 'Hotel Group Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African hospitality analyst. Research {brand}, a hotel group in South Africa, across compliance, customer satisfaction, product value, property quality, customer support, and booking/digital experience. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-hotel-2', type: 'scoring', title: 'Hotel Group Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Hotel Groups rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 20, Property Quality 25, Customer Support 10, Booking/Digital Experience 15. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' }
      ]
    },

    /* ── 13. Investment Platforms ── */
    {
      id: 'sa_investment_platforms',
      name: 'South Africa — Investment Platforms',
      market: 'SA',
      industry: 'Investment Platforms',
      slug: 'investment-platforms',
      icon: 'fa-chart-line',
      status: 'active',
      description: 'Scoring rubric for SA investing apps, broker platforms, and wealth platforms.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 25, customer_satisfaction: 15, product_value: 20, platform_capability: 20, customer_support: 10, accessibility_security: 10 },
          changeSummary: 'Initial rubric for investment and trading platforms.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'FSCA licensing, governance, and investor protection integrity.',
          anchors: { go: 'Fully licensed, strong governance, clear investor protection practices.', caution: 'Licensed but some concerns or weaker transparency.', noGo: 'Serious licensing/compliance concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Investor sentiment and trust.',
          anchors: { go: 'Strong investor reviews and trust signals.', caution: 'Mixed sentiment.', noGo: 'Persistent dissatisfaction or trust concerns.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Fee fairness and value relative to offering.',
          anchors: { go: 'Transparent and competitive fees with strong value.', caution: 'Average value or fee complexity.', noGo: 'Poor value, opaque fees, weak pricing fairness.' } },
        { category: 'Platform Capability', key: 'platform_capability', definition: 'Trading/investing tools, product breadth, and usability.',
          anchors: { go: 'Strong platform, useful tools, broad product access.', caution: 'Adequate platform with some gaps.', noGo: 'Weak tools or poor product access.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Support quality, onboarding help, and issue resolution.',
          anchors: { go: 'Helpful, responsive support and clear onboarding assistance.', caution: 'Acceptable but inconsistent support.', noGo: 'Poor support and unresolved platform issues.' } },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Digital accessibility and protection of funds/data.',
          anchors: { go: 'Strong security, accessible digital journeys, trustworthy controls.', caution: 'Adequate protection with some UX/access issues.', noGo: 'Security or trust concerns.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['FSCA registers', 'platform disclosures', 'legal documentation'], rules: ['Verify licence status and product permissions', 'Check custody/nominee structures'] },
        { category: 'Customer Satisfaction', sources: ['App store reviews', 'Google reviews', 'investor forums'], rules: ['Separate product dissatisfaction from market-loss complaints', 'Weight recent trend'] },
        { category: 'Product Value', sources: ['Fee schedules', 'competitor pricing', 'cost calculators'], rules: ['Compare platform/admin/trading/FX fees', 'Flag inactivity or custody fees'] },
        { category: 'Platform Capability', sources: ['Product pages', 'platform demos', 'feature reviews'], rules: ['Assess product range and usability', 'Check research and reporting tools'] },
        { category: 'Customer Support', sources: ['Support tests', 'help centre', 'complaint reports'], rules: ['Test onboarding and issue-resolution pathways', 'Assess withdrawal/help friction'] },
        { category: 'Accessibility & Security', sources: ['Security pages', 'app UX', 'privacy notices'], rules: ['Check MFA/biometrics', 'Assess accessibility and transparency of safeguards'] }
      ],
      prompts: [
        { id: 'p-invest-1', type: 'research', title: 'Investment Platform Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African investment analyst. Research {brand}, an investment platform in South Africa, across compliance, customer satisfaction, product value, platform capability, customer support, and accessibility/security. Use SA-specific context (FSCA). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-invest-2', type: 'scoring', title: 'Investment Platform Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Investment Platforms rubric weights: Compliance 25, Customer Satisfaction 15, Product Value 20, Platform Capability 20, Customer Support 10, Accessibility/Security 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },    /* ── 14. Online Marketplaces ── */
    {
      id: 'sa_online_marketplaces',
      name: 'South Africa — Online Marketplaces',
      market: 'SA',
      industry: 'Online Marketplaces',
      slug: 'online-marketplaces',
      icon: 'fa-cart-shopping',
      status: 'active',
      description: 'Scoring rubric for SA online marketplaces and e-commerce platforms.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 20, seller_buyer_trust: 20, fulfilment_support: 15, digital_experience: 15 },
          changeSummary: 'Initial rubric for online marketplaces.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Consumer compliance, fair trading, and legal standing.',
          anchors: { go: 'Strong consumer compliance and transparent marketplace policies.', caution: 'Minor policy/transparency concerns.', noGo: 'Repeated serious consumer/legal concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Buyer and seller sentiment.',
          anchors: { go: 'Strong platform satisfaction and trust.', caution: 'Mixed sentiment.', noGo: 'Persistent dissatisfaction or poor trust.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Price competitiveness, fee fairness, and value proposition.',
          anchors: { go: 'Strong value and transparent costs.', caution: 'Average value.', noGo: 'Poor value or opaque pricing/fees.' } },
        { category: 'Seller & Buyer Trust', key: 'seller_buyer_trust', definition: 'Trust systems, dispute management, fraud control.',
          anchors: { go: 'Strong trust architecture and dispute outcomes.', caution: 'Adequate trust systems with some issues.', noGo: 'Weak trust/fraud protections.' } },
        { category: 'Fulfilment & Support', key: 'fulfilment_support', definition: 'Delivery, returns, and post-purchase support.',
          anchors: { go: 'Reliable fulfilment and effective issue resolution.', caution: 'Moderate fulfilment/support quality.', noGo: 'Poor fulfilment or difficult returns/support.' } },
        { category: 'Digital Experience', key: 'digital_experience', definition: 'Marketplace UX, search, checkout, and app/web quality.',
          anchors: { go: 'Excellent shopping UX and reliable digital experience.', caution: 'Usable but some friction.', noGo: 'Weak digital UX or reliability issues.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Marketplace terms', 'consumer complaints', 'returns/refund policies'], rules: ['Review CPA alignment', 'Flag hidden charges or weak disclosure'] },
        { category: 'Customer Satisfaction', sources: ['App store reviews', 'Google reviews', 'social sentiment'], rules: ['Separate buyer and seller complaints where possible', 'Weight recent trend'] },
        { category: 'Product Value', sources: ['Basket comparisons', 'seller fees', 'promo terms'], rules: ['Compare total cost incl. shipping', 'Assess fee fairness for both sides'] },
        { category: 'Seller & Buyer Trust', sources: ['Protection policies', 'dispute centre docs', 'fraud complaints'], rules: ['Assess verification and dispute mechanisms', 'Track counterfeit/fraud themes'] },
        { category: 'Fulfilment & Support', sources: ['Delivery policies', 'returns experience', 'support channels'], rules: ['Test post-purchase help path', 'Track delivery/returns complaints'] },
        { category: 'Digital Experience', sources: ['Web/app walkthroughs', 'app ratings', 'UX audits'], rules: ['Test search, filters, checkout, returns initiation', 'Assess performance and reliability'] }
      ],
      prompts: [
        { id: 'p-market-1', type: 'research', title: 'Online Marketplace Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African e-commerce analyst. Research {brand}, an online marketplace in South Africa, across compliance, customer satisfaction, product value, seller & buyer trust, fulfilment & support, and digital experience. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-market-2', type: 'scoring', title: 'Online Marketplace Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Online Marketplaces rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 20, Seller & Buyer Trust 20, Fulfilment & Support 15, Digital Experience 15. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' }
      ]
    },

    /* ── 15. Petrol Stations / Convenience ── */
    {
      id: 'sa_petrol_stations_convenience',
      name: 'South Africa — Petrol Stations / Convenience',
      market: 'SA',
      industry: 'Petrol Stations / Convenience',
      slug: 'petrol-stations-convenience',
      icon: 'fa-gas-pump',
      status: 'active',
      description: 'Scoring rubric for SA fuel station and forecourt convenience brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 20, site_quality: 25, convenience_offer: 15, customer_support: 10 },
          changeSummary: 'Initial rubric for petrol stations and convenience retail.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Consumer fairness, legal compliance, and operating standards.',
          anchors: { go: 'Strong operating standards and transparent consumer practices.', caution: 'Minor issues or inconsistency.', noGo: 'Serious or repeated compliance concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Customer sentiment and forecourt experience.',
          anchors: { go: 'Strong sentiment on service, cleanliness, and convenience.', caution: 'Mixed branch-level experience.', noGo: 'Persistent poor service or trust issues.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Value across convenience pricing, rewards, and overall proposition.',
          anchors: { go: 'Good value and rewards/incentive quality.', caution: 'Average value.', noGo: 'Poor value and weak proposition.' } },
        { category: 'Site Quality', key: 'site_quality', definition: 'Cleanliness, maintenance, safety, and site quality.',
          anchors: { go: 'Clean, well-run, safe sites with strong standards.', caution: 'Adequate sites with inconsistency.', noGo: 'Poor site conditions or safety concerns.' } },
        { category: 'Convenience Offer', key: 'convenience_offer', definition: 'Quality and relevance of convenience retail and extras.',
          anchors: { go: 'Strong convenience offer, food/coffee/ATM/auxiliary value.', caution: 'Basic convenience proposition.', noGo: 'Weak or poor-quality convenience offer.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Service recovery and complaint handling.',
          anchors: { go: 'Good customer care and issue resolution.', caution: 'Average support.', noGo: 'Poor handling of issues or complaints.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Consumer complaints', 'brand policies', 'station standards'], rules: ['Flag repeated pricing or service fairness issues', 'Assess visible policy transparency'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'social media', 'consumer forums'], rules: ['Assess branch consistency themes', 'Weight recent comments'] },
        { category: 'Product Value', sources: ['Rewards programs', 'promo offers', 'shop pricing'], rules: ['Compare forecourt convenience economics', 'Note loyalty benefits'] },
        { category: 'Site Quality', sources: ['Review photos', 'site visits', 'cleanliness/safety mentions'], rules: ['Track cleanliness and restroom/service themes', 'Assess maintenance consistency'] },
        { category: 'Convenience Offer', sources: ['Forecourt brand materials', 'food/coffee offers', 'partner services'], rules: ['Assess breadth and quality of convenience proposition', 'Review premium vs standard sites'] },
        { category: 'Customer Support', sources: ['Help channels', 'complaint escalation', 'public response behaviour'], rules: ['Assess escalation clarity', 'Track resolution quality'] }
      ],
      prompts: [
        { id: 'p-petrol-1', type: 'research', title: 'Petrol Station / Convenience Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African retail and convenience analyst. Research {brand}, a petrol station/convenience brand in South Africa, across compliance, customer satisfaction, product value, site quality, convenience offer, and customer support. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-petrol-2', type: 'scoring', title: 'Petrol Station / Convenience Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Petrol Stations/Convenience rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 20, Site Quality 25, Convenience Offer 15, Customer Support 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' }
      ]
    },

    /* ── 16. Quick Service Restaurants ── */
    {
      id: 'sa_quick_service_restaurants',
      name: 'South Africa — Quick Service Restaurants',
      market: 'SA',
      industry: 'Quick Service Restaurants',
      slug: 'quick-service-restaurants',
      icon: 'fa-burger',
      status: 'active',
      description: 'Scoring rubric for SA QSR and fast-food brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 20, food_quality_consistency: 25, service_speed: 15, digital_ordering_experience: 10 },
          changeSummary: 'Initial rubric for QSR brands.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Food safety and basic consumer compliance standing.',
          anchors: { go: 'Strong food safety and consumer standards.', caution: 'Minor incidents or branch inconsistency.', noGo: 'Serious or repeated safety/compliance concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Customer sentiment and brand trust.',
          anchors: { go: 'Strong overall satisfaction and loyalty sentiment.', caution: 'Mixed satisfaction.', noGo: 'Persistent poor experience and dissatisfaction.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Value-for-money and menu pricing fairness.',
          anchors: { go: 'Strong value and good menu economics.', caution: 'Average value.', noGo: 'Poor value or weak pricing fairness.' } },
        { category: 'Food Quality & Consistency', key: 'food_quality_consistency', definition: 'Taste, quality, freshness, and consistency across locations.',
          anchors: { go: 'Consistently strong quality across branches.', caution: 'Acceptable but variable quality.', noGo: 'Poor or inconsistent quality.' } },
        { category: 'Service Speed', key: 'service_speed', definition: 'Queue, order turnaround, and operational efficiency.',
          anchors: { go: 'Fast and reliable service times.', caution: 'Moderate delays.', noGo: 'Frequent long waits or service breakdowns.' } },
        { category: 'Digital Ordering Experience', key: 'digital_ordering_experience', definition: 'App/web ordering, delivery integration, and loyalty UX.',
          anchors: { go: 'Strong digital ordering and loyalty experience.', caution: 'Basic digital capability.', noGo: 'Weak or frustrating digital ordering.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Food safety incidents', 'consumer complaints', 'public notices'], rules: ['Flag serious food safety events', 'Assess recurrence and recency'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'social sentiment', 'app reviews'], rules: ['Assess brand-level and branch-level complaints', 'Weight recent trend'] },
        { category: 'Product Value', sources: ['Menu pricing', 'meal comparisons', 'promo offers'], rules: ['Compare common basket items', 'Assess bundle/value meal competitiveness'] },
        { category: 'Food Quality & Consistency', sources: ['Customer reviews', 'food influencer content', 'branch comparisons'], rules: ['Track freshness, order accuracy, and consistency themes'] },
        { category: 'Service Speed', sources: ['Drive-thru/store reviews', 'timing tests', 'consumer reports'], rules: ['Assess peak-time performance', 'Compare in-store vs drive-thru/delivery prep'] },
        { category: 'Digital Ordering Experience', sources: ['App walkthroughs', 'app store reviews', 'loyalty program UX'], rules: ['Test mobile ordering journey', 'Assess rewards integration and friction'] }
      ],
      prompts: [
        { id: 'p-qsr-1', type: 'research', title: 'QSR Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African restaurant industry analyst. Research {brand}, a quick service restaurant brand in South Africa, across compliance, customer satisfaction, product value, food quality & consistency, service speed, and digital ordering experience. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-qsr-2', type: 'scoring', title: 'QSR Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA QSR rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 20, Food Quality & Consistency 25, Service Speed 15, Digital Ordering Experience 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Food quality hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Food Quality & Consistency < 30 → automatic No-Go' }
      ]
    },

    /* ── 17. Retail Pharmacies ── */
    {
      id: 'sa_retail_pharmacies',
      name: 'South Africa — Retail Pharmacies',
      market: 'SA',
      industry: 'Retail Pharmacies',
      slug: 'retail-pharmacies',
      icon: 'fa-prescription-bottle-medical',
      status: 'active',
      description: 'Scoring rubric for SA pharmacy retail brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 25, customer_satisfaction: 15, product_value: 15, product_availability: 20, pharmacist_support: 15, digital_accessibility: 10 },
          changeSummary: 'Initial rubric for retail pharmacy brands.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Pharmacy regulatory compliance, ethics, and dispensing integrity.',
          anchors: { go: 'Strong regulatory standing and dispensing governance.', caution: 'Minor issues or isolated concerns.', noGo: 'Serious compliance or dispensing concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Customer sentiment and trust in pharmacy experience.',
          anchors: { go: 'Strong trust and service sentiment.', caution: 'Mixed satisfaction.', noGo: 'Persistent dissatisfaction or trust issues.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Value across OTC/personal care and overall proposition.',
          anchors: { go: 'Good value and fair pricing.', caution: 'Average value.', noGo: 'Poor value or pricing dissatisfaction.' } },
        { category: 'Product Availability', key: 'product_availability', definition: 'Availability of medicines and relevant pharmacy products.',
          anchors: { go: 'Strong stock availability and fulfilment reliability.', caution: 'Moderate stock gaps.', noGo: 'Chronic stock shortages or weak availability.' } },
        { category: 'Pharmacist Support', key: 'pharmacist_support', definition: 'Quality of pharmacist assistance and guidance.',
          anchors: { go: 'Trusted, professional pharmacist support and consultation quality.', caution: 'Adequate support.', noGo: 'Weak service, poor guidance, or service concerns.' } },
        { category: 'Digital Accessibility', key: 'digital_accessibility', definition: 'Online script/refill, click-and-collect, and digital access convenience.',
          anchors: { go: 'Strong digital access and convenient pharmacy journeys.', caution: 'Basic digital convenience.', noGo: 'Weak digital access or poor accessibility.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Pharmacy Council-related disclosures', 'consumer complaints', 'policy documents'], rules: ['Flag dispensing or ethical complaints', 'Assess recurrence and seriousness'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'Hellopeter', 'social sentiment'], rules: ['Separate clinic/service complaints from retail complaints', 'Weight recent reviews'] },
        { category: 'Product Value', sources: ['OTC price comparisons', 'promos', 'basket comparisons'], rules: ['Compare common OTC baskets', 'Assess value in wellness/personal care categories'] },
        { category: 'Product Availability', sources: ['Customer reports', 'online availability', 'fulfilment feedback'], rules: ['Track stock-out themes', 'Assess script fulfilment reliability'] },
        { category: 'Pharmacist Support', sources: ['Service reviews', 'mystery shopping', 'clinic/pharmacy feedback'], rules: ['Assess professionalism and guidance quality', 'Track consultation/service responsiveness'] },
        { category: 'Digital Accessibility', sources: ['App/web walkthroughs', 'click-and-collect/refill flows', 'app reviews'], rules: ['Test refill and collection journey', 'Assess UX accessibility'] }
      ],
      prompts: [
        { id: 'p-pharm-1', type: 'research', title: 'Retail Pharmacy Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African healthcare retail analyst. Research {brand}, a retail pharmacy brand in South Africa, across compliance, customer satisfaction, product value, product availability, pharmacist support, and digital accessibility. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-pharm-2', type: 'scoring', title: 'Retail Pharmacy Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Retail Pharmacies rubric weights: Compliance 25, Customer Satisfaction 15, Product Value 15, Product Availability 20, Pharmacist Support 15, Digital Accessibility 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },    /* ── 18. Streaming Services ── */
    {
      id: 'sa_streaming_services',
      name: 'South Africa — Streaming Services',
      market: 'SA',
      industry: 'Streaming Services',
      slug: 'streaming-services',
      icon: 'fa-film',
      status: 'active',
      description: 'Scoring rubric for SA-relevant video, audio, and entertainment streaming brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 20, content_quality_relevance: 25, platform_experience: 15, accessibility_security: 10 },
          changeSummary: 'Initial rubric for streaming services.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Consumer fairness, billing transparency, and legal operating standards.',
          anchors: { go: 'Strong transparency, fair consumer terms, sound legal standing.', caution: 'Minor policy or billing concerns.', noGo: 'Serious recurring consumer/legal concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Subscriber sentiment and brand trust.',
          anchors: { go: 'Strong satisfaction and retention sentiment.', caution: 'Mixed user satisfaction.', noGo: 'Persistent dissatisfaction or cancellation frustration.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Price fairness relative to catalogue and quality.',
          anchors: { go: 'Strong value for price and flexible pricing proposition.', caution: 'Average value.', noGo: 'Poor value relative to offering.' } },
        { category: 'Content Quality & Relevance', key: 'content_quality_relevance', definition: 'Breadth, quality, freshness, and SA audience relevance of content.',
          anchors: { go: 'Strong, relevant catalogue with compelling quality and freshness.', caution: 'Adequate catalogue with some gaps.', noGo: 'Weak catalogue or low perceived relevance.' } },
        { category: 'Platform Experience', key: 'platform_experience', definition: 'App/device UX, streaming reliability, and user interface quality.',
          anchors: { go: 'Reliable, polished, intuitive experience across devices.', caution: 'Usable with some friction or instability.', noGo: 'Poor UX, buffering, instability, or weak app quality.' } },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Accessibility features, account security, and trust.',
          anchors: { go: 'Good accessibility features and strong account protections.', caution: 'Adequate but incomplete features or controls.', noGo: 'Weak accessibility or account security concerns.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Terms and billing policies', 'consumer complaints', 'cancellation policies'], rules: ['Assess cancellation friction', 'Flag hidden or confusing billing practices'] },
        { category: 'Customer Satisfaction', sources: ['App store reviews', 'social sentiment', 'review platforms'], rules: ['Separate content complaints from platform complaints', 'Weight recent trend'] },
        { category: 'Product Value', sources: ['Pricing plans', 'competitor comparisons', 'bundle offers'], rules: ['Compare ad-supported vs premium where relevant', 'Assess multi-user and mobile-only tiers'] },
        { category: 'Content Quality & Relevance', sources: ['Catalogue observation', 'release schedules', 'regional content availability'], rules: ['Assess SA relevance and local availability', 'Track freshness and breadth'] },
        { category: 'Platform Experience', sources: ['App walkthroughs', 'device support docs', 'app reviews'], rules: ['Test core flows across device types if possible', 'Assess buffering, downloads, search, and recommendations'] },
        { category: 'Accessibility & Security', sources: ['Help docs', 'account settings', 'accessibility features'], rules: ['Check captions/audio description/profile controls', 'Assess sign-in/account protection options'] }
      ],
      prompts: [
        { id: 'p-stream-1', type: 'research', title: 'Streaming Service Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African media analyst. Research {brand}, a streaming service used in South Africa, across compliance, customer satisfaction, product value, content quality & relevance, platform experience, and accessibility/security. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-stream-2', type: 'scoring', title: 'Streaming Service Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Streaming Services rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 20, Content Quality & Relevance 25, Platform Experience 15, Accessibility/Security 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' }
      ]
    },

    /* ── 19. Supermarkets / Grocery ── */
    {
      id: 'sa_supermarkets_grocery',
      name: 'South Africa — Supermarkets / Grocery',
      market: 'SA',
      industry: 'Supermarkets / Grocery',
      slug: 'supermarkets-grocery',
      icon: 'fa-basket-shopping',
      status: 'active',
      description: 'Scoring rubric for SA grocery and supermarket retail brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 10, customer_satisfaction: 20, product_value: 25, assortment_availability: 20, store_quality: 15, omni_channel_experience: 10 },
          changeSummary: 'Initial rubric for supermarkets and grocery retail.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Consumer fairness and compliance standing.',
          anchors: { go: 'Strong compliance and fair retail practices.', caution: 'Minor concerns or inconsistency.', noGo: 'Serious repeated consumer/legal concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Shopper sentiment and trust.',
          anchors: { go: 'Strong satisfaction and positive trust signals.', caution: 'Mixed experience.', noGo: 'Persistent dissatisfaction or poor trust.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Price competitiveness and basket value.',
          anchors: { go: 'Strong basket value and price competitiveness.', caution: 'Average value.', noGo: 'Poor value or weak price perception.' } },
        { category: 'Assortment & Availability', key: 'assortment_availability', definition: 'Range quality and stock availability.',
          anchors: { go: 'Broad relevant range with strong in-stock reliability.', caution: 'Some stock gaps or range inconsistency.', noGo: 'Weak range or chronic stock shortages.' } },
        { category: 'Store Quality', key: 'store_quality', definition: 'Cleanliness, freshness, staff helpfulness, and shopping environment.',
          anchors: { go: 'Clean, well-run stores with strong fresh quality.', caution: 'Adequate store conditions with inconsistency.', noGo: 'Poor store conditions or fresh quality concerns.' } },
        { category: 'Omni-channel Experience', key: 'omni_channel_experience', definition: 'Online grocery, click-and-collect, and digital shopping journey.',
          anchors: { go: 'Reliable online grocery and good omni-channel experience.', caution: 'Basic digital support or occasional friction.', noGo: 'Weak or frustrating online grocery experience.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['Consumer complaints', 'returns/refund policies', 'company disclosures'], rules: ['Review pricing/promo fairness', 'Flag repeated consumer protection issues'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'social sentiment', 'public review platforms'], rules: ['Separate store-level and online complaints if possible', 'Weight recent trend'] },
        { category: 'Product Value', sources: ['Basket comparisons', 'promo leaflets', 'competitor pricing'], rules: ['Benchmark common grocery baskets', 'Assess loyalty pricing impact'] },
        { category: 'Assortment & Availability', sources: ['Online catalogues', 'stock-out reports', 'customer reviews'], rules: ['Track breadth across key categories', 'Assess stock availability themes'] },
        { category: 'Store Quality', sources: ['Customer reviews', 'store observations', 'fresh produce sentiment'], rules: ['Track cleanliness, queueing, and fresh departments', 'Assess branch consistency'] },
        { category: 'Omni-channel Experience', sources: ['App/web ordering', 'delivery/click-and-collect journeys', 'app reviews'], rules: ['Test basket building to fulfilment', 'Assess substitutions and service communication'] }
      ],
      prompts: [
        { id: 'p-grocery-1', type: 'research', title: 'Supermarket / Grocery Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African grocery retail analyst. Research {brand}, a supermarket/grocery brand in South Africa, across compliance, customer satisfaction, product value, assortment & availability, store quality, and omni-channel experience. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-grocery-2', type: 'scoring', title: 'Supermarket / Grocery Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Supermarkets/Grocery rubric weights: Compliance 10, Customer Satisfaction 20, Product Value 25, Assortment & Availability 20, Store Quality 15, Omni-channel Experience 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' }
      ]
    },

    /* ── 20. Telecoms / Mobile Networks ── */
    {
      id: 'sa_telecoms_mobile_networks',
      name: 'South Africa — Telecoms / Mobile Networks',
      market: 'SA',
      industry: 'Telecoms / Mobile Networks',
      slug: 'telecoms-mobile-networks',
      icon: 'fa-tower-cell',
      status: 'active',
      description: 'Scoring rubric for SA mobile networks and telecom providers.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 15, customer_satisfaction: 15, network_performance: 30, product_value: 20, customer_support: 10, innovation: 10 },
          changeSummary: 'Initial rubric for telecoms and mobile network brands.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Telecom compliance, transparency, and legal operating standards.',
          anchors: { go: 'Strong compliance and transparent consumer practices.', caution: 'Minor transparency or complaint concerns.', noGo: 'Serious compliance or consumer fairness concerns.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Subscriber sentiment and trust.',
          anchors: { go: 'Strong subscriber satisfaction and trust.', caution: 'Mixed sentiment.', noGo: 'Persistent dissatisfaction and trust issues.' } },
        { category: 'Network Performance', key: 'network_performance', definition: 'Coverage, speed, reliability, and real-world network quality.',
          anchors: { go: 'Strong coverage and consistently strong real-world performance.', caution: 'Adequate but inconsistent performance.', noGo: 'Weak coverage or recurring performance problems.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Tariff fairness, bundle quality, and value proposition.',
          anchors: { go: 'Competitive pricing and strong bundle value.', caution: 'Average value.', noGo: 'Poor value or weak pricing fairness.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Billing/help support and issue resolution quality.',
          anchors: { go: 'Responsive support and strong issue resolution.', caution: 'Average support.', noGo: 'Weak support and poor issue handling.' } },
        { category: 'Innovation', key: 'innovation', definition: '5G rollout, digital tools, and service innovation.',
          anchors: { go: 'Strong innovation and modern digital service capabilities.', caution: 'Moderate innovation.', noGo: 'Stagnant innovation profile.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['ICASA context', 'terms and tariffs', 'consumer complaints'], rules: ['Review out-of-bundle transparency', 'Flag cancellation/contract fairness issues'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'social media'], rules: ['Separate network complaints from billing/service complaints', 'Weight recent trend'] },
        { category: 'Network Performance', sources: ['Coverage maps', 'speed tests', 'outage reports'], rules: ['Use multiple network performance sources', 'Assess metro and peri-urban performance'] },
        { category: 'Product Value', sources: ['Tariff pages', 'bundle comparisons', 'promo terms'], rules: ['Compare prepaid, hybrid, and contract where relevant', 'Flag hidden costs'] },
        { category: 'Customer Support', sources: ['Support tests', 'complaint records', 'social response'], rules: ['Assess billing issue resolution', 'Track escalation clarity'] },
        { category: 'Innovation', sources: ['5G announcements', 'app capabilities', 'new products/services'], rules: ['Assess self-service maturity', 'Track recent product/network innovation'] }
      ],
      prompts: [
        { id: 'p-tel-1', type: 'research', title: 'Telecom / Mobile Network Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African telecom analyst. Research {brand}, a mobile network/telecom provider in South Africa, across compliance, customer satisfaction, network performance, product value, customer support, and innovation. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-tel-2', type: 'scoring', title: 'Telecom / Mobile Network Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Telecoms/Mobile Networks rubric weights: Compliance 15, Customer Satisfaction 15, Network Performance 30, Product Value 20, Customer Support 10, Innovation 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Network hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Network Performance < 30 → automatic No-Go' }
      ]
    },

    /* ── 21. Universities / Higher Education ── */
    {
      id: 'sa_universities_higher_education',
      name: 'South Africa — Universities / Higher Education',
      market: 'SA',
      industry: 'Universities / Higher Education',
      slug: 'universities-higher-education',
      icon: 'fa-graduation-cap',
      status: 'active',
      description: 'Scoring rubric for SA universities and higher education institutions.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { accreditation_governance: 25, student_satisfaction: 15, academic_value: 20, graduate_outcomes_reputation: 20, student_support: 10, accessibility_inclusion: 10 },
          changeSummary: 'Initial rubric for higher education institutions.'
        }
      ],
      anchors: [
        { category: 'Accreditation & Governance', key: 'accreditation_governance', definition: 'Accreditation standing, governance, and institutional legitimacy.',
          anchors: { go: 'Strong accreditation standing and institutional governance.', caution: 'Legitimate but with some governance/reputation concerns.', noGo: 'Serious accreditation or governance concerns.' } },
        { category: 'Student Satisfaction', key: 'student_satisfaction', definition: 'Student sentiment and campus/learning experience.',
          anchors: { go: 'Strong student satisfaction and trust.', caution: 'Mixed student sentiment.', noGo: 'Persistent dissatisfaction or weak student confidence.' } },
        { category: 'Academic Value', key: 'academic_value', definition: 'Academic quality relative to cost and educational proposition.',
          anchors: { go: 'Strong academic proposition and perceived value.', caution: 'Average academic value.', noGo: 'Weak value or academic dissatisfaction.' } },
        { category: 'Graduate Outcomes & Reputation', key: 'graduate_outcomes_reputation', definition: 'Employability, outcomes, and institutional reputation.',
          anchors: { go: 'Strong graduate outcomes and respected reputation.', caution: 'Moderate outcomes/reputation.', noGo: 'Weak outcomes or reputation concerns.' } },
        { category: 'Student Support', key: 'student_support', definition: 'Administrative support, counselling, academic support, and responsiveness.',
          anchors: { go: 'Strong student support systems and service culture.', caution: 'Adequate support with some friction.', noGo: 'Weak support and poor responsiveness.' } },
        { category: 'Accessibility & Inclusion', key: 'accessibility_inclusion', definition: 'Accessibility, inclusion, and practical access to study.',
          anchors: { go: 'Strong inclusion, accessibility, and broad access support.', caution: 'Adequate but with gaps.', noGo: 'Weak accessibility/inclusion or major access concerns.' } }
      ],
      playbooks: [
        { category: 'Accreditation & Governance', sources: ['DHET/CHE context', 'institutional disclosures', 'public governance issues'], rules: ['Verify legitimacy and standing', 'Flag serious governance crises'] },
        { category: 'Student Satisfaction', sources: ['Student reviews', 'social sentiment', 'public forums'], rules: ['Separate academic complaints from admin complaints', 'Weight recent sentiment'] },
        { category: 'Academic Value', sources: ['Fee structures', 'programme info', 'institution comparisons'], rules: ['Assess cost relative to programme quality and support', 'Compare like-for-like institutions where possible'] },
        { category: 'Graduate Outcomes & Reputation', sources: ['Employer reputation', 'rankings context', 'graduate stories'], rules: ['Avoid over-weighting global rankings alone', 'Assess local employability signals'] },
        { category: 'Student Support', sources: ['Support services pages', 'student complaints', 'service response reports'], rules: ['Assess registration/admin support', 'Track financial aid and academic support friction'] },
        { category: 'Accessibility & Inclusion', sources: ['Accessibility statements', 'campus support services', 'student feedback'], rules: ['Assess disability and inclusion support', 'Review digital access for learning platforms'] }
      ],
      prompts: [
        { id: 'p-uni-1', type: 'research', title: 'University / Higher Education Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African higher education analyst. Research {brand}, a university or higher education institution in South Africa, across accreditation & governance, student satisfaction, academic value, graduate outcomes & reputation, student support, and accessibility & inclusion. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use verifiable SA-relevant sources', 'Score all categories independently', 'Include evidence URLs where possible'] },
        { id: 'p-uni-2', type: 'scoring', title: 'University / Higher Education Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Universities/Higher Education rubric weights: Accreditation & Governance 25, Student Satisfaction 15, Academic Value 20, Graduate Outcomes & Reputation 20, Student Support 10, Accessibility & Inclusion 10. Compute weighted GoNoGo score (0-100). Return JSON with final score, verdict, and category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Accreditation hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Accreditation & Governance < 30 → automatic No-Go' }
      ]
    }

  ]; // end RUBRICS array
   const state = {
    rubrics: RUBRICS,
    selectedRubricId: null,
    selectedVersionIndex: 0
  };

  function getRubricById(id) {
    return state.rubrics.find(r => r.id === id) || null;
  }

  function getDefaultRubric() {
    return state.rubrics[0] || null;
  }

  function initState() {
    const first = getDefaultRubric();
    state.selectedRubricId = first ? first.id : null;
    state.selectedVersionIndex = 0;
  }

  function exposeForDebug() {
    try {
      window.GoNoGoScoring = {
        state,
        RUBRICS,
        getRubricById,
        getDefaultRubric
      };
    } catch (err) {
      console.warn('Unable to expose GoNoGoScoring on window:', err);
    }
  }

  function safeBootNotice() {
    const rubricCount = Array.isArray(RUBRICS) ? RUBRICS.length : 0;
    console.info(`GoNoGo SA scoring loaded with ${rubricCount} rubric(s).`);
  }

  /* ------------------------------------------------------------
     NOTE:
     If your original admin-scoring.js had additional UI rendering,
     DOM event handlers, save/edit/delete flows, modal logic,
     Supabase sync, or table rendering code, that logic should live
     below this point in your production file.

     This rebuilt version gives you:
     - the corrected full 21-industry RUBRICS seed
     - a valid JS wrapper
     - safe initial state helpers
     - a non-breaking debug/global exposure

     You can now paste this as a clean base file.
     ------------------------------------------------------------ */

  initState();
  exposeForDebug();
  safeBootNotice();

})();
