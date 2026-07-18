import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NeuralNetwork from './NeuralNetwork';
import ScrambleText from './ScrambleText';
import CountUp from './CountUp';
import './Hero.css';

const ROLES = [
  'AI ENGINEER',
  'DATA SCIENTIST',
  'LLM & RAG BUILDER',
  'MLOPS PRACTITIONER',
];

function useTrainingTicker() {
  const [stats, setStats] = useState({ epoch: 1, loss: 0.4128, acc: 87.4 });

  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => {
      const t = (performance.now() - start) / 1000;
      const jitter = (Math.random() - 0.5) * 0.004;
      setStats({
        epoch: Math.floor(t * 1.6) + 1,
        loss: Math.max(0.0021, 0.42 * Math.exp(-t / 22) + 0.002 + jitter),
        acc: Math.min(99.9, 99.9 - 12.5 * Math.exp(-t / 18) + (Math.random() - 0.5) * 0.08),
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  return stats;
}

export default function Hero() {
  const { epoch, loss, acc } = useTrainingTicker();

  return (
    <section id="home" className="hero">
      <NeuralNetwork />
      <div className="hero-vignette" aria-hidden="true"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-hud">
            <span className="hud-dot"></span>
            <span className="hud-label">model: aman-v2</span>
            <span className="hud-sep">|</span>
            <span>epoch {String(epoch).padStart(3, '0')}</span>
            <span className="hud-sep">|</span>
            <span>loss {loss.toFixed(4)}</span>
            <span className="hud-sep">|</span>
            <span>acc {acc.toFixed(1)}%</span>
          </div>

          <p className="hero-greeting">// forward pass complete — output decoded:</p>

          <h1 className="hero-name">
            <ScrambleText phrases={['AMAN KUMAR']} startDelayMs={300} />
          </h1>

          <h2 className="hero-title">
            <span className="hero-title-prompt">&gt;</span>{' '}
            <ScrambleText phrases={ROLES} startDelayMs={1400} />
            <span className="hero-caret" aria-hidden="true"></span>
          </h2>

          <p className="hero-description">
            Building enterprise AI at Ghaia.ai — multi-agent systems,
            production RAG, and memory-first agent architectures.
          </p>

          <div className="hero-cta">
            <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
            <Link to="/projects" className="btn btn-secondary">View Work</Link>
          </div>

          <div className="hero-social">
            <a href="https://www.linkedin.com/in/aman-kumar-5bb609228/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://github.com/Aman123lug" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://twitter.com/lug__aman" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://amanblog.hashnode.dev/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Hashnode Blog">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z"/>
              </svg>
            </a>
            <a href="mailto:ak06465676@gmail.com" className="social-link" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
              </svg>
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value"><CountUp end={140} suffix="+" /></span>
              <span className="stat-label">Releases Shipped</span>
            </div>
            <div className="stat">
              <span className="stat-value"><CountUp end={20} suffix="+" /></span>
              <span className="stat-label">POCs for Clients & Govt</span>
            </div>
            <div className="stat">
              <span className="stat-value"><CountUp end={76} suffix="%" /></span>
              <span className="stat-label">RAG Q&A Improvement</span>
            </div>
            <div className="stat">
              <span className="stat-value"><CountUp end={3} suffix="+" /></span>
              <span className="stat-label">Years in AI/ML</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span className="scroll-text">Explore My Journey</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <div className="scroll-arrows">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
}
