import { useState, useRef, useEffect } from "react";

const SCENARIOS = [
  {
    id: "challenger",
    title: "チャレンジャー号爆発事故",
    year: "1986年",
    role: "ロジャー・ボジョレー博士",
    roleEmoji: "👨‍🔬",
    tag: "権威への服従",
    tagColor: "#3C3489",
    tagBg: "#EEEDFE",
    location: "ケネディ宇宙センター",
    date: "1986年1月27日 夜 22:14",
    endDate: "1986年1月28日 11:38",
    initialScene: `電話会議が始まって2時間が経つ。<br/><br/>あなたは<b>ロジャー・ボジョレー</b>、モートン・サイオコール社のエンジニアだ。明日の打ち上げに向け、NASAと最終確認をしている。<br/><br/>窓の外、フロリダの気温は今夜−1℃まで下がる予報。<b>Oリング</b>——ロケットの燃料漏れを防ぐゴム製パーツ——が、低温でひび割れを起こす可能性がある。<br/><br/>NASA側の声が電話から聞こえる。<br/><br/><b>「ボジョレー博士、明日の打ち上げについて、最終的なサインオフをお願いします」</b>`,
    system: `あなたは没入型歴史体験ゲームのナレーターAIです。

設定：1986年1月27日夜、チャレンジャー号打ち上げ前日。プレイヤーはエンジニアのロジャー・ボジョレー博士。

- 「反対・警告・延期」方向→勇気ある行動、歴史を変える可能性
- 「従う・黙る・諦める」方向→悲劇へ
- 曖昧→状況悪化させ再度判断を求める
- 3〜5ターンで終わらせる

必ずJSON形式のみで返答（マークダウン不要）：
{"avatar_state":"15字以内","stress":0-100,"scene":"150字以内の臨場感ある描写。<b>強調</b>可","is_ending":false,"ending_type":"hero or tragedy","ending_title":"タイトル","ending_body":"120字以内","bias_name":"バイアス名","bias_body":"80字以内","stat_pct":"例:68%","stat_outcome":"英雄 or 悲劇"}`
  },
  {
    id: "chernobyl",
    title: "チェルノブイリ原発事故",
    year: "1986年",
    role: "アナトリー・ジャトコフ副所長",
    roleEmoji: "👨‍💼",
    tag: "確証バイアス",
    tagColor: "#712B13",
    tagBg: "#FAECE7",
    location: "チェルノブイリ原子力発電所",
    date: "1986年4月26日 深夜 1:23",
    endDate: "1986年4月26日 以降",
    initialScene: `制御室に警報が鳴り響いている。<br/><br/>あなたは<b>アナトリー・ジャトコフ</b>、チェルノブイリ原発の副所長だ。今夜、4号炉で安全テストを実施していた。<br/><br/>突然、計器が異常値を示した。炉心温度が急上昇している。オペレーターのトップから報告が上がる——<b>「爆発音が2回。炉心が……見えています」</b><br/><br/>しかし、ソ連の原発が爆発するはずがない。設計上、それは不可能だ。上層部への報告も頭をよぎる。<br/><br/><b>「副所長、避難命令を出しますか？それとも状況を確認してから報告しますか？」</b>`,
    system: `あなたは没入型歴史体験ゲームのナレーターAIです。

設定：1986年4月26日深夜、チェルノブイリ原発4号炉爆発直後。プレイヤーは副所長アナトリー・ジャトコフ。

- 「即時避難・正直に報告・住民を守る」方向→被害を最小化できる英雄ルート
- 「隠蔽・否定・上層部への忖度」方向→歴史通り被害拡大の悲劇ルート
- 「ソ連の原発は爆発しない」という確証バイアスがテーマ
- 3〜5ターンで終わらせる

必ずJSON形式のみで返答（マークダウン不要）：
{"avatar_state":"15字以内","stress":0-100,"scene":"150字以内の臨場感ある描写。<b>強調</b>可","is_ending":false,"ending_type":"hero or tragedy","ending_title":"タイトル","ending_body":"120字以内","bias_name":"バイアス名","bias_body":"80字以内","stat_pct":"例:71%","stat_outcome":"英雄 or 悲劇"}`
  },
  {
    id: "titanic",
    title: "タイタニック沈没",
    year: "1912年",
    role: "エドワード・スミス船長",
    roleEmoji: "👨‍✈️",
    tag: "正常性バイアス",
    tagColor: "#085041",
    tagBg: "#E1F5EE",
    location: "北大西洋 タイタニック艦橋",
    date: "1912年4月14日 夜 23:40",
    endDate: "1912年4月15日 02:20",
    initialScene: `艦橋に緊張が走った。<br/><br/>あなたは<b>エドワード・スミス船長</b>、白星汽船の誇る最高船長だ。引退航海となるこの処女航海、タイタニックは快調に大西洋を進んでいた。<br/><br/>今日だけで<b>6通の氷山警告</b>を受け取っている。しかし海は穏やかで、視界も良好だ。そして——轟音。<br/><br/>「船長！前方の氷山と接触しました。右舷に損傷の可能性があります」<br/><br/>設計士は「タイタニックは絶対に沈まない」と言っていた。乗客には何も知らせていない。<br/><br/><b>「船長、今すぐ全乗客を甲板へ呼集しますか？」</b>`,
    system: `あなたは没入型歴史体験ゲームのナレーターAIです。

設定：1912年4月14日夜、タイタニック氷山接触直後。プレイヤーはスミス船長。

- 「即座に総員退去・救命ボートを全て下ろす・SOSを打つ」方向→より多くを救える英雄ルート
- 「パニックを避けようとする・過小評価・判断を先延ばし」方向→歴史通り1500名死亡の悲劇ルート
- 「まさか沈まないだろう」という正常性バイアスがテーマ
- 3〜5ターンで終わらせる

必ずJSON形式のみで返答（マークダウン不要）：
{"avatar_state":"15字以内","stress":0-100,"scene":"150字以内の臨場感ある描写。<b>強調</b>可","is_ending":false,"ending_type":"hero or tragedy","ending_title":"タイトル","ending_body":"120字以内","bias_name":"バイアス名","bias_body":"80字以内","stat_pct":"例:79%","stat_outcome":"英雄 or 悲劇"}`
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
    setAvatarState("緊張している — 判断を迫られている");
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
        parsed = { scene: "通信が乱れた……もう一度行動してください。", avatar_state: "混乱している", stress: 50, is_ending: false };
      }
      const updatedHistory = [...newHistory, { role: "assistant", content: text }];
      setHistory(updatedHistory);
      setAvatarState(parsed.avatar_state || avatarState);
      setStress(parsed.stress ?? stress);

      if (parsed.is_ending) {
        setEnding(parsed);
        if (!cleared.includes(currentScenario.id)) {
          setCleared([...cleared, currentScenario.id]);
        }
        setScreen("ending");
      } else {
        setSceneText(parsed.scene || "");
        setLog([...newLog, { type: "result", text: parsed.scene || "" }]);
      }
    } catch {
      setLog([...newLog, { type: "result", text: "エラーが発生しました。もう一度お試しください。" }]);
    }
    setLoading(false);
  }

  function retry() {
    startScenario(currentScenario);
  }

  function goLobby() {
    setScreen("lobby");
    setCurrentScenario(null);
  }

  if (screen === "lobby") {
    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#0d0d0d", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ color: "#444", fontSize: 11, letterSpacing: "0.12em", marginBottom: 4 }}>MUSEUM OF WORST DECISIONS</div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 500, marginBottom: 4 }}>あの日、あなたがいたら。</div>
          <div style={{ color: "#555", fontSize: 12, lineHeight: 1.6 }}>歴史の分岐点を体験する没入型ドキュメンタリーゲーム<br/>あなたの言葉が、歴史を変える。</div>
        </div>
        <div style={{ fontSize: 11, color: "#aaa" }}>展示室 — {cleared.length}/{SCENARIOS.length} クリア済み</div>
        {SCENARIOS.map((s) => (
          <div key={s.id} onClick={() => startScenario(s)} style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "14px 16px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#aaa" }}>{s.year}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {cleared.includes(s.id) && <span style={{ fontSize: 10, background: "#EAF3DE", color: "#3B6D11", padding: "2px 8px", borderRadius: 20 }}>クリア済</span>}
                <span style={{ fontSize: 11, background: s.tagBg, color: s.tagColor, padding: "2px 10px", borderRadius: 20 }}>{s.tag}</span>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#111" }}>{s.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{s.roleEmoji}</span>
              <span style={{ fontSize: 12, color: "#888" }}>{s.role} として体験</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (screen === "main" && currentScenario) {
    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={goLobby} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#888", textAlign: "left", padding: 0 }}>← 展示室に戻る</button>
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
          <div style={{ fontSize: 11, color: "#aaa" }}>緊張度 {stress}%</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#888" }}>あなたはどうする？ 自分の言葉で入力してください</div>
          <textarea value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAction(); } }} placeholder="思ったままの行動を入力… (Enterで送信)" style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "0.5px solid #ccc", borderRadius: 8, resize: "none", height: 70, outline: "none", fontFamily: "inherit", color: "#1a1a1a", background: "#fff", boxSizing: "border-box" }} />
          <button onClick={submitAction} disabled={loading || !inputVal.trim()} style={{ padding: 11, border: "0.5px solid #ccc", borderRadius: 8, background: "#fff", color: "#1a1a1a", fontSize: 13, cursor: "pointer", opacity: loading || !inputVal.trim() ? 0.5 : 1 }}>
            {loading ? "AIが状況を分析中..." : "行動する →"}
          </button>
        </div>
        {log.length > 0 && (
          <div ref={logRef} style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
            {log.map((entry, i) => (
              <div key={i} style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #e0e0e0", background: entry.type === "result" ? "#f9f9f9" : "#fff", lineHeight: 1.6 }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 2 }}>{entry.type === "you" ? "あなたの行動" : "状況の変化"}</div>
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
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>このケースで働いた心理バイアス</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a", marginBottom: 4 }}>{ending.bias_name}</div>
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{ending.bias_body}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#f5f5f3", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#1a1a1a" }}>{ending.stat_pct}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>が同じ判断をした</div>
          </div>
          <div style={{ background: "#f5f5f3", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: ending.ending_type === "hero" ? "#0F6E56" : "#A32D2D", marginTop: 4 }}>{ending.stat_outcome}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>あなたの結末</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={retry} style={{ padding: 11, border: "0.5px solid #ccc", borderRadius: 8, background: "#fff", color: "#1a1a1a", fontSize: 13, cursor: "pointer" }}>もう一度やり直す</button>
          <button onClick={goLobby} style={{ padding: 11, border: "0.5px solid #ccc", borderRadius: 8, background: "#fff", color: "#1a1a1a", fontSize: 13, cursor: "pointer" }}>他の展示室へ →</button>
        </div>
      </div>
    );
  }

  return null;
}
