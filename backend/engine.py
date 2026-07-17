PATHS = {
    'CREATIVE': ['write', 'novel', 'book', 'paint', 'art', 'music', 'acting', 'film', 'theatre', 'design', 'poetry', 'baking', 'bakery', 'chef', 'cooking', 'dance', 'hobby', 'freelance', 'photography', 'creative', 'craft'],
    'BUSINESS': ['startup', 'founder', 'business', 'company', 'agency', 'product', 'launch', 'coffee shop', 'bakery', 'sell', 'market', 'invest', 'vc', 'equity', 'partnership', 'franchise', 'store', 'shop', 'ecommerce'],
    'TECH': ['software', 'developer', 'engineer', 'tech', 'corporate', 'consulting', 'manager', 'coding', 'desk job', 'faang', 'marketing', 'finance', 'banking', 'office', 'algorithm', 'data science', 'it analyst'],
    'LIFESTYLE': ['move', 'japan', 'tokyo', 'france', 'paris', 'travel', 'abroad', 'europe', 'countryside', 'remote', 'van life', 'digital nomad', 'quit', 'retire', 'sabbatical', 'relocate', 'nature'],
    'SOCIAL': ['teach', 'english', 'school', 'education', 'public defender', 'law', 'community', 'volunteer', 'nonprofit', 'nurse', 'doctor', 'charity', 'social work', 'therapy', 'clinic', 'hospital']
}

