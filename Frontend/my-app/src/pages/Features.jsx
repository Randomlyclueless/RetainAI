import "../styles/FeaturesPage.css";

const features = [
  {
    icon: "insights",
    title: "Predictive Analytics",
    desc: "Identify risk with AI before it impacts your bottom line. Our models catch early warning signals of customer fatigue.",
    accent: "accent-primary",
  },
  {
    icon: "auto_awesome",
    title: "Automated Insights",
    desc: "Don't just see the data—understand it. Get actionable insights delivered straight to your workflow every morning.",
    accent: "accent-secondary",
  },
  {
    icon: "database",
    title: "Smart Data Processing",
    desc: "Process any dataset instantly. Our infrastructure handles high-volume streaming data without breaking a sweat.",
    accent: "accent-primary",
  },
  {
    icon: "schema",
    title: "No-Code ML Pipeline",
    desc: "Train models without code. Empower your success team to build sophisticated retention models in minutes.",
    accent: "accent-tertiary",
  },
  {
    icon: "hub",
    title: "Multi-Domain Support",
    desc: "Optimized for Banking, E-commerce, and Subscriptions. Industry-specific logic built into every calculation.",
    accent: "accent-secondary",
  },
  {
    icon: "notifications_active",
    title: "Real-Time Alerts",
    desc: "Instant notifications for critical events. Act immediately when a high-value account shows signs of churn.",
    accent: "accent-primary",
  },
];

const benefits = [
  { icon: "person_remove", title: "Reduce churn", desc: "Prevent early departures" },
  { icon: "favorite", title: "Improve retention", desc: "Build loyal customers" },
  { icon: "payments", title: "Increase revenue", desc: "Maximize LTV potential" },
  { icon: "schedule", title: "Save time", desc: "Automate manual tasks" },
];

export default function FeaturesPage() {
  return (
    <div className="fp-root">
      {/* Hero */}
      <section className="fp-hero">
        <div className="fp-hero-bg">
          <div className="fp-hero-blob fp-hero-blob-1" />
          <div className="fp-hero-blob fp-hero-blob-2" />
        </div>
        <div className="fp-container fp-hero-content">
          <span className="fp-badge">Platform Overview</span>
          <h1 className="fp-hero-title">Powerful Features to Retain Your Customers</h1>
          <p className="fp-hero-sub">
            Leverage state-of-the-art machine learning to predict churn before it happens and
            automate your retention strategy with surgical precision.
          </p>
          <div className="fp-hero-actions">
            <button className="fp-btn-primary">Get Started</button>
            <button className="fp-btn-ghost">
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="fp-section fp-features-section">
        <div className="fp-container">
          <div className="fp-features-grid">
            {features.map((f) => (
              <div className="fp-feature-card" key={f.title}>
                <div className={`fp-icon-wrap ${f.accent}`}>
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="fp-feature-title">{f.title}</h3>
                <p className="fp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Section */}
      <section className="fp-section fp-highlight-section">
        <div className="fp-container fp-highlight-inner">
          <div className="fp-highlight-text">
            <h2 className="fp-section-title">AI that works for your business</h2>
            <p className="fp-highlight-body">
              Our technology isn't just about prediction; it's about orchestration. By connecting
              your user behavior data with our neural networks, we help you visualize growth
              opportunities that were previously hidden in the noise of big data.
            </p>
            <ul className="fp-checklist">
              <li>
                <span className="fp-check-icon material-symbols-outlined">check</span>
                Seamless integration with your existing CRM and data warehouse.
              </li>
              <li>
                <span className="fp-check-icon material-symbols-outlined">check</span>
                Privacy-first architecture ensuring your customer data remains secure.
              </li>
            </ul>
          </div>
          <div className="fp-highlight-visual">
            <div className="fp-visual-card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKcPm9RpXnPAbAMBcXMjfZbVGQHwe7CHnU4mEEoNEMXCOaz__K37W0cLnw7wGeaEAtmMhrri0Ad7_xjCqCB9DqhJSAvlPQFA15YXCMsaOzzmQQmXAYxRdRYuKpfkDgZN-wsPFMRYMfH5wFndw0G1_IHfIoCszLUhFIJUI5NzBb18mgb6F0apLq6dwRkIxbinITp59jJp68R85L4LVm_B5jcaJwWUMcdBaCgoCN9d19khIhkNxlNjdM_VdF1O4JzwohKhCnLK5bWB9J"
                alt="AI and Growth Visual"
                className="fp-visual-img"
              />
              <div className="fp-stat-badge">
                <div className="fp-stat-icon">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="fp-stat-label">Retention Lift</p>
                  <p className="fp-stat-value">+24.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="fp-section fp-benefits-section">
        <div className="fp-container">
          <div className="fp-benefits-header">
            <h2 className="fp-section-title">Quantifiable Benefits</h2>
            <p className="fp-benefits-sub">
              The impact of RetainAI on your bottom line, measured in real-world results.
            </p>
          </div>
          <div className="fp-benefits-grid">
            {benefits.map((b) => (
              <div className="fp-benefit-item" key={b.title}>
                <div className="fp-benefit-icon-wrap">
                  <span className="material-symbols-outlined">{b.icon}</span>
                </div>
                <h4 className="fp-benefit-title">{b.title}</h4>
                <p className="fp-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="fp-section fp-cta-section">
        <div className="fp-container">
          <div className="fp-cta-card">
            <div className="fp-cta-glow" />
            <h2 className="fp-cta-title">Start predicting churn today</h2>
            <p className="fp-cta-sub">
              Join 500+ enterprises using RetainAI to power their growth and customer satisfaction
              strategies.
            </p>
            <div className="fp-cta-actions">
              <button className="fp-cta-btn-primary">Get Started</button>
              <button className="fp-cta-btn-outline">Schedule a Demo</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}