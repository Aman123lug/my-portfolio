import { useEffect, useRef, useState } from 'react';
import './Contact.css';

/**
 * To deliver messages silently in the background, create a free form at
 * https://formspree.io (it emails you every submission) and put its ID here,
 * e.g. 'xkgwqyzr'. While empty, sending falls back to opening the visitor's
 * email client with everything pre-filled — still fully functional.
 */
const FORMSPREE_ID = 'mbdnokky';

const EMAIL = 'ak06465676@gmail.com';

type RespLine = { id: number; kind: 'ok' | 'err' | 'dim' | 'out' | 'accent'; text: string };

interface Channel {
  label: string;
  href: string;
  latency: number;
}

const CHANNELS: Channel[] = [
  { label: 'email', href: `mailto:${EMAIL}`, latency: 23 },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/aman-kumar-5bb609228/', latency: 41 },
  { label: 'github', href: 'https://github.com/Aman123lug', latency: 37 },
  { label: 'blog', href: 'https://amanblog.hashnode.dev/', latency: 58 },
];

function useDelhiClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [resp, setResp] = useState<RespLine[]>([]);
  const [pinged, setPinged] = useState(0);

  const nextId = useRef(0);
  const alive = useRef(true);
  const clock = useDelhiClock();

  useEffect(() => {
    alive.current = true;
    // stagger the channel "health checks"
    const timers = CHANNELS.map((_, i) =>
      setTimeout(() => setPinged((p) => Math.max(p, i + 1)), 500 + i * 350)
    );
    return () => {
      alive.current = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const pushResp = (kind: RespLine['kind'], text: string) =>
    setResp((prev) => [...prev, { id: nextId.current++, kind, text }]);

  const streamResp = async (rows: [RespLine['kind'], string][], delay = 70) => {
    for (const [kind, text] of rows) {
      if (!alive.current) return;
      pushResp(kind, text);
      await sleep(delay);
    }
  };

  const handleSend = async () => {
    if (sending) return;
    setResp([]);
    setSending(true);

    const latency = Math.floor(90 + Math.random() * 150);
    await sleep(300);

    // API-style validation errors
    const errors: string[] = [];
    if (!name.trim()) errors.push('"name": "field required"');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('"email": "invalid email address"');
    if (!message.trim()) errors.push('"message": "field required"');

    if (errors.length) {
      await streamResp([
        ['err', `HTTP/2 422 Unprocessable Entity · ${latency}ms`],
        ['dim', 'content-type: application/json'],
        ['out', '{'],
        ['out', '  "detail": {'],
        ...errors.map((e, i) => ['err', `    ${e}${i < errors.length - 1 ? ',' : ''}`] as ['err', string]),
        ['out', '  }'],
        ['out', '}'],
      ]);
      setSending(false);
      return;
    }

    let delivered = false;
    let transport = 'mailto';

    if (FORMSPREE_ID) {
      try {
        const r = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        delivered = r.ok;
        transport = 'formspree';
      } catch {
        delivered = false;
      }
      if (!delivered) {
        await streamResp([
          ['err', `HTTP/2 502 Bad Gateway · ${latency}ms`],
          ['out', '{'],
          ['err', '  "error": "delivery failed",'],
          ['out', `  "fallback": "${EMAIL}"`],
          ['out', '}'],
        ]);
        setSending(false);
        return;
      }
    } else {
      // no backend configured — open the visitor's mail client pre-filled
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        `Portfolio contact from ${name}`
      )}&body=${body}`;
      delivered = true;
    }

    const msgId = `msg_${Math.random().toString(36).slice(2, 10)}`;
    await streamResp([
      ['ok', `HTTP/2 202 Accepted · ${latency}ms`],
      ['dim', 'content-type: application/json'],
      ['dim', `x-message-id: ${msgId}`],
      ['out', '{'],
      ['out', '  "status": "queued",'],
      ['out', `  "transport": "${transport}",`],
      ['out', `  "to": "${EMAIL}",`],
      ['out', '  "reply_eta": "< 24h",'],
      ['accent', '  "note": "thanks for reaching out — talk soon 🤝"'],
      ['out', '}'],
    ]);

    if (delivered && transport === 'formspree') {
      setName('');
      setEmail('');
      setMessage('');
    }
    setSending(false);
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="section-header">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Send a Request</h2>
          <p className="section-subtitle">
            Direct line to my inbox — REST-style. No auth required.
          </p>
        </div>

        {/* ===== status strip ===== */}
        <div className="status-strip">
          <div className="status-item">
            <span className="status-dot"></span>
            <span className="status-strong">ONLINE</span>
            <span className="status-dim">median response &lt; 24h</span>
          </div>
          <div className="status-item">
            <span className="status-dim">local time (Delhi)</span>
            <span className="status-strong status-clock">{clock} IST</span>
          </div>
          <div className="status-channels">
            {CHANNELS.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="status-channel"
              >
                <span className="channel-label">{c.label}</span>
                {pinged > i ? (
                  <span className="channel-ok">✔ 200 OK · {c.latency}ms</span>
                ) : (
                  <span className="channel-wait">pinging…</span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* ===== API playground ===== */}
        <div className="api-playground">
          {/* request panel */}
          <div className="api-panel">
            <div className="api-panel-header">
              <span className="method-badge">POST</span>
              <span className="api-url">https://api.amankumar.dev/v1/contact</span>
            </div>
            <div className="api-body">
              <div className="json-line json-brace">{'{'}</div>
              <div className="json-line">
                <span className="json-key">  "name"</span>
                <span className="json-colon">: "</span>
                <input
                  className="json-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  spellCheck={false}
                />
                <span className="json-colon">",</span>
              </div>
              <div className="json-line">
                <span className="json-key">  "email"</span>
                <span className="json-colon">: "</span>
                <input
                  className="json-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  spellCheck={false}
                />
                <span className="json-colon">",</span>
              </div>
              <div className="json-line json-line-textarea">
                <span className="json-key">  "message"</span>
                <span className="json-colon">: "</span>
                <textarea
                  className="json-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="let's build something — a RAG system, an agent platform, anything"
                  rows={4}
                  spellCheck={false}
                />
                <span className="json-colon">"</span>
              </div>
              <div className="json-line json-brace">{'}'}</div>
            </div>
            <div className="api-actions">
              <button className="btn btn-primary api-send" onClick={handleSend} disabled={sending}>
                {sending ? 'Sending…' : '▶ Send Request'}
              </button>
            </div>
          </div>

          {/* response panel */}
          <div className="api-panel api-panel-response">
            <div className="api-panel-header">
              <span className="response-title">Response</span>
              {sending && <span className="response-spinner"></span>}
            </div>
            <div className="api-body api-response-body">
              {resp.length === 0 && !sending && (
                <div className="resp-line resp-dim">// awaiting request…</div>
              )}
              {resp.map((l) => (
                <div key={l.id} className={`resp-line resp-${l.kind}`}>
                  {l.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