def build_debate_data(path: str, decision: str, label: str, params: dict) -> dict:
    social = params.get('social', 'introvert')
    risk = params.get('risk', 'moderate')
    priority = params.get('priority', 'balance')

    is_introvert = social == 'introvert'
    is_risk_taker = risk == 'high'
    is_risk_averse = risk == 'low'
    is_passion = priority == 'passion'
    is_stability = priority == 'stability'

    growth_msg = ""
    risk_msg = ""
    happiness_msg = ""
    verdict_title_str = ""
    verdict_body_str = ""

    decision_sub = decision[:40]

    if path == 'CREATIVE':
        growth_msg = (
            f"Pursuing a creative track represents highly asymmetric upside, but severely unpredictable baseline stability. "
            f"Historically, only the top 5% of independent creators hit high-earning milestones quickly. However, by leveraging "
            f"modern digital distribution and community-building, you can establish an intellectual asset class that compounds "
            f"value significantly by Year 3. The data shows that if you survive the initial 24 months, the ceiling for wealth "
            f"is technically uncapped. If you seek Stability, however, this pathway introduces high volatility which threatens capital continuity."
        )
        risk_msg = (
            f"I must issue a strong warning against relying on 'uncapped ceilings.' Creative freelance paths lead to severe "
            f"cognitive isolation—especially for an {'Introvert' if is_introvert else 'Extrovert'}—and acute financial strain. "
            f"The anxiety of uneven cash flow, combined with public critique and algorithmic unpredictability, pushes the burnout "
            f"risk index to nearly 78% in Year 1. Since your risk profile is {risk.upper()}, this level of volatility is very "
            f"likely to trigger critical stress loops that can permanently damage your creative drive."
        )
        happiness_msg = (
            f"Growth and Risk are focusing purely on metrics that ignore the intrinsic utility of soul-aligned labor. "
            f"If your core driver is {'Passion' if is_passion else 'Balance'}, the act of writing or painting fulfills human "
            f"self-actualization far more than standard corporate tasks. Working in isolation suits an "
            f"{'Introvert perfectly, allowing you to recharge your focus energy without office politics' if is_introvert else 'Extrovert, provided you actively schedule networking coffee chats to prevent loneliness'}. "
            f"The fulfillment index will spike massively, which often provides the resilience needed to survive those early poverty thresholds."
        )

        if is_stability or is_risk_averse:
            verdict_title_str = "Deferred Launch (Side-Hustle Model)"
            verdict_body_str = (
                f"After synthesizing the council's input, the consensus suggests you DO NOT leap into \"{decision_sub}...\" "
                f"full-time. The risk profile is too misaligned with your security needs. We advise building your assets "
                f"during off-hours, transitioning only after achieving stable, recurring micro-revenue."
            )
        else:
            verdict_title_str = "Aggressive Creative Shift"
            verdict_body_str = (
                f"Your psychological profile supports a direct launch into \"{decision_sub}...\". The potential for deep "
                f"fulfillment outweighs the statistical risks. Secure 6 months of living buffer, establish high-focus workspaces, "
                f"and aggressively pursue audience aggregation to offset early volatility."
            )

    elif path == 'BUSINESS':
        growth_msg = (
            f"Entrepreneurship is the ultimate engine for wealth creation. By establishing equity, you control a scalable "
            f"system rather than trading linear labor hours for wages. With calculated marketing and strategic early hiring, "
            f"revenue growth is simulated to reach strong profitability by Year 3. For an {'Introvert' if is_introvert else 'Extrovert'}, "
            f"scaling requires constructing key management and delegation channels early, but the potential wealth ceiling is unlimited. "
            f"This is where generational wealth is built."
        )
        risk_msg = (
            f"Let's look at the actual survival rates: 90% of new projects dissolve within 5 years. You will face intense customer-facing "
            f"demands, relentless capital calls, and constant regulatory threats. Since you are {'a Risk-Taker' if is_risk_taker else 'Risk-Averse'}, "
            f"this is a {'viable playground, though still incredibly dangerous' if is_risk_taker else 'highly stressful, unsustainable nightmare'} "
            f"path. Working 80-hour weeks will push your burnout risk to maximum thresholds by Year 3, severely impacting your physical health."
        )
        happiness_msg = (
            f"Fulfillment in business comes from absolute autonomy and seeing your vision materialize. However, if your goal is "
            f"{'Stability' if is_stability else 'Life Balance'}, starting this venture will cannibalize your relationships, hobbies, and health. "
            f"As an {'Introvert, pitching to VCs, selling to clients, and managing employees will drain you daily' if is_introvert else 'Extrovert, you will thrive in sales and community building, fueling your wellness scores'}. "
            f"Autonomy is high, but personal balance is virtually zero in the first 36 months."
        )

        if is_risk_taker and (is_passion or is_stability):
            verdict_title_str = "Venture Accelerate Option"
            verdict_body_str = (
                f"You possess the threshold resilience metrics to absorb startup shocks for \"{decision_sub}...\". "
                f"The council advises proceeding with maximum velocity. Partner with complementary skill sets and prioritize "
                f"securing early capital to offset operational stress."
            )
        else:
            verdict_title_str = "Bootstrap / Slow Forge Route"
            verdict_body_str = (
                f"A high-leverage venture for \"{decision_sub}...\" will crush your wellness baseline. We recommend a slow, "
                f"bootstrapped micro-business model, or starting this venture as a partnership where co-founders share the immense pressure."
            )

    elif path == 'TECH':
        growth_msg = (
            f"Tech and corporate roles offer structured upward mobility, robust starting compensation packages, and high-value "
            f"resume accolades. Growth is highly predictable, compounding at 10-15% annually through standard promotion cycles. "
            f"For an {'art-focused profile' if is_passion else 'industry veteran'}, corporate structures optimize financial capital "
            f"efficiently, allowing you to fund external investments or passions without cash-flow anxiety."
        )
        risk_msg = (
            f"Do not overlook the golden handcuffs and corporate drag. The risk here isn't financial failure, but rather "
            f"psychological stagnation and cognitive burnout due to toxic corporate politics, endless meetings, and lack of autonomy. "
            f"Stress indices scale progressively towards Year 3. Since your driver is {priority.upper()}, you will feel locked in "
            f"a hamster wheel if the daily tasks do not align with your core values."
        )
        happiness_msg = (
            f"Corporate paths offer safety, enabling high Life Balance if strict boundaries are set. However, an "
            f"{'Introvert will find endless corporate meetings and open-plan offices exhausting, requiring strong boundaries to survive' if is_introvert else 'Extrovert will thrive in cross-functional team roles, utilizing office dynamics and team wins for positive motivation'}. "
            f"If you pursue Passion, this path risks feeling hollow, leading to a severe mid-life regret crisis."
        )

        if is_passion and not is_risk_averse:
            verdict_title_str = "Corporate Sabbatical or Intrapreneurship"
            verdict_body_str = (
                f"Use the stable income from \"{decision_sub}...\" to finance your true passions. If corporate stagnation "
                f"exceeds 60%, negotiate a shift to a highly specialized remote role or transition to high-impact, autonomous "
                f"projects within the firm."
            )
        else:
            verdict_title_str = "Optimize & Scale Upward"
            verdict_body_str = (
                f"This tech/corporate path for \"{decision_sub}...\" is highly aligned with your need for stability. "
                f"Maximize income early, set strict boundaries to avoid burnout, and allocate 20% of income to independent "
                f"investment portfolios to build ultimate freedom."
            )

    elif path == 'LIFESTYLE':
        growth_msg = (
            f"Relocating or transitioning to a nomadic life model will likely depress immediate linear career growth by 20-30% "
            f"due to local networking gaps and time zone friction. However, the cultural adaptation gains, resilience building, "
            f"and language acquisition represent high-value soft skill growth that compounds in global market networks by Year 5, "
            f"opening doors you can't currently foresee."
        )
        risk_msg = (
            f"Relocation stress is extremely high and often underestimated. Adapting to complex visa rules, foreign tax structures, "
            f"and local logistics introduces massive volatility. For an "
            f"{'Introvert, building a brand new social circle from scratch in a foreign tongue is intimidating and deeply isolating' if is_introvert else 'Extrovert, you will suffer from transient networking fatigue and the painful lack of deep, long-term community roots'}. "
            f"Burnout from sheer logistical friction is high in the first 12 months."
        )
        happiness_msg = (
            f"This is where lifestyle optimization truly shines! If your driver is {'Passion or Balance' if (is_passion or priority == 'balance') else 'Stability'}, "
            f"stepping drastically out of your comfort zone will expand your cognitive elasticity. The mental stimulation of "
            f"foreign environments, new foods, and diverse cultures is simulated to raise life satisfaction indexes to peak levels of "
            f"85% by Year 3, provided you survive the initial culture shock."
        )

        if is_risk_averse:
            verdict_title_str = "Hybrid Sabbatical (Trial Relocation)"
            verdict_body_str = (
                f"Do not burn your local bridges for \"{decision_sub}...\" just yet. The council advises arranging a "
                f"2-to-3 month remote trial in the target destination first to test your integration resilience before making "
                f"permanent, costly relocation commitments."
            )
        else:
            verdict_title_str = "Full Relocation & Launch"
            verdict_body_str = (
                f"Proceed with relocation plans for \"{decision_sub}...\" immediately. The cognitive reset and perspective shift "
                f"are highly compatible with your growth model. Focus on immediate local integration and community building from Day 1."
            )

    elif path == 'SOCIAL':
        growth_msg = (
            f"Education, public sector, and community roles offer moderate salaries and relatively flat career progression. "
            f"The financial ceiling is low, and your primary reward is social utility rather than equity appreciation. By Year 5, "
            f"you will likely reach stable but hard salary caps, requiring careful secondary budgeting and long-term financial "
            f"planning to ensure retirement security."
        )
        risk_msg = (
            f"The public sector is notorious for chronic systemic exhaustion. You will deal with underfunded resources, emotional "
            f"empathy fatigue, and glacial administrative bureaucracy. Stress levels scale heavily over time. For an "
            f"{'Introvert' if is_introvert else 'Extrovert'}, dealing with public distress daily leads to rapid empathy burnout by "
            f"Year 3, often resulting in complete sector abandonment."
        )
        happiness_msg = (
            f"Despite the stress, this path holds the absolute highest human fulfillment scores. Doing work that directly alters "
            f"human lives for the better aligns perfectly with {'Passion' if is_passion else 'Balance'} drivers. As an "
            f"{'Introvert, you will build deep, meaningful one-on-one client relationships that sustain you' if is_introvert else 'Extrovert, you will create powerful community coalitions, driving high systemic happiness scores'}."
        )

        if is_stability:
            verdict_title_str = "Structured Institutional Placement"
            verdict_body_str = (
                f"To satisfy your Stability driver in \"{decision_sub}...\", seek positions in established universities, "
                f"large NGOs, or stable civil service positions. Avoid low-funded startup non-profits which introduce unacceptable "
                f"stress and financial risk."
            )
        else:
            verdict_title_str = "Direct Community Integration"
            verdict_body_str = (
                f"Maximize impact for \"{decision_sub}...\" by choosing grassroots organizations or direct public defense. "
                f"Protect yourself from inevitable empathy fatigue by implementing strict emotional boundaries and robust out-of-office wellness cycles."
            )

    else: # GENERAL
        growth_msg = (
            f"This decision offers standard, linear growth patterns. You will see solid skill development in the first 2 years, "
            f"reaching a steady promotion rhythm by Year 5 with average but reliable salary gains. It's a foundational move."
        )
        risk_msg = (
            f"Every change brings friction. Adjusting to a new routine, boss, or market segment carries a 30% volatility index. "
            f"Monitor your hours closely to prevent early burnout. Since your risk profile is {risk.upper()}, ensure you don't "
            f"overextend your financial buffers during the transition period."
        )
        happiness_msg = (
            f"Fulfillment will depend heavily on your day-to-day work environment and the people you surround yourself with. "
            f"If you prioritize {priority.upper()}, ensure you align this choice with your core interests to keep daily "
            f"satisfaction levels above critical baselines."
        )
        verdict_title_str = "Balanced Adaptation Model"
        verdict_body_str = (
            f"Execute this shift for \"{decision_sub}...\" by retaining a stable financial buffer. Map out your core values "
            f"and verify that this path satisfies at least two of your priority metrics before fully committing your time and capital."
        )

    return {
        "messages": [
            {
                "agent": "Growth Agent",
                "role": "Success & Market Forecaster",
                "emoji": "📈",
                "content": f"Evaluating path [{label}]: \"{decision}\". {growth_msg}"
            },
            {
                "agent": "Risk Agent",
                "role": "Stress & Volatility Inspector",
                "emoji": "🛡️",
                "content": f"Analyzing the downside of path [{label}]. {risk_msg}"
            },
            {
                "agent": "Happiness Agent",
                "role": "Wellness & Satisfaction Analyst",
                "emoji": "💖",
                "content": f"Let's balance those numbers against actual human utility. {happiness_msg}"
            },
            {
                "agent": "Decision Agent",
                "role": "Synthesis & Consensus Council",
                "emoji": "⚖️",
                "content": f"Weighted recommendation coefficients applied. Model calibrated for an {social.upper()} profile, with a {risk.upper()} risk threshold, driven by {priority.upper()}. Ready to synthesize verdict."
            }
        ],
        "verdict": {
            "title": verdict_title_str,
            "body": verdict_body_str
        }
    }


