/**
 * ==========================================================
 * FUTUREFORGE AI - MULTI-AGENT LIFE SIMULATION ENGINE (v2)
 * ==========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- APPLICATION STATE ---
  const state = {
    compareMode: false,
    social: 'introvert',
    risk: 'moderate',
    priority: 'balance',
    decision: '',
    decisionA: '',
    decisionB: '',
    currentScenario: 'best',
    currentYear: 1,
    activeCompareDebateTab: 'a', // 'a' or 'b'
    activeCompareStoryTab: 'a',  // 'a' or 'b'
    simulationData: null,
    simulationDataB: null
  };

  // --- HTML DOM ELEMENTS ---
  const optionButtons = document.querySelectorAll('.option-btn');
  
  // Inputs
  const modeSingleBtn = document.getElementById('mode-single');
  const modeCompareBtn = document.getElementById('mode-compare');
  const singleInputWrapper = document.getElementById('single-input-wrapper');
  const compareInputWrapper = document.getElementById('compare-input-wrapper');
  
  const decisionInput = document.getElementById('decision-input');
  const decisionInputA = document.getElementById('decision-input-a');
  const decisionInputB = document.getElementById('decision-input-b');
  
  const charCount = document.getElementById('char-count');
  const charCountA = document.getElementById('char-count-a');
  const charCountB = document.getElementById('char-count-b');
  
  const forgeBtn = document.getElementById('forge-btn');
  const safetyAlert = document.getElementById('safety-alert');
  const safetyMsg = document.getElementById('safety-msg');
  
  // Panels
  const setupPanel = document.getElementById('setup-panel');
  const loadingPanel = document.getElementById('loading-panel');
  const loaderStatus = document.getElementById('loader-status');
  const dashboardPanel = document.getElementById('dashboard-panel');
  
  // Debate
  const debateTabsContainer = document.getElementById('debate-tabs-container');
  const tabPathA = document.getElementById('tab-path-a');
  const tabPathB = document.getElementById('tab-path-b');
  const debateChatContainer = document.getElementById('debate-chat-container');
  
  const verdictContainer = document.getElementById('decision-verdict-container');
  const verdictTitle = document.getElementById('verdict-title');
  const verdictBody = document.getElementById('verdict-body');
  
  const compareVerdictContainer = document.getElementById('compare-verdict-container');
  const verdictTitleA = document.getElementById('verdict-title-a');
  const verdictBodyA = document.getElementById('verdict-body-a');
  const verdictTitleB = document.getElementById('verdict-title-b');
  const verdictBodyB = document.getElementById('verdict-body-b');
  
  // Scenario & Timelines
  const scenarioToggles = document.querySelectorAll('.scenario-toggle');
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const trackProgress = document.getElementById('track-progress');
  
  const singleScenarioDetails = document.getElementById('single-scenario-details');
  const compareScenarioDetails = document.getElementById('compare-scenario-details');
  
  const singleScenarioMilestones = document.getElementById('single-scenario-milestones');
  const compareScenarioMilestones = document.getElementById('compare-scenario-milestones');
  
  const scenarioHeadline = document.getElementById('scenario-headline');
  const scenarioDesc = document.getElementById('scenario-desc');
  const milestoneText = document.getElementById('milestone-text');
  
  const scenarioHeadlineA = document.getElementById('scenario-headline-a');
  const scenarioDescA = document.getElementById('scenario-desc-a');
  const milestoneTextA = document.getElementById('milestone-text-a');
  
  const scenarioHeadlineB = document.getElementById('scenario-headline-b');
  const scenarioDescB = document.getElementById('scenario-desc-b');
  const milestoneTextB = document.getElementById('milestone-text-b');
  
  // Metrics (Single)
  const metricGrowth = document.getElementById('metric-growth');
  const metricStress = document.getElementById('metric-stress');
  const metricBurnout = document.getElementById('metric-burnout');
  const metricHappiness = document.getElementById('metric-happiness');
  
  const barGrowth = document.getElementById('bar-growth');
  const barStress = document.getElementById('bar-stress');
  const barBurnout = document.getElementById('bar-burnout');
  const barHappiness = document.getElementById('bar-happiness');
  
  // SVG Chart Plotter
  const trendSvg = document.getElementById('trend-svg');
  const pathGrowthA = document.getElementById('chart-path-growth-a');
  const pathBurnoutA = document.getElementById('chart-path-burnout-a');
  const pathGrowthB = document.getElementById('chart-path-growth-b');
  const pathBurnoutB = document.getElementById('chart-path-burnout-b');
  const chartDotsGroup = document.getElementById('chart-dots');
  const compareOnlyLabels = document.querySelectorAll('.compare-only');
  
  // Regret Engine
  const regretGaugesContainer = document.getElementById('regret-gauges-container');
  const gaugeUnitB = document.getElementById('gauge-unit-b');
  const regretGauge = document.getElementById('regret-gauge');
  const regretScoreText = document.getElementById('regret-score-text');
  const regretLevel = document.getElementById('regret-level');
  
  const regretGaugeB = document.getElementById('regret-gauge-b');
  const regretScoreTextB = document.getElementById('regret-score-text-b');
  const regretLevelB = document.getElementById('regret-level-b');
  
  const regretExplanation = document.getElementById('regret-explanation');
  const regretTriggersList = document.getElementById('regret-triggers-list');
  const playbookContent = document.getElementById('playbook-content');
  
  // Story Engine
  const storyTabsContainer = document.getElementById('story-tabs-container');
  const storyTabA = document.getElementById('story-tab-a');
  const storyTabB = document.getElementById('story-tab-b');
  const storyTextContainer = document.getElementById('story-text-container');
  const storyParagraph = document.getElementById('story-paragraph');
  const storyMetaLabel = document.getElementById('story-meta-label');
  
  // Controls
  const resetBtn = document.getElementById('reset-btn');
  const exportBtn = document.getElementById('export-btn');

  // Templates
  const tempBakery = document.getElementById('temp-bakery');
  const tempAbroad = document.getElementById('temp-abroad');
  const tempCorp = document.getElementById('temp-corp');
  const tempStartup = document.getElementById('temp-startup');

  // --- SAFETY REGEX / BLOCKWORDS ---
  const HARMFUL_PATTERNS = [
    /rob\b/i, /steal\b/i, /theft\b/i, /murder\b/i, /kill\b/i, /suicide\b/i, 
    /assault\b/i, /heist\b/i, /scam\b/i, /fraud\b/i, /hack\b.*government/i, 
    /hack\b.*bank/i, /cyberattack/i, /ransomware/i, /drug dealer/i, /cocaine/i, 
    /heroin/i, /meth\b/i, /extort/i, /bomb\b/i, /weapon\b.*illegal/i, 
    /human trafficking/i, /launder\b.*money/i, /cheat\b.*taxes/i, /tax evasion/i,
    /doxx/i, /harass/i, /blackmail/i
  ];

  // --- KEYWORD PATH DETECTORS ---
  const PATHS = {
    CREATIVE: ['write', 'novel', 'book', 'paint', 'art', 'music', 'acting', 'film', 'theatre', 'design', 'poetry', 'baking', 'bakery', 'chef', 'cooking', 'dance', 'hobby', 'freelance', 'photography', 'creative', 'craft'],
    BUSINESS: ['startup', 'founder', 'business', 'company', 'agency', 'product', 'launch', 'coffee shop', 'bakery', 'sell', 'market', 'invest', 'vc', 'equity', 'partnership', 'franchise', 'store', 'shop', 'ecommerce'],
    TECH: ['software', 'developer', 'engineer', 'tech', 'corporate', 'consulting', 'manager', 'coding', 'desk job', 'faang', 'marketing', 'finance', 'banking', 'office', 'algorithm', 'data science', 'it analyst'],
    LIFESTYLE: ['move', 'japan', 'tokyo', 'france', 'paris', 'travel', 'abroad', 'europe', 'countryside', 'remote', 'van life', 'digital nomad', 'quit', 'retire', 'sabbatical', 'relocate', 'nature'],
    SOCIAL: ['teach', 'english', 'school', 'education', 'public defender', 'law', 'community', 'volunteer', 'nonprofit', 'nurse', 'doctor', 'charity', 'social work', 'therapy', 'clinic', 'hospital']
  };

  // --- MODE SWITCHER ---
  modeSingleBtn.addEventListener('click', () => {
    modeCompareBtn.classList.remove('active');
    modeSingleBtn.classList.add('active');
    compareInputWrapper.classList.add('hidden');
    singleInputWrapper.classList.remove('hidden');
    state.compareMode = false;
  });

  modeCompareBtn.addEventListener('click', () => {
    modeSingleBtn.classList.remove('active');
    modeCompareBtn.classList.add('active');
    singleInputWrapper.classList.add('hidden');
    compareInputWrapper.classList.remove('hidden');
    state.compareMode = true;
  });

  // --- WIZARD HANDLERS ---
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const value = btn.getAttribute('data-value');
      
      const siblingButtons = document.querySelectorAll(`.option-btn[data-type="${type}"]`);
      siblingButtons.forEach(sib => sib.classList.remove('active'));
      btn.classList.add('active');
      
      state[type] = value;
    });
  });

  // --- TEXTAREA HANDLERS ---
  const handleInput = (elem, counter) => {
    elem.addEventListener('input', () => {
      counter.textContent = elem.value.length;
      safetyAlert.classList.add('hidden');
    });
  };
  handleInput(decisionInput, charCount);
  handleInput(decisionInputA, charCountA);
  handleInput(decisionInputB, charCountB);

  // --- TEMPLATES LOADER ---
  const applyTemplate = (textA, textB) => {
    safetyAlert.classList.add('hidden');
    if (!state.compareMode) {
      decisionInput.value = textA;
      charCount.textContent = textA.length;
    } else {
      decisionInputA.value = textA;
      charCountA.textContent = textA.length;
      decisionInputB.value = textB;
      charCountB.textContent = textB.length;
    }
  };

  tempBakery.addEventListener('click', () => applyTemplate(
    "Quit my corporate software engineering job to open an artisanal sourdough bakery in a small town.",
    "Stay in my corporate engineering role and negotiate a remote work agreement."
  ));
  tempAbroad.addEventListener('click', () => applyTemplate(
    "Move to Tokyo, Japan to teach English for a year to experience a new culture.",
    "Stay in my current marketing position in my home city."
  ));
  tempCorp.addEventListener('click', () => applyTemplate(
    "Reject a high-paying corporate law offer to work as a public defender helping the local community.",
    "Accept the corporate law firm contract to build financial security."
  ));
  tempStartup.addEventListener('click', () => applyTemplate(
    "Start an AI tech startup with my college classmates, raising VC funding and working 80 hours a week.",
    "Work as an AI specialist inside an established tech firm with standard hours."
  ));

  // --- SIMULATION TRIGGER ---
  forgeBtn.addEventListener('click', () => {
    let inputsToValidate = [];
    if (!state.compareMode) {
      inputsToValidate.push({ text: decisionInput.value.trim(), label: "Decision Input" });
    } else {
      inputsToValidate.push({ text: decisionInputA.value.trim(), label: "Path A" });
      inputsToValidate.push({ text: decisionInputB.value.trim(), label: "Path B" });
    }

    // Verify empty
    if (inputsToValidate.some(item => !item.text)) {
      alert('Please fill out all decision inputs before starting simulation.');
      return;
    }

    // Verify safety
    for (const item of inputsToValidate) {
      const isHarmful = HARMFUL_PATTERNS.some(regex => regex.test(item.text));
      if (isHarmful) {
        safetyMsg.textContent = `Your prompt in "${item.label}" was flagged by FutureForge Guardrails. We cannot simulate scenarios involving illegal activities, direct harm, or unethical professional endeavors. Please input a constructive life path.`;
        safetyAlert.classList.remove('hidden');
        return;
      }
    }

    // Save variables
    if (!state.compareMode) {
      state.decision = decisionInput.value.trim();
    } else {
      state.decisionA = decisionInputA.value.trim();
      state.decisionB = decisionInputB.value.trim();
    }

    startSimulationPipeline();
  });

  // --- RUN SIMULATION PIPELINE ---
  function startSimulationPipeline() {
    setupPanel.classList.add('hidden');
    loadingPanel.classList.remove('hidden');
    
    let progress = 0;
    const phrases = [
      "Analyzing life paths and extracting contextual parameters...",
      "Growth Agent projecting professional scaling models and salary curves...",
      "Risk Agent mapping occupational burnouts and volatility hazards...",
      "Happiness Agent balancing fulfillment variables and wellness constraints...",
      "Decision Agent synthesizing council opinions and compiling strategic advice..."
    ];
    
    const interval = setInterval(() => {
      if (progress < phrases.length) {
        loaderStatus.textContent = phrases[progress];
        progress++;
      } else {
        clearInterval(interval);
        generateSimulationData();
        renderDashboard();
      }
    }, 850);
  }

  // --- SIMULATION DATA COMPILATION ---
  function generateSimulationData() {
    // Helper to detect category path
    const getCategory = (text) => {
      const lower = text.toLowerCase();
      for (const [key, list] of Object.entries(PATHS)) {
        if (list.some(keyword => lower.includes(keyword))) return key;
      }
      return 'GENERAL';
    };

    if (!state.compareMode) {
      const path = getCategory(state.decision);
      state.simulationData = {
        path,
        debate: buildDebateData(path, state.decision, "A"),
        timeline: buildTimelineData(path),
        regret: calculateRegret(path, "A"),
        story: buildCinematicStory(path, "A")
      };
    } else {
      const pathA = getCategory(state.decisionA);
      const pathB = getCategory(state.decisionB);
      state.simulationData = {
        path: pathA,
        debate: buildDebateData(pathA, state.decisionA, "A"),
        timeline: buildTimelineData(pathA),
        regret: calculateRegret(pathA, "A"),
        story: buildCinematicStory(pathA, "A")
      };
      state.simulationDataB = {
        path: pathB,
        debate: buildDebateData(pathB, state.decisionB, "B"),
        timeline: buildTimelineData(pathB),
        regret: calculateRegret(pathB, "B"),
        story: buildCinematicStory(pathB, "B")
      };
    }
  }

  // --- RENDER SIMULATION PANEL ---
  function renderDashboard() {
    loadingPanel.classList.add('hidden');
    dashboardPanel.classList.remove('hidden');
    
    // Clear chat console
    debateChatContainer.innerHTML = '';
    
    // Adjust layout elements for Single vs Compare Mode
    if (!state.compareMode) {
      debateTabsContainer.classList.add('hidden');
      verdictContainer.classList.add('hidden');
      compareVerdictContainer.classList.add('hidden');
      
      singleScenarioDetails.classList.remove('hidden');
      compareScenarioDetails.classList.add('hidden');
      singleScenarioMilestones.classList.remove('hidden');
      compareScenarioMilestones.classList.add('hidden');
      
      storyTabsContainer.classList.add('hidden');
      
      // Hide compare items on chart legend
      compareOnlyLabels.forEach(el => el.classList.add('hidden'));
      gaugeUnitB.classList.add('hidden');
      
      // Hide Path B chart paths
      pathGrowthB.classList.add('hidden');
      pathBurnoutB.classList.add('hidden');
      
      // Trigger Single Debate sequence
      animateDebateLogs(state.simulationData.debate, () => {
        verdictTitle.textContent = state.simulationData.debate.verdict.title;
        verdictBody.textContent = state.simulationData.debate.verdict.body;
        verdictContainer.classList.remove('hidden');
        debateChatContainer.scrollTop = debateChatContainer.scrollHeight;
        
        loadLayoutData();
      });
      
    } else {
      debateTabsContainer.classList.remove('hidden');
      verdictContainer.classList.add('hidden');
      compareVerdictContainer.classList.add('hidden');
      
      singleScenarioDetails.classList.add('hidden');
      compareScenarioDetails.classList.remove('hidden');
      singleScenarioMilestones.classList.add('hidden');
      compareScenarioMilestones.classList.remove('hidden');
      
      storyTabsContainer.classList.remove('hidden');
      
      // Show compare items on chart legend
      compareOnlyLabels.forEach(el => el.classList.remove('hidden'));
      gaugeUnitB.classList.remove('hidden');
      
      // Show Path B chart paths
      pathGrowthB.classList.remove('hidden');
      pathBurnoutB.classList.remove('hidden');
      
      // Active states defaults
      state.activeCompareDebateTab = 'a';
      state.activeCompareStoryTab = 'a';
      tabPathA.classList.add('active');
      tabPathB.classList.remove('active');
      storyTabA.classList.add('active');
      storyTabB.classList.remove('active');
      
      // Simulate Path A debate log initially
      animateDebateLogs(state.simulationData.debate, () => {
        // Show both consensus verdict boxes side-by-side
        verdictTitleA.textContent = state.simulationData.debate.verdict.title;
        verdictBodyA.textContent = state.simulationData.debate.verdict.body;
        verdictTitleB.textContent = state.simulationDataB.debate.verdict.title;
        verdictBodyB.textContent = state.simulationDataB.debate.verdict.body;
        compareVerdictContainer.classList.remove('hidden');
        debateChatContainer.scrollTop = debateChatContainer.scrollHeight;
        
        loadLayoutData();
      });
    }
  }

  // --- ANIMATE DEBATE CONSOLE ---
  function animateDebateLogs(debateData, onComplete) {
    let index = 0;
    debateChatContainer.innerHTML = '';
    
    function showNext() {
      if (index < debateData.messages.length) {
        const msg = debateData.messages[index];
        const bubble = document.createElement('div');
        bubble.className = 'debate-msg';
        
        let avatarClass = 'growth-avatar';
        let nameColorClass = 'growth-text';
        let tagClass = 'growth-tag';
        
        if (msg.agent === 'Risk Agent') {
          avatarClass = 'risk-avatar';
          nameColorClass = 'risk-text';
          tagClass = 'risk-tag';
        } else if (msg.agent === 'Happiness Agent') {
          avatarClass = 'happiness-avatar';
          nameColorClass = 'happiness-text';
          tagClass = 'happiness-tag';
        } else if (msg.agent === 'Decision Agent') {
          avatarClass = 'decision-avatar';
          nameColorClass = 'decision-text';
          tagClass = 'decision-tag';
        }
        
        bubble.innerHTML = `
          <div class="agent-avatar ${avatarClass}">${msg.emoji}</div>
          <div class="msg-bubble">
            <div class="msg-header">
              <span class="agent-name ${nameColorClass}">${msg.agent}</span>
              <span class="agent-tag ${tagClass}">${msg.role}</span>
            </div>
            <div class="msg-body">${msg.content}</div>
          </div>
        `;
        
        debateChatContainer.appendChild(bubble);
        debateChatContainer.scrollTop = debateChatContainer.scrollHeight;
        index++;
        setTimeout(showNext, 1200);
      } else {
        if (onComplete) onComplete();
      }
    }
    showNext();
  }

  // --- LOADS ALL DASHBOARD SEGMENTS ---
  function loadLayoutData() {
    updateTimelineDisplay();
    updateRegretDisplay();
    generatePlaybookChecklist();
    typewriteStory();
  }

  // --- TIMELINE DISPLAY HANDLER ---
  function updateTimelineDisplay() {
    const dataA = state.simulationData.timeline[state.currentScenario][`year${state.currentYear}`];
    
    // SVG coordinate mapping configuration
    // width: 400 (50 to 450), height: 160 (20 to 180).
    const xCoords = { year1: 50, year3: 250, year5: 450 };
    const getY = (val) => 180 - (val / 100 * 160);

    if (!state.compareMode) {
      // 1. Update text metrics
      scenarioHeadline.textContent = dataA.headline;
      scenarioDesc.textContent = dataA.desc;
      milestoneText.textContent = dataA.milestone;
      
      metricGrowth.textContent = `${dataA.metrics.growth}%`;
      metricStress.textContent = `${dataA.metrics.stress}%`;
      metricBurnout.textContent = `${dataA.metrics.burnout}%`;
      metricHappiness.textContent = `${dataA.metrics.happiness}%`;
      
      barGrowth.style.width = `${dataA.metrics.growth}%`;
      barStress.style.width = `${dataA.metrics.stress}%`;
      barBurnout.style.width = `${dataA.metrics.burnout}%`;
      barHappiness.style.width = `${dataA.metrics.happiness}%`;
      
      // 2. Draw SVG Trend Chart Path (Path A)
      const dataY1 = state.simulationData.timeline[state.currentScenario].year1.metrics;
      const dataY3 = state.simulationData.timeline[state.currentScenario].year3.metrics;
      const dataY5 = state.simulationData.timeline[state.currentScenario].year5.metrics;
      
      pathGrowthA.setAttribute('d', `M 50 ${getY(dataY1.growth)} L 250 ${getY(dataY3.growth)} L 450 ${getY(dataY5.growth)}`);
      pathBurnoutA.setAttribute('d', `M 50 ${getY(dataY1.burnout)} L 250 ${getY(dataY3.burnout)} L 450 ${getY(dataY5.burnout)}`);
      
      // 3. Highlight Selected timeline dots on chart
      const activeData = dataA.metrics;
      chartDotsGroup.innerHTML = `
        <circle cx="${xCoords[`year${state.currentYear}`]}" cy="${getY(activeData.growth)}" r="6" fill="#000" stroke="var(--color-growth)" stroke-width="3" />
        <circle cx="${xCoords[`year${state.currentYear}`]}" cy="${getY(activeData.burnout)}" r="6" fill="#000" stroke="var(--color-risk)" stroke-width="3" />
      `;

    } else {
      const dataB = state.simulationDataB.timeline[state.currentScenario][`year${state.currentYear}`];
      
      scenarioHeadlineA.textContent = dataA.headline;
      scenarioDescA.textContent = dataA.desc;
      milestoneTextA.textContent = dataA.milestone;
      
      scenarioHeadlineB.textContent = dataB.headline;
      scenarioDescB.textContent = dataB.desc;
      milestoneTextB.textContent = dataB.milestone;
      
      // Draw SVG Trend paths (Path A & Path B)
      const dataY1A = state.simulationData.timeline[state.currentScenario].year1.metrics;
      const dataY3A = state.simulationData.timeline[state.currentScenario].year3.metrics;
      const dataY5A = state.simulationData.timeline[state.currentScenario].year5.metrics;
      
      const dataY1B = state.simulationDataB.timeline[state.currentScenario].year1.metrics;
      const dataY3B = state.simulationDataB.timeline[state.currentScenario].year3.metrics;
      const dataY5B = state.simulationDataB.timeline[state.currentScenario].year5.metrics;
      
      pathGrowthA.setAttribute('d', `M 50 ${getY(dataY1A.growth)} L 250 ${getY(dataY3A.growth)} L 450 ${getY(dataY5A.growth)}`);
      pathBurnoutA.setAttribute('d', `M 50 ${getY(dataY1A.burnout)} L 250 ${getY(dataY3A.burnout)} L 450 ${getY(dataY5A.burnout)}`);
      
      pathGrowthB.setAttribute('d', `M 50 ${getY(dataY1B.growth)} L 250 ${getY(dataY3B.growth)} L 450 ${getY(dataY5B.growth)}`);
      pathBurnoutB.setAttribute('d', `M 50 ${getY(dataY1B.burnout)} L 250 ${getY(dataY3B.burnout)} L 450 ${getY(dataY5B.burnout)}`);
      
      // Highlight dots for both paths at selected year
      chartDotsGroup.innerHTML = `
        <circle cx="${xCoords[`year${state.currentYear}`]}" cy="${getY(dataA.metrics.growth)}" r="6" fill="#000" stroke="var(--color-growth)" stroke-width="3" />
        <circle cx="${xCoords[`year${state.currentYear}`]}" cy="${getY(dataA.metrics.burnout)}" r="6" fill="#000" stroke="var(--color-risk)" stroke-width="3" />
        <circle cx="${xCoords[`year${state.currentYear}`]}" cy="${getY(dataB.metrics.growth)}" r="6" fill="#000" stroke="var(--color-happiness)" stroke-width="3" />
        <circle cx="${xCoords[`year${state.currentYear}`]}" cy="${getY(dataB.metrics.burnout)}" r="6" fill="#000" stroke="var(--color-primary)" stroke-width="3" />
      `;
    }

    // Set timeline progress stepper line
    let fillPct = '0%';
    if (state.currentYear === 3) fillPct = '50%';
    if (state.currentYear === 5) fillPct = '100%';
    trackProgress.style.width = fillPct;
    
    timelineNodes.forEach(node => {
      const yr = parseInt(node.getAttribute('data-year'));
      if (yr === state.currentYear) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }

  // --- REGRET SCORE DISPLAY ---
  function updateRegretDisplay() {
    const rA = state.simulationData.regret;
    const circ = 2 * Math.PI * 50;
    
    // Set Path A Gauge
    regretScoreText.textContent = `${rA.score}%`;
    regretGauge.style.strokeDashoffset = circ - (rA.score / 100 * circ);
    regretLevel.textContent = rA.level;
    
    if (!state.compareMode) {
      regretExplanation.textContent = rA.explanation;
      
      regretTriggersList.innerHTML = '';
      rA.triggers.forEach(tr => {
        const li = document.createElement('li');
        li.textContent = tr;
        regretTriggersList.appendChild(li);
      });
    } else {
      const rB = state.simulationDataB.regret;
      
      // Set Path B Gauge
      regretScoreTextB.textContent = `${rB.score}%`;
      regretGaugeB.style.strokeDashoffset = circ - (rB.score / 100 * circ);
      regretLevelB.textContent = rB.level;
      
      // Compare description synthesis
      regretExplanation.textContent = `Path A shows a ${rA.score}% regret risk (${rA.level}), primarily due to mismatches in stabilizer rules. Path B evaluates at a ${rB.score}% regret risk (${rB.level}).`;
      
      regretTriggersList.innerHTML = '';
      const comboTriggers = [
        `[Path A Trigger] ${rA.triggers[0] || 'Lack of operational buffer'}`,
        `[Path B Trigger] ${rB.triggers[0] || 'Career progression fatigue'}`
      ];
      comboTriggers.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        regretTriggersList.appendChild(li);
      });
    }
  }

  // --- STRATEGIC PLAYBOOK CHECKLIST GENERATION ---
  function generatePlaybookChecklist() {
    playbookContent.innerHTML = '';
    const items = [];
    
    // Strategy based on priority motivator
    if (state.priority === 'stability') {
      items.push({
        title: "Secure capital reserves (6 months buffer)",
        desc: "Protect against early cash-flow drops to avoid survival panic."
      });
      items.push({
        title: "Consult local accounting / tax structures",
        desc: "Optimize business filings and retirement tax deductions immediately."
      });
    } else if (state.priority === 'passion') {
      items.push({
        title: "Schedule independent asset building hours",
        desc: "Block out weekly hours exclusively for creator tasks outside standard demands."
      });
      items.push({
        title: "Initiate audience feedback aggregates",
        desc: "Publish drafts early to prevent isolated validation traps."
      });
    } else { // Balance
      items.push({
        title: "Enforce a hard log-off curfew (6:00 PM)",
        desc: "Schedule physical blocks to prevent business overlap into leisure hours."
      });
      items.push({
        title: "Pre-book 2 wellness weekends per quarter",
        desc: "Guarantees offline mental recovery cycles to combat progressive burnout."
      });
    }

    // Strategy based on risk appetite
    if (state.risk === 'low') {
      items.push({
        title: "Formulate a secondary retreat fallback path",
        desc: "Secure contractual triggers allowing you to return to stable jobs if margins default."
      });
    } else if (state.risk === 'high') {
      items.push({
        title: "Establish a strict liabilities maximum threshold",
        desc: "Draw a red line on personal credit and co-signs to protect long-term assets."
      });
    } else { // Moderate
      items.push({
        title: "Establish co-owner agreements / skill sharing",
        desc: "De-risk operational stress loops by introducing partners with opposite skills."
      });
    }

    // Strategy based on social style
    if (state.social === 'introvert') {
      items.push({
        title: "Integrate high-focus quiet zones in your calendar",
        desc: "Avoid retail administrative burn by planning blocks of alone work."
      });
    } else { // Extrovert
      items.push({
        title: "Schedule active external networking meetups",
        desc: "Bypass workspace isolation by holding meetings in community hubs."
      });
    }

    // Render Playbook Elements
    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'playbook-item';
      card.innerHTML = `
        <div class="playbook-checkbox" data-index="${index}">✓</div>
        <div class="playbook-text-col">
          <span class="playbook-item-title">${item.title}</span>
          <span class="playbook-item-desc">${item.desc}</span>
        </div>
      `;
      
      const checkbox = card.querySelector('.playbook-checkbox');
      card.addEventListener('click', () => {
        card.classList.toggle('checked');
      });
      
      playbookContent.appendChild(card);
    });
  }

  // --- TYPEWRITER CINEMATIC STORYTELLING ---
  let typeTimer = null;
  function typewriteStory() {
    if (typeTimer) clearInterval(typeTimer);
    
    let storyStr = "";
    if (!state.compareMode) {
      storyStr = state.simulationData.story;
      storyMetaLabel.textContent = `DIARY LOG: FUTURE VERSE (DECISION PATH)`;
    } else {
      if (state.activeCompareStoryTab === 'a') {
        storyStr = state.simulationData.story;
        storyMetaLabel.textContent = `DIARY LOG: ALTERNATE PATH A (PROPOSED)`;
      } else {
        storyStr = state.simulationDataB.story;
        storyMetaLabel.textContent = `DIARY LOG: ALTERNATE PATH B (STATUS QUO)`;
      }
    }
    
    storyParagraph.textContent = '';
    let index = 0;
    
    typeTimer = setInterval(() => {
      if (index < storyStr.length) {
        storyParagraph.textContent += storyStr.charAt(index);
        index++;
        storyTextContainer.scrollTop = storyTextContainer.scrollHeight;
      } else {
        clearInterval(typeTimer);
      }
    }, 12);
  }

  // --- COMPARISON DEBATE TAB SWITCHER ---
  tabPathA.addEventListener('click', () => {
    if (state.activeCompareDebateTab === 'a') return;
    state.activeCompareDebateTab = 'a';
    tabPathA.classList.add('active');
    tabPathB.classList.remove('active');
    animateDebateLogs(state.simulationData.debate);
  });

  tabPathB.addEventListener('click', () => {
    if (state.activeCompareDebateTab === 'b') return;
    state.activeCompareDebateTab = 'b';
    tabPathB.classList.add('active');
    tabPathA.classList.remove('active');
    animateDebateLogs(state.simulationDataB.debate);
  });

  // --- COMPARISON STORY TAB SWITCHER ---
  storyTabA.addEventListener('click', () => {
    if (state.activeCompareStoryTab === 'a') return;
    state.activeCompareStoryTab = 'a';
    storyTabA.classList.add('active');
    storyTabB.classList.remove('active');
    typewriteStory();
  });

  storyTabB.addEventListener('click', () => {
    if (state.activeCompareStoryTab === 'b') return;
    state.activeCompareStoryTab = 'b';
    storyTabB.classList.add('active');
    storyTabA.classList.remove('active');
    typewriteStory();
  });

  // --- SCENARIO SELECTOR SWITCH ---
  scenarioToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      scenarioToggles.forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');
      
      state.currentScenario = toggle.getAttribute('data-scenario');
      updateTimelineDisplay();
    });
  });

  // --- TIMELINE STEPPER CLICK ---
  timelineNodes.forEach(node => {
    node.addEventListener('click', () => {
      state.currentYear = parseInt(node.getAttribute('data-year'));
      updateTimelineDisplay();
    });
  });

  // --- RESET SYSTEM ---
  resetBtn.addEventListener('click', () => {
    state.decision = '';
    state.decisionA = '';
    state.decisionB = '';
    decisionInput.value = '';
    decisionInputA.value = '';
    decisionInputB.value = '';
    charCount.textContent = '0';
    charCountA.textContent = '0';
    charCountB.textContent = '0';
    
    dashboardPanel.classList.add('hidden');
    setupPanel.classList.remove('hidden');
    
    if (typeTimer) clearInterval(typeTimer);
    storyParagraph.textContent = '';
    debateChatContainer.innerHTML = '';
  });

  // --- REPORT EXPORTER (.txt file download) ---
  exportBtn.addEventListener('click', () => {
    const simA = state.simulationData;
    const simB = state.simulationDataB;
    const d = new Date();
    
    let reportText = `==========================================================
FUTUREFORGE AI SIMULATION REPORT
Generated on: ${d.toLocaleDateString()} at ${d.toLocaleTimeString()}
==========================================================

USER PROFILE:
- Social Energy: ${state.social.toUpperCase()}
- Risk Threshold: ${state.risk.toUpperCase()}
- Primary Driver: ${state.priority.toUpperCase()}

`;

    if (!state.compareMode) {
      reportText += `DECISION UNDER SIMULATION:
"${state.decision}"

==========================================================
AGENT CONSULTATIVE DEBATE LOG
==========================================================
`;
      simA.debate.messages.forEach(m => {
        reportText += `\n[${m.agent.toUpperCase()} - ${m.role}]\n"${m.content}"\n`;
      });

      reportText += `\n[FINAL CONSENSUS VERDICT: ${simA.debate.verdict.title.toUpperCase()}]\n${simA.debate.verdict.body}\n`;

      reportText += `
==========================================================
REGRET ENGINE ANALYSIS
==========================================================
Future Regret Score: ${simA.regret.score}% (${simA.regret.level})
Insight: ${simA.regret.explanation}

Critical Regret Triggers:
`;
      simA.regret.triggers.forEach(t => {
        reportText += `- ${t}\n`;
      });

      reportText += `
==========================================================
CINEMATIC FUTURE CHRONICLE
==========================================================
${simA.story}
`;
    } else {
      reportText += `COMPARED DECISION PATHWAYS:
[Path A (Proposed Move)]: "${state.decisionA}"
[Path B (Status Quo)]: "${state.decisionB}"

==========================================================
PATH A AGENT CONSULTATIVE DEBATE LOG
==========================================================
`;
      simA.debate.messages.forEach(m => {
        reportText += `\n[${m.agent.toUpperCase()} - ${m.role}]\n"${m.content}"\n`;
      });
      reportText += `\n[PATH A VERDICT]: ${simA.debate.verdict.title.toUpperCase()}\n${simA.debate.verdict.body}\n`;

      reportText += `
==========================================================
PATH B AGENT CONSULTATIVE DEBATE LOG
==========================================================
`;
      if (simB) {
        simB.debate.messages.forEach(m => {
          reportText += `\n[${m.agent.toUpperCase()} - ${m.role}]\n"${m.content}"\n`;
        });
        reportText += `\n[PATH B VERDICT]: ${simB.debate.verdict.title.toUpperCase()}\n${simB.debate.verdict.body}\n`;
      }

      reportText += `
==========================================================
REGRET ENGINE COMPARISONS
==========================================================
Path A Regret Score: ${simA.regret.score}% (${simA.regret.level})
Path B Regret Score: ${simB ? simB.regret.score : 0}% (${simB ? simB.regret.level : 'N/A'})

Primary Regret Triggers:
- Path A: ${simA.regret.triggers[0] || 'None'}
- Path B: ${simB ? (simB.regret.triggers[0] || 'None') : 'None'}

==========================================================
CINEMATIC PATH A CHRONICLE
==========================================================
${simA.story}

==========================================================
CINEMATIC PATH B CHRONICLE
==========================================================
${simB ? simB.story : 'N/A'}
`;
    }

    reportText += `
==========================================================
Disclaimer: FutureForge AI simulations are generated based on personality weights and contextual logic models. Actual outcomes may vary. Forge responsibly.
==========================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `FutureForge_Simulation_${d.getFullYear()}${d.getMonth()+1}${d.getDate()}.txt`;
    link.click();
  });


  // ==========================================================
  // DEBATE CONVERSATION BUILDERS
  // ==========================================================
  function buildDebateData(path, decision, label) {
    const isIntrovert = state.social === 'introvert';
    const isRiskTaker = state.risk === 'high';
    const isRiskAverse = state.risk === 'low';
    const isPassion = state.priority === 'passion';
    const isStability = state.priority === 'stability';

    let growthMsg = "";
    let riskMsg = "";
    let happinessMsg = "";
    let verdictTitleStr = "";
    let verdictBodyStr = "";

    switch (path) {
      case 'CREATIVE':
        growthMsg = `Pursuing a creative track represents highly asymmetric upside, but severely unpredictable baseline stability. Historically, only the top 5% of independent creators hit high-earning milestones quickly. However, by leveraging modern digital distribution and community-building, you can establish an intellectual asset class that compounds value significantly by Year 3. The data shows that if you survive the initial 24 months, the ceiling for wealth is technically uncapped. If you seek Stability, however, this pathway introduces high volatility which threatens capital continuity.`;
        riskMsg = `I must issue a strong warning against relying on "uncapped ceilings." Creative freelance paths lead to severe cognitive isolation—especially for an ${isIntrovert ? 'Introvert' : 'Extrovert'}—and acute financial strain. The anxiety of uneven cash flow, combined with public critique and algorithmic unpredictability, pushes the burnout risk index to nearly 78% in Year 1. Since your risk profile is ${state.risk.toUpperCase()}, this level of volatility is very likely to trigger critical stress loops that can permanently damage your creative drive.`;
        happinessMsg = `Growth and Risk are focusing purely on metrics that ignore the intrinsic utility of soul-aligned labor. If your core driver is ${isPassion ? 'Passion' : 'Balance'}, the act of writing or painting fulfills human self-actualization far more than standard corporate tasks. Working in isolation suits an ${isIntrovert ? 'Introvert perfectly, allowing you to recharge your focus energy without office politics' : 'Extrovert, provided you actively schedule networking coffee chats to prevent loneliness'}. The fulfillment index will spike massively, which often provides the resilience needed to survive those early poverty thresholds.`;
        
        if (isStability || isRiskAverse) {
          verdictTitleStr = "Deferred Launch (Side-Hustle Model)";
          verdictBodyStr = `After synthesizing the council's input, the consensus suggests you DO NOT leap into "${decision.substring(0, 40)}..." full-time. The risk profile is too misaligned with your security needs. We advise building your assets during off-hours, transitioning only after achieving stable, recurring micro-revenue.`;
        } else {
          verdictTitleStr = "Aggressive Creative Shift";
          verdictBodyStr = `Your psychological profile supports a direct launch into "${decision.substring(0, 40)}...". The potential for deep fulfillment outweighs the statistical risks. Secure 6 months of living buffer, establish high-focus workspaces, and aggressively pursue audience aggregation to offset early volatility.`;
        }
        break;

      case 'BUSINESS':
        growthMsg = `Entrepreneurship is the ultimate engine for wealth creation. By establishing equity, you control a scalable system rather than trading linear labor hours for wages. With calculated marketing and strategic early hiring, revenue growth is simulated to reach strong profitability by Year 3. For an ${isIntrovert ? 'Introvert' : 'Extrovert'}, scaling requires constructing key management and delegation channels early, but the potential wealth ceiling is unlimited. This is where generational wealth is built.`;
        riskMsg = `Let's look at the actual survival rates: 90% of new projects dissolve within 5 years. You will face intense customer-facing demands, relentless capital calls, and constant regulatory threats. Since you are ${isRiskAverse ? 'Risk-Averse' : 'a Risk-Taker'}, this is a ${isRiskAverse ? 'highly stressful, unsustainable nightmare' : 'viable playground, though still incredibly dangerous'} path. Working 80-hour weeks will push your burnout risk to maximum thresholds by Year 3, severely impacting your physical health.`;
        happinessMsg = `Fulfillment in business comes from absolute autonomy and seeing your vision materialize. However, if your goal is ${isStability ? 'Stability' : 'Life Balance'}, starting this venture will cannibalize your relationships, hobbies, and health. As an ${isIntrovert ? 'Introvert, pitching to VCs, selling to clients, and managing employees will drain you daily' : 'Extrovert, you will thrive in sales and community building, fueling your wellness scores'}. Autonomy is high, but personal balance is virtually zero in the first 36 months.`;
        
        if (isRiskTaker && (isPassion || isStability)) {
          verdictTitleStr = "Venture Accelerate Option";
          verdictBodyStr = `You possess the threshold resilience metrics to absorb startup shocks for "${decision.substring(0, 40)}...". The council advises proceeding with maximum velocity. Partner with complementary skill sets and prioritize securing early capital to offset operational stress.`;
        } else {
          verdictTitleStr = "Bootstrap / Slow Forge Route";
          verdictBodyStr = `A high-leverage venture for "${decision.substring(0, 40)}..." will crush your wellness baseline. We recommend a slow, bootstrapped micro-business model, or starting this venture as a partnership where co-founders share the immense pressure.`;
        }
        break;

      case 'TECH':
        growthMsg = `Tech and corporate roles offer structured upward mobility, robust starting compensation packages, and high-value resume accolades. Growth is highly predictable, compounding at 10-15% annually through standard promotion cycles. For an ${isPassion ? 'art-focused profile' : 'industry veteran'}, corporate structures optimize financial capital efficiently, allowing you to fund external investments or passions without cash-flow anxiety.`;
        riskMsg = `Do not overlook the golden handcuffs and corporate drag. The risk here isn't financial failure, but rather psychological stagnation and cognitive burnout due to toxic corporate politics, endless meetings, and lack of autonomy. Stress indices scale progressively towards Year 3. Since your driver is ${state.priority.toUpperCase()}, you will feel locked in a hamster wheel if the daily tasks do not align with your core values.`;
        happinessMsg = `Corporate paths offer safety, enabling high Life Balance if strict boundaries are set. However, an ${isIntrovert ? 'Introvert will find endless corporate meetings and open-plan offices exhausting, requiring strong boundaries to survive' : 'Extrovert will thrive in cross-functional team roles, utilizing office dynamics and team wins for positive motivation'}. If you pursue Passion, this path risks feeling hollow, leading to a severe mid-life regret crisis.`;
        
        if (isPassion && !isRiskAverse) {
          verdictTitleStr = "Corporate Sabbatical or Intrapreneurship";
          verdictBodyStr = `Use the stable income from "${decision.substring(0, 40)}..." to finance your true passions. If corporate stagnation exceeds 60%, negotiate a shift to a highly specialized remote role or transition to high-impact, autonomous projects within the firm.`;
        } else {
          verdictTitleStr = "Optimize & Scale Upward";
          verdictBodyStr = `This tech/corporate path for "${decision.substring(0, 40)}..." is highly aligned with your need for stability. Maximize income early, set strict boundaries to avoid burnout, and allocate 20% of income to independent investment portfolios to build ultimate freedom.`;
        }
        break;

      case 'LIFESTYLE':
        growthMsg = `Relocating or transitioning to a nomadic life model will likely depress immediate linear career growth by 20-30% due to local networking gaps and time zone friction. However, the cultural adaptation gains, resilience building, and language acquisition represent high-value soft skill growth that compounds in global market networks by Year 5, opening doors you can't currently foresee.`;
        riskMsg = `Relocation stress is extremely high and often underestimated. Adapting to complex visa rules, foreign tax structures, and local logistics introduces massive volatility. For an ${isIntrovert ? 'Introvert, building a brand new social circle from scratch in a foreign tongue is intimidating and deeply isolating' : 'Extrovert, you will suffer from transient networking fatigue and the painful lack of deep, long-term community roots'}. Burnout from sheer logistical friction is high in the first 12 months.`;
        happinessMsg = `This is where lifestyle optimization truly shines! If your driver is ${isPassion ? 'Passion or Balance' : 'Stability'}, stepping drastically out of your comfort zone will expand your cognitive elasticity. The mental stimulation of foreign environments, new foods, and diverse cultures is simulated to raise life satisfaction indexes to peak levels of 85% by Year 3, provided you survive the initial culture shock.`;
        
        if (isRiskAverse) {
          verdictTitleStr = "Hybrid Sabbatical (Trial Relocation)";
          verdictBodyStr = `Do not burn your local bridges for "${decision.substring(0, 40)}..." just yet. The council advises arranging a 2-to-3 month remote trial in the target destination first to test your integration resilience before making permanent, costly relocation commitments.`;
        } else {
          verdictTitleStr = "Full Relocation & Launch";
          verdictBodyStr = `Proceed with relocation plans for "${decision.substring(0, 40)}..." immediately. The cognitive reset and perspective shift are highly compatible with your growth model. Focus on immediate local integration and community building from Day 1.`;
        }
        break;

      case 'SOCIAL':
        growthMsg = `Education, public sector, and community roles offer moderate salaries and relatively flat career progression. The financial ceiling is low, and your primary reward is social utility rather than equity appreciation. By Year 5, you will likely reach stable but hard salary caps, requiring careful secondary budgeting and long-term financial planning to ensure retirement security.`;
        riskMsg = `The public sector is notorious for chronic systemic exhaustion. You will deal with underfunded resources, emotional empathy fatigue, and glacial administrative bureaucracy. Stress levels scale heavily over time. For an ${isIntrovert ? 'Introvert' : 'Extrovert'}, dealing with public distress daily leads to rapid empathy burnout by Year 3, often resulting in complete sector abandonment.`;
        happinessMsg = `Despite the stress, this path holds the absolute highest human fulfillment scores. Doing work that directly alters human lives for the better aligns perfectly with ${isPassion ? 'Passion' : 'Balance'} drivers. As an ${isIntrovert ? 'Introvert, you will build deep, meaningful one-on-one client relationships that sustain you' : 'Extrovert, you will create powerful community coalitions, driving high systemic happiness scores'}.`;
        
        if (isStability) {
          verdictTitleStr = "Structured Institutional Placement";
          verdictBodyStr = `To satisfy your Stability driver in "${decision.substring(0, 40)}...", seek positions in established universities, large NGOs, or stable civil service positions. Avoid low-funded startup non-profits which introduce unacceptable stress and financial risk.`;
        } else {
          verdictTitleStr = "Direct Community Integration";
          verdictBodyStr = `Maximize impact for "${decision.substring(0, 40)}..." by choosing grassroots organizations or direct public defense. Protect yourself from inevitable empathy fatigue by implementing strict emotional boundaries and robust out-of-office wellness cycles.`;
        }
        break;

      default: // GENERAL
        growthMsg = `This decision offers standard, linear growth patterns. You will see solid skill development in the first 2 years, reaching a steady promotion rhythm by Year 5 with average but reliable salary gains. It's a foundational move.`;
        riskMsg = `Every change brings friction. Adjusting to a new routine, boss, or market segment carries a 30% volatility index. Monitor your hours closely to prevent early burnout. Since your risk profile is ${state.risk.toUpperCase()}, ensure you don't overextend your financial buffers during the transition period.`;
        happinessMsg = `Fulfillment will depend heavily on your day-to-day work environment and the people you surround yourself with. If you prioritize ${state.priority.toUpperCase()}, ensure you align this choice with your core interests to keep daily satisfaction levels above critical baselines.`;
        
        verdictTitleStr = "Balanced Adaptation Model";
        verdictBodyStr = `Execute this shift for "${decision.substring(0, 40)}..." by retaining a stable financial buffer. Map out your core values and verify that this path satisfies at least two of your priority metrics before fully committing your time and capital.`;
        break;
    }

    return {
      messages: [
        {
          agent: 'Growth Agent',
          role: 'Success & Market Forecaster',
          emoji: '📈',
          content: `Evaluating path [${label}]: "${decision}". ${growthMsg}`
        },
        {
          agent: 'Risk Agent',
          role: 'Stress & Volatility Inspector',
          emoji: '🛡️',
          content: `Analyzing the downside of path [${label}]. ${riskMsg}`
        },
        {
          agent: 'Happiness Agent',
          role: 'Wellness & Satisfaction Analyst',
          emoji: '💖',
          content: `Let's balance those numbers against actual human utility. ${happinessMsg}`
        },
        {
          agent: 'Decision Agent',
          role: 'Synthesis & Consensus Council',
          emoji: '⚖️',
          content: `Weighted recommendation coefficients applied. Model calibrated for an ${state.social.toUpperCase()} profile, with a ${state.risk.toUpperCase()} risk threshold, driven by ${state.priority.toUpperCase()}. Ready to synthesize verdict.`
        }
      ],
      verdict: {
        title: verdictTitleStr,
        body: verdictBodyStr
      }
    };
  }

  // ==========================================================
  // TIMELINE DATA BUILDERS (Generates Year 1, 3, 5 outcomes)
  // ==========================================================
  function buildTimelineData(path) {
    const isIntrovert = state.social === 'introvert';
    const isRiskTaker = state.risk === 'high';
    const isRiskAverse = state.risk === 'low';
    const isPassion = state.priority === 'passion';
    const isStability = state.priority === 'stability';

    function getMetrics(scenario, year, baseGrowth, baseStress, baseBurnout, baseHappiness) {
      let growthModifier = 0;
      let stressModifier = 0;
      let burnoutModifier = 0;
      let happinessModifier = 0;

      if (scenario === 'best') {
        growthModifier += 15;
        stressModifier -= 10;
        burnoutModifier -= 10;
        happinessModifier += 15;
      } else if (scenario === 'worst') {
        growthModifier -= 25;
        stressModifier += 20;
        burnoutModifier += 20;
        happinessModifier -= 25;
      }

      if (year === 3) {
        growthModifier += 10;
        stressModifier += 5;
        happinessModifier += 5;
      } else if (year === 5) {
        growthModifier += 20;
        stressModifier -= 5;
        burnoutModifier -= 5;
        happinessModifier += 10;
      }

      if (isRiskTaker) {
        growthModifier += 8;
        stressModifier += 10;
        burnoutModifier += 8;
      } else if (isRiskAverse) {
        growthModifier -= 10;
        stressModifier -= 12;
        burnoutModifier -= 8;
      }

      if (isPassion) {
        happinessModifier += 10;
        burnoutModifier += 5;
      } else if (isStability) {
        growthModifier += 8;
        happinessModifier -= 5;
      }

      const clamp = (val) => Math.max(5, Math.min(98, Math.round(val)));

      return {
        growth: clamp(baseGrowth + growthModifier),
        stress: clamp(baseStress + stressModifier),
        burnout: clamp(baseBurnout + burnoutModifier),
        happiness: clamp(baseHappiness + happinessModifier)
      };
    }

    const scenarios = ['best', 'average', 'worst'];
    const timeline = {};

    scenarios.forEach(scen => {
      timeline[scen] = {};
      let yr1Head = "", yr1Desc = "", yr1Mile = "";
      let yr3Head = "", yr3Desc = "", yr3Mile = "";
      let yr5Head = "", yr5Desc = "", yr5Mile = "";
      let baseG = 50, baseS = 50, baseB = 40, baseH = 50;

      if (path === 'CREATIVE') {
        baseG = 40; baseS = 55; baseB = 45; baseH = 65;
        if (scen === 'best') {
          yr1Head = "Creative Breakthrough";
          yr1Desc = "Your work finds a dedicated niche online. Organic growth begins to substitute your living costs.";
          yr1Mile = "Secured your first 50 recurring patrons or clients, validating your business model.";
          yr3Head = "Brand Expansion";
          yr3Desc = "You secure notable collaborations. A steady creative routine minimizes early career friction.";
          yr3Mile = "Released a major piece, landing features in curated industry publications.";
          yr5Head = "Creative Sovereignty";
          yr5Desc = "You control your time completely. Your intellectual property generates compounding royalty channels.";
          yr5Mile = "Achieved total financial independence from passive sales, buying a custom workspace.";
        } else if (scen === 'average') {
          yr1Head = "The Hustler's Grind";
          yr1Desc = "Work is sporadic. You alternate between highly fulfilling projects and dull freelance gigs to pay rent.";
          yr1Mile = "Survived the first year without touching retirement savings, though margins are tight.";
          yr3Head = "Flickering Stability";
          yr3Desc = "Clients become regular, but you feel like you've traded one boss for ten. Work hours are long.";
          yr3Mile = "Streamlined operations, allowing you to take your first 2-week vacation in years.";
          yr5Head = "Modest Sustainability";
          yr5Desc = "You earn a median salary. The work is deeply yours, but you must constantly market to stay relevant.";
          yr5Mile = "Established a stable personal brand that guarantees a consistent regional audience.";
        } else {
          yr1Head = "Market Rejection";
          yr1Desc = "Zero audience traction. Unpaid bills mount, and the isolation leads to cognitive doubt.";
          yr1Mile = "Forced to take credit card debt to cover studio space and living essentials.";
          yr3Head = "Burnout Crash";
          yr3Desc = "You are working 80 hours a week on creative ideas with no financial return. The anxiety is crushing.";
          yr3Mile = "Suffered a major creative block, leading to a temporary collapse of freelance commissions.";
          yr5Head = "Retreat & Re-entry";
          yr5Desc = "Exhausted and financially depleted, you pause the creative venture to seek standard corporate roles.";
          yr5Mile = "Closed your business account and formatted your resume to apply for corporate entry jobs.";
        }
      } 
      else if (path === 'BUSINESS') {
        baseG = 55; baseS = 65; baseB = 50; baseH = 55;
        if (scen === 'best') {
          yr1Head = "Product-Market Fit Achieved";
          yr1Desc = "Your solution resolves a real pain point. Word of mouth triggers early client growth.";
          yr1Mile = "Closed a seed funding round or broke even in operations inside month nine.";
          yr3Head = "Team Scale-up";
          yr3Desc = "You delegate operations to employees. You focus strictly on high-level growth strategy.";
          yr3Mile = "Expanded team to 8 employees and opened a dedicated corporate headquarters.";
          yr5Head = "Market Leadership / Exit";
          yr5Desc = "Your startup dominates its regional niche. Competitors look to acquire your operations.";
          yr5Mile = "Successfully completed a partial equity exit, securing significant liquidity.";
        } else if (scen === 'average') {
          yr1Head = "Operational Friction";
          yr1Desc = "Client acquisition is expensive. You work long hours handling customer support, sales, and delivery.";
          yr1Mile = "Kept operations afloat through personal savings and micro-loans, scraping a living wage.";
          yr3Head = "Steady Margin Survival";
          yr3Desc = "Business is stable but doesn't scale easily. You are a self-employed operator rather than an owner.";
          yr3Mile = "Renegotiated vendor contracts, boosting net profitability margins by 12%.";
          yr5Head = "Stable Livelihood";
          yr5Desc = "The company yields a comfortable income. You have built a loyal client base, though stress remains high.";
          yr5Mile = "Achieved systemic parity where operations can run for 30 days without your active intervention.";
        } else {
          yr1Head = "Cash Flow Crunch";
          yr1Desc = "Major launch misses the mark. High customer acquisition costs drain your startup capital quickly.";
          yr1Mile = "Defaulted on initial equipment lease payments, requiring personal emergency funds.";
          yr3Head = "Executive Exhaustion";
          yr3Desc = "Co-founder disputes explode. Employees leave due to stress, leaving you to manage all systems.";
          yr3Mile = "Forced to liquidate company assets to repay outstanding business loans.";
          yr5Head = "Bankruptcy & Pivot";
          yr5Desc = "The company shuts down. You spend a year negotiating liabilities and recovering mentally.";
          yr5Mile = "Legally dissolved the corporation, retaining valuable execution skills but losing initial capital.";
        }
      }
      else if (path === 'TECH') {
        baseG = 65; baseS = 50; baseB = 40; baseH = 50;
        if (scen === 'best') {
          yr1Head = "Fast-Track Recognition";
          yr1Desc = "You deliver critical projects ahead of schedule. Leadership marks you for rapid promotion.";
          yr1Mile = "Received a high performance rating and a 15% salary bump within year one.";
          yr3Head = "Management Ascent";
          yr3Desc = "You shift to strategic team management. You enjoy generous bonuses and equity vesting packages.";
          yr3Mile = "Promoted to Lead Director, managing a budget of $1M and a team of senior engineers.";
          yr5Head = "Corporate Elite Status";
          yr5Desc = "You reach executive tiers. You have massive leverage, choosing your projects and teams.";
          yr5Mile = "Vested stock options reach maturity, creating a significant wealth portfolio.";
        } else if (scen === 'average') {
          yr1Head = "Ramp Up & Integration";
          yr1Desc = "You adapt to the corporate stack. The hours are standard, but the bureaucracy is tedious.";
          yr1Mile = "Passed your initial onboarding reviews, securing a standard market rate cost-of-living raise.";
          yr3Head = "Mid-Level Plateau";
          yr3Desc = "The work is repetitive. You perform well, but senior promotions are blocked by corporate structure.";
          yr3Mile = "Obtained a specialized technical certification, ensuring role safety during reorganization.";
          yr5Head = "Comfortable Competency";
          yr5Desc = "You earn a solid upper-middle-class income. Work is predictable, leaving time for out-of-office hobbies.";
          yr5Mile = "Negotiated a permanent 3-day remote work agreement, optimizing life balance metrics.";
        } else {
          yr1Head = "Stack Mismatch";
          yr1Desc = "The department undergoes re-organization. You are assigned to a toxic manager and legacy tech stack.";
          yr1Mile = "Placed on a performance improvement plan (PIP) due to communication clashes with leadership.";
          yr3Head = "Layoff Volatility";
          yr3Desc = "Broad corporate downsizing hits your team. You face a job market with declining hiring rates.";
          yr3Mile = "Laid off with 2 weeks severance, spending 6 anxious months interviewing.";
          yr5Head = "Career Downgrade";
          yr5Desc = "You accept a lower-paying role at a volatile firm to avoid unemployment. Stagnation index peaking.";
          yr5Mile = "Accepted a 20% pay cut at a legacy support firm, feeling heavy career regret.";
        }
      }
      else if (path === 'LIFESTYLE') {
        baseG = 45; baseS = 50; baseB = 35; baseH = 70;
        if (scen === 'best') {
          yr1Head = "Cultural Integration";
          yr1Desc = "The transition is smooth. You build foreign connections quickly and lower your cost of living.";
          yr1Mile = "Mastered basic local language benchmarks and signed a long-term apartment lease.";
          yr3Head = "Global Hub Setup";
          yr3Desc = "You build an international remote workflow, earning USD while enjoying high lifestyle leverage abroad.";
          yr3Mile = "Established a legal foreign business entity, reducing your tax exposure by 15%.";
          yr5Head = "Transnational Synthesis";
          yr5Desc = "You are fully bilingual and culturally integrated. You split your year between gorgeous locales.";
          yr5Mile = "Secured permanent residency status, buying a scenic home in your dream country.";
        } else if (scen === 'average') {
          yr1Head = "Transient Disorientation";
          yr1Desc = "Bureaucracy slows you down. You experience spikes of homesickness and language barriers.";
          yr1Mile = "Obtained local visa renewals, though administrative fees drained your savings buffer.";
          yr3Head = "Expat Bubble Comfort";
          yr3Desc = "You build a group of expat friends, but struggle to connect deeply with locals. Work is stable.";
          yr3Mile = "Shifted to freelance client work to maintain visa compliance requirements.";
          yr5Head = "Split Reality";
          yr5Desc = "You love the safety of your new home, but feel distant from family. Career growth is moderate.";
          yr5Mile = "Achieved balanced comfort, though you contemplate returning to your home country.";
        } else {
          yr1Head = "Visa Nightmare & Isolation";
          yr1Desc = "Visa applications are rejected. You feel isolated, living in sub-par temporary rentals.";
          yr1Mile = "Forced to return home briefly due to visa expiration, incurring heavy travel debt.";
          yr3Head = "Depleted Reserve Emergency";
          yr3Desc = "You cannot secure local income. The high inflation rates wipe out your initial savings.";
          yr3Mile = "Hospitalized abroad with no insurance, requiring family repatriation funding assistance.";
          yr5Head = "Defeated Return";
          yr5Desc = "You return home permanently. You feel like a stranger in your old town, facing career regression.";
          yr5Mile = "Moved back into your parents' home, starting from scratch in the local job market.";
        }
      }
      else if (path === 'SOCIAL') {
        baseG = 40; baseS = 55; baseB = 45; baseH = 65;
        if (scen === 'best') {
          yr1Head = "Direct Impact Validation";
          yr1Desc = "Your clients show significant improvement. You feel a deep daily purpose that corporate roles lacked.";
          yr1Mile = "Awarded Local Advocate of the Year by your department director.";
          yr3Head = "Program Creation";
          yr3Desc = "You design new support frameworks. You lead training workshops, scaling your altruistic footprint.";
          yr3Mile = "Secured a federal foundation grant to launch a dedicated youth support initiative.";
          yr5Head = "Systemic Leader";
          yr5Desc = "You run a major division. You are highly respected in the community, earning a comfortable stable salary.";
          yr5Mile = "Successfully influenced local policy, establishing permanent funding for 500+ families.";
        } else if (scen === 'average') {
          yr1Head = "Empathy Burnout Threat";
          yr1Desc = "You help clients, but the massive caseload leaves you emotionally drained by Friday night.";
          yr1Mile = "Survived a major budget cut cycle, keeping your primary case assignments intact.";
          yr3Head = "Bureaucratic Deadlocks";
          yr3Desc = "You spend 50% of your time filling out reports rather than helping people. Career growth is flat.";
          yr3Mile = "Transferred to a quieter administrative desk role to protect mental health.";
          yr5Head = "Resigned Dedication";
          yr5Desc = "The system is slow, but you make a quiet difference. You earn a modest income with good retirement buffers.";
          yr5Mile = "Completed a 5-year tenure milestone, securing public service student loan forgiveness.";
        } else {
          yr1Head = "Administrative Exhaustion";
          yr1Desc = "Hostile management and massive case backlogs destroy your enthusiasm in month three.";
          yr1Mile = "Took a 2-week stress leave after a severe confrontation with systemic negligence.";
          yr3Head = "Secondary Traumatic Stress";
          yr3Desc = "The emotional weight of your clients' distress causes you chronic insomnia and mental fatigue.";
          yr3Mile = "Resigned from the agency under extreme anxiety, seeking medical leave.";
          yr5Head = "Career Relinquish";
          yr5Desc = "You leave the social impact sector completely, taking a simple data entry role to find quiet safety.";
          yr5Mile = "Accepted a basic entry clerk position, mourning the loss of your early idealist goals.";
        }
      }
      else { // GENERAL
        baseG = 50; baseS = 50; baseB = 40; baseH = 50;
        if (scen === 'best') {
          yr1Head = "Smooth Path Adaptation";
          yr1Desc = "The new path unfolds smoothly. You build skills and fit into your team dynamics.";
          yr1Mile = "Passed initial evaluation cycles with positive peer feedback.";
          yr3Head = "Structured Progression";
          yr3Desc = "Salary steps up by 20%. You command respect, establishing a comfortable lifestyle balance.";
          yr3Mile = "Successfully completed a cornerstone department integration assignment.";
          yr5Head = "Optimized Mastery";
          yr5Desc = "You hold key domain expertise. The role pays well, demands are stable, and wellness is secure.";
          yr5Mile = "Achieved target salary goal, establishing active wealth accumulation funds.";
        } else if (scen === 'average') {
          yr1Head = "Standard Routine Adjustment";
          yr1Desc = "The learning curve is steep. You spend hours adjusting to new operational styles.";
          yr1Mile = "Secured standard tenure milestones, neutralizing early probationary risks.";
          yr3Head = "Linear Compensation Gains";
          yr3Desc = "Inflation adjustments are granted, but growth is flat. The role is acceptable but unexciting.";
          yr3Mile = "Completed secondary training seminars to prevent role obsolescence.";
          yr5Head = "Comfortable Baseline";
          yr5Desc = "A stable life. The decision hasn't changed the world, but it has secured your daily parameters.";
          yr5Mile = "Negotiated standard work-from-home options to preserve weekly leisure time.";
        } else {
          yr1Head = "Friction & Doubt";
          yr1Desc = "The daily tasks are tedious. You question if this choice was a lateral step backward.";
          yr1Mile = "Missed the initial quarterly performance metrics, leading to warning reviews.";
          yr3Head = "Chronic Friction Loops";
          yr3Desc = "Friction with management compounds. Market shifts threaten the long-term safety of your position.";
          yr3Mile = "Survived a corporate re-org but got reassigned to an unrewarding division.";
          yr5Head = "Role Fatigue Stagnation";
          yr5Desc = "You feel locked in a career cul-de-sac. Stress is high, pay is low, and motivation is gone.";
          yr5Mile = "Began sending resumes to competitors, seeking a total reset of this pathway.";
        }
      }

      timeline[scen].year1 = {
        headline: yr1Head,
        desc: yr1Desc,
        milestone: yr1Mile,
        metrics: getMetrics(scen, 1, baseG, baseS, baseB, baseH)
      };
      timeline[scen].year3 = {
        headline: yr3Head,
        desc: yr3Desc,
        milestone: yr3Mile,
        metrics: getMetrics(scen, 3, baseG, baseS, baseB, baseH)
      };
      timeline[scen].year5 = {
        headline: yr5Head,
        desc: yr5Desc,
        milestone: yr5Mile,
        metrics: getMetrics(scen, 5, baseG, baseS, baseB, baseH)
      };
    });

    return timeline;
  }

  // ==========================================================
  // REGRET SCORE ENGINE CALCULATIONS
  // ==========================================================
  function calculateRegret(path, label) {
    const isIntrovert = state.social === 'introvert';
    const isRiskTaker = state.risk === 'high';
    const isRiskAverse = state.risk === 'low';
    const isPassion = state.priority === 'passion';
    const isStability = state.priority === 'stability';

    let score = 45; 
    let explanation = "";
    const triggers = [];

    if (path === 'CREATIVE') {
      if (isStability) {
        score += 25;
        explanation = `Because your primary driver is Stability & Wealth, taking this low-guarantee creative path [${label}] will trigger high regret whenever income fluctuates.`;
        triggers.push("Freelance revenue drops below 40% of baseline costs.");
        triggers.push("Seeing corporate colleagues purchase properties while you manage rent volatility.");
      } else if (isRiskAverse) {
        score += 15;
        explanation = `As a Risk-Averse individual, the lack of structured career safety on path [${label}] will cause persistent anxiety.`;
        triggers.push("Going 60 days without a confirmed client project or commission.");
      } else {
        score -= 15;
        explanation = `Your passion-driven, risk-tolerant nature is highly compatible with creative paths [${label}]. Regret will be minimal.`;
        triggers.push("Loss of creative autonomy due to accepting poorly paid corporate contracts.");
      }
      if (!isIntrovert) {
        score += 10;
        triggers.push("Sustained creative isolation leading to extrovert networking exhaustion.");
      }
    } 
    else if (path === 'BUSINESS') {
      if (isRiskAverse) {
        score += 30;
        explanation = `A startup path [${label}] carries high friction. Because you prefer security, the threat of bankruptcy or liability will trigger high regret.`;
        triggers.push("Negotiating personal guarantees on commercial office leases.");
        triggers.push("Handling tax audits or co-founder contract disputes.");
      } else if (isStability) {
        score += 10;
        explanation = `While business [${label}] offers wealth, the initial year of zero salary conflicts with your financial goals, generating regret.`;
        triggers.push("Drawing zero salary for 12 straight months while working 80-hour weeks.");
      } else {
        score -= 10;
        explanation = `You possess the risk tolerance to manage startup shocks. Regret will only occur if the business fails completely on path [${label}].`;
        triggers.push("A sudden regulatory shift that closes your business model completely.");
      }
      if (isIntrovert) {
        score += 10;
        triggers.push("Sustained retail management demands leading to introvert energy burnout.");
      }
    } 
    else if (path === 'TECH') {
      if (isPassion) {
        score += 25;
        explanation = `Since you prioritize Passion, working in corporate tech [${label}] will trigger significant regret over lost creative years.`;
        triggers.push("Spending consecutive quarters writing admin slides rather than creative code.");
        triggers.push("Reaching age 40 and realizing your creative goals were never launched.");
      } else if (isRiskTaker) {
        score += 15;
        explanation = `As a Risk-Taker, the comfortable safety of corporate tech [${label}] will eventually feel restrictive, triggering regret over missed ventures.`;
        triggers.push("Watching former classmates raise VC funding while you sit in status meetings.");
      } else {
        score -= 20;
        explanation = `You prioritize stability, and tech corporate roles [${label}] offer exactly that. Your regret score is exceptionally low.`;
        triggers.push("Sudden structural layoffs that destroy your safety net.");
      }
    } 
    else if (path === 'LIFESTYLE') {
      if (isStability) {
        score += 20;
        explanation = `Moving abroad [${label}] lowers immediate career speed. You will regret the move when calculating lost compounding growth back home.`;
        triggers.push("Seeing local peers get promoted to Senior VP while you work remote odd-jobs.");
      } else if (isRiskAverse) {
        score += 15;
        explanation = `Moving country [${label}] requires high adaptation. Volatile visa regulations will trigger regret during emergencies.`;
        triggers.push("Sudden visa changes that give you 30 days to leave the country.");
      } else {
        score -= 15;
        explanation = `You prioritize experience. Even if the move [${label}] is chaotic, the life lessons will ensure you do not regret this choice.`;
        triggers.push("Experiencing long-term family emergencies back home while you are far away.");
      }
    } 
    else if (path === 'SOCIAL') {
      if (isStability) {
        score += 20;
        explanation = `Public sector roles [${label}] have low salary growth. Because you prioritize wealth, you will regret the choice when faced with living costs.`;
        triggers.push("Struggling to afford quality housing due to rigid public service salary steps.");
      } else {
        score -= 15;
        explanation = `Altruistic paths [${label}] offer high satisfaction. Doing direct good keeps regret low.`;
        triggers.push("Realizing that bureaucratic deadlocks prevent you from actually helping your clients.");
      }
    } 
    else { // GENERAL
      if (isRiskAverse) {
        score += 10;
        explanation = `Every change brings friction. Because you prefer security, minor startup obstacles on path [${label}] will cause nostalgia for your old routine.`;
        triggers.push("The initial 6 months of operational confusion in your new role.");
      } else {
        explanation = `Your average regret index suggests you will adapt to this decision [${label}].`;
        triggers.push("Failing to schedule boundaries, leading to general life stagnation.");
      }
    }

    score = Math.max(5, Math.min(95, score));
    let level = "Low Regret Risk";
    if (score > 40 && score <= 65) level = "Moderate Regret Risk";
    if (score > 65) level = "High Regret Risk";

    return { score, level, explanation, triggers };
  }

  // ==========================================================
  // CINEMATIC STORY ENGINE
  // ==========================================================
  function buildCinematicStory(path, label) {
    const isIntrovert = state.social === 'introvert';
    const isRiskTaker = state.risk === 'high';
    const isPassion = state.priority === 'passion';
    const isStability = state.priority === 'stability';

    let intro = "";
    let body = "";
    let outro = "";

    if (path === 'CREATIVE') {
      intro = `June 28, 2031. Five years have evaporated since the morning I stared at my keyboard and decided to pursue a creative life on path ${label}. The scent of fresh coffee fills my small studio space. Outside, rain streams down the window pane. There is no corporate alarm clock, no morning commute, no manager checking my status logs. Just a blank canvas, my tools, and a quiet sense of ownership.`;
      if (isIntrovert) {
        body = `In the beginning, the quiet was intoxicating. I spent Year 1 and 2 in high-focus isolation, writing or crafting in solitary loops. But isolation is a double-edged sword. There were weeks when my only social contact was the local grocery clerk. Financial stress was a constant shadow; I remember a cold Tuesday in Year 3 when my account hit double digits, and I questioned my sanity. Yet, step by step, my digital audience grew. They didn't just buy my work; they bought my perspective.`;
      } else {
        body = `Being an extrovert, I quickly realized that locking myself in a room would destroy my drive. I moved my workspace to a bustling community studio. I hosted workshops, organized local creator panels, and co-shared projects. Year 3 was a whirlwind of social collaboration. The income was volatile—a rollercoaster of high commissions followed by dry seasons—but the energy of the crowd kept my motivation alive.`;
      }
      if (isPassion) {
        outro = `Looking back, I may not own a luxury vehicle or a corporate title, but I own my days. My soul is intact, and the stories I have created will outlive my bank balance. I chose passion, and that has made all the difference.`;
      } else {
        outro = `The path was beautiful but exhausting. I have had to take on freelance contracts that felt corporate just to pay the rent. I managed to survive, but the constant marketing has made me value stability more than ever. I forged a path, but I learned that security has its own beauty.`;
      }
    } 
    else if (path === 'BUSINESS') {
      intro = `June 28, 2031. The glass-walled office overlooks the city skyline on path ${label}. It's late, and the cleaning staff is working down the hall. I look at the logo etched on the wall—the entity I built from a simple text prompt five years ago. I am exhausted, but the brand belongs to me. We survived the first-year cash crunch, the co-founder disputes of Year 3, and the grueling scale-up that followed.`;
      if (isIntrovert) {
        body = `Managing a team of 15 has forced me to adapt. Being naturally introverted, the constant sales calls and meetings initially drained me to zero. I had to design strict boundaries, retreating to quiet offices to recharge. The risk was immense; I remember Year 2 when we almost missed payroll, and the weight of my employees' livelihoods kept me awake for weeks. But we survived, building a highly systematized business.`;
      } else {
        body = `As an extrovert, I thrived in the chaotic early stages. Pitching to investors, winning clients over dinners, and rallying my team during late-night sprints was my fuel. I built a wide community net, leveraging partnerships to bypass obstacles. The volatility was a rush, and my high risk appetite allowed me to make bets that paid off in Year 4.`;
      }
      if (isStability) {
        outro = `The company is now highly profitable. The early years of zero pay have been replaced by a secure executive package. I built a system of wealth and equity, buying the financial freedom I always craved. The forge succeeded.`;
      } else {
        outro = `We scaled, but at a cost. I have missed family dinners, lost touch with old friends, and suffered chronic high blood pressure. I built an empire, but I am now looking to step down as CEO to find the balance I threw away. The forge worked, but the bill has come due.`;
      }
    } 
    else if (path === 'TECH') {
      intro = `June 28, 2031. The soft hum of the corporate server room and the gentle glow of dual monitors frame my evening on path ${label}. Five years ago, I chose path predictability. Today, I sit in a high-backed executive chair, checking my vested stock balances. It is a world of metrics, scheduled promotions, stable benefits, and structured comfort.`;
      if (isPassion) {
        body = `The career path is successful, but the days feel like a loop of corporate acronyms. I earn a high salary, but my notebooks are full of scribbled ideas for novels and projects I never find the energy to start. I remember Year 3, receiving a major bonus while feeling an empty sadness inside. I have used my money to buy comfort, but my creative drive has stagnated in this plush cage.`;
      } else {
        body = `The stability has allowed me to build a beautiful life outside the office. I shut my laptop at 5:00 PM. I bought a home in Year 3, got a dog, and spent my weekends traveling. Being an ${isIntrovert ? 'introvert, I enjoy the quiet remote setup' : 'extrovert, I enjoy mentoring junior team members'}, utilizing the corporate structure without letting it consume my identity.`;
      }
      if (isStability) {
        outro = `I chose safety, and I do not regret it. My bank account is secure, my future is mapped, and I have built a solid foundation. You cannot eat passion, but you can build a stable life with structure. The forge was calculated, and it won.`;
      } else {
        outro = `I earned the title and the compensation, but I look at independent creators with a quiet envy. I traded volatility for structure, but a small part of me will always wonder what would have happened if I had leaped off the corporate ledge.`;
      }
    } 
    else if (path === 'LIFESTYLE') {
      intro = `June 28, 2031. The afternoon sun illuminates a cobblestone street in a foreign town on path ${label}. I sit at a small café, my laptop open, typing with the sound of a foreign language echoing around me. Five years ago, I decided to pack my life into a suitcase and relocate. It was a leap into the unknown, a choice of environment over structured career speed.`;
      if (isIntrovert) {
        body = `The first year was difficult. I sat in lonely rooms, navigating complex visa bureaucracies and language blocks. As an introvert, making friends from scratch was an exercise in extreme courage. But I adapted, finding quiet joy in long walks through ancient forests and remote work in local libraries. I lost some career speed, but I gained an immense inner resilience.`;
      } else {
        body = `I threw myself into the local scene. I organized expat meetups, joined local sports leagues, and co-shared desks. I learned the language by making mistakes in public and laughing about it. My career transformed into a digital consulting model, allowing me to travel through three continents. The lack of roots was exhausting at times, but the network I built spans the globe.`;
      }
      if (isPassion || state.priority === 'balance') {
        outro = `I live a life of rich experiences. I may have less retirement savings than my office colleagues, but I have swam in remote oceans, spoken three languages, and lived multiple lives. I chose lifestyle, and my horizon is wide open.`;
      } else {
        outro = `I saw the world, but the distance from family has begun to weigh on me. I realized that adventure is sweet, but roots are necessary. I am now planning my return, carrying memories but seeking a stable home at last.`;
      }
    } 
    else if (path === 'SOCIAL') {
      intro = `June 28, 2031. The community center is quiet now on path ${label}. I look at the drawings on the wall and the case files on my desk. Five years ago, I walked away from raw salary maximization to work in the human sector. The salary is modest, but the work is alive. I spend my days dealing with real human distress and systemic hope.`;
      if (isIntrovert) {
        body = `I had to learn how to survive empathy fatigue. In Year 2, I would carry my clients' pain home, spending sleepless nights worrying about their lives. As an introvert, the public-facing demands drained my batteries. I had to learn the art of professional detachment, focusing on deep, quiet one-on-one sessions where I could offer complete, focused help.`;
      } else {
        body = `I thrived in public advocacy. I built community projects, raised funds through charity drives, and spoke at local councils. Being energized by groups, I leveraged my extroversion to coordinate coalitions of volunteers. The bureaucracy of public services tried to crush our spirit in Year 3, but the community network we built held us together.`;
      }
      if (isPassion) {
        outro = `When I see a client secure housing or a student succeed, the sense of accomplishment is unmatched. I do not care about corporate stocks; I care about human eyes. I chose impact, and my heart is full.`;
      } else {
        outro = `The work is noble, but the financial limitations are real. I struggled to afford quality childcare in Year 4, and the stress of low pay has strained my relationship. I forged an idealistic path, but I have learned that help requires its own financial oxygen.`;
      }
    } 
    else { // GENERAL
      intro = `June 28, 2031. Five years have quietly passed since I made the decision to change my trajectory on path ${label}. I sit in my living room, reviewing the path I forged. The initial disruption has smoothed into a daily routine. It is a life of standard rhythms, comfortable adjustments, and steady progression.`;
      body = `Year 1 and 2 were a blur of learning new systems and adjusting to the daily requirements. I faced minor friction points—a demanding manager in Year 3, a changing market in Year 4—but my personality settings kept me balanced. I did not take massive risks, nor did I hide in total stagnation. I navigated the middle path, building stable value.`;
      outro = `Looking back, it was a balanced choice. It secured my career without burning out my life. I forged a sustainable path, and I am content with the horizon ahead.`;
    }

    return `${intro}\n\n${body}\n\n${outro}`;
  }

});
