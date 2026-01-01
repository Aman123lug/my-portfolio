import './Projects.css';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Multi-Agent IT Support System',
    description: 'Built an intelligent multi-agent IT support system using AutoGen for autonomous troubleshooting, ticket resolution, and knowledge base management with dynamic tool selection.',
    tags: ['AutoGen', 'Multi-Agent', 'Python', 'AI'],
    githubUrl: 'https://github.com/Aman123lug/Multi-Agent-IT-Support',
  },
  {
    id: 2,
    title: 'Stock Intelligence Bot',
    description: 'RAG App for Data Analysis and Visualizations. Generates all types of graphs including BarPlot, LinePlot, TimeSeries, and more for comprehensive stock market analysis.',
    tags: ['RAG', 'Data Analysis', 'Python', 'Visualization'],
    githubUrl: 'https://github.com/Aman123lug/stock-intelligence-bot',
  },
  {
    id: 3,
    title: 'GSoC 2024 - Medical AI Platform',
    description: 'Medical project using Gen-AI and LLMOps to manage ML and LLM pipelines for healthcare. Built with Platform Engineering practices on OpenSUSE Rancher.',
    tags: ['GSoC', 'Gen-AI', 'LLMOps', 'Kubernetes', 'Rancher'],
    githubUrl: 'https://github.com/Aman123lug/GSOC-project-24-medical',
  },
  {
    id: 4,
    title: 'ETL Pipeline with Airflow',
    description: 'MLOps ETL Pipeline using Airflow DAGs and PostgreSQL for fetching data from different APIs. Production-ready data engineering solution.',
    tags: ['Airflow', 'PostgreSQL', 'ETL', 'Python'],
    githubUrl: 'https://github.com/Aman123lug/ETL-pipeline-using-airflow-with-postgres',
  },
  {
    id: 5,
    title: 'End-to-End MLOps Capstone project',
    description: 'Complete MLOps implementation for classification tasks with automated training, deployment, and monitoring pipelines.',
    tags: ['MLOps', 'ML Pipeline', 'CI/CD', 'Docker'],
    githubUrl: 'https://github.com/Aman123lug/End-to-End-MLOPs-implementation-Classification',
  },
  
];

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Here are some of my recent projects. Each one showcases different skills and technologies.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-image">
                <div className="project-placeholder">
                  <span>Project Image</span>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Code
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