def build_timeline_data(path: str, params: dict) -> dict:
    social = params.get('social', 'introvert')
    risk = params.get('risk', 'moderate')
    priority = params.get('priority', 'balance')

    is_introvert = social == 'introvert'
    is_risk_taker = risk == 'high'
    is_risk_averse = risk == 'low'
    is_passion = priority == 'passion'
    is_stability = priority == 'stability'

    def get_metrics(scenario, year, base_growth, base_stress, base_burnout, base_happiness):
        growth_modifier = 0
        stress_modifier = 0
        burnout_modifier = 0
        happiness_modifier = 0

        if scenario == 'best':
            growth_modifier += 15
            stress_modifier -= 10
            burnout_modifier -= 10
            happiness_modifier += 15
        elif scenario == 'worst':
            growth_modifier -= 25
            stress_modifier += 20
            burnout_modifier += 20
            happiness_modifier -= 25

        if year == 3:
            growth_modifier += 10
            stress_modifier += 5
            happiness_modifier += 5
        elif year == 5:
            growth_modifier += 20
            stress_modifier -= 5
            burnout_modifier -= 5
            happiness_modifier += 10

        if is_risk_taker:
            growth_modifier += 8
            stress_modifier += 10
            burnout_modifier += 8
        elif is_risk_averse:
            growth_modifier -= 10
            stress_modifier -= 12
            burnout_modifier -= 8

        if is_passion:
            happiness_modifier += 10
            burnout_modifier += 5
        elif is_stability:
            growth_modifier += 8
            happiness_modifier -= 5

        def clamp(val):
            return max(5, min(98, round(val)))

        return {
            "growth": clamp(base_growth + growth_modifier),
            "stress": clamp(base_stress + stress_modifier),
            "burnout": clamp(base_burnout + burnout_modifier),
            "happiness": clamp(base_happiness + happiness_modifier)
        }

    scenarios = ['best', 'average', 'worst']
    timeline = {}

    for scen in scenarios:
        timeline[scen] = {}
        yr1_head = ""
        yr1_desc = ""
        yr1_mile = ""
        yr3_head = ""
        yr3_desc = ""
        yr3_mile = ""
        yr5_head = ""
        yr5_desc = ""
        yr5_mile = ""
        base_g, base_s, base_b, base_h = 50, 50, 40, 50

        if path == 'CREATIVE':
            base_g, base_s, base_b, base_h = 40, 55, 45, 65
            if scen == 'best':
                yr1_head = "Creative Breakthrough"
                yr1_desc = "Your work finds a dedicated niche online. Organic growth begins to substitute your living costs."
                yr1_mile = "Secured your first 50 recurring patrons or clients, validating your business model."
                yr3_head = "Brand Expansion"
                yr3_desc = "You secure notable collaborations. A steady creative routine minimizes early career friction."
                yr3_mile = "Released a major piece, landing features in curated industry publications."
                yr5_head = "Creative Sovereignty"
                yr5_desc = "You control your time completely. Your intellectual property generates compounding royalty channels."
                yr5_mile = "Achieved total financial independence from passive sales, buying a custom workspace."
            elif scen == 'average':
                yr1_head = "The Hustler's Grind"
                yr1_desc = "Work is sporadic. You alternate between highly fulfilling projects and dull freelance gigs to pay rent."
                yr1_mile = "Survived the first year without touching retirement savings, though margins are tight."
                yr3_head = "Flickering Stability"
                yr3_desc = "Clients become regular, but you feel like you've traded one boss for ten. Work hours are long."
                yr3_mile = "Streamlined operations, allowing you to take your first 2-week vacation in years."
                yr5_head = "Modest Sustainability"
                yr5_desc = "You earn a median salary. The work is deeply yours, but you must constantly market to stay relevant."
                yr5_mile = "Established a stable personal brand that guarantees a consistent regional audience."
            else:
                yr1_head = "Market Rejection"
                yr1_desc = "Zero audience traction. Unpaid bills mount, and the isolation leads to cognitive doubt."
                yr1_mile = "Forced to take credit card debt to cover studio space and living essentials."
                yr3_head = "Burnout Crash"
                yr3_desc = "You are working 80 hours a week on creative ideas with no financial return. The anxiety is crushing."
                yr3_mile = "Suffered a major creative block, leading to a temporary collapse of freelance commissions."
                yr5_head = "Retreat & Re-entry"
                yr5_desc = "Exhausted and financially depleted, you pause the creative venture to seek standard corporate roles."
                yr5_mile = "Closed your business account and formatted your resume to apply for corporate entry jobs."

        elif path == 'BUSINESS':
            base_g, base_s, base_b, base_h = 55, 65, 50, 55
            if scen == 'best':
                yr1_head = "Product-Market Fit Achieved"
                yr1_desc = "Your solution resolves a real pain point. Word of mouth triggers early client growth."
                yr1_mile = "Closed a seed funding round or broke even in operations inside month nine."
                yr3_head = "Team Scale-up"
                yr3_desc = "You delegate operations to employees. You focus strictly on high-level growth strategy."
                yr3_mile = "Expanded team to 8 employees and opened a dedicated corporate headquarters."
                yr5_head = "Market Leadership / Exit"
                yr5_desc = "Your startup dominates its regional niche. Competitors look to acquire your operations."
                yr5_mile = "Successfully completed a partial equity exit, securing significant liquidity."
            elif scen == 'average':
                yr1_head = "Operational Friction"
                yr1_desc = "Client acquisition is expensive. You work long hours handling customer support, sales, and delivery."
                yr1_mile = "Kept operations afloat through personal savings and micro-loans, scraping a living wage."
                yr3_head = "Steady Margin Survival"
                yr3_desc = "Business is stable but doesn't scale easily. You are a self-employed operator rather than an owner."
                yr3_mile = "Renegotiated vendor contracts, boosting net profitability margins by 12%."
                yr5_head = "Stable Livelihood"
                yr5_desc = "The company yields a comfortable income. You have built a loyal client base, though stress remains high."
                yr5_mile = "Achieved systemic parity where operations can run for 30 days without your active intervention."
            else:
                yr1_head = "Cash Flow Crunch"
                yr1_desc = "Major launch misses the mark. High customer acquisition costs drain your startup capital quickly."
                yr1_mile = "Defaulted on initial equipment lease payments, requiring personal emergency funds."
                yr3_head = "Executive Exhaustion"
                yr3_desc = "Co-founder disputes explode. Employees leave due to stress, leaving you to manage all systems."
                yr3_mile = "Forced to liquidate company assets to repay outstanding business loans."
                yr5_head = "Bankruptcy & Pivot"
                yr5_desc = "The company shuts down. You spend a year negotiating liabilities and recovering mentally."
                yr5_mile = "Legally dissolved the corporation, retaining valuable execution skills but losing initial capital."

        elif path == 'TECH':
            base_g, base_s, base_b, base_h = 65, 50, 40, 50
            if scen == 'best':
                yr1_head = "Fast-Track Recognition"
                yr1_desc = "You deliver critical projects ahead of schedule. Leadership marks you for rapid promotion."
                yr1_mile = "Received a high performance rating and a 15% salary bump within year one."
                yr3_head = "Management Ascent"
                yr3_desc = "You shift to strategic team management. You enjoy generous bonuses and equity vesting packages."
                yr3_mile = "Promoted to Lead Director, managing a budget of $1M and a team of senior engineers."
                yr5_head = "Corporate Elite Status"
                yr5_desc = "You reach executive tiers. You have massive leverage, choosing your projects and teams."
                yr5_mile = "Vested stock options reach maturity, creating a significant wealth portfolio."
            elif scen == 'average':
                yr1_head = "Ramp Up & Integration"
                yr1_desc = "You adapt to the corporate stack. The hours are standard, but the bureaucracy is tedious."
                yr1_mile = "Passed your initial onboarding reviews, securing a standard market rate cost-of-living raise."
                yr3_head = "Mid-Level Plateau"
                yr3_desc = "The work is repetitive. You perform well, but senior promotions are blocked by corporate structure."
                yr3_mile = "Obtained a specialized technical certification, ensuring role safety during reorganization."
                yr5_head = "Comfortable Competency"
                yr5_desc = "You earn a solid upper-middle-class income. Work is predictable, leaving time for out-of-office hobbies."
                yr5_mile = "Negotiated a permanent 3-day remote work agreement, optimizing life balance metrics."
            else:
                yr1_head = "Stack Mismatch"
                yr1_desc = "The department undergoes re-organization. You are assigned to a toxic manager and legacy tech stack."
                yr1_mile = "Placed on a performance improvement plan (PIP) due to communication clashes with leadership."
                yr3_head = "Layoff Volatility"
                yr3_desc = "Broad corporate downsizing hits your team. You face a job market with declining hiring rates."
                yr3_mile = "Laid off with 2 weeks severance, spending 6 anxious months interviewing."
                yr5_head = "Career Downgrade"
                yr5_desc = "You accept a lower-paying role at a volatile firm to avoid unemployment. Stagnation index peaking."
                yr5_mile = "Accepted a 20% pay cut at a legacy support firm, feeling heavy career regret."

        elif path == 'LIFESTYLE':
            base_g, base_s, base_b, base_h = 45, 50, 35, 70
            if scen == 'best':
                yr1_head = "Cultural Integration"
                yr1_desc = "The transition is smooth. You build foreign connections quickly and lower your cost of living."
                yr1_mile = "Mastered basic local language benchmarks and signed a long-term apartment lease."
                yr3_head = "Global Hub Setup"
                yr3_desc = "You build an international remote workflow, earning USD while enjoying high lifestyle leverage abroad."
                yr3_mile = "Established a legal foreign business entity, reducing your tax exposure by 15%."
                yr5_head = "Transnational Synthesis"
                yr5_desc = "You are fully bilingual and culturally integrated. You split your year between gorgeous locales."
                yr5_mile = "Secured permanent residency status, buying a scenic home in your dream country."
            elif scen == 'average':
                yr1_head = "Transient Disorientation"
                yr1_desc = "Bureaucracy slows you down. You experience spikes of homesickness and language barriers."
                yr1_mile = "Obtained local visa renewals, though administrative fees drained your savings buffer."
                yr3_head = "Expat Bubble Comfort"
                yr3_desc = "You build a group of expat friends, but struggle to connect deeply with locals. Work is stable."
                yr3_mile = "Shifted to freelance client work to maintain visa compliance requirements."
                yr5_head = "Split Reality"
                yr5_desc = "You love the safety of your new home, but feel distant from family. Career growth is moderate."
                yr5_mile = "Achieved balanced comfort, though you contemplate returning to your home country."
            else:
                yr1_head = "Visa Nightmare & Isolation"
                yr1_desc = "Visa applications are rejected. You feel isolated, living in sub-par temporary rentals."
                yr1_mile = "Forced to return home briefly due to visa expiration, incurring heavy travel debt."
                yr3_head = "Depleted Reserve Emergency"
                yr3_desc = "You cannot secure local income. The high inflation rates wipe out your initial savings."
                yr3_mile = "Hospitalized abroad with no insurance, requiring family repatriation funding assistance."
                yr5_head = "Defeated Return"
                yr5_desc = "You return home permanently. You feel like a stranger in your old town, facing career regression."
                yr5_mile = "Moved back into your parents' home, starting from scratch in the local job market."

        elif path == 'SOCIAL':
            base_g, base_s, base_b, base_h = 40, 55, 45, 65
            if scen == 'best':
                yr1_head = "Direct Impact Validation"
                yr1_desc = "Your clients show significant improvement. You feel a daily purpose that corporate roles lacked."
                yr1_mile = "Awarded Local Advocate of the Year by your department director."
                yr3_head = "Program Creation"
                yr3_desc = "You design new support frameworks. You lead training workshops, scaling your altruistic footprint."
                yr3_mile = "Secured a federal foundation grant to launch a dedicated youth support initiative."
                yr5_head = "Systemic Leader"
                yr5_desc = "You run a major division. You are highly respected in the community, earning a comfortable stable salary."
                yr5_mile = "Successfully influenced local policy, establishing permanent funding for 500+ families."
            elif scen == 'average':
                yr1_head = "Empathy Burnout Threat"
                yr1_desc = "You help clients, but the massive caseload leaves you emotionally drained by Friday night."
                yr1_mile = "Survived a major budget cut cycle, keeping your primary case assignments intact."
                yr3_head = "Bureaucratic Deadlocks"
                yr3_desc = "You spend 50% of your time filling out reports rather than helping people. Career growth is flat."
                yr3_mile = "Transferred to a quieter administrative desk role to protect mental health."
                yr5_head = "Resigned Dedication"
                yr5_desc = "The system is slow, but you make a quiet difference. You earn a modest income with good retirement buffers."
                yr5_mile = "Completed a 5-year tenure milestone, securing public service student loan forgiveness."
            else:
                yr1_head = "Administrative Exhaustion"
                yr1_desc = "Hostile management and massive case backlogs destroy your enthusiasm in month three."
                yr1_mile = "Took a 2-week stress leave after a severe confrontation with systemic negligence."
                yr3_head = "Secondary Traumatic Stress"
                yr3_desc = "The emotional weight of your clients' distress causes you chronic insomnia and mental fatigue."
                yr3_mile = "Resigned from the agency under extreme anxiety, seeking medical leave."
                yr5_head = "Career Relinquish"
                yr5_desc = "You leave the social impact sector completely, taking a simple data entry role to find quiet safety."
                yr5_mile = "Accepted a basic entry clerk position, mourning the loss of your early idealist goals."

        else: # GENERAL
            base_g, base_s, base_b, base_h = 50, 50, 40, 50
            if scen == 'best':
                yr1_head = "Smooth Path Adaptation"
                yr1_desc = "The new path unfolds smoothly. You build skills and fit into your team dynamics."
                yr1_mile = "Passed initial evaluation cycles with positive peer feedback."
                yr3_head = "Structured Progression"
                yr3_desc = "Salary steps up by 20%. You command respect, establishing a comfortable lifestyle balance."
                yr3_mile = "Successfully completed a cornerstone department integration assignment."
                yr5_head = "Optimized Mastery"
                yr5_desc = "You hold key domain expertise. The role pays well, demands are stable, and wellness is secure."
                yr5_mile = "Achieved target salary goal, establishing active wealth accumulation funds."
            elif scen == 'average':
                yr1_head = "Standard Routine Adjustment"
                yr1_desc = "The learning curve is steep. You spend hours adjusting to new operational styles."
                yr1_mile = "Secured standard tenure milestones, neutralizing early probationary risks."
                yr3_head = "Linear Compensation Gains"
                yr3_desc = "Inflation adjustments are granted, but growth is flat. The role is acceptable but unexciting."
                yr3_mile = "Completed secondary training seminars to prevent role obsolescence."
                yr5_head = "Comfortable Baseline"
                yr5_desc = "A stable life. The decision hasn't changed the world, but it has secured your daily parameters."
                yr5_mile = "Negotiated standard work-from-home options to preserve weekly leisure time."
            else:
                yr1_head = "Friction & Doubt"
                yr1_desc = "The daily tasks are tedious. You question if this choice was a lateral step backward."
                yr1_mile = "Missed the initial quarterly performance metrics, leading to warning reviews."
                yr3_head = "Chronic Friction Loops"
                yr3_desc = "Friction with management compounds. Market shifts threaten the long-term safety of your position."
                yr3_mile = "Survived a corporate re-org but got reassigned to an unrewarding division."
                yr5_head = "Role Fatigue Stagnation"
                yr5_desc = "You feel locked in a career cul-de-sac. Stress is high, pay is low, and motivation is gone."
                yr5_mile = "Began sending resumes to competitors, seeking a total reset of this pathway."

        timeline[scen]["year1"] = {
            "headline": yr1_head,
            "desc": yr1_desc,
            "milestone": yr1_mile,
            "metrics": get_metrics(scen, 1, base_g, base_s, base_b, base_h)
        }
        timeline[scen]["year3"] = {
            "headline": yr3_head,
            "desc": yr3_desc,
            "milestone": yr3_mile,
            "metrics": get_metrics(scen, 3, base_g, base_s, base_b, base_h)
        }
        timeline[scen]["year5"] = {
            "headline": yr5_head,
            "desc": yr5_desc,
            "milestone": yr5_mile,
            "metrics": get_metrics(scen, 5, base_g, base_s, base_b, base_h)
        }

    return timeline


