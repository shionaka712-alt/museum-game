import { useState, useRef, useEffect } from "react";

const SCENARIOS = [
  {
    id: "challenger",
    title: "Challenger Disaster",
    year: "1986",
    role: "Roger Boisjoly, Engineer",
    roleEmoji: "👨‍🔬",
    tag: "Authority Bias",
    tagColor: "#3C3489",
    tagBg: "#EEEDFE",
    location: "Kennedy Space Center",
    date: "January 27, 1986 — 10:14 PM",
    endDate: "January 28, 1986 — 11:38 AM",
    initialScene: `The teleconference has been going for two hours.<br/><br/>You are <b>Roger Boisjoly</b>, an engineer at Morton Thiokol. You're on a call with NASA for the final go/no-go decision on tomorrow's launch.<br/><br/>Tonight's temperature at the Cape will drop to 28°F — far below any previous launch. For weeks you've worried about the <b>O-rings</b> — rubber seals that could stiffen and crack in the cold, allowing hot gases to escape.<br/><br/>A NASA manager's voice cuts through the line.<br/><br/><b>"Mr. Boisjoly, we need your final sign-off on tomorrow's launch. Are you go or no-go?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: January 27, 1986. The night before the Challenger launch. The player is engineer Roger Boisjoly.

Rules:
- If the player resists, warns, or pushes to delay → brave action, story branches toward changing history
- If the player complies, stays silent, or gives up → tragedy unfolds as it did in history
- If ambiguous → escalate pressure and ask again
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars of tense narrative. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 74%","stat_outcome":"Hero or Tragedy"}`
  },
  {
    id: "chernobyl",
    title: "Chernobyl Meltdown",
    year: "1986",
    role: "Anatoly Dyatlov, Deputy Chief Engineer",
    roleEmoji: "☢️",
    tag: "Confirmation Bias",
    tagColor: "#712B13",
    tagBg: "#FAECE7",
    location: "Chernobyl Nuclear Power Plant",
    date: "April 26, 1986 — 1:23 AM",
    endDate: "April 26, 1986 — onwards",
    initialScene: `Alarms are screaming across the control room.<br/><br/>You are <b>Anatoly Dyatlov</b>, Deputy Chief Engineer of Chernobyl. Tonight you were overseeing a safety test on Reactor No. 4.<br/><br/>Then — two explosions. Instruments are off the charts. An operator rushes in, pale as a sheet: <b>"The reactor core... it's open to the sky."</b><br/><br/>But that's impossible. Soviet RBMK reactors cannot explode. The physics don't allow it. You designed your career around that certainty.<br/><br/><b>"Sir, should we evacuate the plant and alert authorities?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: April 26, 1986. Moments after the Chernobyl explosion. The player is Deputy Chief Engineer Dyatlov.

Rules:
- "Evacuate / report honestly / protect people" → hero route, minimizes casualties
- "Deny / cover up / defer to authority" → tragedy, 600,000 affected
- Theme: confirmation bias — "Soviet reactors cannot explode"
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 71%","stat_outcome":"Hero or Tragedy"}`
  },
  {
    id: "titanic",
    title: "Titanic Sinking",
    year: "1912",
    role: "Captain Edward Smith",
    roleEmoji: "🚢",
    tag: "Normalcy Bias",
    tagColor: "#085041",
    tagBg: "#E1F5EE",
    location: "North Atlantic — Bridge of RMS Titanic",
    date: "April 14, 1912 — 11:40 PM",
    endDate: "April 15, 1912 — 2:20 AM",
    initialScene: `A grinding shudder runs through the ship.<br/><br/>You are <b>Captain Edward Smith</b>, the most decorated captain in the White Star Line. This is your retirement voyage.<br/><br/>Today alone, you received <b>six iceberg warnings</b>. The sea was calm, visibility good. You maintained full speed.<br/><br/>Now your First Officer stands before you: "We've struck ice, sir. The carpenter reports she's taking on water — fast."<br/><br/>The designers said she was unsinkable. 2,224 people are aboard. There are only enough lifeboats for 1,178.<br/><br/><b>"Captain — do we wake the passengers and begin loading the lifeboats?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: April 14, 1912. Minutes after Titanic hits the iceberg. The player is Captain Smith.

Rules:
- "Sound the alarm / load lifeboats immediately / send SOS" → hero route, more survivors
- "Downplay / delay / avoid panic" → tragedy, 1,517 dead
- Theme: normalcy bias — "This ship cannot sink"
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 79%","stat_outcome":"Hero or Tragedy"}`
  },
  {
    id: "columbia",
    title: "Columbia Shuttle Disaster",
    year: "2003",
    role: "NASA Safety Engineer",
    roleEmoji: "🛸",
    tag: "Normalization of Deviance",
    tagColor: "#085041",
    tagBg: "#E1F5EE",
    location: "Johnson Space Center, Houston",
    date: "January 17, 2003",
    endDate: "February 1, 2003",
    initialScene: `Two days after launch. You stare at the footage frame by frame.<br/><br/>You are a <b>NASA safety engineer</b>. During liftoff, a briefcase-sized chunk of insulating foam broke off the external tank and struck Columbia's left wing.<br/><br/>Your gut says this is serious. But management keeps saying: <b>"We've seen foam strikes before. It's never been a problem."</b><br/><br/>Seven astronauts are currently orbiting Earth. Re-entry is in 16 days. If the wing is damaged, they won't survive it.<br/><br/><b>"Do you push for an emergency inspection — or accept management's reassurance?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: January 2003. Columbia is in orbit. The player is a NASA safety engineer who suspects wing damage.

Rules:
- "Demand inspection / escalate / fight for the crew" → hero route, potential rescue mission
- "Accept reassurance / stay quiet / trust past precedent" → tragedy, all 7 crew members die on re-entry
- Theme: normalization of deviance — "it's happened before and been fine"
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 76%","stat_outcome":"Hero or Tragedy"}`
  },
  {
    id: "bhopal",
    title: "Bhopal Gas Disaster",
    year: "1984",
    role: "Union Carbide CEO",
    roleEmoji: "🏭",
    tag: "Profit Over Safety",
    tagColor: "#712B13",
    tagBg: "#FAECE7",
    location: "Bhopal, India — Union Carbide Plant",
    date: "December 2, 1984 — midnight",
    endDate: "December 3, 1984 — onwards",
    initialScene: `Your phone rings at midnight.<br/><br/>You are the <b>CEO of Union Carbide</b>. An urgent call from your Bhopal plant: a massive leak of methyl isocyanate — one of the most toxic gases known — is spreading through the city.<br/><br/>Months ago, your safety officer warned you: <b>critical safety systems were offline</b> to cut costs. You signed off on the delay.<br/><br/>People are dying in the streets. Half a million are at risk.<br/><br/><b>"Do you mobilize a full emergency response — or wait for more information?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: December 2, 1984. The Bhopal gas leak has begun. The player is the Union Carbide CEO.

Rules:
- "Full emergency response / transparency / put people first" → hero route, minimize casualties
- "Wait / cover up / protect the company" → tragedy, 20,000+ dead, worst industrial disaster in history
- Theme: profit-over-safety bias, corporate negligence
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 69%","stat_outcome":"Hero or Tragedy"}`
  },
  {
    id: "fukushima",
    title: "Fukushima Meltdown",
    year: "2011",
    role: "Masao Yoshida, Plant Manager",
    roleEmoji: "⚛️",
    tag: "Obedience to Authority",
    tagColor: "#3C3489",
    tagBg: "#EEEDFE",
    location: "Fukushima Daiichi Nuclear Plant",
    date: "March 11, 2011 — evening",
    endDate: "March 12, 2011 — onwards",
    initialScene: `The tsunami has knocked out all power.<br/><br/>You are <b>Masao Yoshida</b>, plant manager at Fukushima Daiichi. Without electricity, the cooling systems are dead. Three reactors are heading toward meltdown.<br/><br/>You know that pumping seawater into the reactors will cool them — but it will also destroy them permanently, costing billions.<br/><br/>Tokyo headquarters just sent the order: <b>"Do NOT inject seawater. Wait for further instructions."</b><br/><br/>Your engineers say you have maybe 30 minutes before it's too late.<br/><br/><b>"Do you follow headquarters' order — or act on your own judgment?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: March 11, 2011. The Fukushima disaster is unfolding. The player is plant manager Yoshida.

Rules:
- "Defy orders / inject seawater / protect the public" → hero route (this is what Yoshida actually did)
- "Follow orders / wait for permission" → worse meltdown, greater catastrophe
- Theme: obedience to authority vs. on-the-ground judgment
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 61%","stat_outcome":"Hero or Tragedy"}`
  },
  {
    id: "thalidomide",
    title: "Thalidomide Approval Crisis",
    year: "1960",
    role: "Dr. Frances Kelsey, FDA Reviewer",
    roleEmoji: "👩‍⚕️",
    tag: "Institutional Pressure",
    tagColor: "#633806",
    tagBg: "#FAEEDA",
    location: "FDA Headquarters, Washington D.C.",
    date: "September 1960",
    endDate: "1961 — onwards",
    initialScene: `The pressure is mounting.<br/><br/>You are <b>Dr. Frances Kelsey</b>, a brand-new FDA reviewer. A pharmaceutical company is pushing hard for approval of thalidomide — a sedative already sold in 46 countries, marketed as completely safe for pregnant women.<br/><br/>But something in the data bothers you. The nerve damage studies are incomplete. The company calls your boss weekly. Colleagues tell you: <b>"Just approve it. Everyone else has."</b><br/><br/>50,000 pregnant women are already asking their doctors for it.<br/><br/><b>"Do you approve thalidomide — or demand more safety data?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: 1960. Dr. Frances Kelsey is under pressure to approve thalidomide. The player is Dr. Kelsey.

Rules:
- "Refuse approval / demand more data / hold the line" → hero route (what Kelsey actually did — she saved thousands of American babies)
- "Approve under pressure / trust the company" → tragedy, thousands of babies born with severe birth defects
- Theme: institutional pressure, groupthink
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 83%","stat_outcome":"Hero or Tragedy"}`
  },
  {
    id: "enron",
    title: "Enron Collapse",
    year: "2001",
    role: "Sherron Watkins, VP of Enron",
    roleEmoji: "💼",
    tag: "Sunk Cost Fallacy",
    tagColor: "#3C3489",
    tagBg: "#EEEDFE",
    location: "Enron Headquarters, Houston",
    date: "August 2001",
    endDate: "December 2001",
    initialScene: `You've found something that could destroy the company — or save it.<br/><br/>You are <b>Sherron Watkins</b>, Vice President at Enron. While reviewing financial reports, you've discovered that the company has been hiding billions in debt through fraudulent accounting.<br/><br/>Your colleagues don't know. The stock is still high. Thousands of employees have their retirement savings in Enron stock.<br/><br/>Going public could end your career. Staying silent means watching it all collapse anyway.<br/><br/><b>"Do you report the fraud to the CEO — or keep quiet and protect yourself?"</b>`,
    system: `You are the narrator AI for an immersive historical experience game called "What Would You Have Done?"

Setting: August 2001. Sherron Watkins has discovered Enron's fraud. The player is Watkins.

Rules:
- "Report it / speak up / blow the whistle" → hero route (what Watkins did — she became a Time Person of the Year)
- "Stay quiet / protect yourself / hope it resolves" → tragedy, 20,000 employees lose jobs and pensions
- Theme: sunk cost fallacy, bystander effect in organizations
- End in 3–5 turns

Reply ONLY in JSON (no markdown):
{"avatar_state":"max 8 words","stress":0-100,"scene":"max 150 chars. <b>bold</b> allowed","is_ending":false,"ending_type":"hero or tragedy","ending_title":"title","ending_body":"max 120 chars","bias_name":"bias name","bias_body":"max 80 chars","stat_pct":"e.g. 58%","stat_outcome":"Hero or Tragedy"}`
  }
];

