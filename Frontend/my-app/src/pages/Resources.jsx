import "../styles/Resources.css";

const articles = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi1GPz-g407U3xTNkgXZXcTduymwJm1Oi1g9M6CAYZ9lFEDe53ii_PKi00lLLWh5e5YFfz4po5wsOUbvnLKPyjQLuYJ1IVwch3mdhrEJ_mNOzkjeXLK_2N4lMhweojXXOtYrwztMs59tjAaaQFAC-PU-5GY0fg3LHOER967hmIsM_y8zvTsxAZ1r_hLY4wCUyU7wlv3CsJ_StcUTaijxP6nYGRSg-zbl0btSroMF7NgeSEmj59xBEGCKatnl1-1Df-Rj2Ke73KUuRR",
    title: "What is Customer Churn?",
    desc: "An essential primer on why customers leave and how to measure the real impact on your bottom line.",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDje9dIBW3oRQC48pi18DInL8jBV98i537KuRvajQJIoH2ZoI3u23ddQ1szybXHcYuYXgaB2eLbH-Jjh6nu-o_R_a39sKcWxJZGJtvn0VZxBo__wSf2JM0sbOUdV1IBynIXWsvIgS1iZFxQcjPs4T4a2lQg-W2xZU_y5BSbwe6tqPWXl5_tCIGAc4BKaUyv8U32acrzwUtXhkCrRBR6Gld4HcH48u1-S2dTbUh6mY6SFtSsFXeFXJmw_7dY6JZM8-GOju2cF8YiMsiU",
    title: "Top 5 Ways to Reduce Churn",
    desc: "Actionable strategies you can implement today to increase loyalty and improve user engagement.",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKZXaIt5nOZ2h4Xt2rUVUwUeyfsYYN0NX6BwkRRaabBbRzMi38MXrMHuuJTuzun9oUBEOJpRvfXD6jL7yn4GY2b8typnrwMZeNDAWQYU5255SPX9VSSyPPZL24SiDG9Ua5Jpfn1LzvRL1eoy1ki0i4Hwg0gSUu1Kf_e_YojRAbJ0EH2eEvL6LQqD8QSU_3UxIKNsTeWD3S-Wl2B8YFTNF1XNM6Q7KF_0RIg7GzS189vw1YsO_w0Nv4jDhPQVPLYmYVeA260CVkGQ6m",
    title: "Understanding Metrics",
    desc: "From CLV to MRR: A deep dive into the KPIs that actually matter for your subscription business.",
  },
];

const guides = [
  {
    icon: "rocket_launch",
    title: "How to Use RetainAI",
    desc: "A step-by-step walkthrough of the entire platform from dashboard to automation.",
    linkLabel: "Get Started",
  },
  {
    icon: "person_add",
    title: "Getting Started",
    desc: "Everything you need to know for your first 30 days of retention excellence.",
    linkLabel: "Quick Start",
  },
  {
    icon: "database",
    title: "Data Preparation",
    desc: "How to format and import your customer data for maximum predictive accuracy.",
    linkLabel: "Technical Docs",
  },
];