def calculate_regret(path: str, label: str, params: dict) -> dict:
    social = params.get('social', 'introvert')
    risk = params.get('risk', 'moderate')
    priority = params.get('priority', 'balance')

    is_introvert = social == 'introvert'
    is_risk_taker = risk == 'high'
    is_risk_averse = risk == 'low'
    is_passion = priority == 'passion'
    is_stability = priority == 'stability'

    score = 45
    explanation = ""
    triggers = []

    if path == 'CREATIVE':
        if is_stability:
            score += 25
            explanation = f"Because your primary driver is Stability & Wealth, taking this low-guarantee creative path [{label}] will trigger high regret whenever income fluctuates."
            triggers.append("Freelance revenue drops below 40% of baseline costs.")
            triggers.append("Seeing corporate colleagues purchase properties while you manage rent volatility.")
        elif is_risk_averse:
            score += 15
            explanation = f"As a Risk-Averse individual, the lack of structured career safety on path [{label}] will cause persistent anxiety."
            triggers.append("Going 60 days without a confirmed client project or commission.")
        else:
            score -= 15
            explanation = f"Your passion-driven, risk-tolerant nature is highly compatible with creative paths [{label}]. Regret will be minimal."
            triggers.append("Loss of creative autonomy due to accepting poorly paid corporate contracts.")
        
        if not is_introvert:
            score += 10
            triggers.append("Sustained creative isolation leading to extrovert networking exhaustion.")

    elif path == 'BUSINESS':
        if is_risk_averse:
            score += 30
            explanation = f"A startup path [{label}] carries high friction. Because you prefer security, the threat of bankruptcy or liability will trigger high regret."
            triggers.append("Negotiating personal guarantees on commercial office leases.")
            triggers.append("Handling tax audits or co-founder contract disputes.")
        elif is_stability:
            score += 10
            explanation = f"While business [{label}] offers wealth, the initial year of zero salary conflicts with your financial goals, generating regret."
            triggers.append("Drawing zero salary for 12 straight months while working 80-hour weeks.")
        else:
            score -= 10
            explanation = f"You possess the risk tolerance to manage startup shocks. Regret will only occur if the business fails completely on path [{label}]."
            triggers.append("A sudden regulatory shift that closes your business model completely.")
        
        if is_introvert:
            score += 10
            triggers.append("Sustained retail management demands leading to introvert energy burnout.")

    elif path == 'TECH':
        if is_passion:
            score += 25
            explanation = f"Since you prioritize Passion, working in corporate tech [{label}] will trigger significant regret over lost creative years."
            triggers.append("Spending consecutive quarters writing admin slides rather than creative code.")
            triggers.append("Reaching age 40 and realizing your creative goals were never launched.")
        elif is_risk_taker:
            score += 15
            explanation = f"As a Risk-Taker, the comfortable safety of corporate tech [{label}] will eventually feel restrictive, triggering regret over missed ventures."
            triggers.append("Watching former classmates raise VC funding while you sit in status meetings.")
        else:
            score -= 20
            explanation = f"You prioritize stability, and tech corporate roles [{label}] offer exactly that. Your regret score is exceptionally low."
            triggers.append("Sudden structural layoffs that destroy your safety net.")

    elif path == 'LIFESTYLE':
        if is_stability:
            score += 20
            explanation = f"Moving abroad [{label}] lowers immediate career speed. You will regret the move when calculating lost compounding growth back home."
            triggers.append("Seeing local peers get promoted to Senior VP while you work remote odd-jobs.")
        elif is_risk_averse:
            score += 15
            explanation = f"Moving country [{label}] requires high adaptation. Volatile visa regulations will trigger regret during emergencies."
            triggers.append("Sudden visa changes that give you 30 days to leave the country.")
        else:
            score -= 15
            explanation = f"You prioritize experience. Even if the move [{label}] is chaotic, the life lessons will ensure you do not regret this choice."
            triggers.append("Experiencing long-term family emergencies back home while you are far away.")

    elif path == 'SOCIAL':
        if is_stability:
            score += 20
            explanation = f"Public sector roles [{label}] have low salary growth. Because you prioritize wealth, you will regret the choice when faced with living costs."
            triggers.append("Struggling to afford quality housing due to rigid public service salary steps.")
        else:
            score -= 15
            explanation = f"Altruistic paths [{label}] offer high satisfaction. Doing direct good keeps regret low."
            triggers.append("Realizing that bureaucratic deadlocks prevent you from actually helping your clients.")

    else: # GENERAL
        if is_risk_averse:
            score += 10
            explanation = f"Every change brings friction. Because you prefer security, minor startup obstacles on path [{label}] will cause nostalgia for your old routine."
            triggers.append("The initial 6 months of operational confusion in your new role.")
        else:
            explanation = f"Your average regret index suggests you will adapt to this decision [{label}]."
            triggers.append("Failing to schedule boundaries, leading to general life stagnation.")

    score = max(5, min(95, score))
    level = "Low Regret Risk"
    if 40 < score <= 65:
        level = "Moderate Regret Risk"
    elif score > 65:
        level = "High Regret Risk"

    return {
        "score": score,
        "level": level,
        "explanation": explanation,
        "triggers": triggers
    }


