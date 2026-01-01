import './About.css';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="section-header">
          <span className="section-tag">About</span>
          <h2 className="section-title">Get to Know Me</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <p className="about-intro">
              I'm a <strong>Data Scientist & AI/ML Engineer</strong> based in <strong>Delhi, India</strong>.
            </p>
            <p>
              Currently working as a Data Scientist at Ghaia.ai, where I architect enterprise 
              multi-agent systems and production-grade RAG architectures. And Worked on POCs of Qatar Government,  I'm passionate 
              about building AI solutions that solve real-world problems at scale.
            </p>
            <p>
              I'm <strong>MLflow Ambassador</strong> (one of 10 global ambassadors), 
              a <strong>Google Summer of Code 2024</strong> contributor, and 
              <strong> 2x Google Cloud Facilitator</strong> with 30+ cloud badges.
            </p>
            <p>
              BTech in Computer Engineering from Maharishi Dayanand University (2022-2025).
            </p>
            
            <div className="about-quote">
              <blockquote>
                "Building intelligent systems that bridge the gap between human intent and machine capability."
              </blockquote>
            </div>
          </div>
          
          <div className="about-skills">
            <h3>Skills & Expertise</h3>
            <div className="skills-grid">
              <div className="skill-category">
                <h4>AI/ML & GenAI</h4>
                <ul>
                  <li>Multi-Agent Systems (AutoGen)</li>
                  <li>Custom MCP Servers</li>
                  <li>RAG Pipelines</li>
                  <li>LangChain / LangGraph</li>
                  <li>Fine-tuning (LoRA, QLoRA, DPO)</li>
                  <li>Mixture of Experts (MoE)</li>
                  <li>Vector Databases</li>
                  <li>vLLM</li>
                  <li>PyTorch / TensorFlow</li>
                  <li>Hugging Face</li>
                  <li>FastMCP</li>
                  <li>Agent Orchestration</li>
                </ul>
              </div>
              <div className="skill-category">
                <h4>MLOps & DevOps</h4>
                <ul>
                  <li>MLflow</li>
                  <li>Docker & Kubernetes</li>
                  <li>Istio / Argo-CD</li>
                  <li>CI/CD (GitHub Actions, Jenkins)</li>
                  <li>Prometheus & Grafana</li>
                  <li>Celery / Ray / RabbitMQ</li>
                  <li>WebAssembly</li>
                  <li>Monitoring & Alerts</li>
                </ul>
              </div>
              <div className="skill-category">
                <h4>Cloud & Backend</h4>
                <ul>
                  <li>Complete Azure Services</li>
                  <li>Complete Google Cloud Platform</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
