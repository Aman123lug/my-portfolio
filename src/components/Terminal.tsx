import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Terminal.css';

type LineKind = 'cmd' | 'out' | 'ok' | 'err' | 'dim' | 'accent' | 'link';

interface Line {
  id: number;
  kind: LineKind;
  text: string;
  href?: string;
}

const PROMPT = 'aman@portfolio:~$';

const HELP: [string, string][] = [
  ['whoami', 'who is this guy?'],
  ['experience', 'stream my career log in realtime'],
  ['skills', 'tech stack with proficiency bars'],
  ['neofetch', 'system info card'],
  ['projects', 'jump to my work'],
  ['contact', 'reach me'],
  ['sudo hire-me', 'you know you want to'],
  ['ls / cat <file>', 'poke around the filesystem'],
  ['clear', 'wipe the screen'],
];

const FILES = ['experience.log', 'skills.json', 'projects.md', 'about.txt', 'resume.pdf'];

export default function Terminal() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([]);
  const [typed, setTyped] = useState(''); // text shown while autoplay "types"
  const [interactive, setInteractive] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const alive = useRef(true);
  const started = useRef(false);
  const nextId = useRef(0);
  const history = useRef<string[]>([]);
  const histPos = useRef(-1);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sleep = (ms: number) =>
    new Promise<void>((res) => setTimeout(res, reducedMotion ? 0 : ms));

  const push = useCallback((kind: LineKind, text: string, href?: string) => {
    const id = nextId.current++;
    setLines((prev) => [...prev, { id, kind, text, href }]);
    return id;
  }, []);

  const patch = useCallback((id: number, text: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, text } : l)));
  }, []);

  // keep scrolled to bottom
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typed, input]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const progressBar = async (label: string, ms = 500) => {
    const id = push('dim', `${label} ░░░░░░░░░░ 0%`);
    for (let f = 1; f <= 10; f++) {
      if (!alive.current) return;
      await sleep(ms / 10);
      patch(id, `${label} ${'█'.repeat(f)}${'░'.repeat(10 - f)} ${f * 10}%`);
    }
  };

  const stream = async (
    rows: [LineKind, string, string?][],
    delay = 55
  ) => {
    for (const [kind, text, href] of rows) {
      if (!alive.current) return;
      push(kind, text, href);
      await sleep(delay);
    }
  };

  /* ---------- command implementations ---------- */

  const cmdWhoami = () =>
    stream([
      ['accent', 'Aman Kumar — AI Engineer / FDE @ Ghaia.ai (Doha, Qatar · remote)'],
      ['out', 'MLflow Ambassador · GSoC 2024 · 2x Google Cloud Facilitator'],
      ['dim', 'multi-agent systems · production RAG · memory-first agent architectures'],
    ]);

  const cmdExperience = async () => {
    push('dim', 'streaming career.log ...');
    await progressBar('loading experience', 600);
    await stream(
      [
        ['ok', '[Apr 2025 → present]  AI Engineer / FDE · Ghaia.ai (Doha, Qatar) ● RUNNING'],
        ['dim', '   └─ 140+ releases shipped · 20+ POCs for customers & government clients'],
        ['dim', '   └─ multi-agent orchestration (MS Agent Framework) · memory-first adaptive agents'],
        ['dim', '   └─ graph memory (Apache AGE): −40% clarifications · multimodal RAG: +76% Q&A'],
        ['ok', '[Mar 2024 → present]  MLflow Ambassador · MLflow Core Team       ● ACTIVE'],
        ['dim', '   └─ release management · technical blogs · community & devrel'],
        ['out', '[Feb 2025 → May 2025] Freelance ETL Developer · Reg30 (India)   ✔ done'],
        ['dim', '   └─ BSE/NSE/SEBI pipelines · Playwright + rate limiting · multi-agent scraping'],
        ['out', '[Oct 2024 → Feb 2025] AI/ML Engineer · CareerOS (Barcelona)     ✔ done'],
        ['dim', '   └─ PostgreSQL → BigQuery streaming (Dataflow) · anti-hallucination guardrails'],
        ['out', '[May 2024 → Oct 2024] GSoC 2024 · Google / openSUSE             ✔ done'],
        ['dim', '   └─ GenAI + MLOps/LLMOps for healthcare · K8s edge analytics (Rancher)'],
        ['out', '[May 2023 → Oct 2023] Data Scientist Intern · DataKnobs         ✔ done'],
        ['dim', '   └─ multi-doc summarization · NLP bots · K8s · Docker · GCP'],
        ['out', '[2022 → 2025]         B.Tech CSE · Maharishi Dayanand Univ.     ✔ done'],
      ],
      120
    );
    push('accent', '8 entries · 2 processes still running · exit code 0');
  };

  const cmdSkills = () =>
    stream(
      [
        ['accent', 'GenAI / Agents   ██████████░ 95%'],
        ['dim', '   LangChain · LangGraph · MS Agent Framework · AutoGen · MCP (FastMCP) · CUDA'],
        ['accent', 'RAG / VectorDB   ██████████░ 95%'],
        ['dim', '   multimodal RAG · Pinecone · SingleStore · LightRAG · graph memory (Apache AGE)'],
        ['accent', 'Fine-tuning      █████████░░ 90%'],
        ['dim', '   QLoRA · PEFT · Transformers · PyTorch · TensorFlow · Keras'],
        ['accent', 'MLOps / Backend  ██████████░ 95%'],
        ['dim', '   FastAPI · Flask · MLflow · Kubeflow · DVC · Docker · K8s · Prometheus · Grafana'],
        ['accent', 'Cloud            █████████░░ 90%'],
        ['dim', '   Azure (complete) · GCP (Dataflow · pub/sub · Cloud Run) · AWS'],
      ],
      90
    );

  const cmdProjects = () =>
    stream(
      [
        ['accent', 'MedSathi — medical RAG assistant'],
        ['dim', '   Gemini · Pinecone · LightRAG graph retrieval · Flask + Streamlit'],
        ['accent', 'Deep Research Agent — supervisor/worker multi-agent system'],
        ['dim', '   LangGraph · Groq Llama-3 · DataStax Astra DB · LangSmith tracing'],
        ['accent', 'Job-Matchmaker — resume ↔ JD semantic ranking'],
        ['dim', '   RAG over live job postings · Docker · Kubernetes + Kustomize'],
        ['accent', 'Mistral-7B Fine-Tuning — QLoRA 4-bit'],
        ['dim', '   GPU memory 28GB → 10GB · HuggingFace PEFT · perplexity evals'],
        ['dim', "run 'projects --open' for the full page"],
      ],
      80
    );

  const cmdNeofetch = () =>
    stream(
      [
        ['accent', '   ▄▄▄▄▄▄▄▄▄▄     aman@portfolio'],
        ['accent', '  █  ▄▄  ▄▄  █    ─────────────────────────────'],
        ['accent', '  █  ██  ██  █    OS:       AmanOS v23 (Delhi, India)'],
        ['accent', '  █    ▄▄    █    Host:     Ghaia.ai — AI Engineer / FDE'],
        ['accent', '  █  ▀▄▄▄▄▀  █    Kernel:   agent-framework-25.4-multimodal'],
        ['accent', '  █          █    Shell:    LLM (function-calling enabled)'],
        ['accent', '   ▀▀▀▀▀▀▀▀▀▀     Uptime:   3+ years in AI/ML · 140+ releases'],
        ['out', '                  Packages: agents, RAG, MCP, guardrails, MLOps'],
        ['out', '                  GPU:      whatever the cloud gives me'],
        ['out', '                  Memory:   4-layer + graph-augmented (Apache AGE)'],
      ],
      60
    );

  const cmdContact = () =>
    stream(
      [
        ['out', 'opening channels ...'],
        ['link', '  ✉  ak06465676@gmail.com', 'mailto:ak06465676@gmail.com'],
        ['link', '  ⌁  linkedin.com/in/aman-kumar-5bb609228', 'https://www.linkedin.com/in/aman-kumar-5bb609228/'],
        ['link', '  ⌥  github.com/Aman123lug', 'https://github.com/Aman123lug'],
        ['link', '  ✍  amanblog.hashnode.dev', 'https://amanblog.hashnode.dev/'],
        ['dim', "or just run: sudo hire-me"],
      ],
      70
    );

  const cmdHireMe = async () => {
    push('dim', '[sudo] password for visitor: ');
    await sleep(400);
    patch(nextId.current - 1, '[sudo] password for visitor: ********');
    await sleep(500);
    push('ok', 'ACCESS GRANTED ✔');
    await progressBar('opening secure channel to Aman', 800);
    push('accent', 'redirecting to /contact ...');
    await sleep(700);
    if (alive.current) navigate('/contact');
  };

  const cmdHelp = () =>
    stream(
      HELP.map(([c, d]) => ['out', `  ${c.padEnd(16)} ${d}`] as [LineKind, string]),
      40
    );

  const run = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setBusy(true);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);

    switch (true) {
      case name === 'help':
        await cmdHelp();
        break;
      case name === 'whoami':
        await cmdWhoami();
        break;
      case ['experience', 'exp', 'career'].includes(name) ||
        (name === 'cat' && args[0] === 'experience.log') ||
        cmd === './run_experience.sh --realtime':
        await cmdExperience();
        break;
      case name === 'skills' || (name === 'cat' && args[0] === 'skills.json'):
        await cmdSkills();
        break;
      case name === 'neofetch':
        await cmdNeofetch();
        break;
      case name === 'contact':
        await cmdContact();
        break;
      case name === 'sudo' && args.join(' ') === 'hire-me':
        await cmdHireMe();
        break;
      case name === 'hire-me':
        push('err', 'permission denied — try: sudo hire-me');
        break;
      case name === 'projects' && args[0] === '--open':
        push('accent', 'opening /projects ...');
        await sleep(600);
        if (alive.current) navigate('/projects');
        break;
      case name === 'projects' || (name === 'cat' && args[0] === 'projects.md'):
        await cmdProjects();
        break;
      case name === 'blog':
        push('accent', 'opening blog ...');
        window.open('https://amanblog.hashnode.dev/', '_blank');
        break;
      case name === 'ls':
        push('out', FILES.join('   '));
        break;
      case name === 'cat' && args[0] === 'about.txt':
        await cmdWhoami();
        break;
      case name === 'cat' && args[0] === 'resume.pdf':
        push('err', 'binary file — ask me for it: contact');
        break;
      case name === 'cat':
        push('err', `cat: ${args[0] ?? ''}: no such file`);
        break;
      case name === 'clear':
        setLines([]);
        break;
      case name === 'rm':
        push('err', 'rm: permission denied — nice try 😄');
        break;
      case ['vim', 'vi', 'nano', 'emacs'].includes(name):
        push('out', 'you are now trapped in vim. just kidding — :q!');
        break;
      case name === 'exit' || name === 'logout':
        push('dim', 'there is no escape. try `contact` instead.');
        break;
      case name === 'python' || name === 'python3':
        push('out', '>>> import aman as ai_engineer  # already running');
        break;
      case name === 'pwd':
        push('out', '/home/aman/portfolio');
        break;
      default:
        push('err', `command not found: ${name} — try 'help'`);
    }

    setBusy(false);
  };

  /* ---------- autoplay demo on first scroll into view ---------- */

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const typeCmd = async (cmd: string) => {
          for (let i = 1; i <= cmd.length; i++) {
            if (!alive.current) return;
            setTyped(cmd.slice(0, i));
            await sleep(30 + Math.random() * 45);
          }
          await sleep(250);
          setTyped('');
          push('cmd', cmd);
        };

        await sleep(400);
        await typeCmd('whoami');
        await cmdWhoami();
        await sleep(600);
        await typeCmd('./run_experience.sh --realtime');
        await cmdExperience();
        await sleep(300);
        push('dim', " ");
        push('accent', "→ your turn. type 'help' to explore.");
        setInteractive(true);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- input handling ---------- */

  const onKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !busy) {
      const cmd = input;
      setInput('');
      histPos.current = -1;
      if (cmd.trim()) history.current.unshift(cmd);
      push('cmd', cmd);
      await run(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = history.current;
      if (h.length) {
        histPos.current = Math.min(histPos.current + 1, h.length - 1);
        setInput(h[histPos.current]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      histPos.current = Math.max(histPos.current - 1, -1);
      setInput(histPos.current === -1 ? '' : history.current[histPos.current]);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section className="terminal-section" ref={sectionRef}>
      <div className="terminal-container">
        <div className="section-header">
          <span className="section-tag">Live Shell</span>
          <h2 className="section-title">Don't Read My Resume — Run It</h2>
          <p className="section-subtitle">
            A real terminal. Type <code>help</code> and explore.
          </p>
        </div>

        <div
          className="terminal-window"
          onClick={() => interactive && inputRef.current?.focus()}
        >
          <div className="terminal-titlebar">
            <span className="tdot tdot-red"></span>
            <span className="tdot tdot-yellow"></span>
            <span className="tdot tdot-green"></span>
            <span className="terminal-title">aman@portfolio — zsh</span>
          </div>

          <div className="terminal-body" ref={bodyRef}>
            {lines.map((l) =>
              l.kind === 'cmd' ? (
                <div key={l.id} className="t-line">
                  <span className="t-prompt">{PROMPT}</span> <span className="t-cmd">{l.text}</span>
                </div>
              ) : l.kind === 'link' ? (
                <div key={l.id} className="t-line">
                  <a className="t-link" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.text}
                  </a>
                </div>
              ) : (
                <div key={l.id} className={`t-line t-${l.kind}`}>
                  {l.text}
                </div>
              )
            )}

            {/* live prompt: autoplay typing or user input */}
            {!interactive ? (
              <div className="t-line">
                <span className="t-prompt">{PROMPT}</span> <span className="t-cmd">{typed}</span>
                <span className="t-block-caret" aria-hidden="true"></span>
              </div>
            ) : (
              <div className="t-line t-input-line">
                <span className="t-prompt">{PROMPT}</span>{' '}
                <input
                  ref={inputRef}
                  className="t-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={busy}
                  placeholder={busy ? '' : "type 'help'"}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="terminal input"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