def build_cinematic_story(path: str, label: str, params: dict) -> str:
    social = params.get('social', 'introvert')
    risk = params.get('risk', 'moderate')
    priority = params.get('priority', 'balance')

    is_introvert = social == 'introvert'
    is_risk_taker = risk == 'high'
    is_passion = priority == 'passion'
    is_stability = priority == 'stability'

    intro = ""
    body = ""
    outro = ""

    if path == 'CREATIVE':
        intro = f"June 28, 2031. Five years have evaporated since the morning I stared at my keyboard and decided to pursue a creative life on path {label}. The scent of fresh coffee fills my small studio space. Outside, rain streams down the window pane. There is no corporate alarm clock, no morning commute, no manager checking my status logs. Just a blank canvas, my tools, and a quiet sense of ownership."
        if is_introvert:
            body = "In the beginning, the quiet was intoxicating. I spent Year 1 and 2 in high-focus isolation, writing or crafting in solitary loops. But isolation is a double-edged sword. There were weeks when my only social contact was the local grocery clerk. Financial stress was a constant shadow; I remember a cold Tuesday in Year 3 when my account hit double digits, and I questioned my sanity. Yet, step by step, my digital audience grew. They didn't just buy my work; they bought my perspective."
        else:
            body = "Being an extrovert, I quickly realized that locking myself in a room would destroy my drive. I moved my workspace to a bustling community studio. I hosted workshops, organized local creator panels, and co-shared projects. Year 3 was a whirlwind of social collaboration. The income was volatile—a rollercoaster of high commissions followed by dry seasons—but the energy of the crowd kept my motivation alive."
        
        if is_passion:
            outro = "Looking back, I may not own a luxury vehicle or a corporate title, but I own my days. My soul is intact, and the stories I have created will outlive my bank balance. I chose passion, and that has made all the difference."
        else:
            outro = "The path was beautiful but exhausting. I have had to take on freelance contracts that felt corporate just to pay the rent. I managed to survive, but the constant marketing has made me value stability more than ever. I forged a path, but I learned that security has its own beauty."

    elif path == 'BUSINESS':
        intro = f"June 28, 2031. The glass-walled office overlooks the city skyline on path {label}. It's late, and the cleaning staff is working down the hall. I look at the logo etched on the wall—the entity I built from a simple text prompt five years ago. I am exhausted, but the brand belongs to me. We survived the first-year cash crunch, the co-founder disputes of Year 3, and the grueling scale-up that followed."
        if is_introvert:
            body = "Managing a team of 15 has forced me to adapt. Being naturally introverted, the constant sales calls and meetings initially drained me to zero. I had to design strict boundaries, retreating to quiet offices to recharge. The risk was immense; I remember Year 2 when we almost missed payroll, and the weight of my employees' livelihoods kept me awake for weeks. But we survived, building a highly systematized business."
        else:
            body = "As an extrovert, I thrived in the chaotic early stages. Pitching to investors, winning clients over dinners, and rallying my team during late-night sprints was my fuel. I built a wide community net, leveraging partnerships to bypass obstacles. The volatility was a rush, and my high risk appetite allowed me to make bets that paid off in Year 4."
        
        if is_stability:
            outro = "The company is now highly profitable. The early years of zero pay have been replaced by a secure executive package. I built a system of wealth and equity, buying the financial freedom I always craved. The forge succeeded."
        else:
            outro = "We scaled, but at a cost. I have missed family dinners, lost touch with old friends, and suffered chronic high blood pressure. I built an empire, but I am now looking to step down as CEO to find the balance I threw away. The forge worked, but the bill has come due."

    elif path == 'TECH':
        intro = f"June 28, 2031. The soft hum of the corporate server room and the gentle glow of dual monitors frame my evening on path {label}. Five years ago, I chose path predictability. Today, I sit in a high-backed executive chair, checking my vested stock balances. It is a world of metrics, scheduled promotions, stable benefits, and structured comfort."
        if is_passion:
            body = "The career path is successful, but the days feel like a loop of corporate acronyms. I earn a high salary, but my notebooks are full of scribbled ideas for novels and projects I never find the energy to start. I remember Year 3, receiving a major bonus while feeling an empty sadness inside. I have used my money to buy comfort, but my creative drive has stagnated in this plush cage."
        else:
            body = f"The stability has allowed me to build a beautiful life outside the office. I shut my laptop at 5:00 PM. I bought a home in Year 3, got a dog, and spent my weekends traveling. Being an {'introvert, I enjoy the quiet remote setup' if is_introvert else 'extrovert, I enjoy mentoring junior team members'}, utilizing the corporate structure without letting it consume my identity."
        
        if is_stability:
            outro = "I chose safety, and I do not regret it. My bank account is secure, my future is mapped, and I have built a solid foundation. You cannot eat passion, but you can build a stable life with structure. The forge was calculated, and it won."
        else:
            outro = "I earned the title and the compensation, but I look at independent creators with a quiet envy. I traded volatility for structure, but a small part of me will always wonder what would have happened if I had leaped off the corporate ledge."

    elif path == 'LIFESTYLE':
        intro = f"June 28, 2031. The afternoon sun illuminates a cobblestone street in a foreign town on path {label}. I sit at a small café, my laptop open, typing with the sound of a foreign language echoing around me. Five years ago, I decided to pack my life into a suitcase and relocate. It was a leap into the unknown, a choice of environment over structured career speed."
        if is_introvert:
            body = "The first year was difficult. I sat in lonely rooms, navigating complex visa bureaucracies and language blocks. As an introvert, making friends from scratch was an exercise in extreme courage. But I adapted, finding quiet joy in long walks through ancient forests and remote work in local libraries. I lost some career speed, but I gained an immense inner resilience."
        else:
            body = "I threw myself into the local scene. I organized expat meetups, joined local sports leagues, and co-shared desks. I learned the language by making mistakes in public and laughing about it. My career transformed into a digital consulting model, allowing me to travel through three continents. The lack of roots was exhausting at times, but the network I built spans the globe."
        
        if is_passion or priority == 'balance':
            outro = "I live a life of rich experiences. I may have less retirement savings than my office colleagues, but I have swam in remote oceans, spoken three languages, and lived multiple lives. I chose lifestyle, and my horizon is wide open."
        else:
            outro = "I saw the world, but the distance from family has begun to weigh on me. I realized that adventure is sweet, but roots are necessary. I am now planning my return, carrying memories but seeking a stable home at last."

    elif path == 'SOCIAL':
        intro = f"June 28, 2031. The community center is quiet now on path {label}. I look at the drawings on the wall and the case files on my desk. Five years ago, I walked away from raw salary maximization to work in the human sector. The salary is modest, but the work is alive. I spend my days dealing with real human distress and systemic hope."
        if is_introvert:
            body = "I had to learn how to survive empathy fatigue. In Year 2, I would carry my clients' pain home, spending sleepless nights worrying about their lives. As an introvert, the public-facing demands drained my batteries. I had to learn the art of professional detachment, focusing on deep, quiet one-on-one sessions where I could offer complete, focused help."
        else:
            body = "I thrived in public advocacy. I built community projects, raised funds through charity drives, and spoke at local councils. Being energized by groups, I leveraged my extroversion to coordinate coalitions of volunteers. The bureaucracy of public services tried to crush our spirit in Year 3, but the community network we built held us together."
        
        if is_passion:
            outro = "When I see a client secure housing or a student succeed, the sense of accomplishment is unmatched. I do not care about corporate stocks; I care about human eyes. I chose impact, and my heart is full."
        else:
            outro = "The work is noble, but the financial limitations are real. I struggled to afford quality childcare in Year 4, and the stress of low pay has strained my relationship. I forged an idealistic path, but I have learned that help requires its own financial oxygen."

    else: # GENERAL
        intro = f"June 28, 2031. Five years have quietly passed since I made the decision to change my trajectory on path {label}. I sit in my living room, reviewing the path I forged. The initial disruption has smoothed into a daily routine. It is a life of standard rhythms, comfortable adjustments, and steady progression."
        body = "Year 1 and 2 were a blur of learning new systems and adjusting to the daily requirements. I faced minor friction points—a demanding manager in Year 3, a changing market in Year 4—but my personality settings kept me balanced. I did not take massive risks, nor did I hide in total stagnation. I navigated the middle path, building stable value."
        outro = "Looking back, it was a balanced choice. It secured my career without burning out my life. I forged a sustainable path, and I am content with the horizon ahead."

    return f"{intro}\n\n${body}\n\n${outro}"


