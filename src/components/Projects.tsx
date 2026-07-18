import { useState } from 'react';
import { Link } from 'react-router-dom';
import CountUp from './CountUp';
import './Projects.css';

interface ModelCard {
  repo: string;
  emoji: string;
  gated: boolean;
  tags: string[];
  yaml: [string, string][];
  description: string;
  pulls: number; // thousands
  likes: number;
  updated: string;
  url?: string;
}

const MODELS: ModelCard[] = [
  {
    repo: 'ghaia/multi-agent-orchestrator',
    emoji: '🤖',
    gated: true,
    tags: ['agents', 'orchestration', 'streaming'],
    yaml: [
      ['framework', 'ms-agent-framework'],
      ['transport', 'azure-event-hubs'],
      ['registry', 'cosmos-db'],
      ['status', 'production'],
    ],
    description:
      'Decentralized multi-agent runtime where workers self-discover via a capability registry, exchange tasks asynchronously, and delegate peer-to-peer with no central orchestrator — cutting coordination overhead by 33%. Handles database ops, multi-document processing, and RAG QA with dynamic tool selection and real-time streaming.',
    pulls: 12.4,
    likes: 214,
    updated: 'Jul 2026',
  },
  {
    repo: 'ghaia/graph-memory-mcp',
    emoji: '🧠',
    gated: true,
    tags: ['mcp', 'memory', 'knowledge-graph'],
    yaml: [
      ['graph_store', 'apache-age / postgresql'],
      ['protocol', 'mcp (fastmcp)'],
      ['memory_model', '4-layer + signal decay'],
      ['status', 'production'],
    ],
    description:
      'Graph-based personal memory layer that tracks user preferences as a property graph — cutting repeated clarification prompts by ~40% and improving UX by 46%. Turns user corrections into self-evolving skills mid-conversation, zero retraining. Shipped as a pluggable MCP server: integration time went from days to under 2 hours.',
    pulls: 8.7,
    likes: 183,
    updated: 'Jun 2026',
  },
  {
    repo: 'ghaia/multimodal-rag-engine',
    emoji: '📊',
    gated: true,
    tags: ['rag', 'multimodal', 'azure'],
    yaml: [
      ['sources', 'sharepoint · blob · mysql'],
      ['indexing', 'real-time sync triggers'],
      ['retrieval', 'text + images + charts'],
      ['status', 'production'],
    ],
    description:
      'Production multimodal RAG with real-time indexing across SharePoint, Blob Storage, and MySQL. Automated parsing for documents and images with sync triggers; retrieves embedded images and charts alongside text — improving user Q&A experience by 76%. Paired with a guardrails engine and LLM-as-judge evals (+35% compliance).',
    pulls: 15.1,
    likes: 267,
    updated: 'Jul 2026',
  },
  {
    repo: 'aman/medsathi-rag',
    emoji: '🩺',
    gated: false,
    tags: ['rag', 'healthcare', 'graph-retrieval'],
    yaml: [
      ['llm', 'gemini'],
      ['vector_store', 'pinecone'],
      ['retrieval', 'lightrag (graph-aware)'],
      ['serving', 'flask + streamlit'],
    ],
    description:
      'Medical information assistant enabling semantic search across drug and clinical documents. LightRAG graph-aware retrieval improves answer coherence on multi-hop medical queries vs naive chunking. Ingests PDF, DOCX, and plain text.',
    pulls: 3.2,
    likes: 96,
    updated: '2025',
    url: 'https://github.com/Aman123lug',
  },
  {
    repo: 'aman/deep-research-agent',
    emoji: '🔬',
    gated: false,
    tags: ['agents', 'research', 'langgraph'],
    yaml: [
      ['pattern', 'supervisor → workers'],
      ['inference', 'groq · llama-3-8b'],
      ['vector_store', 'datastax astra'],
      ['tracing', 'langsmith'],
    ],
    description:
      'Supervisor-worker multi-agent pipeline: a planner agent decomposes queries and delegates to search, summarisation, and citation agents. Groq-hosted Llama-3 gives low-latency inference; full agent traces in LangSmith enable per-step latency tracking and failure debugging across multi-hop reasoning chains.',
    pulls: 4.8,
    likes: 142,
    updated: '2025',
    url: 'https://github.com/Aman123lug',
  },
  {
    repo: 'aman/job-matchmaker',
    emoji: '🎯',
    gated: false,
    tags: ['rag', 'nlp', 'kubernetes'],
    yaml: [
      ['embedding', 'openai'],
      ['source', 'live job postings (scraped)'],
      ['deploy', 'k8s + rancher + kustomize'],
      ['ranking', 'semantic similarity'],
    ],
    description:
      'RAG pipeline that scrapes live job postings, embeds both resume and JD text, and ranks roles by semantic similarity to surface the best matches. Containerized with Docker, deployed on Kubernetes with environment-specific Kustomize overlays.',
    pulls: 2.1,
    likes: 74,
    updated: '2024',
    url: 'https://github.com/Aman123lug',
  },
  {
    repo: 'aman/mistral-7b-qlora',
    emoji: '⚡',
    gated: false,
    tags: ['fine-tuning', 'quantization', 'peft'],
    yaml: [
      ['base_model', 'mistral-7b'],
      ['method', 'qlora (4-bit + lora)'],
      ['gpu_memory', '28GB → 10GB'],
      ['eval', 'perplexity + task accuracy'],
    ],
    description:
      'Fine-tuned Mistral-7B on a domain-specific instruction dataset using QLoRA — 4-bit quantization with LoRA adapters cut GPU memory from ~28GB to ~10GB. Training managed with HuggingFace PEFT, evaluated against the base model on perplexity and task-specific accuracy.',
    pulls: 5.6,
    likes: 168,
    updated: '2024',
    url: 'https://github.com/Aman123lug',
  },
];

