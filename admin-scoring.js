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
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: { compliance: 20, customer_satisfaction: 25, product_value: 20, innovation: 10, customer_support: 15, accessibility_security: 10 },
          changeSummary: 'Initial banking rubric from XLSX scoring matrix.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Evaluates compliance aspects of the brand.',
          anchors: {
            go: 'Full FCA authorization, no restrictions, clean regulatory record; Full FSCS protection (£85k), ring-fenced funds, strong safeguarding; Clean record, no major fines/sanctions in 24+ months',
            caution: 'Authorized with minor restrictions or e-money license; Good protection with minor gaps in coverage; Minor regulatory actions or historical issues',
            noGo: 'Pending authorization or operating with limited oversight; Limited or unclear fund protection; Recent major fines, ongoing investigations'
          }
        },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Evaluates customer satisfaction aspects of the brand.',
          anchors: {
            go: '4.8+ average across platforms, positive trend, high volume; Top performer in major satisfaction surveys; Very low complaint rates, under 24hr resolution',
            caution: '4.0-4.7 average with stable sentiment; Above average performance in surveys; Average complaint handling and resolution times',
            noGo: 'Below 4.0 average or declining trend; Below average or poor survey performance; High complaint rates, slow resolution'
          }
        },
        { category: 'Product Value', key: 'product_value', definition: 'Evaluates product value aspects of the brand.',
          anchors: {
            go: 'Complete transparency, no hidden fees, clear T&Cs; Strong free tier, genuine paid plan value (insurance, cashback); Market-leading FX rates, minimal/no transaction fees',
            caution: 'Good transparency with minor unclear areas; Good free tier with reasonable paid benefits; Competitive rates and reasonable fees',
            noGo: 'Poor transparency, hidden charges; Weak free tier, poor paid plan value; High FX spreads and transaction fees'
          }
        },
        { category: 'Innovation', key: 'innovation', definition: 'Evaluates innovation aspects of the brand.',
          anchors: {
            go: 'Quarterly meaningful launches (budgeting, crypto, open banking); First to market with beneficial tech (instant payments, AI tools)',
            caution: 'Semi-annual useful feature updates; Quick follower with good implementation',
            noGo: 'Rare or insignificant feature updates; Technology laggard, slow adoption'
          }
        },
        { category: 'Customer Support', key: 'customer_support', definition: 'Evaluates customer support aspects of the brand.',
          anchors: {
            go: '24/7 live chat, phone, email, social media support; Sub-1 hour response, knowledgeable agents, high first-contact resolution',
            caution: 'Extended hours with multiple channels; Good response times and knowledge levels',
            noGo: 'Limited hours or few contact options; Slow response, inconsistent quality'
          }
        },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Evaluates accessibility/security aspects of the brand.',
          anchors: {
            go: '4.5+ app ratings, comprehensive accessibility features (screen readers, font sizing); Biometric login, 3DS, instant freeze, real-time alerts, advanced fraud detection; No major breaches in 12+ months, excellent incident response',
            caution: 'Good app ratings with basic accessibility; Good security suite with most features; Minor incidents well-handled',
            noGo: 'Poor app experience or limited accessibility; Basic security measures only; Recent major breaches or poor incident response'
          }
        }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['SARB prudential authority records', 'FSCA register', 'NCR compliance data'], rules: ['Verify SARB banking licence', 'Check FAIS compliance'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Trustpilot', 'App Store & Google Play ratings', 'SA Customer Satisfaction Index'], rules: ['Aggregate 3+ platforms', 'Weight recency — last 6 months'] },
        { category: 'Product Value', sources: ['Bank pricing schedules', 'Comparison sites (Finder SA, Gobankingrates)', 'Product disclosure documents'], rules: ['Compare fee structures across tiers', 'Assess interest rates vs repo rate'] },
        { category: 'Innovation', sources: ['Press releases & tech blogs', 'App changelogs', 'Open banking API directories'], rules: ['Track 12-month feature cadence', 'Assess digital-first capability'] },
        { category: 'Customer Support', sources: ['Mystery shopping across channels', 'Social media response audits', 'Banking Ombudsman data'], rules: ['Test 2+ channels', 'Measure first-response time'] },
        { category: 'Accessibility & Security', sources: ['App store accessibility reviews', 'POPIA compliance reports', 'Breach notification history'], rules: ['Verify biometric and MFA availability', 'Check POPIA compliance'] }
      ],
      prompts: [
        { id: 'p-bank-1', type: 'research', title: 'Banking Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African banking analyst. Research {brand} across compliance, customer satisfaction, product value, innovation, customer support, and accessibility/security. Use SA-specific regulatory context (SARB, FSCA, NCR). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['Use only verifiable South African sources', 'Score each of the 6 categories independently', 'Provide evidence URLs where possible'] },
        { id: 'p-bank-2', type: 'scoring', title: 'Banking Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply the SA Banking rubric weights: Compliance 20, Customer Satisfaction 25, Product Value 20, Innovation 10, Customer Support 15, Accessibility/Security 10. Compute the weighted GoNoGo score (0-100). Return JSON with final score, verdict (Go/Caution/No-Go), and per-category breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules before final verdict', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go regardless of total' }
      ]
    },

    /* ── 5. Car Dealerships ── */
    {
      id: 'sa_car_dealerships',
      name: 'South Africa — Car Dealerships',
      market: 'SA',
      industry: 'Car Dealerships',
      slug: 'car-dealers',
      icon: 'fa-car',
      status: 'active',
      description: 'Scoring rubric for SA new and used car dealership brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_licensing: 15, vehicle_quality: 25, customer_experience: 20, value_pricing: 20, digital_presence: 10, aftersales: 10 },
          changeSummary: 'Initial car dealerships rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Licensing', key: 'compliance_licensing', definition: 'NCA compliance, CPA adherence, and dealer registration.', anchors: { go: 'Fully NCA/CPA compliant, registered dealer, clean record.', caution: 'Registered with minor compliance gaps.', noGo: 'Unregistered or significant compliance failures.' } },
        { category: 'Vehicle Quality', key: 'vehicle_quality', definition: 'Vehicle condition, history checks, and inspection standards.', anchors: { go: 'Comprehensive pre-sale inspections, full history reports, quality guarantee.', caution: 'Basic inspections, partial history available.', noGo: 'No inspections, missing history, known defects unreported.' } },
        { category: 'Customer Experience', key: 'customer_experience', definition: 'Sales process, transparency, and buyer satisfaction.', anchors: { go: 'Transparent sales, no pressure tactics, high satisfaction ratings.', caution: 'Adequate experience with minor friction points.', noGo: 'High-pressure sales, misleading info, poor reviews.' } },
        { category: 'Value & Pricing', key: 'value_pricing', definition: 'Pricing competitiveness, finance terms, and trade-in value.', anchors: { go: 'Competitive pricing, fair finance, transparent trade-in valuations.', caution: 'Average pricing, standard finance terms.', noGo: 'Overpriced, predatory finance, poor trade-in values.' } },
        { category: 'Digital Presence', key: 'digital_presence', definition: 'Online inventory, virtual showroom, and digital tools.', anchors: { go: 'Full online inventory, virtual tours, digital paperwork.', caution: 'Basic online listings.', noGo: 'No digital presence or outdated site.' } },
        { category: 'After-Sales', key: 'aftersales', definition: 'Warranty, service plans, and post-purchase support.', anchors: { go: 'Comprehensive warranty, service plans, proactive follow-up.', caution: 'Standard warranty, basic after-sales.', noGo: 'No warranty, poor post-sale support.' } }
      ],
      playbooks: [
        { category: 'Compliance & Licensing', sources: ['NAAMSA records', 'NCA register', 'CPA enforcement actions'], rules: ['Verify dealer registration', 'Check NCA compliance'] },
        { category: 'Vehicle Quality', sources: ['AA inspection reports', 'TransUnion vehicle checks', 'Customer feedback'], rules: ['Verify inspection process', 'Check vehicle history report availability'] },
        { category: 'Customer Experience', sources: ['Google reviews', 'Hellopeter', 'Cars.co.za reviews'], rules: ['Aggregate 3+ review platforms', 'Focus on last 12 months'] },
        { category: 'Value & Pricing', sources: ['AutoTrader price comparisons', 'Finance rate benchmarks', 'Industry pricing guides'], rules: ['Compare against market average', 'Assess finance APR vs prime rate'] },
        { category: 'Digital Presence', sources: ['Website audit', 'App store listings', 'Social media activity'], rules: ['Test inventory search UX', 'Verify listing accuracy'] },
        { category: 'After-Sales', sources: ['Warranty policy documents', 'Service plan brochures', 'Post-sale reviews'], rules: ['Review warranty T&Cs', 'Assess service plan value'] }
      ],
      prompts: [
        { id: 'p-card-1', type: 'research', title: 'Car Dealership Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African automotive analyst. Research {brand}, a car dealership, across compliance & licensing, vehicle quality, customer experience, value & pricing, digital presence, and after-sales. Use SA-specific context (NCA, CPA, NAAMSA). Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['SA regulatory context required', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-card-2', type: 'scoring', title: 'Car Dealership Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Given the research payload for {brand}, apply weights: Compliance & Licensing 15, Vehicle Quality 25, Customer Experience 20, Value & Pricing 20, Digital Presence 10, After-Sales 10. Compute weighted GoNoGo score. Return JSON with final score, verdict, and breakdowns.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 with no hard fails → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance & Licensing < 30 → automatic No-Go' }
      ]
    },

    /* ── 6. Car Rentals ── */
    {
      id: 'sa_car_rentals',
      name: 'South Africa — Car Rentals',
      market: 'SA',
      industry: 'Car Rentals',
      slug: 'car-rentals',
      icon: 'fa-key',
      status: 'active',
      description: 'Scoring rubric for SA car rental and vehicle hire brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_licensing: 15, fleet_quality: 20, customer_experience: 25, value_pricing: 20, digital_booking: 10, coverage_availability: 10 },
          changeSummary: 'Initial car rentals rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Licensing', key: 'compliance_licensing', definition: 'Tourism grading, insurance compliance, and CPA adherence.', anchors: { go: 'Fully licensed, comprehensive fleet insurance, CPA compliant.', caution: 'Licensed with minor gaps.', noGo: 'Licensing issues or inadequate insurance.' } },
        { category: 'Fleet Quality', key: 'fleet_quality', definition: 'Vehicle condition, variety, age, and maintenance standards.', anchors: { go: 'Modern fleet (<3 yrs avg), wide variety, documented maintenance.', caution: 'Average fleet age, adequate variety.', noGo: 'Ageing fleet, poor maintenance, limited options.' } },
        { category: 'Customer Experience', key: 'customer_experience', definition: 'Pickup/drop-off process, staff quality, and satisfaction.', anchors: { go: 'Fast pickup, friendly staff, seamless process, 4.5+ ratings.', caution: 'Adequate process with some friction.', noGo: 'Long waits, poor staff, hidden charges at counter.' } },
        { category: 'Value & Pricing', key: 'value_pricing', definition: 'Daily rates, insurance excess, hidden fees, and transparency.', anchors: { go: 'Competitive rates, low excess, full transparency.', caution: 'Average pricing, moderate excess.', noGo: 'Expensive, high excess, hidden fees.' } },
        { category: 'Digital Booking', key: 'digital_booking', definition: 'Online reservation, app features, and modification ease.', anchors: { go: 'Smooth online booking, great app, easy modifications.', caution: 'Basic online booking.', noGo: 'No online booking or very poor digital experience.' } },
        { category: 'Coverage & Availability', key: 'coverage_availability', definition: 'Location network, airport presence, and fleet availability.', anchors: { go: 'All major airports, wide city coverage, high availability.', caution: 'Major cities covered, occasional availability issues.', noGo: 'Limited locations, frequent unavailability.' } }
      ],
      playbooks: [
        { category: 'Compliance & Licensing', sources: ['Tourism grading council', 'Insurance certificates', 'CPA records'], rules: ['Verify active tourism licence', 'Confirm fleet insurance coverage'] },
        { category: 'Fleet Quality', sources: ['Fleet age data', 'Maintenance records', 'Customer photos/reviews'], rules: ['Check average fleet age', 'Verify service intervals'] },
        { category: 'Customer Experience', sources: ['Google reviews', 'Hellopeter', 'Trustpilot'], rules: ['Aggregate ratings from 3+ platforms', 'Focus on pickup/return experience'] },
        { category: 'Value & Pricing', sources: ['Rate comparison tools', 'Rental T&Cs', 'Competitor benchmarks'], rules: ['Compare all-in daily rates', 'Flag excess and deposit amounts'] },
        { category: 'Digital Booking', sources: ['Website UX audit', 'App store ratings', 'Booking flow test'], rules: ['Complete test booking', 'Assess modification flexibility'] },
        { category: 'Coverage & Availability', sources: ['Branch locator', 'Airport presence data', 'Booking availability checks'], rules: ['Map against SA airports', 'Test high-season availability'] }
      ],
      prompts: [
        { id: 'p-carr-1', type: 'research', title: 'Car Rental Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African travel analyst. Research {brand}, a car rental provider, across compliance & licensing, fleet quality, customer experience, value & pricing, digital booking, and coverage & availability. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['SA context required', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-carr-2', type: 'scoring', title: 'Car Rental Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance & Licensing 15, Fleet Quality 20, Customer Experience 25, Value & Pricing 20, Digital Booking 10, Coverage & Availability 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 7. Conference Centres ── */
    {
      id: 'sa_conference_centres',
      name: 'South Africa — Conference Centres',
      market: 'SA',
      industry: 'Conference Centres',
      slug: 'conference-centres',
      icon: 'fa-building-columns',
      status: 'active',
      description: 'Scoring rubric for SA conference and event venue brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_safety: 15, venue_quality: 25, service_experience: 20, technology_av: 15, value_pricing: 15, accessibility_location: 10 },
          changeSummary: 'Initial conference centres rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Safety', key: 'compliance_safety', definition: 'Fire safety, capacity compliance, and health regulations.', anchors: { go: 'Full compliance with fire/safety regs, documented capacity, health cert.', caution: 'Compliant with minor outstanding items.', noGo: 'Non-compliant or expired safety certifications.' } },
        { category: 'Venue Quality', key: 'venue_quality', definition: 'Facilities, catering, and overall venue condition.', anchors: { go: 'Excellent facilities, high-quality catering, well-maintained.', caution: 'Good facilities with some dated aspects.', noGo: 'Poor facilities, substandard catering.' } },
        { category: 'Service Experience', key: 'service_experience', definition: 'Event coordination, staff responsiveness, and client satisfaction.', anchors: { go: 'Dedicated coordinator, responsive staff, 4.5+ client ratings.', caution: 'Adequate service, some coordination gaps.', noGo: 'Poor service, unresponsive, negative reviews.' } },
        { category: 'Technology & AV', key: 'technology_av', definition: 'AV equipment, connectivity, and hybrid event capability.', anchors: { go: 'Modern AV, high-speed WiFi, hybrid/streaming capability.', caution: 'Basic AV, adequate WiFi.', noGo: 'Outdated AV, poor connectivity.' } },
        { category: 'Value & Pricing', key: 'value_pricing', definition: 'Package pricing, inclusions, and cost competitiveness.', anchors: { go: 'Competitive packages, transparent inclusions, flexible.', caution: 'Average pricing, some hidden extras.', noGo: 'Overpriced, unclear inclusions.' } },
        { category: 'Accessibility & Location', key: 'accessibility_location', definition: 'Transport links, parking, accommodation, and inclusive access.', anchors: { go: 'Excellent transport links, ample parking, nearby hotels, wheelchair accessible.', caution: 'Adequate access with some limitations.', noGo: 'Poor access, limited parking, not accessible.' } }
      ],
      playbooks: [
        { category: 'Compliance & Safety', sources: ['Municipal fire certificates', 'Health department records', 'Occupancy permits'], rules: ['Verify current fire certificate', 'Check capacity documentation'] },
        { category: 'Venue Quality', sources: ['Venue tours/photos', 'Client reviews', 'Catering menus'], rules: ['Conduct virtual or physical tour', 'Assess catering quality'] },
        { category: 'Service Experience', sources: ['Google/Hellopeter reviews', 'Event planner testimonials', 'Mystery enquiry'], rules: ['Aggregate client feedback', 'Test response time to enquiry'] },
        { category: 'Technology & AV', sources: ['AV equipment lists', 'WiFi speed tests', 'Streaming capabilities'], rules: ['Verify fibre connectivity', 'Check hybrid event support'] },
        { category: 'Value & Pricing', sources: ['Published rate cards', 'Proposal documents', 'Competitor quotes'], rules: ['Compare like-for-like packages', 'Flag exclusions'] },
        { category: 'Accessibility & Location', sources: ['Google Maps access data', 'Parking capacity', 'Accessibility audits'], rules: ['Map public transport links', 'Verify wheelchair access'] }
      ],
      prompts: [
        { id: 'p-conf-1', type: 'research', title: 'Conference Centre Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African events analyst. Research {brand}, a conference centre, across compliance & safety, venue quality, service experience, technology & AV, value & pricing, and accessibility & location. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['SA context required', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-conf-2', type: 'scoring', title: 'Conference Centre Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance & Safety 15, Venue Quality 25, Service Experience 20, Technology & AV 15, Value & Pricing 15, Accessibility & Location 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Safety hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance & Safety < 30 → automatic No-Go' }
      ]
    },

    /* ── 8. Food & Grocery Delivery ── */
    {
      id: 'sa_food_grocery_delivery',
      name: 'South Africa — Food & Grocery Delivery',
      market: 'SA',
      industry: 'Food & Grocery Delivery',
      slug: 'food-delivery',
      icon: 'fa-utensils',
      status: 'active',
      description: 'Scoring rubric for SA food and grocery delivery platforms.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance: 20, customer_satisfaction: 20, product_value: 25, innovation: 10, customer_support: 15, accessibility_security: 10 },
          changeSummary: 'Initial rubric derived from Meal Delivery scoring framework.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'Food safety regulations, delivery licensing, and consumer protection compliance.', anchors: { go: 'Full food safety compliance, registered with health authorities, clean record.', caution: 'Compliant with minor gaps.', noGo: 'Non-compliant or health violations on record.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'User ratings, order accuracy, and delivery experience.', anchors: { go: '4.5+ app ratings, high order accuracy, positive sentiment.', caution: '3.5–4.4 ratings, moderate accuracy.', noGo: 'Below 3.5 ratings, frequent complaints.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Menu variety, pricing, delivery fees, and promotions.', anchors: { go: 'Wide restaurant selection, fair pricing, transparent fees, regular promos.', caution: 'Adequate selection, moderate fees.', noGo: 'Limited selection, high fees, misleading pricing.' } },
        { category: 'Innovation', key: 'innovation', definition: 'Technology features, real-time tracking, and new service launches.', anchors: { go: 'Best-in-class tracking, AI recommendations, rapid feature iteration.', caution: 'Standard tracking, occasional updates.', noGo: 'Basic app, minimal innovation.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'In-app support, refund handling, and complaint resolution.', anchors: { go: 'Instant in-app support, fast refunds, proactive issue resolution.', caution: 'Adequate support, reasonable refund times.', noGo: 'Difficult to reach, slow refunds, unresolved issues.' } },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'App accessibility, payment security, and data protection.', anchors: { go: 'Inclusive app design, secure payments, POPIA compliant.', caution: 'Basic accessibility, standard security.', noGo: 'Poor accessibility, security concerns.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['DoH food safety records', 'CPA compliance', 'Business registration'], rules: ['Verify health department compliance', 'Check CPA adherence'] },
        { category: 'Customer Satisfaction', sources: ['App store ratings', 'Hellopeter', 'Social media sentiment'], rules: ['Aggregate app + review platforms', 'Track order accuracy complaints'] },
        { category: 'Product Value', sources: ['Menu/pricing audits', 'Fee comparison', 'Promotion tracking'], rules: ['Compare delivery fees across platforms', 'Assess restaurant coverage'] },
        { category: 'Innovation', sources: ['App changelogs', 'Press coverage', 'Feature comparisons'], rules: ['Track feature releases quarterly', 'Assess tracking capabilities'] },
        { category: 'Customer Support', sources: ['In-app support tests', 'Refund policy review', 'Social media responsiveness'], rules: ['Test support response time', 'Document refund process'] },
        { category: 'Accessibility & Security', sources: ['App accessibility audit', 'Payment security review', 'POPIA compliance'], rules: ['Test screen reader compatibility', 'Verify payment encryption'] }
      ],
      prompts: [
        { id: 'p-food-1', type: 'research', title: 'Food Delivery Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African food-tech analyst. Research {brand}, a food & grocery delivery platform, across compliance, customer satisfaction, product value, innovation, customer support, and accessibility/security. Return structured JSON with category scores 0-100 and evidence summaries.',
          constraints: ['SA context required', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-food-2', type: 'scoring', title: 'Food Delivery Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance 20, Customer Satisfaction 20, Product Value 25, Innovation 10, Customer Support 15, Accessibility/Security 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 9. HR & Payroll Software ── */
    {
      id: 'sa_hr_payroll_software',
      name: 'South Africa — HR & Payroll Software',
      market: 'SA',
      industry: 'HR & Payroll Software',
      slug: 'hr-software',
      icon: 'fa-users-gear',
      status: 'active',
      description: 'Scoring rubric for SA HR, payroll, and people management software.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_regulation: 20, product_features: 25, customer_satisfaction: 20, value_pricing: 15, integration_support: 10, innovation: 10 },
          changeSummary: 'Initial HR & Payroll software rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Regulation', key: 'compliance_regulation', definition: 'SARS compliance, BCEA adherence, and POPIA.', anchors: { go: 'Full SARS compliance, BCEA adherent, POPIA certified.', caution: 'Compliant with minor gaps.', noGo: 'SARS non-compliant or POPIA violations.' } },
        { category: 'Product Features', key: 'product_features', definition: 'Payroll accuracy, leave management, and HR modules.', anchors: { go: 'Comprehensive HR suite, accurate payroll, robust leave/claims.', caution: 'Good core features, some modules lacking.', noGo: 'Limited features, payroll inaccuracies.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'User reviews, onboarding experience, and support quality.', anchors: { go: '4.5+ ratings, smooth onboarding, responsive support.', caution: '3.5–4.4 ratings, adequate onboarding.', noGo: 'Below 3.5 ratings, poor onboarding, unresponsive.' } },
        { category: 'Value & Pricing', key: 'value_pricing', definition: 'Per-employee pricing, tiers, and cost transparency.', anchors: { go: 'Competitive per-employee pricing, transparent, flexible tiers.', caution: 'Average pricing, some hidden costs.', noGo: 'Expensive, opaque pricing, long lock-in.' } },
        { category: 'Integration & Support', key: 'integration_support', definition: 'API integrations, accounting software links, and support channels.', anchors: { go: 'Rich API, integrates with major SA accounting tools, multi-channel support.', caution: 'Basic integrations, standard support.', noGo: 'No integrations, limited support.' } },
        { category: 'Innovation', key: 'innovation', definition: 'AI features, mobile access, and product roadmap.', anchors: { go: 'AI-driven insights, excellent mobile app, clear roadmap.', caution: 'Some modern features, basic mobile.', noGo: 'Legacy platform, no mobile, stagnant.' } }
      ],
      playbooks: [
        { category: 'Compliance & Regulation', sources: ['SARS e-filing integration status', 'BCEA compliance docs', 'POPIA audit reports'], rules: ['Verify SARS submission capability', 'Check BCEA leave calculation accuracy'] },
        { category: 'Product Features', sources: ['Feature comparison matrices', 'Product demos', 'User reviews'], rules: ['Assess payroll accuracy claims', 'Compare module coverage'] },
        { category: 'Customer Satisfaction', sources: ['G2/Capterra ratings', 'Hellopeter', 'LinkedIn recommendations'], rules: ['Aggregate 3+ platforms', 'Weight recent reviews'] },
        { category: 'Value & Pricing', sources: ['Published pricing pages', 'Competitor benchmarks', 'Contract terms'], rules: ['Compare per-employee cost', 'Flag lock-in clauses'] },
        { category: 'Integration & Support', sources: ['API documentation', 'Integration partner lists', 'Support SLAs'], rules: ['Verify Sage/Xero/QuickBooks integrations', 'Test support channels'] },
        { category: 'Innovation', sources: ['Product changelogs', 'Press coverage', 'Roadmap publications'], rules: ['Track 12-month release cadence', 'Assess mobile app quality'] }
      ],
      prompts: [
        { id: 'p-hr-1', type: 'research', title: 'HR & Payroll Software Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African HR technology analyst. Research {brand} across compliance & regulation, product features, customer satisfaction, value & pricing, integration & support, and innovation. Use SA-specific context (SARS, BCEA, POPIA). Return structured JSON with category scores 0-100.',
          constraints: ['SA regulatory context required', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-hr-2', type: 'scoring', title: 'HR & Payroll Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance & Regulation 20, Product Features 25, Customer Satisfaction 20, Value & Pricing 15, Integration & Support 10, Innovation 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance & Regulation < 30 → automatic No-Go' }
      ]
    },

    /* ── 10. Home Cleaning Services ── */
    {
      id: 'sa_home_cleaning_services',
      name: 'South Africa — Home Cleaning Services',
      market: 'SA',
      industry: 'Home Cleaning Services',
      slug: 'home-cleaning',
      icon: 'fa-spray-can-sparkles',
      status: 'active',
      description: 'Scoring rubric for SA home cleaning and domestic service platforms.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_vetting: 20, service_quality: 25, customer_satisfaction: 20, booking_platform: 15, value_pricing: 10, reliability_trust: 10 },
          changeSummary: 'Initial home cleaning services rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Vetting', key: 'compliance_vetting', definition: 'Worker vetting, UIF/COIDA compliance, and insurance.', anchors: { go: 'Full background checks, UIF/COIDA registered, insured workers.', caution: 'Basic vetting, partial compliance.', noGo: 'No vetting, non-compliant, uninsured.' } },
        { category: 'Service Quality', key: 'service_quality', definition: 'Cleaning standards, consistency, and professionalism.', anchors: { go: 'Consistently high standards, professional teams, quality guarantees.', caution: 'Generally good with occasional inconsistency.', noGo: 'Poor quality, unreliable standards.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Reviews, repeat bookings, and complaint resolution.', anchors: { go: '4.5+ ratings, high repeat rate, fast complaint resolution.', caution: '3.5–4.4 ratings, moderate retention.', noGo: 'Below 3.5, low retention, unresolved complaints.' } },
        { category: 'Booking Platform', key: 'booking_platform', definition: 'Ease of booking, scheduling flexibility, and app quality.', anchors: { go: 'Seamless app/web booking, flexible scheduling, real-time availability.', caution: 'Basic online booking, limited flexibility.', noGo: 'Manual booking only, poor digital experience.' } },
        { category: 'Value & Pricing', key: 'value_pricing', definition: 'Hourly rates, package deals, and pricing transparency.', anchors: { go: 'Competitive rates, transparent pricing, good packages.', caution: 'Average pricing, some unclear extras.', noGo: 'Expensive, opaque pricing.' } },
        { category: 'Reliability & Trust', key: 'reliability_trust', definition: 'Punctuality, cancellation rates, and trust indicators.', anchors: { go: 'High punctuality, low cancellation, strong trust signals.', caution: 'Generally reliable with occasional issues.', noGo: 'Frequent cancellations, unreliable.' } }
      ],
      playbooks: [
        { category: 'Compliance & Vetting', sources: ['UIF registration checks', 'COIDA compliance', 'Insurance certificates'], rules: ['Verify worker registration', 'Confirm insurance coverage'] },
        { category: 'Service Quality', sources: ['Customer reviews', 'Quality guarantee policies', 'Training documentation'], rules: ['Assess consistency from reviews', 'Check quality guarantee terms'] },
        { category: 'Customer Satisfaction', sources: ['Google reviews', 'Hellopeter', 'App store ratings'], rules: ['Aggregate 3+ platforms', 'Track repeat booking rate'] },
        { category: 'Booking Platform', sources: ['App/website UX audit', 'Booking flow test', 'Feature comparison'], rules: ['Complete test booking', 'Assess scheduling flexibility'] },
        { category: 'Value & Pricing', sources: ['Published rates', 'Competitor pricing', 'Package comparisons'], rules: ['Compare hourly rates', 'Flag hidden fees'] },
        { category: 'Reliability & Trust', sources: ['Cancellation rate data', 'Punctuality reviews', 'Trust certifications'], rules: ['Track cancellation trends', 'Verify trust signals'] }
      ],
      prompts: [
        { id: 'p-clean-1', type: 'research', title: 'Home Cleaning Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African services analyst. Research {brand}, a home cleaning service, across compliance & vetting, service quality, customer satisfaction, booking platform, value & pricing, and reliability & trust. Return structured JSON with category scores 0-100.',
          constraints: ['SA labour law context (UIF, COIDA)', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-clean-2', type: 'scoring', title: 'Home Cleaning Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance & Vetting 20, Service Quality 25, Customer Satisfaction 20, Booking Platform 15, Value & Pricing 10, Reliability & Trust 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Vetting hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance & Vetting < 30 → automatic No-Go' }
      ]
    },

    /* ── 11. Home Internet & Fibre ── */
    {
      id: 'sa_home_internet_fibre',
      name: 'South Africa — Home Internet & Fibre',
      market: 'SA',
      industry: 'Home Internet & Fibre',
      slug: 'home-internet-fibre',
      icon: 'fa-wifi',
      status: 'active',
      description: 'Scoring rubric for SA fibre and home internet providers.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance: 20, customer_satisfaction: 20, product_value: 25, innovation: 10, customer_support: 15, accessibility_security: 10 },
          changeSummary: 'Initial rubric derived from Broadband/Fiber scoring framework.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'ICASA licensing, CPA compliance, and regulatory standing.', anchors: { go: 'Full ICASA licence, CPA compliant, clean regulatory record.', caution: 'Licensed with minor compliance items.', noGo: 'Licensing issues or regulatory penalties.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'User ratings, speed consistency, and overall satisfaction.', anchors: { go: '4.5+ ratings, consistent speeds, positive sentiment.', caution: '3.5–4.4 ratings, occasional speed issues.', noGo: 'Below 3.5, frequent complaints, poor sentiment.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Speed tiers, pricing, FUP policies, and bundling value.', anchors: { go: 'Competitive pricing, uncapped options, good speed tiers.', caution: 'Average pricing, some FUP limitations.', noGo: 'Expensive, heavy throttling, poor value.' } },
        { category: 'Innovation', key: 'innovation', definition: 'Network technology, speed upgrades, and new service launches.', anchors: { go: 'FTTH leader, regular speed upgrades, innovative bundling.', caution: 'Standard technology, periodic upgrades.', noGo: 'Legacy infrastructure, no upgrades.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Installation support, fault resolution, and communication.', anchors: { go: 'Fast installation, quick fault resolution, proactive comms.', caution: 'Adequate support with some delays.', noGo: 'Slow installation, poor fault handling.' } },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'Coverage area, router security, and online safety features.', anchors: { go: 'Wide coverage, secure routers, parental controls, POPIA compliant.', caution: 'Good coverage, basic security.', noGo: 'Limited coverage, poor security.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['ICASA licence register', 'CPA records', 'POPIA compliance'], rules: ['Verify active ICASA licence', 'Check CPA complaint history'] },
        { category: 'Customer Satisfaction', sources: ['MyBroadband forums', 'Hellopeter', 'Google reviews'], rules: ['Aggregate 3+ platforms', 'Track speed test data'] },
        { category: 'Product Value', sources: ['ISP pricing pages', 'MyBroadband comparisons', 'Speed tier analysis'], rules: ['Compare Rand-per-Mbps', 'Check FUP policies'] },
        { category: 'Innovation', sources: ['Network rollout data', 'Press releases', 'Technology certifications'], rules: ['Assess FTTH vs LTE coverage', 'Track upgrade frequency'] },
        { category: 'Customer Support', sources: ['Installation time reviews', 'Fault resolution data', 'Social media responsiveness'], rules: ['Measure average installation time', 'Track fault resolution SLAs'] },
        { category: 'Accessibility & Security', sources: ['Coverage maps', 'Router spec sheets', 'Security feature lists'], rules: ['Map coverage against metros', 'Verify router security defaults'] }
      ],
      prompts: [
        { id: 'p-fibre-1', type: 'research', title: 'Home Internet & Fibre Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African telecoms analyst. Research {brand}, a home internet/fibre provider, across compliance, customer satisfaction, product value, innovation, customer support, and accessibility/security. Use SA-specific context (ICASA). Return structured JSON with category scores 0-100.',
          constraints: ['SA regulatory context (ICASA)', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-fibre-2', type: 'scoring', title: 'Home Internet Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance 20, Customer Satisfaction 20, Product Value 25, Innovation 10, Customer Support 15, Accessibility/Security 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 12. Hospitals ── */
    {
      id: 'sa_hospitals',
      name: 'South Africa — Hospitals',
      market: 'SA',
      industry: 'Hospitals',
      slug: 'hospitals',
      icon: 'fa-hospital',
      status: 'active',
      description: 'Scoring rubric for SA private and public hospital brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_accreditation: 20, clinical_quality: 25, patient_experience: 20, accessibility_facilities: 15, value_billing: 10, innovation_technology: 10 },
          changeSummary: 'Initial hospitals rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Accreditation', key: 'compliance_accreditation', definition: 'HPCSA compliance, COHSASA accreditation, and DoH standards.', anchors: { go: 'Full COHSASA accreditation, HPCSA compliant, clean DoH record.', caution: 'Accredited with minor non-conformances.', noGo: 'Unaccredited or serious compliance failures.' } },
        { category: 'Clinical Quality', key: 'clinical_quality', definition: 'Outcomes, specialist availability, and clinical governance.', anchors: { go: 'Excellent outcomes, comprehensive specialist roster, strong governance.', caution: 'Good outcomes, adequate specialist access.', noGo: 'Poor outcomes, limited specialists, governance concerns.' } },
        { category: 'Patient Experience', key: 'patient_experience', definition: 'Wait times, communication, and overall patient satisfaction.', anchors: { go: 'Short waits, excellent communication, 4.5+ satisfaction.', caution: 'Moderate waits, adequate communication.', noGo: 'Long waits, poor communication, low satisfaction.' } },
        { category: 'Accessibility & Facilities', key: 'accessibility_facilities', definition: 'Location access, facility condition, and inclusive design.', anchors: { go: 'Modern facilities, excellent access, fully inclusive.', caution: 'Adequate facilities with some dated areas.', noGo: 'Poor facilities, limited access.' } },
        { category: 'Value & Billing', key: 'value_billing', definition: 'Billing transparency, medical aid acceptance, and cost management.', anchors: { go: 'Transparent billing, all major medical aids, competitive rates.', caution: 'Standard billing, most medical aids accepted.', noGo: 'Opaque billing, limited medical aid acceptance.' } },
        { category: 'Innovation & Technology', key: 'innovation_technology', definition: 'Medical technology, digital health records, and telemedicine.', anchors: { go: 'Cutting-edge medical tech, full EHR, telemedicine offered.', caution: 'Standard technology, partial digital records.', noGo: 'Outdated technology, paper-based systems.' } }
      ],
      playbooks: [
        { category: 'Compliance & Accreditation', sources: ['COHSASA database', 'HPCSA records', 'DoH inspection reports'], rules: ['Verify current COHSASA status', 'Check DoH compliance history'] },
        { category: 'Clinical Quality', sources: ['Outcome statistics', 'Specialist directories', 'Clinical governance reports'], rules: ['Review published outcomes', 'Assess specialist coverage'] },
        { category: 'Patient Experience', sources: ['Google reviews', 'Hellopeter', 'Patient satisfaction surveys'], rules: ['Aggregate 3+ platforms', 'Track wait time complaints'] },
        { category: 'Accessibility & Facilities', sources: ['Facility photos/tours', 'Accessibility audits', 'Location data'], rules: ['Assess facility condition', 'Verify wheelchair/disability access'] },
        { category: 'Value & Billing', sources: ['Published tariffs', 'Medical aid agreements', 'Billing complaint data'], rules: ['Compare tariffs vs industry average', 'Check medical aid acceptance list'] },
        { category: 'Innovation & Technology', sources: ['Technology press releases', 'EHR adoption data', 'Telemedicine offerings'], rules: ['Verify digital records capability', 'Assess telemedicine availability'] }
      ],
      prompts: [
        { id: 'p-hosp-1', type: 'research', title: 'Hospital Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African healthcare analyst. Research {brand}, a hospital, across compliance & accreditation, clinical quality, patient experience, accessibility & facilities, value & billing, and innovation & technology. Use SA context (HPCSA, COHSASA, DoH). Return structured JSON with category scores 0-100.',
          constraints: ['SA healthcare regulatory context', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-hosp-2', type: 'scoring', title: 'Hospital Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance & Accreditation 20, Clinical Quality 25, Patient Experience 20, Accessibility & Facilities 15, Value & Billing 10, Innovation & Technology 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Accreditation hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance & Accreditation < 30 → automatic No-Go' }
      ]
    },

    /* ── 13. Insurance ── */
    {
      id: 'sa_insurance',
      name: 'South Africa — Insurance',
      market: 'SA',
      industry: 'Insurance',
      slug: 'insurance',
      icon: 'fa-shield-halved',
      status: 'active',
      description: 'Scoring rubric for SA short-term and long-term insurance brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance: 20, customer_satisfaction: 20, product_value: 25, innovation: 10, customer_support: 15, accessibility_security: 10 },
          changeSummary: 'Initial insurance rubric from XLSX scoring matrix.'
        }
      ],
      anchors: [
        { category: 'Compliance', key: 'compliance', definition: 'FSCA registration, FAIS compliance, and regulatory standing.', anchors: { go: 'Full FSCA registration, FAIS compliant, clean regulatory history.', caution: 'Registered with minor compliance items.', noGo: 'Registration issues or regulatory sanctions.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Policyholder ratings, claims experience, and NPS.', anchors: { go: '4.5+ ratings, high claims satisfaction, strong NPS.', caution: '3.5–4.4 ratings, moderate claims experience.', noGo: 'Below 3.5, poor claims reputation.' } },
        { category: 'Product Value', key: 'product_value', definition: 'Premium competitiveness, cover scope, and policy clarity.', anchors: { go: 'Competitive premiums, comprehensive cover, clear policy wording.', caution: 'Average premiums, standard cover.', noGo: 'Expensive, limited cover, unclear terms.' } },
        { category: 'Innovation', key: 'innovation', definition: 'Digital claims, usage-based products, and tech adoption.', anchors: { go: 'Digital-first claims, innovative products (telematics, on-demand), strong tech.', caution: 'Basic digital capability, standard products.', noGo: 'Paper-heavy processes, no innovation.' } },
        { category: 'Customer Support', key: 'customer_support', definition: 'Claims support, query resolution, and communication.', anchors: { go: '24/7 claims support, fast resolution, proactive communication.', caution: 'Standard support hours, adequate resolution.', noGo: 'Poor claims support, slow resolution.' } },
        { category: 'Accessibility & Security', key: 'accessibility_security', definition: 'App quality, online portal, and data security.', anchors: { go: 'Excellent app, comprehensive portal, strong data security.', caution: 'Basic app, standard portal.', noGo: 'No digital access, poor security.' } }
      ],
      playbooks: [
        { category: 'Compliance', sources: ['FSCA register', 'FAIS compliance records', 'Ombudsman rulings'], rules: ['Verify FSCA registration', 'Check Ombudsman complaint trends'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'SA Insurance Customer Survey'], rules: ['Aggregate 3+ platforms', 'Focus on claims experience reviews'] },
        { category: 'Product Value', sources: ['Premium comparison tools', 'Policy wording analysis', 'Benefit schedules'], rules: ['Compare like-for-like cover', 'Assess excess structures'] },
        { category: 'Innovation', sources: ['Product launches', 'Tech press coverage', 'App store changelogs'], rules: ['Track digital claims adoption', 'Assess telematics offerings'] },
        { category: 'Customer Support', sources: ['Claims SLA data', 'Mystery shopping', 'Social media responsiveness'], rules: ['Test claims reporting process', 'Measure response time'] },
        { category: 'Accessibility & Security', sources: ['App store ratings', 'Portal UX audit', 'POPIA compliance'], rules: ['Test app functionality', 'Verify data protection measures'] }
      ],
      prompts: [
        { id: 'p-ins-1', type: 'research', title: 'Insurance Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African insurance analyst. Research {brand} across compliance, customer satisfaction, product value, innovation, customer support, and accessibility/security. Use SA-specific context (FSCA, FAIS, Ombudsman). Return structured JSON with category scores 0-100.',
          constraints: ['SA regulatory context (FSCA, FAIS)', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-ins-2', type: 'scoring', title: 'Insurance Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance 20, Customer Satisfaction 20, Product Value 25, Innovation 10, Customer Support 15, Accessibility/Security 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance < 30 → automatic No-Go' }
      ]
    },

    /* ── 14. Medical Aid & Health Cover ── */
    {
      id: 'sa_medical_aid_health_cover',
      name: 'South Africa — Medical Aid & Health Cover',
      market: 'SA',
      industry: 'Medical Aid & Health Cover',
      slug: 'medical-aid',
      icon: 'fa-heart-pulse',
      status: 'active',
      description: 'Scoring rubric for SA medical aids and health insurance providers.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_regulation: 20, plan_value: 25, claims_experience: 20, customer_satisfaction: 15, digital_services: 10, network_coverage: 10 },
          changeSummary: 'Initial medical aid rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Regulation', key: 'compliance_regulation', definition: 'CMS registration and Medical Schemes Act compliance.', anchors: { go: 'CMS registered, fully MSA compliant, clean regulatory record.', caution: 'Registered with minor compliance items.', noGo: 'Registration issues, MSA non-compliance.' } },
        { category: 'Plan Value', key: 'plan_value', definition: 'Benefit options, premiums, and out-of-pocket limits.', anchors: { go: 'Comprehensive benefits, competitive premiums, low OOP.', caution: 'Adequate benefits, average premiums.', noGo: 'Limited benefits, expensive, high OOP.' } },
        { category: 'Claims Experience', key: 'claims_experience', definition: 'Claims turnaround, approval rates, and transparency.', anchors: { go: 'Fast turnaround, high approval rates, transparent process.', caution: 'Standard turnaround, reasonable approval rates.', noGo: 'Slow claims, frequent rejections, opaque process.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Member reviews, NPS, and complaint resolution.', anchors: { go: '4.5+ ratings, strong NPS, fast complaint resolution.', caution: '3.5–4.4 ratings, moderate NPS.', noGo: 'Below 3.5, poor NPS, unresolved complaints.' } },
        { category: 'Digital Services', key: 'digital_services', definition: 'App functionality, online claims, and member portal.', anchors: { go: 'Full-featured app, online claims submission, comprehensive portal.', caution: 'Basic app, limited online features.', noGo: 'No digital access, paper-only processes.' } },
        { category: 'Network & Coverage', key: 'network_coverage', definition: 'Hospital and provider network, DSP options, and PMB coverage.', anchors: { go: 'Wide hospital/GP network, strong DSP options, full PMB coverage.', caution: 'Adequate network, standard PMB.', noGo: 'Limited network, poor PMB compliance.' } }
      ],
      playbooks: [
        { category: 'Compliance & Regulation', sources: ['CMS annual reports', 'MSA compliance records', 'Registrar communications'], rules: ['Verify CMS registration', 'Check solvency ratio'] },
        { category: 'Plan Value', sources: ['Benefit comparison tools', 'Premium schedules', 'Independent broker reports'], rules: ['Compare benefits per contribution level', 'Assess day-to-day vs hospital split'] },
        { category: 'Claims Experience', sources: ['CMS complaints data', 'Member reviews', 'Claims turnaround reports'], rules: ['Track average turnaround time', 'Assess rejection rate trends'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'Annual member surveys'], rules: ['Aggregate 3+ platforms', 'Focus on claims-related reviews'] },
        { category: 'Digital Services', sources: ['App store ratings', 'Portal UX audit', 'Feature comparison'], rules: ['Test claims submission flow', 'Assess benefit check features'] },
        { category: 'Network & Coverage', sources: ['Provider directory', 'DSP network maps', 'PMB coverage documentation'], rules: ['Map network against major metros', 'Verify PMB adherence'] }
      ],
      prompts: [
        { id: 'p-med-1', type: 'research', title: 'Medical Aid Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African health insurance analyst. Research {brand} across compliance & regulation, plan value, claims experience, customer satisfaction, digital services, and network & coverage. Use SA context (CMS, MSA). Return structured JSON with category scores 0-100.',
          constraints: ['SA regulatory context (CMS, MSA)', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-med-2', type: 'scoring', title: 'Medical Aid Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance & Regulation 20, Plan Value 25, Claims Experience 20, Customer Satisfaction 15, Digital Services 10, Network & Coverage 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance & Regulation < 30 → automatic No-Go' }
      ]
    },

    /* ── 15. Mobile Networks & Data ── */
    {
      id: 'sa_mobile_networks_data',
      name: 'South Africa — Mobile Networks & Data',
      market: 'SA',
      industry: 'Mobile Networks & Data',
      slug: 'mobile-networks',
      icon: 'fa-signal',
      status: 'active',
      description: 'Scoring rubric for SA mobile network operators and MVNOs.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_regulation: 15, network_quality: 25, customer_satisfaction: 20, value_pricing: 20, digital_services: 10, innovation: 10 },
          changeSummary: 'Initial mobile networks rubric.'
        }
      ],
      anchors: [
        { category: 'Compliance & Regulation', key: 'compliance_regulation', definition: 'ICASA licensing and compliance with regulations.', anchors: { go: 'Full ICASA licence, spectrum compliance, clean regulatory record.', caution: 'Licensed with minor compliance items.', noGo: 'Licensing issues or spectrum violations.' } },
        { category: 'Network Quality', key: 'network_quality', definition: 'Coverage, speed, reliability, and 5G rollout.', anchors: { go: 'National coverage, fast speeds, low downtime, 5G available.', caution: 'Good metro coverage, adequate speeds.', noGo: 'Poor coverage, slow speeds, frequent outages.' } },
        { category: 'Customer Satisfaction', key: 'customer_satisfaction', definition: 'Reviews, NPS, and complaint resolution.', anchors: { go: '4.5+ ratings, strong NPS, fast complaint resolution.', caution: '3.5–4.4 ratings, moderate satisfaction.', noGo: 'Below 3.5, poor NPS, unresolved complaints.' } },
        { category: 'Value & Pricing', key: 'value_pricing', definition: 'Data pricing, bundle value, and out-of-bundle rates.', anchors: { go: 'Competitive data rates, excellent bundles, fair OOB rates.', caution: 'Average pricing, standard bundles.', noGo: 'Expensive data, poor bundles, punitive OOB rates.' } },
        { category: 'Digital Services', key: 'digital_services', definition: 'App features, self-service, and eSIM support.', anchors: { go: 'Full-featured app, comprehensive self-service, eSIM support.', caution: 'Basic app, limited self-service.', noGo: 'Poor digital experience, no self-service.' } },
        { category: 'Innovation', key: 'innovation', definition: 'Technology adoption, new services, and digital transformation.', anchors: { go: '5G leader, innovative services, strong digital transformation.', caution: 'Standard technology, following industry.', noGo: 'Technology laggard, no innovation.' } }
      ],
      playbooks: [
        { category: 'Compliance & Regulation', sources: ['ICASA licence register', 'Spectrum allocation records', 'Regulatory rulings'], rules: ['Verify active ICASA licence', 'Check spectrum compliance'] },
        { category: 'Network Quality', sources: ['Ookla Speedtest data', 'MyBroadband coverage maps', 'OpenSignal reports'], rules: ['Compare speed and coverage nationally', 'Assess 5G rollout status'] },
        { category: 'Customer Satisfaction', sources: ['Hellopeter', 'Google reviews', 'MyBroadband forums'], rules: ['Aggregate 3+ platforms', 'Track sentiment trends'] },
        { category: 'Value & Pricing', sources: ['Published rate cards', 'Bundle comparison tools', 'ICASA cost-to-communicate data'], rules: ['Compare R-per-GB', 'Check OOB rates'] },
        { category: 'Digital Services', sources: ['App store ratings', 'Self-service feature audit', 'eSIM availability'], rules: ['Test app functionality', 'Verify self-service completeness'] },
        { category: 'Innovation', sources: ['Press releases', 'Technology announcements', '5G coverage maps'], rules: ['Track 5G metro coverage', 'Assess new service launches'] }
      ],
      prompts: [
        { id: 'p-mob-1', type: 'research', title: 'Mobile Network Brand Research', model: 'gpt-4o', badge: 'research',
          body: 'You are a South African telecoms analyst. Research {brand}, a mobile network, across compliance & regulation, network quality, customer satisfaction, value & pricing, digital services, and innovation. Use SA context (ICASA). Return structured JSON with category scores 0-100.',
          constraints: ['SA regulatory context (ICASA)', 'Score each category independently', 'Include evidence URLs'] },
        { id: 'p-mob-2', type: 'scoring', title: 'Mobile Network Scoring Engine', model: 'gpt-4o', badge: 'scoring',
          body: 'Apply weights: Compliance & Regulation 15, Network Quality 25, Customer Satisfaction 20, Value & Pricing 20, Digital Services 10, Innovation 10. Compute weighted GoNoGo score. Return JSON.',
          constraints: ['Weights must sum to 100', 'Apply hard-fail rules', 'Round to 1 decimal place'] }
      ],
      rules: [
        { name: 'Go threshold', scope: 'overall', min: 70, max: 100, verdict: 'go', description: 'Score ≥ 70 → Go' },
        { name: 'Caution band', scope: 'overall', min: 50, max: 69.9, verdict: 'caution', description: 'Score 50–69.9 → Caution' },
        { name: 'No-Go floor', scope: 'overall', min: 0, max: 49.9, verdict: 'no-go', description: 'Score < 50 → No-Go' },
        { name: 'Compliance hard fail', scope: 'hard_fail', min: null, max: 30, verdict: 'no-go', description: 'Compliance & Regulation < 30 → automatic No-Go' }
      ]
    },

    /* ── 16. Online Shopping & Marketplaces ── */
    {
      id: 'sa_online_shopping_marketplaces',
      name: 'South Africa — Online Shopping & Marketplaces',
      market: 'SA',
      industry: 'Online Shopping & Marketplaces',
      slug: 'online-retailers',
      icon: 'fa-cart-shopping',
      status: 'active',
      description: 'Scoring rubric for SA e-commerce and online marketplace brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0', status: 'active', effectiveDate: '2026-03-01',
          weights: { compliance_consumer_protection: 15, product_catalogue: 20, customer_experience: 20, value_pricing: 20, delivery_logistics: 15, security_trust: 10 },
          changeSummary: 'Initial online shopping rubric.'
        }
      ],
      anchors: [
  {
    category: 'Compliance & Consumer Protection',
    key: 'compliance_consumer_protection',
    definition: 'CPA compliance, returns policy, and POPIA adherence.',
    anchors: {
      go: 'Full CPA compliance, clear returns policy, POPIA certified.',
      caution: 'Generally compliant with minor policy or disclosure gaps.',
      noGo: 'Non-compliance with CPA or serious POPIA issues.'
    }
      }
],
{
  id: 'sa_online_shopping_marketplaces',
      name: 'South Africa — Online Shopping & Marketplaces',
      market: 'SA',
      industry: 'Online Shopping & Marketplaces',
      slug: 'online-retailers',
      icon: 'fa-cart-shopping',
      status: 'active',
      description: 'Scoring rubric for SA e-commerce and online marketplace brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: {
            compliance_consumer_protection: 15,
            product_catalogue: 20,
            customer_experience: 20,
            value_pricing: 20,
            delivery_logistics: 15,
            security_trust: 10
          },
          changeSummary: 'Initial online shopping rubric.'
        }
      ],
      anchors: [
        {
          category: 'Compliance & Consumer Protection',
          key: 'compliance_consumer_protection',
          definition: 'CPA compliance, returns policy, and POPIA adherence.',
          anchors: {
            go: 'Full CPA compliance, clear returns policy, POPIA certified.',
            caution: 'Generally compliant with minor policy or disclosure gaps.',
            noGo: 'Non‑compliance with CPA or serious POPIA issues.'
          }
        },
        {
          category: 'Product Catalogue',
          key: 'product_catalogue',
          definition: 'Range, availability, seller quality, and authenticity.',
          anchors: {
            go: 'Wide authentic range, strong local + international brands, good seller vetting.',
            caution: 'Adequate catalogue with some availability gaps.',
            noGo: 'Limited range, counterfeit risk, weak seller vetting.'
          }
        },
        {
          category: 'Customer Experience',
          key: 'customer_experience',
          definition: 'Site/app UX, search, and purchase flow.',
          anchors: {
            go: 'Fast, intuitive UX, powerful search/filters, seamless checkout.',
            caution: 'Usable but with friction in search or checkout.',
            noGo: 'Slow, confusing UX, frequent errors at checkout.'
          }
        },
        {
          category: 'Value & Pricing',
          key: 'value_pricing',
          definition: 'Price competitiveness, deals, and fee transparency.',
          anchors: {
            go: 'Competitive pricing, regular deals, transparent fees.',
            caution: 'Average pricing, occasional deals, some fee opacity.',
            noGo: 'Overpriced, misleading discounts, hidden fees.'
          }
        },
        {
          category: 'Delivery & Logistics',
          key: 'delivery_logistics',
          definition: 'Shipping speed, tracking, and delivery reliability.',
          anchors: {
            go: 'Fast, reliable delivery with accurate tracking and low loss/damage rates.',
            caution: 'Standard delivery times with occasional issues.',
            noGo: 'Frequent delays, lost parcels, unreliable tracking.'
          }
        },
        {
          category: 'Security & Trust',
          key: 'security_trust',
          definition: 'Payment security, buyer protection, and fraud prevention.',
          anchors: {
            go: 'Strong payment security, buyer protection guarantees, robust fraud controls.',
            caution: 'Standard card security, basic buyer protection.',
            noGo: 'Security incidents, weak buyer protection, fraud complaints.'
          }
        }
      ],
      playbooks: [
        {
          category: 'Compliance & Consumer Protection',
          sources: ['CPA documentation', 'Returns and refunds policy pages', 'Privacy policy'],
          rules: [
            'Check CPA‑aligned returns and cooling‑off rights.',
            'Confirm POPIA‑aligned data handling and disclosures.'
          ]
        },
        {
          category: 'Product Catalogue',
          sources: ['On‑site catalogue review', 'Category and brand coverage analysis'],
          rules: [
            'Assess depth in key categories (electronics, fashion, FMCG).',
            'Check for clear labelling and authenticity indicators.'
          ]
        },
        {
          category: 'Customer Experience',
          sources: ['UX walkthroughs', 'App store reviews', 'On‑site search tests'],
          rules: [
            'Test full browse‑search‑checkout journey on mobile and desktop.',
            'Record navigation or search friction points.'
          ]
        },
        {
          category: 'Value & Pricing',
          sources: ['Price comparison tools', 'Basket‑level tests', 'Competitor benchmarks'],
          rules: [
            'Compare final basket price including shipping and fees.',
            'Assess frequency and depth of promotions.'
          ]
        },
        {
          category: 'Delivery & Logistics',
          sources: ['Delivery SLA pages', 'Customer reviews', 'Test orders'],
          rules: [
            'Place at least one test order to measure actual delivery time.',
            'Track incidence of damaged/late parcels from reviews.'
          ]
        },
        {
          category: 'Security & Trust',
          sources: ['Payment provider integrations', 'Security certifications', 'Fraud/chargeback reports'],
          rules: [
            'Verify HTTPS, 3‑D Secure and trusted payment partners.',
            'Check buyer protection and dispute resolution mechanisms.'
          ]
        }
      ],
      prompts: [
        {
          id: 'p-ecom-1',
          type: 'research',
          title: 'E‑commerce Brand Research',
          model: 'gpt-4o',
          badge: 'research',
          body:
            'You are a South African e‑commerce analyst. Research {brand}, an online retailer/marketplace, across compliance & consumer protection, product catalogue, customer experience, value & pricing, delivery & logistics, and security & trust. Return structured JSON with category scores 0‑100 and evidence summaries.',
          constraints: [
            'Use SA consumer‑protection context (CPA, POPIA).',
            'Score each category independently.',
            'Include evidence URLs wherever possible.'
          ]
        },
        {
          id: 'p-ecom-2',
          type: 'scoring',
          title: 'E‑commerce Scoring Engine',
          model: 'gpt-4o',
          badge: 'scoring',
          body:
            'Given the research payload for {brand}, apply the SA Online Shopping rubric weights: Compliance & Consumer Protection 15, Product Catalogue 20, Customer Experience 20, Value & Pricing 20, Delivery & Logistics 15, Security & Trust 10. Compute a weighted GoNoGo score (0‑100) and return JSON with the final score, verdict (Go/Caution/No‑Go), and per‑category breakdowns.',
          constraints: [
            'Weights must sum to 100.',
            'Apply any configured hard‑fail rules first.',
            'Round all scores to 1 decimal place.'
          ]
        }
      ],
      rules: [
        {
          name: 'Go threshold',
          scope: 'overall',
          min: 70,
          max: 100,
          verdict: 'go',
          description: 'Score ≥ 70 with no hard fails → Go.'
        },
        {
          name: 'Caution band',
          scope: 'overall',
          min: 50,
          max: 69.9,
          verdict: 'caution',
          description: 'Score 50–69.9 → Caution.'
        },
        {
          name: 'No‑Go floor',
          scope: 'overall',
          min: 0,
          max: 49.9,
          verdict: 'no-go',
          description: 'Score < 50 → No‑Go.'
        },
        {
          name: 'Compliance hard fail',
          scope: 'hard_fail',
          min: null,
          max: 30,
          verdict: 'no-go',
          description: 'Compliance & Consumer Protection < 30 → automatic No‑Go.'
        }
      ]
    },

    /* ── 17. Pharmacies ── */
    {
      id: 'sa_pharmacies',
      name: 'South Africa — Pharmacies',
      market: 'SA',
      industry: 'Pharmacies',
      slug: 'pharmacies-health',
      icon: 'fa-prescription-bottle-medical',
      status: 'active',
      description: 'Scoring rubric for SA retail pharmacy brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: {
            compliance_licensing: 20,
            product_range: 20,
            customer_experience: 20,
            pricing_value: 15,
            digital_services: 15,
            accessibility: 10
          },
          changeSummary: 'Initial pharmacies rubric.'
        }
      ],
      anchors: [
        {
          category: 'Compliance & Licensing',
          key: 'compliance_licensing',
          definition: 'SAPC registration and schedule compliance.',
          anchors: {
            go: 'Fully SAPC registered, schedule‑compliant, no serious infractions.',
            caution: 'Registered with minor inspection findings.',
            noGo: 'Unregistered outlets or serious schedule breaches.'
          }
        },
        {
          category: 'Product Range',
          key: 'product_range',
          definition: 'Medication availability, generics, and health products.',
          anchors: {
            go: 'Broad Rx/OTC range, strong generics, wellness and chronic support.',
            caution: 'Adequate core range with some gaps.',
            noGo: 'Frequent stock‑outs, limited range.'
          }
        },
        {
          category: 'Customer Experience',
          key: 'customer_experience',
          definition: 'Service quality, pharmacist consultations, and wait times.',
          anchors: {
            go: 'Knowledgeable pharmacists, proactive counselling, short queues.',
            caution: 'Standard service, moderate queues.',
            noGo: 'Rushed, unhelpful service, long waits.'
          }
        },
        {
          category: 'Pricing & Value',
          key: 'pricing_value',
          definition: 'Medicine pricing, loyalty programmes, and SEP compliance.',
          anchors: {
            go: 'SEP compliant, competitive pricing, compelling loyalty value.',
            caution: 'Compliant but only moderately competitive.',
            noGo: 'Price or SEP non‑compliance, poor value.'
          }
        },
        {
          category: 'Digital Services',
          key: 'digital_services',
          definition: 'Online ordering, repeat prescriptions, and app features.',
          anchors: {
            go: 'Robust app/portal, repeat scripts, delivery options.',
            caution: 'Basic online re‑order or app functions.',
            noGo: 'No meaningful digital services.'
          }
        },
        {
          category: 'Accessibility',
          key: 'accessibility',
          definition: 'Store locations, operating hours, and delivery options.',
          anchors: {
            go: 'Dense branch network, long hours, broad delivery coverage.',
            caution: 'Reasonable location and hours, limited delivery.',
            noGo: 'Sparse network, restrictive hours, no delivery.'
          }
        }
      ],
      // playbooks / prompts / rules omitted here for brevity if you’re tight on size,
      // but keep following the same pattern used above if you want full detail.
    },

    /* ── 18. Property Rental & Letting ── */
    {
      id: 'sa_property_rental_letting',
      name: 'South Africa — Property Rental & Letting',
      market: 'SA',
      industry: 'Property Rental & Letting',
      slug: 'property-letting',
      icon: 'fa-house-chimney',
      status: 'active',
      description: 'Scoring rubric for SA residential rental agents and platforms.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: {
            compliance_regulation: 20,
            listing_quality: 20,
            tenant_experience: 20,
            landlord_service: 15,
            digital_platform: 15,
            value_fees: 10
          },
          changeSummary: 'Initial property rental rubric.'
        }
      ],
      anchors: [
        {
          category: 'Compliance & Regulation',
          key: 'compliance_regulation',
          definition: 'EAAB registration and Rental Housing Act compliance.',
          anchors: {
            go: 'Registered with EAAB, compliant leases and deposits, no serious findings.',
            caution: 'Registered with minor compliance issues.',
            noGo: 'Unregistered or serious compliance breaches.'
          }
        },
        {
          category: 'Listing Quality',
          key: 'listing_quality',
          definition: 'Property accuracy, photography, and listing detail.',
          anchors: {
            go: 'Accurate listings, high‑quality photos, full details.',
            caution: 'Mostly accurate with some missing details.',
            noGo: 'Misleading or sparse listings.'
          }
        },
        {
          category: 'Tenant Experience',
          key: 'tenant_experience',
          definition: 'Application process, maintenance response, and deposit handling.',
          anchors: {
            go: 'Smooth application, responsive maintenance, fair deposits.',
            caution: 'Adequate processes with some friction.',
            noGo: 'Difficult applications, slow maintenance, deposit disputes.'
          }
        },
        {
          category: 'Landlord Service',
          key: 'landlord_service',
          definition: 'Tenant vetting, rent collection, and property management.',
          anchors: {
            go: 'Thorough vetting, reliable collections, proactive management.',
            caution: 'Standard management services.',
            noGo: 'Poor vetting, collection problems, weak management.'
          }
        },
        {
          category: 'Digital Platform',
          key: 'digital_platform',
          definition: 'Online search, virtual tours, and application portal.',
          anchors: {
            go: 'Strong search, virtual tours, online applications.',
            caution: 'Basic listing site with manual applications.',
            noGo: 'Minimal digital tooling.'
          }
        },
        {
          category: 'Value & Fees',
          key: 'value_fees',
          definition: 'Commission rates, fee transparency, and service value.',
          anchors: {
            go: 'Competitive fees, fully transparent, strong value.',
            caution: 'Standard fee levels, some opacity.',
            noGo: 'High or opaque fees, poor value.'
          }
        }
      ]
    },

    /* ── 19. Solar & Backup Power Installers ── */
    {
      id: 'sa_solar_backup_power_installers',
      name: 'South Africa — Solar & Backup Power Installers',
      market: 'SA',
      industry: 'Solar & Backup Power Installers',
      slug: 'solar-backup-installers',
      icon: 'fa-solar-panel',
      status: 'active',
      description: 'Scoring rubric for SA solar and backup power installation brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: {
            compliance_certification: 20,
            product_quality: 25,
            installation_service: 20,
            customer_satisfaction: 15,
            value_pricing: 10,
            warranty_support: 10
          },
          changeSummary: 'Initial solar/installers rubric.'
        }
      ],
      anchors: [
        {
          category: 'Compliance & Certification',
          key: 'compliance_certification',
          definition: 'ECSA registration, COC compliance, and municipal approvals.',
          anchors: {
            go: 'ECSA registered, CoC compliant, municipal approvals in place.',
            caution: 'Mostly compliant with minor gaps.',
            noGo: 'Unregistered installers, invalid CoCs or approvals.'
          }
        },
        {
          category: 'Product Quality',
          key: 'product_quality',
          definition: 'Panel/inverter/battery brands, tier ratings, and system design.',
          anchors: {
            go: 'Tier‑1 components, reputable brands, solid design.',
            caution: 'Mixed component quality.',
            noGo: 'Low‑quality or grey‑import components.'
          }
        },
        {
          category: 'Installation & Service',
          key: 'installation_service',
          definition: 'Installation quality, timelines, and workmanship.',
          anchors: {
            go: 'Clean installations, on‑time delivery, neat cabling and finishing.',
            caution: 'Generally acceptable with some issues.',
            noGo: 'Unsafe or sloppy workmanship, major delays.'
          }
        },
        {
          category: 'Customer Satisfaction',
          key: 'customer_satisfaction',
          definition: 'Reviews, referral rates, and post‑install experience.',
          anchors: {
            go: 'Strong referrals, high ratings, proactive follow‑up.',
            caution: 'Average ratings, mixed feedback.',
            noGo: 'Frequent complaints, poor after‑sales.'
          }
        },
        {
          category: 'Value & Pricing',
          key: 'value_pricing',
          definition: 'Cost per kWh, financing options, and ROI transparency.',
          anchors: {
            go: 'Clear ROI cases, fair pricing, good finance options.',
            caution: 'Average pricing, basic finance.',
            noGo: 'Overpriced, opaque ROI, no finance options.'
          }
        },
        {
          category: 'Warranty & Support',
          key: 'warranty_support',
          definition: 'Warranty terms, monitoring, and after‑sales support.',
          anchors: {
            go: 'Solid warranties, remote monitoring, responsive support.',
            caution: 'Standard warranties, reactive support.',
            noGo: 'Weak warranties, poor support.'
          }
        }
      ]
    },

    /* ── 20. Sports Betting ── */
    {
      id: 'sa_sports_betting',
      name: 'South Africa — Sports Betting',
      market: 'SA',
      industry: 'Sports Betting',
      slug: 'online-casinos-bookmakers',
      icon: 'fa-dice',
      status: 'active',
      description: 'Scoring rubric for SA sports betting and iGaming brands.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: {
            licensing_compliance: 20,
            responsible_gambling: 15,
            odds_value: 20,
            platform_experience: 15,
            customer_support: 15,
            payout_security: 15
          },
          changeSummary: 'Initial sports betting rubric.'
        }
      ],
      anchors: [
        {
          category: 'Licensing & Compliance',
          key: 'licensing_compliance',
          definition: 'Regulatory licensing and responsible gambling compliance in SA.',
          anchors: {
            go: 'Fully licensed with SA gambling boards, clean record.',
            caution: 'Licensed with minor issues or conditions.',
            noGo: 'Unlicensed operations or major regulatory breaches.'
          }
        },
        {
          category: 'Responsible Gambling',
          key: 'responsible_gambling',
          definition: 'Self‑exclusion tools, deposit limits, and player protection measures.',
          anchors: {
            go: 'Robust RG tools, clear messaging, strong player protections.',
            caution: 'Basic tools and messaging.',
            noGo: 'Minimal RG controls, poor messaging.'
          }
        },
        {
          category: 'Odds & Value',
          key: 'odds_value',
          definition: 'Competitiveness of odds, promotions, and overall betting value.',
          anchors: {
            go: 'Consistently competitive odds, fair margins, good promos.',
            caution: 'Generally average odds and value.',
            noGo: 'Poor odds, misleading or predatory promotions.'
          }
        },
        {
          category: 'Platform Experience',
          key: 'platform_experience',
          definition: 'App quality, live betting features, and user interface.',
          anchors: {
            go: 'Stable, feature‑rich platform with strong UX.',
            caution: 'Usable but occasionally buggy or limited.',
            noGo: 'Unstable, confusing, or outdated platform.'
          }
        },
        {
          category: 'Customer Support',
          key: 'customer_support',
          definition: 'Support availability and resolution for betting queries.',
          anchors: {
            go: '24/7 support, fast issue resolution.',
            caution: 'Limited hours, moderate resolution times.',
            noGo: 'Hard to reach, poor resolution.'
          }
        },
        {
          category: 'Payout & Security',
          key: 'payout_security',
          definition: 'Withdrawal speed, payment options, and data security.',
          anchors: {
            go: 'Fast, reliable withdrawals, diverse secure payment methods.',
            caution: 'Standard withdrawal times, basic security.',
            noGo: 'Slow or blocked withdrawals, security incidents.'
          }
        }
      ]
    },

    /* ── 21. Supermarkets ── */
    {
      id: 'sa_supermarkets',
      name: 'South Africa — Supermarkets',
      market: 'SA',
      industry: 'Supermarkets',
      slug: 'supermarkets',
      icon: 'fa-basket-shopping',
      status: 'active',
      description: 'Scoring rubric for SA grocery and supermarket chains.',
      owner: 'GoNoGo SA',
      versions: [
        {
          version: '1.0',
          status: 'active',
          effectiveDate: '2026-03-01',
          weights: {
            compliance_food_safety: 15,
            product_range: 20,
            customer_experience: 20,
            value_pricing: 20,
            digital_loyalty: 15,
            accessibility_reach: 10
          },
          changeSummary: 'Initial supermarkets rubric.'
        }
      ],
      anchors: [
        {
          category: 'Compliance & Food Safety',
          key: 'compliance_food_safety',
          definition: 'Health inspections, food safety standards, and labelling compliance.',
          anchors: {
            go: 'Consistently clean inspections, strong food safety practices.',
            caution: 'Generally compliant with occasional issues.',
            noGo: 'Serious hygiene or food safety violations.'
          }
        },
        {
          category: 'Product Range',
          key: 'product_range',
          definition: 'Variety, fresh produce quality, local sourcing, and speciality items.',
          anchors: {
            go: 'Broad range with high‑quality fresh produce and local sourcing.',
            caution: 'Adequate range with some gaps.',
            noGo: 'Limited range, poor fresh quality.'
          }
        },
        {
          category: 'Customer Experience',
          key: 'customer_experience',
          definition: 'Store cleanliness, staff service, and checkout efficiency.',
          anchors: {
            go: 'Clean stores, helpful staff, fast checkouts.',
            caution: 'Acceptable experience with some pain points.',
            noGo: 'Dirty stores, poor service, long queues.'
          }
        },
        {
          category: 'Value & Pricing',
          key: 'value_pricing',
          definition: 'Price competitiveness, specials, and basket value.',
          anchors: {
            go: 'Competitive pricing and strong basket value.',
            caution: 'Average pricing and savings.',
            noGo: 'Expensive baskets, weak savings.'
          }
        },
        {
          category: 'Digital & Loyalty',
          key: 'digital_loyalty',
          definition: 'Loyalty programme, online shopping, and app features.',
          anchors: {
            go: 'Compelling loyalty scheme, robust app and online shopping.',
            caution: 'Basic loyalty and/or digital offering.',
            noGo: 'Minimal loyalty benefits, weak digital.'
          }
        },
        {
          category: 'Accessibility & Reach',
          key: 'accessibility_reach',
          definition: 'Store locations, trading hours, and delivery coverage.',
          anchors: {
            go: 'Dense footprint, long trading hours, broad delivery coverage.',
            caution: 'Reasonable physical access, limited delivery.',
            noGo: 'Sparse footprint, restrictive hours, no delivery.'
          }
        }
      ]
    }

  ]; // end RUBRICS array

  /* ──────────────────────────────────────────────
     RENDERING + STATE
     ────────────────────────────────────────────── */

  const state = {
    rubrics: RUBRICS,
    selectedRubricId: null,
    selectedVersionIndex: 0
  };

  // Helper functions, event wiring, and DOM rendering should remain
  // as in your existing admin-scoring.js; you only need to swap out
  // the RUBRICS seed definition with this expanded version.

  // Example minimal hooks (if you already have these, keep your versions):

  function findRubric(id) {
    return state.rubrics.find(r => r.id === id);
  }

  // ... your existing code that:
  // - Renders the left-hand rubric list from state.rubrics
  // - When a rubric is clicked, updates state.selectedRubricId
  // - Renders Scoring Framework / Playbooks / Decisions / Versions
  //   for the selected rubric using anchors, versions, prompts, rules

  window.GoNoGoScoring = { state, findRubric };
})();