def generate_single_simulation(params_dict: dict, decision_text: str, label: str = 'A') -> dict:
    lower = decision_text.lower()
    path = 'GENERAL'
    for key, keywords in PATHS.items():
        if any(kw in lower for kw in keywords):
            path = key
            break

    return {
        "path": path,
        "debate": build_debate_data(path, decision_text, label, params_dict),
        "timeline": build_timeline_data(path, params_dict),
        "regret": calculate_regret(path, label, params_dict),
        "story": build_cinematic_story(path, label, params_dict)
    }


def run_full_simulation(decision_mode: str, params_dict: dict) -> dict:
    if decision_mode == 'single':
        results = generate_single_simulation(params_dict, params_dict.get('decision', ''))
        return {
            "single": results
        }
    else:
        results_a = generate_single_simulation(params_dict, params_dict.get('decisionA', ''), 'A')
        results_b = generate_single_simulation(params_dict, params_dict.get('decisionB', ''), 'B')
        return {
            "optionA": results_a,
            "optionB": results_b
        }

# ==========================================================
# NEW AI SCORING & COMPATIBILITY ENGINE
# ==========================================================
def calculate_compatibility_scores(params: dict) -> dict:
    social = params.get('social', 'introvert')
    risk = params.get('risk', 'moderate')
    priority = params.get('priority', 'balance')

    is_introvert = social == 'introvert'
    is_risk_taker = risk == 'high'
    is_risk_averse = risk == 'low'
    is_passion = priority == 'passion'
    is_stability = priority == 'stability'

    # Scores out of 100
    scores = {}

    # CREATIVE
    cr_score = 50
    if is_passion: cr_score += 30
    elif is_stability: cr_score -= 20
    else: cr_score += 10
    if is_risk_taker: cr_score += 15
    elif is_risk_averse: cr_score -= 20
    if is_introvert: cr_score += 10
    else: cr_score -= 5
    scores['CREATIVE'] = max(10, min(98, cr_score))

    # BUSINESS
    biz_score = 45
    if is_passion: biz_score += 10
    elif is_stability: biz_score -= 25
    else: biz_score -= 10
    if is_risk_taker: biz_score += 35
    elif is_risk_averse: biz_score -= 30
    else: biz_score += 15
    if not is_introvert: biz_score += 15
    else: biz_score -= 5
    scores['BUSINESS'] = max(10, min(98, biz_score))

    # TECH / Corporate
    tech_score = 55
    if is_stability: tech_score += 30
    elif is_passion: tech_score -= 10
    else: tech_score += 15
    if is_risk_averse: tech_score += 20
    elif is_risk_taker: tech_score -= 15
    else: tech_score += 10
    scores['TECH'] = max(10, min(98, tech_score))

    # LIFESTYLE / Nomad
    lf_score = 50
    if priority == 'balance': lf_score += 30
    elif is_passion: lf_score += 15
    elif is_stability: lf_score -= 20
    if is_risk_taker: lf_score += 20
    elif is_risk_averse: lf_score -= 15
    else: lf_score += 10
    scores['LIFESTYLE'] = max(10, min(98, lf_score))

    # SOCIAL / NGO / Advocacy
    sc_score = 50
    if is_passion: sc_score += 30
    elif priority == 'balance': sc_score += 10
    elif is_stability: sc_score -= 15
    if is_risk_averse: sc_score += 10
    elif is_risk_taker: sc_score -= 10
    if not is_introvert: sc_score += 15
    else: sc_score += 5
    scores['SOCIAL'] = max(10, min(98, sc_score))

    return scores