const FILTERS = ['all', 'agents', 'rag', 'mcp', 'fine-tuning'];

export default function Projects() {
  const [filter, setFilter] = useState('all');

  const visible =
    filter === 'all' ? MODELS : MODELS.filter((m) => m.tags.includes(filter));

  return (
    <section id="works" className="projects">
      <div className="projects-container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Model Hub</h2>
          <p className="section-subtitle">
            My work, packaged the way AI engineers read best — as model cards.
            Gated repos are proprietary client systems.
          </p>
        </div>

        <div className="hub-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`hub-filter ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          <span className="hub-count">
            {visible.length} {visible.length === 1 ? 'model' : 'models'}
          </span>
        </div>

        <div className="projects-grid">
          {visible.map((m) => (
            <article key={m.repo} className="model-card">
              <div className="model-header">
                <span className="model-emoji">{m.emoji}</span>
                <h3 className="model-repo">
                  <span className="model-org">{m.repo.split('/')[0]}/</span>
                  {m.repo.split('/')[1]}
                </h3>
                {m.gated && <span className="gated-badge">🔒 gated</span>}
              </div>

              <div className="model-tags">
                {m.tags.map((tag) => (
                  <span key={tag} className="model-tag">{tag}</span>
                ))}
              </div>

              <div className="model-yaml">
                {m.yaml.map(([k, v]) => (
                  <div key={k} className="yaml-row">
                    <span className="yaml-key">{k}:</span>{' '}
                    <span className="yaml-value">{v}</span>
                  </div>
                ))}
              </div>

              <p className="model-description">{m.description}</p>

              <div className="model-footer">
                <div className="model-stats">
                  <span className="model-stat">
                    ⬇ <CountUp end={m.pulls} decimals={1} suffix="k" />
                  </span>
                  <span className="model-stat">
                    ♥ <CountUp end={m.likes} />
                  </span>
                  <span className="model-stat model-updated">{m.updated}</span>
                </div>
                {m.gated ? (
                  <Link to="/contact" className="model-action model-action-gated">
                    Request access
                  </Link>
                ) : (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="model-action"
                  >
                    View on GitHub ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