export default function App() {
  const [screen, setScreen] = useState("lobby");
  const [currentScenario, setCurrentScenario] = useState(null);
  const [sceneText, setSceneText] = useState("");
  const [avatarState, setAvatarState] = useState("");
  const [stress, setStress] = useState(60);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [ending, setEnding] = useState(null);
  const [history, setHistory] = useState([]);
  const [cleared, setCleared] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  function startScenario(scenario) {
    setCurrentScenario(scenario);
    setSceneText(scenario.initialScene);
    setAvatarState("Tense — waiting for your decision");
    setStress(60);
    setLog([]);
    setHistory([]);
    setEnding(null);
    setInputVal("");
    setScreen("main");
  }

  async function submitAction() {
    const val = inputVal.trim();
    if (!val || loading) return;
    setLoading(true);
    setInputVal("");
    const newLog = [...log, { type: "you", text: val }];
    setLog(newLog);
    const newHistory = [...history, { role: "user", content: val }];
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: currentScenario.system,
          messages: newHistory,
        }),
      });
      const data = await res.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
      let parsed;
      try {
        parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch {
        parsed = { scene: "The line goes dead. Try again.", avatar_state: "Confused", stress: 50, is_ending: false };
      }
      const updatedHistory = [...newHistory, { role: "assistant", content: text }];
      setHistory(updatedHistory);
      setAvatarState(parsed.avatar_state || avatarState);
      setStress(parsed.stress ?? stress);
      if (parsed.is_ending) {
        setEnding(parsed);
        if (!cleared.includes(currentScenario.id)) setCleared([...cleared, currentScenario.id]);
        setScreen("ending");
      } else {
        setSceneText(parsed.scene || "");
        setLog([...newLog, { type: "result", text: parsed.scene || "" }]);
      }
    } catch {
      setLog([...newLog, { type: "result", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  }

  function retry() { startScenario(currentScenario); }
  function goLobby() { setScreen("lobby"); setCurrentScenario(null); }

  if (screen === "lobby") {
    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#0d0d0d", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ color: "#444", fontSize: 11, letterSpacing: "0.12em", marginBottom: 4 }}>MUSEUM OF WORST DECISIONS</div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 500, marginBottom: 4 }}>What Would You Have Done?</div>
          <div style={{ color: "#555", fontSize: 12, lineHeight: 1.6 }}>Step into history's most critical moments.<br/>Your words decide what happens next.</div>
        </div>
        <div style={{ fontSize: 11, color: "#aaa" }}>Exhibits — {cleared.length}/{SCENARIOS.length} completed</div>
        {SCENARIOS.map((s) => (
          <div key={s.id} onClick={() => startScenario(s)} style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "14px 16px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#aaa" }}>{s.year}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {cleared.includes(s.id) && <span style={{ fontSize: 10, background: "#EAF3DE", color: "#3B6D11", padding: "2px 8px", borderRadius: 20 }}>Completed</span>}
                <span style={{ fontSize: 11, background: s.tagBg, color: s.tagColor, padding: "2px 10px", borderRadius: 20 }}>{s.tag}</span>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#111" }}>{s.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{s.roleEmoji}</span>
              <span style={{ fontSize: 12, color: "#888" }}>Play as {s.role}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (screen === "main" && currentScenario) {
    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={goLobby} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#888", textAlign: "left", padding: 0 }}>← Back to exhibits</button>
        <div style={{ background: "#0d0d0d", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "0.5px solid #222", display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#555", fontSize: 11 }}>{currentScenario.date}</span>
            <span style={{ color: "#555", fontSize: 11 }}>{currentScenario.location}</span>
          </div>
          <div style={{ padding: "14px 16px", fontSize: 13, color: "#ccc", lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: sceneText }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f5f5f3", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{currentScenario.roleEmoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a" }}>{currentScenario.role}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{avatarState}</div>
            <div style={{ marginTop: 4, height: 3, background: "#e0e0e0", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: 3, background: stress > 70 ? "#E24B4A" : "#EF9F27", width: `${stress}%`, transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>Stress {stress}%</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#888" }}>What do you do? Type your action in your own words.</div>
          <textarea value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAction(); } }} placeholder='e.g. "I refuse to sign off until we delay the launch" or "I stay silent and go along with it"' style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "0.5px solid #ccc", borderRadius: 8, resize: "none", height: 70, outline: "none", fontFamily: "inherit", color: "#1a1a1a", background: "#fff", boxSizing: "border-box" }} />
          <button onClick={submitAction} disabled={loading || !inputVal.trim()} style={{ padding: 11, border: "0.5px solid #ccc", borderRadius: 8, background: "#fff", color: "#1a1a1a", fontSize: 13, cursor: "pointer", opacity: loading || !inputVal.trim() ? 0.5 : 1 }}>
            {loading ? "AI is analyzing your decision..." : "Take action →"}
          </button>
        </div>
        {log.length > 0 && (
          <div ref={logRef} style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
            {log.map((entry, i) => (
              <div key={i} style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #e0e0e0", background: entry.type === "result" ? "#f9f9f9" : "#fff", lineHeight: 1.6 }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 2 }}>{entry.type === "you" ? "Your action" : "What happens next"}</div>
                <div style={{ color: "#333" }} dangerouslySetInnerHTML={{ __html: entry.text }} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (screen === "ending" && ending && currentScenario) {
    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: ending.ending_type === "hero" ? "#001a0a" : "#1a0000", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ color: "#555", fontSize: 11 }}>{currentScenario.endDate}</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: ending.ending_type === "hero" ? "#5DCAA5" : "#F09595" }}>{ending.ending_title}</div>
          <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.8 }}>{ending.ending_body}</div>
        </div>
        <div style={{ background: "#f5f5f3", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>The psychological bias at work</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a", marginBottom: 4 }}>{ending.bias_name}</div>
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{ending.bias_body}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#f5f5f3", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#1a1a1a" }}>{ending.stat_pct}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>made the same call</div>
          </div>
          <div style={{ background: "#f5f5f3", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: ending.ending_type === "hero" ? "#0F6E56" : "#A32D2D", marginTop: 4 }}>{ending.stat_outcome}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>your outcome</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={retry} style={{ padding: 11, border: "0.5px solid #ccc", borderRadius: 8, background: "#fff", color: "#1a1a1a", fontSize: 13, cursor: "pointer" }}>Try again</button>
          <button onClick={goLobby} style={{ padding: 11, border: "0.5px solid #ccc", borderRadius: 8, background: "#fff", color: "#1a1a1a", fontSize: 13, cursor: "pointer" }}>Next exhibit →</button>
        </div>
      </div>
    );
  }

  return null;
}