def generate_swot_analysis(path: str, params: dict) -> dict:
    # Compile consulting SWOT analysis lists
    swot = {
        "strengths": [],
        "weaknesses": [],
        "opportunities": [],
        "threats": []
    }

    if path == 'CREATIVE':
        swot["strengths"] = [
            "High creative and scheduling autonomy",
            "Compounding value of personal intellectual assets over time",
            "Fulfillment-driven work aligning directly with passion priorities"
        ]
        swot["weaknesses"] = [
            "Unpredictable baseline cash flow patterns",
            "High potential for cognitive isolation and routine stagnation",
            "High self-discipline threshold required for client generation"
        ]
        swot["opportunities"] = [
            "Leveraging digital web communities to aggregate niche global buyers",
            "High-leverage licensing contracts of artistic assets",
            "Monetizing instructional resources (baking/craft schools, etc.)"
        ]
        swot["threats"] = [
            "Platform/algorithm shifts reducing direct audience traffic",
            "Generative AI assets deflating prices of standard commissions",
            "Rapid burnout due to blurring of work-leisure lines"
        ]
    elif path == 'BUSINESS':
        swot["strengths"] = [
            "Direct system ownership and scalable equity appreciation",
            "Complete decision velocity and strategic path control",
            "Uncapped ceiling for generating compound financial resources"
        ]
        swot["weaknesses"] = [
            "Relentless workload (simulated at 70-80 hours/week early)",
            "Critical early startup cash flow deficits",
            "Relentless operational stress and decision fatigue"
        ]
        swot["opportunities"] = [
            "Securing external seed capital or angel partnerships",
            "First-mover advantage in localized niche services",
            "Structuring business systems for hands-off management"
        ]
        swot["threats"] = [
            "High industry sector mortality rates (90% inside Year 5)",
            "Shifting regulatory requirements or tax compliance burdens",
            "Team friction or key executive resignation blocks"
        ]
    elif path == 'TECH':
        swot["strengths"] = [
            "Predictable financial growth steps and promotion loops",
            "Comprehensive health and financial corporate buffers",
            "Generous capital resources enabling out-of-office investment"
        ]
        swot["weaknesses"] = [
            "Strict structural constraints on task autonomy",
            "Cognitive drag from corporate meetings and politics",
            "Stack mismatch and risk of developer tool obsolescence"
        ]
        swot["opportunities"] = [
            "Vesting stock packages compounding over consecutive quarters",
            "Negotiating high-grade remote work positions",
            "Ascending to director level to steer strategic tech budgets"
        ]
        swot["threats"] = [
            "Macroeconomic layoff waves and project cancellation shocks",
            "Golden handcuffs locking in low-passion occupation steps",
            "Burnout due to highly demanding release and sprint metrics"
        ]
    elif path == 'LIFESTYLE':
        swot["strengths"] = [
            "Arresting cost-of-living drag through geo-arbitrage",
            "Accelerated adaptability and cultural elastic learning",
            "High focus blocks due to escape from domestic routines"
        ]
        swot["weaknesses"] = [
            "Complex visa structures and immigration constraints",
            "Timezone discrepancies causing remote client friction",
            "Distance from direct family support networks"
        ]
        swot["opportunities"] = [
            "Establishing international freelance consulting pipelines",
            "Securing residency buffers in low-tax digital jurisdictions",
            "Developing unique cross-border content assets"
        ]
        swot["threats"] = [
            "Sudden changes in remote-worker visa rules",
            "Sudden domestic emergency requirements",
            "Transient community isolation and loneliness"
        ]
    elif path == 'SOCIAL':
        swot["strengths"] = [
            "Direct alignment with social progress goals",
            "Immensely rewarding client feedback and utility loops",
            "Low existential career regret score metrics"
        ]
        swot["weaknesses"] = [
            "Flat salary growth profile with rigid budget ceilings",
            "Susceptibility to chronic secondary empathy fatigue",
            "Frequent struggle with bureaucratic institutional lethargy"
        ]
        swot["opportunities"] = [
            "Securing large federal or foundation endowment grants",
            "Pivoting to run systemic community policy changes",
            "Achieving public service student loan forgiveness benchmarks"
        ]
        swot["threats"] = [
            "Sudden grant funding cuts terminating key project branches",
            "Burnout due to systemic under-staffing and case backlogs",
            "Empathy fatigue leading to career abandonment"
        ]
    else: # GENERAL
        swot["strengths"] = [
            "Stable transition footprint with low disruption metrics",
            "Consistent work-life balance benchmarks",
            "Low risk of sudden cash flow collapse"
        ]
        swot["weaknesses"] = [
            "Lack of asymmetric upside potential",
            "Repetitive daily task structures",
            "Moderate interest alignment"
        ]
        swot["opportunities"] = [
            "Allocating steady cash surpluses to index funds",
            "Negotiating moderate work schedule flexibility",
            "Compounding skills over incremental promotion steps"
        ]
        swot["threats"] = [
            "General inflation eroding standard salary steps",
            "Role stagnation due to structural industry contraction",
            "Boredom and career mid-life regret cycles"
        ]

    return swot


