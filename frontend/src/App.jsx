import React, { useState, useEffect } from "react";
import "./App.css";


function App() {

  const BASE_URL = "https://futureforge-backend-0pfu.onrender.com";
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState("profile"); // profile, simulation, results, report, history
  const [apiConnected, setApiConnected] = useState(true);
  const [energy, setEnergy] = useState("Introvert");
  const [risk, setRisk] = useState("Moderate");
  const [paradigm, setParadigm] = useState("Single Path");

  // User persona profile settings
  const [social, setSocial] = useState("introvert");
  const [priority, setPriority] = useState("balance");

  // Path Compatibility scores state
  const [compatScores, setCompatScores] = useState(null);
  const [compatAnalysis, setCompatAnalysis] = useState("");
  const [compatLoading, setCompatLoading] = useState(false);

  // Simulation inputs
  const [decisionMode, setDecisionMode] = useState("single"); // 'single' or 'multiple'
  const [decisionText, setDecisionText] = useState("Quit FAANG corporate tech job to start an artisanal bakery");
  const [decisionAText, setDecisionAText] = useState("Stay in FAANG corporate tech job, maximize stock options");
  const [decisionBText, setDecisionBText] = useState("Relocate to Japan, start a boutique creative agency");

  // Simulation execution state
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);

  // SWOT & Playbook Report compiler state
  const [reportPath, setReportPath] = useState("CREATIVE");
  const [reportRegret, setReportRegret] = useState(45);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportResults, setReportResults] = useState(null);

  // History vault state
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  // Council simulation loading steps
  const simulationSteps = [
    "Initializing FutureForge Core Engine...",
    "Injecting psychological profile parameters...",
    "Summoning Growth Advisor to analyze trajectory metrics...",
    "Summoning Risk Officer to model baseline fail-safes...",
    "Summoning Happiness Advocate to audit alignment values...",
    "Spawning consulting debate: addressing priority friction...",
    "Simulating regret indices and year-5 milestones...",
    "Synthesizing cinematic future diary entries (June 2031)...",
    "Finalizing decision blueprint..."
  ];

  // Check API connection and load history on mount
  useEffect(() => {
    checkConnection();
    loadHistory();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await fetch("/api/decisions");
      if (res.ok) {
        setApiConnected(true);
      } else {
        setApiConnected(false);
      }
    } catch (e) {
      setApiConnected(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/decisions`)
      if (res.ok) {
        const data = await res.json();
        setHistoryItems(data);
      }
    } catch (e) {
      console.error("Failed to load decisions history:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Run user profile analysis
  const runProfileAnalysis = async (e) => {
    if (e) e.preventDefault();
    setCompatLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/analyze-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ social, risk, priority })
      });
      if (res.ok) {
        const data = await res.json();
        setCompatScores(data.compatibility_scores);
        setCompatAnalysis(data.analysis);
      } else {
        alert("Failed to analyze profile settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting the compatibility engine.");
    } finally {
      setCompatLoading(false);
    }
  };

  // Run full simulation
  const executeSimulation = async () => {
    setSimulationLoading(true);
    setSimulationStepIndex(0);
    setSimulationResults(null);
    setShareUrl(null);
    setCopied(false);

    // Change tab immediately so user sees the progress loader
    setActiveTab("results");

    // Cycle through simulation steps for gorgeous effect
    const interval = setInterval(() => {
      setSimulationStepIndex((prev) => {
        if (prev < simulationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    try {
  const payload = {
  decisionMode,
  params: {
    social,
    risk,
    priority,

    decision:
      decisionMode === "single" ? decisionText : "",

    decisionA:
      decisionMode === "comparative" ? decisionAText : "",

    decisionB:
      decisionMode === "comparative" ? decisionBText : ""
  }
};

      const res = await fetch(`${BASE_URL}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const resultsData = await res.json();
        
        // Wait a small moment to ensure the loading effect finishes
        setTimeout(async () => {
          setSimulationResults(resultsData);
          setSimulationLoading(false);
          clearInterval(interval);
          
          // Auto-save the decision in the database
          await saveDecision(resultsData);
        }, 1200);

      } else {
        setSimulationLoading(false);
        clearInterval(interval);
        alert("Simulation engine failed. Please review inputs.");
      }
    } catch (err) {
      console.error(err);
      setSimulationLoading(false);
      clearInterval(interval);
      alert("Error communicating with simulation backend.");
    }
  };

  // Save decision record to backend database
  const saveDecision = async (resultsData) => {
    try {
      const newId = "ff_" + Math.random().toString(36).substr(2, 9);
      const title = decisionMode === "single"
        ? `Single: ${decisionText.substring(0, 45)}...`
        : `Vs: ${decisionAText.substring(0, 20)}... vs ${decisionBText.substring(0, 20)}...`;

      // Determine final verdict representation for DB listing
      let finalVerdictObj = {};
      if (decisionMode === "single" && resultsData.single) {
        finalVerdictObj = {
          verdictTitle: resultsData.single.debate.verdict.title,
          verdictBody: resultsData.single.debate.verdict.body,
          riskLevel: resultsData.single.regret.score > 60 ? "High" : "Low",
          score: resultsData.single.regret.score
        };
      } else if (resultsData.optionA && resultsData.optionB) {
        finalVerdictObj = {
          verdictTitle: `Option A Regret: ${resultsData.optionA.regret.score}% vs Option B: ${resultsData.optionB.regret.score}%`,
          verdictBody: `Preferred Path: A (${resultsData.optionA.path}) or B (${resultsData.optionB.path})`,
          riskLevel: Math.max(resultsData.optionA.regret.score, resultsData.optionB.regret.score) > 60 ? "High" : "Low",
          score: Math.min(resultsData.optionA.regret.score, resultsData.optionB.regret.score)
        };
      }

      const payload = {
        id: newId,
        title,
        mode: decisionMode,
        createdAt: new Date().toISOString(),
        input: {
          social,
          risk,
          priority,
          decision: decisionText,
          decisionA: decisionAText,
          decisionB: decisionBText
        },
        results: resultsData,
        finalVerdict: finalVerdictObj,
        shareable: true
      };

      const res = await fetch(`${BASE_URL}/api/decisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        loadHistory(); // Reload history items
        // Generate mock share link
        setShareUrl(`${window.location.origin}/share/${newId}`);
      }
    } catch (e) {
      console.error("Auto-saving failed:", e);
    }
  };

  // Delete decision record
  const deleteRecord = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to purge this record from your vault?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/decisions/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadHistory();
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting record.");
    }
  };

  // Load past simulation from vault
  const loadHistoryItem = (item) => {
    setDecisionMode(item.mode);
    setSocial(item.input.social || "introvert");
    setRisk(item.input.risk || "moderate");
    setPriority(item.input.priority || "balance");
    if (item.mode === "single") {
      setDecisionText(item.input.decision || "");
    } else {
      setDecisionAText(item.input.decisionA || "");
      setDecisionBText(item.input.decisionB || "");
    }
    setSimulationResults(item.results);
    setShareUrl(`${window.location.origin}/share/${item.id}`);
    setCopied(false);
    setActiveTab("results");
  };

  // Compile SWOT & Playbook report
  const compileSWOTReport = async (path, regretVal) => {
    setReportLoading(true);
    setReportResults(null);
    try {
      const payload = {
        path: path || reportPath,
        regretScore: regretVal || reportRegret,
        social,
        risk,
        priority
      };
      
      const res = await fetch(`${BASE_URL}/api/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setReportResults(data);
      } else {
        alert("Failed to generate report.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting the report engine.");
    } finally {
      setReportLoading(false);
    }
  };

  // Quick report compiler trigger from simulation outcomes
  const triggerReportFromPath = (path, regretScore) => {
    setReportPath(path);
    setReportRegret(regretScore);
    compileSWOTReport(path, regretScore);
    setActiveTab("report");
  };

  // Copy share URL to clipboard
  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper component to render progress gauge (Circular SVG)
  const RegretGauge = ({ score }) => {
    const radius = 50;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    // Color grade based on regret
    let color = "var(--tech-color)";
    if (score > 60) color = "var(--danger)";
    else if (score > 35) color = "var(--warning)";

    return (
      <div className="regret-gauge-wrapper">
        <svg className="regret-circular-svg">
          <circle
            className="regret-gauge-bg"
            cx="65"
            cy="65"
            r={radius}
          />
          <circle
            className="regret-gauge-fill"
            cx="65"
            cy="65"
            r={radius}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="regret-gauge-text">
          <div className="regret-percentage">{score}%</div>
          <div className="regret-label">Regret</div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header Panel */}
      <header className="header-row">
        <div className="logo-container">
          <span className="logo-text gradient-text">FutureForge AI</span>
          <span className="logo-badge">V2.0 Core</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className={`status-dot ${apiConnected ? "active" : "inactive"}`}></span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
            {apiConnected ? "Sim Engine: Connected" : "Sim Engine: Offline"}
          </span>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <nav className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          👤 1. Identity Matrix
        </button>
        <button className={`tab-btn ${activeTab === "simulation" ? "active" : ""}`} onClick={() => setActiveTab("simulation")}>
          ⚙️ 2. Trajectory Simulator
        </button>
        <button className={`tab-btn ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
          👁️ 3. Council Outcomes {simulationResults && <span className="tab-indicator"></span>}
        </button>
        <button className={`tab-btn ${activeTab === "report" ? "active" : ""}`} onClick={() => {
          setActiveTab("report");
          if (!reportResults) compileSWOTReport();
        }}>
          📋 4. SWOT Playbook
        </button>
        <button className={`tab-btn ${activeTab === "history" ? "active" : ""}`} onClick={() => {
          setActiveTab("history");
          loadHistory();
        }}>
          🗄️ 5. Vault ({historyItems.length})
        </button>
      </nav>

      {/* Main Grid Body */}
      <main style={{ flexGrow: 1 }}>
        
        {/* Tab 1: Profile & Suitability Index */}
        {activeTab === "profile" && (
          <div className="grid-2col">
            {/* Profile Forms */}
            <div className="glass-panel">
              <h2 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "15px" }}>Configure Identity Profile</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
                Establish your fundamental psychological traits. FutureForge synthesizes these parameters to project regret scores and suitability metrics.
              </p>

              <form onSubmit={runProfileAnalysis}>
                <div className="form-group">
                  <label className="form-label">Social Energy Mode</label>
                  <div className="bubble-group">
  {["Introvert", "Extrovert"].map(option => (
    <button
      key={option}
      className={`bubble ${energy === option ? "active" : ""}`}
      onClick={() => {
  setEnergy(option);
  setSocial(option.toLowerCase());
}}
    >
      {option}
    </button>
  ))}
</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Volatility (Risk) Tolerance</label>
                  <div className="bubble-group">
  {["Low Risk", "Moderate", "High Risk"].map(option => (
    <button
      key={option}
      className={`bubble ${risk === option ? "active" : ""}`}
      onClick={() => setRisk(option)}
    >
      {option}
    </button>
  ))}
</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Core Life Driver</label>
                  <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="passion">Passion (Autonomy & Creative Expression)</option>
                    <option value="stability">Stability (Financial Safety & Predictability)</option>
                    <option value="balance">Life Balance (Flexibility, Health & Family)</option>
                  </select>
                </div>

                <button type="submit" className="btn-premium" style={{ width: "100%", marginTop: "10px" }} disabled={compatLoading}>
                  {compatLoading ? "Processing..." : "Calculate Pathway Suitability Index"}
                </button>
              </form>
            </div>

            {/* Suitability Index outcomes */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyBetween: "space-between" }}>
              <h2 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "10px" }}>Suitability Vector</h2>
              
              {!compatScores ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyCenter: "center", flexGrow: 1, padding: "40px 10px", textAlign: "center", gap: "12px" }}>
                  <div style={{ fontSize: "2.5rem" }}>📊</div>
                  <h4 style={{ color: "var(--text-secondary)" }}>Waiting for identity matrix configuration</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "300px" }}>
                    Configure your traits on the left and engage the compatibility index to view alignment data.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", flexGrow: 1, justifyContent: "space-between" }}>
                  <div className="compatibility-list">
                    {Object.entries(compatScores).map(([path, score]) => (
                      <div key={path} className="compatibility-item">
                        <div className="compatibility-header">
                          <span className={`path-badge color-${path}`}>{path}</span>
                          <span className={`score-value color-${path}`}>{score}%</span>
                        </div>
                        <div className="progress-track">
                          <div className={`progress-fill bg-${path}`} style={{ width: `${score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="help-card" style={{ marginTop: "15px" }}>
                    <div className="help-card-title">Consensus Summary</div>
                    <p style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>{compatAnalysis}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Decision Simulator */}
        {activeTab === "simulation" && (
          <div className="grid-2col">
            {/* Input Options Panel */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h2 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "15px" }}>Trajectory Setup</h2>
                
                <div className="form-group">
  <label className="form-label">Simulation Paradigm</label>

  <div className="bubble-group">
    {["Single Path", "Comparative Dilemma (A vs B)"].map(option => (
      <button
        type="button"
        key={option}
        className={`bubble ${paradigm === option ? "active" : ""}`}
        onClick={() => {
  setParadigm(option);

  if (option === "Single Path") {
    setDecisionMode("single");
  } else {
    setDecisionMode("comparative");
  }
}}
      >
        {option}
      </button>
    ))}
  </div>
</div>

                {paradigm === "Single Path" ? (
  <div className="form-group">
    <label className="form-label">
      Enter Career / Life Decision Statement
    </label>

    <textarea 
      className="form-textarea" 
      value={decisionText} 
      onChange={(e) => setDecisionText(e.target.value)}
      placeholder="e.g. Resign from my stable product manager role at Microsoft to open a craft bakery in Portland."
    />

    <span style={{ 
      fontSize: "0.75rem", 
      color: "var(--text-muted)", 
      fontStyle: "italic" 
    }}>
      Tip: Describe the change, location, and nature of the transition for maximum keyword alignment.
    </span>
  </div>
) : (
  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
    
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label" style={{ color: "var(--primary)" }}>
        Option A Trajectory
      </label>

      <textarea 
        className="form-textarea" 
        value={decisionAText} 
        onChange={(e) => setDecisionAText(e.target.value)}
        placeholder="e.g. Relocate to Tokyo, Japan as a freelance software engineer."
      />
    </div>

    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label" style={{ color: "var(--accent-cyan)" }}>
        Option B Trajectory
      </label>

      <textarea 
        className="form-textarea" 
        value={decisionBText} 
        onChange={(e) => setDecisionBText(e.target.value)}
        placeholder="e.g. Stay at current job in Austin, Texas, focus on promotion track."
      />
    </div>

  </div>
)}
</div>

              <div style={{ marginTop: "30px" }}>
                <button onClick={executeSimulation} className="btn-premium" style={{ width: "100%" }}>
                  🔮 Engage Simulation Council
                </button>
              </div>
            </div>

            {/* Current Profile Specs details */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600" }}>Identity Alignment Matrix</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                The simulation council evaluates decisions through the lens of your currently locked-in profile traits:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" }}>SOCIAL STYLE:</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: "700", color: "var(--primary)" }}>{social.toUpperCase()}</span>
                </div>
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" }}>RISK PROFILE:</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: "700", color: "var(--accent-cyan)" }}>{risk.toUpperCase()}</span>
                </div>
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" }}>PRIMARY GOAL DRIVER:</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: "700", color: "var(--tech-color)" }}>{priority.toUpperCase()}</span>
                </div>
              </div>

              <div className="help-card" style={{ marginTop: "10px" }}>
                <div className="help-card-title">Why this matters</div>
                <p style={{ fontSize: "0.82rem" }}>
                  If you are <strong>Risk-Averse</strong> but propose starting an aggressive freelance project, the council's Risk Officer will highlight severe cognitive stress factors. Adjust your traits in the Identity Matrix if your values have changed.
                </p>
              </div>

              <button className="btn-secondary" onClick={() => setActiveTab("profile")} style={{ marginTop: "auto" }}>
                Edit Identity Traits
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Simulation Results Outcomes */}
        {activeTab === "results" && (
          <div>
            {simulationLoading ? (
              /* Simulation Engine Loading State */
              <div className="glass-panel simulation-loader">
                <div className="spinner-outer">
                  <div className="spinner-inner"></div>
                  <div style={{ fontSize: "1.6rem" }}>🔮</div>
                </div>
                <h3 className="pulse-text">{simulationSteps[simulationStepIndex]}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "450px" }}>
                  The FutureForge AI Council is projecting multi-variant paths, analyzing regrets, compiling timelines, and generating future narratives.
                </p>
              </div>
            ) : !simulationResults ? (
              /* Empty Results State */
              <div className="glass-panel" style={{ textAlign: "center", padding: "60px 40px" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "15px" }}>🔮</div>
                <h2 className="gradient-text" style={{ fontFamily: "var(--font-display)" }}>Simulator Standby</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "450px", margin: "10px auto 25px" }}>
                  No simulation results are currently loaded. Run a new simulation in the Trajectory Simulator page or choose a saved session from the Vault.
                </p>
                <button className="btn-premium" onClick={() => setActiveTab("simulation")} style={{ margin: "0 auto" }}>
                  Open Trajectory Simulator
                </button>
              </div>
            ) : (
              /* Results Loaded Panel */
              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                
                {/* Share Link alert banner */}
                {shareUrl && (
                  <div className="share-banner">
                    <div className="share-info">
                      <span className="share-icon">🔗</span>
                      <div style={{ textAlign: "left" }}>
                        <div className="share-title">Simulation Persisted in Vault</div>
                        <div className="share-desc">This trajectory is saved in your sqlite database. Copy local share URL:</div>
                      </div>
                    </div>
                    <div className="share-copy-wrapper">
                      <input className="share-input" readOnly value={shareUrl} />
                      <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={copyShareLink}>
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}

                {/* SINGLE MODE DISPLAY */}
                {simulationResults.single && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    
                    {/* Header Path suit badge */}
                    <div className="verdict-banner">
                      <div className="verdict-glow-icon">⚖️</div>
                      <div className="verdict-info" style={{ textAlign: "left" }}>
                        <h3>{simulationResults.single.debate.verdict.title}</h3>
                        <p>{simulationResults.single.debate.verdict.body}</p>
                        <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                          <span className={`path-badge color-${simulationResults.single.path}`} style={{ textTransform: "uppercase" }}>
                            🎯 Class Alignment: {simulationResults.single.path}
                          </span>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: "2px 10px", fontSize: "0.75rem" }} 
                            onClick={() => triggerReportFromPath(simulationResults.single.path, simulationResults.single.regret.score)}
                          >
                            Compile SWOT Matrix & Playbook
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Column Grid: Advisors & Regret */}
                    <div className="grid-2col">
                      {/* Left: Regret Score dial */}
                      <div className="glass-panel">
                        <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "20px" }}>Regret Risk Analysis</h3>
                        <div className="regret-analysis-box">
                          <RegretGauge score={simulationResults.single.regret.score} />
                          <div className="regret-info-content" style={{ textAlign: "left" }}>
                            <h4>Fulfillment Risk Profile</h4>
                            <p>{simulationResults.single.regret.explanation}</p>
                            <span className="form-label" style={{ display: "block", marginBottom: "8px", fontSize: "0.75rem" }}>Regret Trigger Risks:</span>
                            <div className="triggers-container">
                              {simulationResults.single.regret.triggers.map((trigger, idx) => (
                                <span key={idx} className="trigger-badge">#{trigger}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Advisor debate console */}
                      <div className="glass-panel">
                        <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "15px" }}>Consulting Council Opinions</h3>
                        <div className="help-card" style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "15px" }}>
                          Review debate from Growth, Risk, and Life-quality advisors reflecting your profile settings.
                        </div>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                          <div style={{ borderLeft: "3px solid var(--tech-color)", paddingLeft: "10px" }}>
                            <strong style={{ fontSize: "0.85rem", color: "var(--tech-color)" }}>📈 GROWTH ADVISOR:</strong>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>{simulationResults.single.debate.growth}</p>
                          </div>
                          <div style={{ borderLeft: "3px solid var(--danger)", paddingLeft: "10px" }}>
                            <strong style={{ fontSize: "0.85rem", color: "var(--danger)" }}>🛡️ RISK OFFICER:</strong>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>{simulationResults.single.debate.risk}</p>
                          </div>
                          <div style={{ borderLeft: "3px solid var(--business-color)", paddingLeft: "10px" }}>
                            <strong style={{ fontSize: "0.85rem", color: "var(--business-color)" }}>❤️ HAPPINESS ADVOCATE:</strong>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>{simulationResults.single.debate.happiness}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline section */}
                    <div className="glass-panel">
                      <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "20px" }}>5-Year Career Trajectory Milestones</h3>
                      
                      <div className="timeline-split-grid" style={{ textAlign: "left" }}>
                        {/* Best Case Column */}
                        <div>
                          <div className="timeline-column-header" style={{ color: "var(--tech-color)" }}>
                            <span>🟢</span> Best-Case Scenario Forecasts
                          </div>
                          <div className="timeline-vertical-line">
                            {Object.entries(simulationResults.single.timeline.best).map(([yearKey, node]) => (
                              <div key={yearKey} className="timeline-node best-scenario">
                                <div className="timeline-dot"></div>
                                <div className="timeline-node-year">{yearKey}</div>
                                <div className="timeline-node-card">
                                  <div className="timeline-node-headline">{node.headline}</div>
                                  <div className="timeline-node-metrics">
                                    {Object.entries(node.metrics || {}).map(([metricName, val]) => (
                                      <span key={metricName} className={`metric-pill ${metricName}`}>
                                        {metricName}: {val}%
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Worst Case Column */}
                        <div>
                          <div className="timeline-column-header" style={{ color: "var(--danger)" }}>
                            <span>🔴</span> Stress/Worst-Case Scenario Forecasts
                          </div>
                          <div className="timeline-vertical-line">
                            {Object.entries(simulationResults.single.timeline.worst).map(([yearKey, node]) => (
                              <div key={yearKey} className="timeline-node worst-scenario">
                                <div className="timeline-dot"></div>
                                <div className="timeline-node-year">{yearKey}</div>
                                <div className="timeline-node-card">
                                  <div className="timeline-node-headline">{node.headline}</div>
                                  <div className="timeline-node-metrics">
                                    {Object.entries(node.metrics || {}).map(([metricName, val]) => (
                                      <span key={metricName} className={`metric-pill ${metricName}`}>
                                        {metricName}: {val}%
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Future cinematic diary story */}
                    <div className="glass-panel" style={{ textAlign: "left" }}>
                      <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "15px" }}>Cinematic Future Log (June 28, 2031)</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "15px" }}>
                        An AI-synthesized fictional reflection of what a day in your life looks like in five years, derived from path-suitability and core trait constraints.
                      </p>
                      <div className="story-diary">{simulationResults.single.story}</div>
                    </div>

                  </div>
                )}

                {/* COMPARATIVE MULTIPLE MODE DISPLAY */}
                {simulationResults.optionA && simulationResults.optionB && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    
                    {/* Header comparison row */}
                    <div className="option-comparison-header-grid">
                      <div className="option-pane" style={{ borderLeft: "4px solid var(--primary)" }}>
                        <h4>Option A Trajectory</h4>
                        <p>{decisionAText}</p>
                        <span className={`path-badge color-${simulationResults.optionA.path}`} style={{ textTransform: "uppercase", display: "inline-block", marginTop: "8px" }}>
                          Path: {simulationResults.optionA.path}
                        </span>
                      </div>
                      <div className="vs-badge">VS</div>
                      <div className="option-pane" style={{ borderLeft: "4px solid var(--accent-cyan)" }}>
                        <h4>Option B Trajectory</h4>
                        <p>{decisionBText}</p>
                        <span className={`path-badge color-${simulationResults.optionB.path}`} style={{ textTransform: "uppercase", display: "inline-block", marginTop: "8px" }}>
                          Path: {simulationResults.optionB.path}
                        </span>
                      </div>
                    </div>

                    {/* Verdict Banners for both */}
                    <div className="grid-2col">
                      <div className="glass-panel" style={{ borderTop: "3px solid var(--primary)", textAlign: "left" }}>
                        <span className="logo-badge" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>Option A Consensus</span>
                        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "700", marginTop: "10px", marginBottom: "8px", color: "#fff" }}>
                          {simulationResults.optionA.debate.verdict.title}
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                          {simulationResults.optionA.debate.verdict.body}
                        </p>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: "4px 10px", fontSize: "0.75rem", marginTop: "12px" }}
                          onClick={() => triggerReportFromPath(simulationResults.optionA.path, simulationResults.optionA.regret.score)}
                        >
                          Compile SWOT report for A
                        </button>
                      </div>
                      
                      <div className="glass-panel" style={{ borderTop: "3px solid var(--accent-cyan)", textAlign: "left" }}>
                        <span className="logo-badge" style={{ color: "var(--accent-cyan)", borderColor: "var(--accent-cyan)" }}>Option B Consensus</span>
                        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "700", marginTop: "10px", marginBottom: "8px", color: "#fff" }}>
                          {simulationResults.optionB.debate.verdict.title}
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                          {simulationResults.optionB.debate.verdict.body}
                        </p>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: "4px 10px", fontSize: "0.75rem", marginTop: "12px" }}
                          onClick={() => triggerReportFromPath(simulationResults.optionB.path, simulationResults.optionB.regret.score)}
                        >
                          Compile SWOT report for B
                        </button>
                      </div>
                    </div>

                    {/* Regret comparison dials */}
                    <div className="glass-panel">
                      <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "20px" }}>Side-by-Side Regret Audit</h3>
                      
                      <div className="grid-2col">
                        <div className="regret-analysis-box" style={{ background: "rgba(255,255,255,0.01)", padding: "15px", borderRadius: "12px" }}>
                          <RegretGauge score={simulationResults.optionA.regret.score} />
                          <div className="regret-info-content" style={{ textAlign: "left" }}>
                            <strong style={{ color: "var(--primary)" }}>Option A Regrets</strong>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "4px 0 8px" }}>
                              {simulationResults.optionA.regret.explanation}
                            </p>
                            <div className="triggers-container">
                              {simulationResults.optionA.regret.triggers.map((trigger, idx) => (
                                <span key={idx} className="trigger-badge">#{trigger}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="regret-analysis-box" style={{ background: "rgba(255,255,255,0.01)", padding: "15px", borderRadius: "12px" }}>
                          <RegretGauge score={simulationResults.optionB.regret.score} />
                          <div className="regret-info-content" style={{ textAlign: "left" }}>
                            <strong style={{ color: "var(--accent-cyan)" }}>Option B Regrets</strong>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "4px 0 8px" }}>
                              {simulationResults.optionB.regret.explanation}
                            </p>
                            <div className="triggers-container">
                              {simulationResults.optionB.regret.triggers.map((trigger, idx) => (
                                <span key={idx} className="trigger-badge">#{trigger}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline side-by-side (Best scenarios) */}
                    <div className="glass-panel">
                      <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "20px" }}>Timeline Scenario Comparison (Best Case)</h3>
                      
                      <div className="grid-2col" style={{ textAlign: "left" }}>
                        <div>
                          <div className="timeline-column-header" style={{ color: "var(--primary)" }}>
                            <span>🔵</span> Option A - Best-Case Forecast
                          </div>
                          <div className="timeline-vertical-line">
                            {Object.entries(simulationResults.optionA.timeline.best).map(([yearKey, node]) => (
                              <div key={yearKey} className="timeline-node best-scenario">
                                <div className="timeline-dot" style={{ background: "var(--primary)" }}></div>
                                <div className="timeline-node-year">{yearKey}</div>
                                <div className="timeline-node-card">
                                  <div className="timeline-node-headline">{node.headline}</div>
                                  <div className="timeline-node-metrics">
                                    {Object.entries(node.metrics || {}).map(([metricName, val]) => (
                                      <span key={metricName} className={`metric-pill ${metricName}`}>{metricName}: {val}%</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="timeline-column-header" style={{ color: "var(--accent-cyan)" }}>
                            <span>🟢</span> Option B - Best-Case Forecast
                          </div>
                          <div className="timeline-vertical-line">
                            {Object.entries(simulationResults.optionB.timeline.best).map(([yearKey, node]) => (
                              <div key={yearKey} className="timeline-node best-scenario">
                                <div className="timeline-dot" style={{ background: "var(--accent-cyan)" }}></div>
                                <div className="timeline-node-year">{yearKey}</div>
                                <div className="timeline-node-card">
                                  <div className="timeline-node-headline">{node.headline}</div>
                                  <div className="timeline-node-metrics">
                                    {Object.entries(node.metrics || {}).map(([metricName, val]) => (
                                      <span key={metricName} className={`metric-pill ${metricName}`}>{metricName}: {val}%</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Narrative comparison */}
                    <div className="glass-panel" style={{ textAlign: "left" }}>
                      <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "15px" }}>Cinematic Future Diaries (Side-by-Side)</h3>
                      
                      <div className="grid-2col">
                        <div>
                          <strong style={{ color: "var(--primary)", fontFamily: "var(--font-display)", fontSize: "0.95rem" }}>Option A Future Logs</strong>
                          <div className="story-diary" style={{ marginTop: "10px", fontSize: "0.95rem", lineHeight: "1.6" }}>
                            {simulationResults.optionA.story}
                          </div>
                        </div>
                        <div>
                          <strong style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-display)", fontSize: "0.95rem" }}>Option B Future Logs</strong>
                          <div className="story-diary" style={{ marginTop: "10px", fontSize: "0.95rem", lineHeight: "1.6" }}>
                            {simulationResults.optionB.story}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* Tab 4: SWOT & Actionable Playbook Reports */}
        {activeTab === "report" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
            {/* Input Selection Panel */}
            <div className="glass-panel">
              <h2 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "15px" }}>SWOT Matrix Compiler</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
                Generate structural SWOT quadrants and risk mitigation playbook checklists for any selected career path.
              </p>

              <div className="grid-3col" style={{ alignItems: "flex-end" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Target Career Path</label>
                  <select className="form-select" value={reportPath} onChange={(e) => setReportPath(e.target.value)}>
                    <option value="CREATIVE">CREATIVE (Art, Writing, Craft, Baking)</option>
                    <option value="BUSINESS">BUSINESS (Startup, VC, Partnership, Store)</option>
                    <option value="TECH">TECH & CORPORATE (Engineering, Desk Job, Finance)</option>
                    <option value="LIFESTYLE">LIFESTYLE (Remote, Relocate, Digital Nomad)</option>
                    <option value="SOCIAL">SOCIAL & COMMUNITY (Teaching, NGO, Clinic)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Estimated Regret Score ({reportRegret}%)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      className="form-input" 
                      style={{ padding: "5px 0", height: "auto" }}
                      value={reportRegret} 
                      onChange={(e) => setReportRegret(parseInt(e.target.value))} 
                    />
                  </div>
                </div>

                <button onClick={() => compileSWOTReport(reportPath, reportRegret)} className="btn-premium" style={{ width: "100%" }} disabled={reportLoading}>
                  {reportLoading ? "Compiling..." : "Generate Matrix & Playbook"}
                </button>
              </div>
            </div>

            {/* SWOT output */}
            {reportLoading ? (
              <div className="glass-panel" style={{ textAlign: "center", padding: "50px" }}>
                <div className="spinner-outer" style={{ margin: "0 auto 15px" }}></div>
                <div className="pulse-text">Synthesizing SWOT quadrants & Playbooks...</div>
              </div>
            ) : reportResults ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                
                {/* Summary banner */}
                <div className="help-card" style={{ borderLeft: "4px solid var(--accent-cyan)" }}>
                  <div className="help-card-title">Trajectory Advisory consensus</div>
                  <p style={{ color: "#fff", fontSize: "0.95rem" }}>{reportResults.summaryHighlight}</p>
                </div>

                {/* SWOT Grid */}
                <div className="swot-grid" style={{ textAlign: "left" }}>
                  <div className="swot-quadrant s">
                    <div className="swot-title color-TECH">🛡️ Strengths</div>
                    <ul className="swot-list">
                      {reportResults.swot.strengths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="swot-quadrant w">
                    <div className="swot-title color-CREATIVE" style={{ color: "var(--danger)" }}>⚠️ Weaknesses</div>
                    <ul className="swot-list">
                      {reportResults.swot.weaknesses.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="swot-quadrant o">
                    <div className="swot-title color-BUSINESS" style={{ color: "var(--accent-cyan)" }}>⚡ Opportunities</div>
                    <ul className="swot-list">
                      {reportResults.swot.opportunities.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="swot-quadrant t">
                    <div className="swot-title color-LIFESTYLE" style={{ color: "var(--business-color)" }}>🔥 Threats</div>
                    <ul className="swot-list">
                      {reportResults.swot.threats.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actionable Playbook */}
                <div className="glass-panel" style={{ textAlign: "left" }}>
                  <h3 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "15px" }}>Risk Mitigation Action Playbook</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px" }}>
                    Follow these step-by-step procedures to offset regret triggers and structure your launch safely.
                  </p>
                  
                  <div className="playbook-container">
                    {reportResults.playbook.map((step, idx) => (
                      <div key={idx} className="playbook-step">
                        <div className="playbook-number">{idx + 1}</div>
                        <div className="playbook-content">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-panel" style={{ textAlign: "center", padding: "40px" }}>
                <h4 style={{ color: "var(--text-secondary)" }}>Choose path parameters above to compile report</h4>
              </div>
            )}

          </div>
        )}

        {/* Tab 5: Vault Decision History */}
        {activeTab === "history" && (
          <div className="glass-panel" style={{ textAlign: "left" }}>
            <h2 className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "10px" }}>Saved Trajectories Vault</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
              Access and load previously modeled career scenarios from your local SQLite database repository.
            </p>

            {historyLoading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner-outer" style={{ margin: "0 auto" }}></div>
              </div>
            ) : historyItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 10px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "2.5rem" }}>🗄️</div>
                <h4 style={{ marginTop: "10px" }}>The Vault is empty</h4>
                <p style={{ fontSize: "0.8rem", maxWidth: "300px", margin: "5px auto 0" }}>
                  Engage the simulator to model new trajectories. They will be saved here automatically.
                </p>
              </div>
            ) : (
              <div className="history-list">
                {historyItems.map((item) => (
                  <div key={item.id} className="history-item" onClick={() => loadHistoryItem(item)}>
                    <div className="history-meta">
                      <h5>{item.title}</h5>
                      <div className="history-details">
                        <span className="history-badge">{item.mode.toUpperCase()}</span>
                        <span>Saved: {new Date(item.createdAt).toLocaleString()}</span>
                        {item.finalVerdict && item.finalVerdict.riskLevel && (
                          <span style={{ color: item.finalVerdict.riskLevel === "High" ? "var(--danger)" : "var(--tech-color)" }}>
                            Risk: {item.finalVerdict.riskLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="history-actions">
                      <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => loadHistoryItem(item)}>
                        Load 👁️
                      </button>
                      <button className="btn-danger-outline" style={{ padding: "4px 8px" }} onClick={(e) => deleteRecord(item.id, e)}>
                        Purge 🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ marginTop: "30px", borderTop: "1px solid var(--panel-border)", paddingTop: "15px", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
        FutureForge AI // Corporate Trajectory & Decision Intelligence Engine. Pair programming with Antigravity.
      </footer>
    </div>
  );
}

export default App;