export default function ResourcesPage() {
  return (
    <div className="rp-root">
      {/* Hero */}
      <header className="rp-hero">
        <div className="rp-hero-glow" />
        <div className="rp-container rp-hero-content">
          <h1 className="rp-hero-title">Resources to Help You Grow</h1>
          <p className="rp-hero-sub">
            Explore our comprehensive library of insights, guides, and customer stories designed to
            help you master retention and scale your intelligence.
          </p>
          <div className="rp-search-wrap">
            <span className="rp-search-icon material-symbols-outlined">search</span>
            <input
              className="rp-search-input"
              type="text"
              placeholder="Search for articles, guides, or case studies..."
            />
          </div>
        </div>
      </header>

      <main className="rp-container rp-main">
        {/* Featured Resource */}
        <section className="rp-section">
          <div className="rp-featured-card">
            <div className="rp-featured-img-wrap">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtFwqJQWW2nLbbOWouSeAwGI9G2K1BU109aNQeRcZzyBhTyosQabK3KMLo6CvcsMRpLeZkwetLNevwt_eHi9v50eVvDaavjzdvLpQSxMxji5_QQPq0cP1SgbGvLxiKl93Bei1zcQgK6SMWjs11s972_zfZnozO2FZIrosEO82vWiuzaK8mBBiV4B3X0DlLOthZGgbNkEagdBvRWNfqx7-uMq0QFKmdVA4KM9dGj6pJ5s9DhSgd-qkPQikGn1uUtmAne665avNgVy9M"
                alt="Featured Guide"
                className="rp-featured-img"
              />
              <div className="rp-featured-overlay" />
            </div>
            <div className="rp-featured-body">
              <span className="rp-badge">Featured Guide</span>
              <h2 className="rp-featured-title">
                Predictive Analytics: The New Frontier in Customer Retention
              </h2>
              <p className="rp-featured-desc">
                Learn how RetainAI leverages advanced machine learning to identify at-risk customers
                weeks before they churn. This 20-page guide covers everything from data hygiene to
                automated intervention strategies.
              </p>
              <a href="#" className="rp-link-arrow">
                Read the Full Guide
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        {/* Blog & Articles */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h2 className="rp-section-title">Blog &amp; Articles</h2>
            <a href="#" className="rp-view-all">View all</a>
          </div>
          <div className="rp-articles-grid">
            {articles.map((a) => (
              <div className="rp-article-card" key={a.title}>
                <div className="rp-article-img-wrap">
                  <img src={a.img} alt={a.title} className="rp-article-img" />
                </div>
                <h3 className="rp-article-title">{a.title}</h3>
                <p className="rp-article-desc">{a.desc}</p>
                <a href="#" className="rp-link-chevron">
                  Read More
                  <span className="material-symbols-outlined">chevron_right</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Product Guides */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h2 className="rp-section-title">Product Guides</h2>
            <a href="#" className="rp-view-all">Support Center</a>
          </div>
          <div className="rp-guides-grid">
            {guides.map((g) => (
              <div className="rp-guide-card" key={g.title}>
                <div className="rp-guide-icon-wrap">
                  <span className="material-symbols-outlined">{g.icon}</span>
                </div>
                <h3 className="rp-guide-title">{g.title}</h3>
                <p className="rp-guide-desc">{g.desc}</p>
                <a href="#" className="rp-link-chevron">
                  {g.linkLabel}
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Case Studies — Bento */}
        <section className="rp-section">
          <h2 className="rp-section-title" style={{ marginBottom: "24px" }}>Case Studies</h2>
          <div className="rp-bento-grid">
            {/* Large card */}
            <div className="rp-bento-main">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaXxLt167dBtx-mMlST2zrExyajF8xydxLIizeIH8lTxQpaQDYUHwB4wwLfPI9miE6IoLnwCM1LapMuTF_FCbZg11m3tU59ny_Mo-9cqnXQGiSTGrZQbQ0sdhokYDwPYOQ_ERxLk-mpiszl4NmOdFx1UOy7mwWy1lqJP92mnvZlLJH_N5uY6MmBF2bdgHW5l9__9M_bXjJEvtFWMBaS6HklYVAN5gIP42wQJfM8SHByPUqk78mYqnYK023fYFYvLVlduH4n0KgdUkY"
                alt="E-Commerce Case Study"
                className="rp-bento-main-img"
              />
              <div className="rp-bento-main-body">
                <span className="rp-badge">E-Commerce</span>
                <h3 className="rp-bento-main-title">30% Churn Reduction</h3>
                <p className="rp-bento-main-desc">
                  How GlobalCart used predictive behavioral triggers to save $2M in annual revenue.
                </p>
                <a href="#" className="rp-link-arrow rp-link-arrow--light">
                  View Case Study
                  <span className="material-symbols-outlined">arrow_outward</span>
                </a>
              </div>
            </div>

            {/* Side cards */}
            <div className="rp-bento-side">
              <div className="rp-bento-card rp-bento-card--primary">
                <span className="rp-badge rp-badge--light">Fintech</span>
                <h3 className="rp-bento-card-title">Banking Strategy</h3>
                <p className="rp-bento-card-desc">
                  Revitalizing customer loyalty in the digital banking sector.
                </p>
                <a href="#" className="rp-link-arrow rp-link-arrow--white">
                  Read <span className="material-symbols-outlined">arrow_forward</span>
                </a>
                <div className="rp-bento-deco">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
              </div>

              <div className="rp-bento-card rp-bento-card--white">
                <span className="rp-badge">SaaS</span>
                <h3 className="rp-bento-card-title rp-bento-card-title--dark">App Growth</h3>
                <p className="rp-bento-card-desc rp-bento-card-desc--dark">
                  Scaling from 10k to 100k users with intelligent retention.
                </p>
                <a href="#" className="rp-link-arrow">
                  Read <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Help Banner */}
        <section className="rp-help-banner">
          <div className="rp-help-left">
            <div className="rp-help-icon-wrap">
              <span className="material-symbols-outlined">help_outline</span>
            </div>
            <div>
              <h2 className="rp-help-title">Need help getting started?</h2>
              <p className="rp-help-sub">
                Our support team is available 24/7 to help you set up your first retention workflow.
              </p>
            </div>
          </div>
          <button className="rp-help-btn">Contact Support</button>
        </section>

        {/* Final CTA */}
        <section className="rp-cta-section">
          <div className="rp-cta-card">
            <div className="rp-cta-blob rp-cta-blob-1" />
            <div className="rp-cta-blob rp-cta-blob-2" />
            <div className="rp-cta-content">
              <h2 className="rp-cta-title">Start using RetainAI today</h2>
              <p className="rp-cta-sub">
                Join 500+ high-growth companies that use our intelligence to keep their customers longer.
              </p>
              <button className="rp-cta-btn">Get Started</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}