def generate_mitigation_strategies(path: str, regret_score: int, params: dict) -> list:
    strategies = []
    
    # Custom strategies based on path
    if path == 'CREATIVE':
        strategies = [
            "Accumulate a liquid savings buffer of at least 9 months of living costs before transitioning full-time.",
            "Establish a 'Side-Hustle Bridge' model: retain main employment while devoting 15 hours/week to asset building.",
            "Schedule structured co-working block times to prevent isolation-driven depression loops."
        ]
    elif path == 'BUSINESS':
        strategies = [
            "Partner with a co-founder possessing complementary operational skills to balance pitching versus execution.",
            "Prioritize cash-flow neutrality and low customer acquisition costs over scaling operations prematurely.",
            "Implement a hard weekly boundary (e.g., Sunday digital detox) to block executive burnout."
        ]
    elif path == 'TECH':
        strategies = [
            "Redirect stable corporate surplus cash into funding personal creative projects or investment assets.",
            "Actively negotiate a hybrid or remote arrangement to restore weekday personal time.",
            "Participate in intrapreneurship or specialized R&D divisions to sustain innovation interest."
        ]
    elif path == 'LIFESTYLE':
        strategies = [
            "Run a 90-day trial sabbatical in the destination country before terminating domestic residential leases.",
            "Maintain a segregated emergency airfare and medical travel cash fund at all times.",
            "Structure consulting contracts to operate asynchronously to avoid timezone exhaustion."
        ]
    elif path == 'SOCIAL':
        strategies = [
            "Enforce a strict professional boundary, logging out of case dashboards at 5:00 PM to mitigate empathy fatigue.",
            "Focus employment search on large, well-funded institutions over cash-strapped grassroots organizations.",
            "Establish bi-weekly counseling or peer-review venting circles to buffer stress."
        ]
    else:
        strategies = [
            "Perform a career satisfaction audit every 12 months to verify the path remains aligned with priorities.",
            "Engage in structured hobby communities outside work to provide creative and emotional outlet."
        ]

    # Add general recommendation if regret is high
    if regret_score > 60:
        strategies.append("Due to your High Regret Risk profile, do not resign from your current path until a formal alternative offer is signed.")

    return strategies
