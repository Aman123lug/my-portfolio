import './Projects.css';

interface Work {
  id: number;
  title: string;
  description: string;
  tags: string[];
  url?: string;
}

const works: Work[] = [
  {
    id: 1,
    title: 'Coming Soon',
    description: 'Details will be added soon...',
    tags: [],
  },
  {
    id: 2,
    title: 'Coming Soon',
    description: 'Details will be added soon...',
    tags: [],
  },
  {
    id: 3,
    title: 'Coming Soon',
    description: 'Details will be added soon...',
    tags: [],
  },
];

export default function Projects() {
  return (
    <section id="works" className="projects">
      <div className="projects-container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">My Works</h2>
          <p className="section-subtitle">
            Here are some of my recent works and contributions.
          </p>
        </div>

        <div className="projects-grid">
          {works.map((work) => (
            <article key={work.id} className="project-card">
              <div className="project-content">
                <h3 className="project-title">{work.title}</h3>
                <p className="project-description">{work.description}</p>
                {work.tags.length > 0 && (
                  <div className="project-tags">
                    {work.tags.map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                )}
                {work.url && (
                  <div className="project-links">
                    <a href={work.url} className="project-link" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      View
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
