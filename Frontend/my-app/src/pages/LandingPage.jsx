import React from "react";
import "./LandingPage.css";
import dashboard from "../assets/dashboard.png";
export default function RetainAI() {
  return (
    <div className="retain-app">
      {/* Top Nav */}
      <header className="navbar">
        <nav className="navbar-inner">
          <div className="navbar-left">
            <a href="#" className="logo">RetainAI</a>
            <div className="nav-links">
              <a href="#" className="nav-link active">Features</a>
              <a href="#" className="nav-link">How it Works</a>
              <a href="#" className="nav-link">Pricing</a>
            </div>
          </div>
          <div className="navbar-right">
            <button className="btn-ghost">Log In</button>
            <button className="btn-primary">Get Started</button>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-text">
              <div className="badge">
                <span className="badge-dot"></span>
                <span>New: Predictive Churn Scores v2.0</span>
              </div>
              <h1 className="hero-heading">Master Your Customer Retention</h1>
              <p className="hero-sub">
                Predict churn with AI-powered intelligence and turn risk into
                opportunity. Proactively engage customers before they leave.
              </p>
              <div className="hero-actions">
                <button className="btn-primary btn-lg">Get Started for Free</button>
                <button className="btn-outline btn-lg">Book a Demo</button>
              </div>
              <div className="social-proof">
                <div className="avatars">
                  <img
                    className="avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKy5_2rQlGqpcfkeUKJMdlZRaRldrk0JA8A0E3XFrtud2DefLnJxI4YARWO0YAnRonQkhqIfc9RTeP6NPEZmkHY7raCVYaVwKNS_gf8mstQDdR4Ka8Ry4wL36SeNb38nbp4Zht1U4kav7N12aK0_5eK-QJwTLa9q42WFUUpG-qXzGcQQr4Ps_Osa1s8ctke4svGFTl2FUdR8Zi0oRMrkBwpH75M5Tfr2dYSPANUX7frs_v8EXanjutzu6wj30ZuefZn80nMHtaJDa2"
                    alt="User 1"
                  />
                  <img
                    className="avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAty6SHZFJ51KTUtPg-P6xMSelwMCnApZasjb07HAwXVI_dKS0QYoirKQ4JtjIyxKYd_R5_zPNoKqT8m5ghFX4nCHerawdIdeW5B1z8U01MW2KsYCJgJPUZDnzpn3686X8qpJEIvdZh3GwCmhJx2Doer_TceeCZkNlrFUdsm9bLzhDn1CCvbLwrPVP8WdZ32I9W3A1oOrbeWKDpO6rThBbx5nWv_gzyEXNeIDWyt38KZjyKlAKGM9AEMrhdPBLeP_0WXuVQtne3slGW"
                    alt="User 2"
                  />
                  <img
                    className="avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqnKmXKbp3WBsc4FLFMhmuDYzl6mgFpggR9zSj68YsPS08UiybNJnF5ZrqYdprcehR_f6sCmsj8CChhUfYZUNK-qUBMs7bH0tQxg7KBbMrNSwXDSr8s_j72lv8XLLN_zp4S55Pit3daFxtVpEZ8YCg3AMoMJ-WBQT_dRjA1K8ULjbwl3g8rlhYz8vNRg0iuxdFxDgI0n-80dega4sdtqfJMrGVgunnvtzTUIcRbgCfR_SBDe9gcZ3j21DBN897612hG1S1UMvxm-68"
                    alt="User 3"
                  />
                </div>
                <p className="social-text">Trusted by 500+ growth teams</p>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-glow hero-glow-top"></div>
              <div className="hero-glow hero-glow-bottom"></div>
              <div className="hero-card">
                <img
  className="hero-img"
  src={dashboard}
  alt="Dashboard"
/>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">Supercharge your growth engine</h2>
              <p className="section-sub">
                Our intelligence suite gives you the visibility and automation
                tools needed to keep every customer happy and engaged.
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon feature-icon-primary">
                  <span className="material-symbols-outlined">insights</span>
                </div>
                <h3 className="feature-title">Predictive Analytics</h3>
                <p className="feature-desc">
                  Identify high-risk accounts before they even consider leaving
                  with our proprietary AI scoring models.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon feature-icon-secondary">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <h3 className="feature-title">Automated Workflows</h3>
                <p className="feature-desc">
                  Trigger custom re-engagement campaigns across email, Slack,
                  and in-app messages based on real-time behavior.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon feature-icon-tertiary">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <h3 className="feature-title">Customer Sentiment</h3>
                <p className="feature-desc">
                  Go beyond usage data. Analyze communication tone and feedback
                  to understand how your users truly feel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="how-section">
          <div className="section-inner">
            <div className="how-grid">
              <div className="how-visual">
                <div className="how-card">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiyRZo5f8SOYhqec6UhwSIzXq18Mv9KmeqNrF8e5dXavP9XgqIyQ9aaq4__Hi_5PwJMFNLYe48ClqwUFKnx-rtJgK0vLQR-WVI8QydDS5u7KD8AoHHBSj9S3yLVwpoy3phZANRKZzE2GXXKCNQLCBygZLSDNPXZIIMPDS451qDKx6VFPwie66ooqurNjsbFsJvxgJJj2R9Zj-30a402cfpw7vENY7QwDaN2CwJn0XXtXg5zE-ebUDxWdoo6LG-q1tql29pwjl_dKXo"
                    alt="Workflow"
                    className="how-img"
                  />
                </div>
                <div className="how-stat">
                  <span className="material-symbols-outlined">trending_up</span>
                  <div>
                    <p className="stat-label">Efficiency Increase</p>
                    <p className="stat-value">+42%</p>
                  </div>
                </div>
              </div>

              <div className="how-content">
                <div className="how-header">
                  <p className="how-eyebrow">The Process</p>
                  <h2 className="how-title">Effortless Intelligence</h2>
                </div>
                <div className="steps">
                  <div className="step">
                    <div className="step-num">1</div>
                    <div>
                      <h4 className="step-title">Connect Data</h4>
                      <p className="step-desc">
                        Integrate your CRM, billing, and product usage data with
                        a single click. We support 100+ native connectors.
                      </p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-num">2</div>
                    <div>
                      <h4 className="step-title">AI Analysis</h4>
                      <p className="step-desc">
                        Our engine processes billions of data points to create
                        individualized health scores and churn probabilities.
                      </p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-num">3</div>
                    <div>
                      <h4 className="step-title">Act on Insights</h4>
                      <p className="step-desc">
                        Receive alerts and automate outreach to at-risk
                        accounts. Turn churn risk into successful expansion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="section-inner">
            <div className="cta-card">
              <div className="cta-glow cta-glow-top"></div>
              <div className="cta-glow cta-glow-bottom"></div>
              <div className="cta-content">
                <h2 className="cta-heading">
                  Ready to grow? Start predicting today.
                </h2>
                <p className="cta-sub">
                  Join the world's most innovative companies using RetainAI to
                  scale their recurring revenue.
                </p>
                <div className="cta-actions">
                  <button className="btn-white">Create Free Account</button>
                  <button className="btn-outline-white">Talk to Sales</button>
                </div>
                <p className="cta-note">
                  No credit card required • 14-day free trial
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">RetainAI</span>
            <p className="footer-copy">© 2024 RetainAI. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a href="#" className="social-icon">
              <span className="material-symbols-outlined">share</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}