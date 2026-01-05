import './Timeline.css';

interface TimelineItem {
  id: number;
  date: string;
  title: string;
  company: string;
  description: string;
  type: 'work' | 'project' | 'education';
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    date: 'Apr 2025 - Present',
    title: 'AI Engineer',
    company: 'Ghaia.ai',
    description: 'Leading Core Backend AI product development. Architected end-to-end production RAG pipeline with intelligent file indexing system. Built Multi-Agent AI systems for enterprise document processing with real-time database sync. Developed cutting-edge Web Search for G-Agent, MCP servers powering AI agents, and NL2SQL engine using DuckDB in-memory processing via AutoGen framework. Delivered POCs for Qatar Government projects. Building next-gen Advanced RAG and Multi-model RAG systems with mem0 memory integration.',
    type: 'work',
  },
  
  {
    id: 3,
    date: 'Mar 2024 - Present',
    title: 'MLflow Ambassador',
    company: 'MLflow Core Team',
    description: 'Part of the MLflow Core team. Contributing to release management, writing technical blogs and tutorials, organizing tech events, brand ambassadorship, community building, and developer advocacy.',
    type: 'project',
  },
  {
    id: 4,
    date: 'Feb 2025 - May 2025',
    title: 'AI/ML Freelancer',
    company: 'Reg30 (India)',
    description: 'Engineered enterprise-grade data extraction system from BSE, NSE, and SEBI - India\'s top financial exchanges. Built sophisticated rate-limited scrapers using Playwright, transformed massive datasets, and loaded into production PostgreSQL. Fully automated CI/CD pipelines with GitHub Actions for zero-touch deployments. Architected Multi-AI-Agent automated web scraping infrastructure using LangChain, Ollama, Selenium, and BeautifulSoup - processing millions of financial records.',
    type: 'work',
  },
  {
    id: 5,
    date: 'Nov 2024 - Feb 2025',
    title: 'AI/ML Engineer Intern',
    company: 'CareerOS (Barcelona, Spain)',
    description: 'Developed AI Agents and Data Pipelines for career automation. Worked with GCP, Apache Beam, and ETL workflows. Built intelligent agent systems for AI-powered career solutions.',
    type: 'work',
  },
  {
    id: 6,
    date: 'May 2024 - Oct 2024',
    title: 'Google Summer of Code Mentee',
    company: 'Google / OpenSUSE Rancher',
    description: 'Developed End-to-End Advanced RAG pipeline for medical vertical on private dataset using Pinecone, OCR, Ollama, LangChain, and multi-model LLMs. Implemented MLOps and DevOps practices with vector databases.',
    type: 'project',
  },
  {
    id: 7,
    date: 'May 2023 - Oct 2023',
    title: 'Data Scientist Intern',
    company: 'DataKnobs',
    description: 'Solved Multi-Document Summarization problems. Created 2 NLP-based Bots for cricket and finance. Worked on complete automation with observability and monitoring using CI/CD, Kubernetes, Docker, and GCP.',
    type: 'work',
  },
  {
    id: 8,
    date: 'May 2023 - Jul 2023',
    title: 'Open Source Developer Intern',
    company: 'Hack2skill (Delhi, India)',
    description: 'Contributed to open-source projects using JavaScript, Java, and Python. Engaged in strategic communications and community collaboration.',
    type: 'project',
  },
  {
    id: 9,
    date: 'May 2022 - Jul 2022',
    title: 'Cloud Facilitator',
    company: 'Google Cloud Community India',
    description: 'Google Facilitator Program - Learned DialogFlow, Kubernetes, Docker, GitHub Actions, deployments, and automation on GCP. Earned 40+ Google Cloud Badges with certificates.',
    type: 'project',
  },
  {
    id: 10,
    date: '2022 - 2025',
    title: 'Bachelor of Technology',
    company: 'Computer Science & Engineering',
    description: 'Graduated with focus on Machine Learning, Data Science, and Software Development. Completed multiple projects in AI/ML and participated in hackathons.',
    type: 'education',
  },
];

export default function Timeline() {
  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <div className="section-header">
          <span className="section-tag">Journey</span>
          <h2 className="section-title">My Experience</h2>
          <p className="section-subtitle">
            A roadmap of my professional journey and key milestones.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-line"></div>
          {timelineData.map((item, index) => (
            <div 
              key={item.id} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="timeline-marker">
                <div className={`timeline-dot ${item.type}`}></div>
              </div>
              <div className="timeline-content">
                <span className="timeline-date">{item.date}</span>
                <h3 className="timeline-title">{item.title}</h3>
                <span className="timeline-company">{item.company}</span>
                {item.description && (
                  <p className="timeline-description">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="timeline-legend">
          <div className="legend-item">
            <span className="legend-dot work"></span>
            <span>Work Experience</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot project"></span>
            <span>Projects</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot education"></span>
            <span>Education</span>
          </div>
        </div>
      </div>
    </section>
  );
}
