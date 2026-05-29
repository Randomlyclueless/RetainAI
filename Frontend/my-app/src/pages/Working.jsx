import React from "react";
import "../styles/Working.css";
/* ── Data ─────────────────────────────────────── */
// const NAV_LINKS = ["Features", "How it Works", "Pricing", "Resources"];

const STEPS = [
  {
    icon: "upload_file",
    color: "primary",
    title: "Upload Your Data",
    desc: "Simply drag and drop your CSV or connect your favorite datasets directly.",
  },
  {
    icon: "settings_input_component",
    color: "secondary",
    title: "Configure in Seconds",
    desc: "Select your target outcome and the features you want the AI to analyze.",
  },
  {
    icon: "psychology",
    color: "primary",
    title: "AI Trains Model",
    desc: "Our automated ML pipeline builds the perfect predictive model for your specific data.",
  },
  {
    icon: "insights",
    color: "secondary",
    title: "Get Insights",
    desc: "Access detailed predictions and churn analysis with clear visual reporting.",
  },
];

const USE_CASES = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmPueL2jzio_G1vQjcbAQAwraNM1IgpCWBxIvCYHYacrVOkqNYIXdGppWRE1EkSFmFWlDyQR8al34VOJJ7tPe0xoHuB4qJ5lxoKnefS3kQ3lR-yjVhw2HcXER_3_BVaBTUo4TMmmqVpz-1ad47QXO-u1EzM61kR7deqdJ_pMHzCu8BOJndLyhNcFRZ8bROYPGBAWIVfeIFMMHmZbzUgVb2PLP0IZxT97FBej56x2s9xqP0Gw3BzJmx6nwSDmMVDscaFETfAnfiy6BN",
    title: "Banking",
    desc: "Predict high-value client churn and loan defaults before they happen with precision modeling.",
    bullets: ["Portfolio Risk Analysis", "Customer LTV Prediction"],
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfJtULKsQCSY_UZ3ic-cL9LiBksEUTWPYIYzEIEabPy64MaBdMcbCTGFJJ1Aa-cKr53BDtyu0Iy9bb5aRQHhFewP0Jt1fD_ZizSui0mMq7-AaF3sBcJFy30dCbTL9-Fovs4cPHB6UXRlMwswrE-IpUvwTeTayJEBCw57nWRZVK6ZmE4Bu5lY4M75mg6N9DH49feIyD7vEZ1doBHyjz2ftisawA2kAytW22cYiTyUg1GZEnPlyNpTo3Ue5h7JURU4M9apZFyCGbAbKx",
    title: "E-commerce",
    desc: "Increase repeat purchases by identifying shoppers who are unlikely to return to your store.",
    bullets: ["Cart Abandonment Recovery", "Next-Order Prediction"],
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaCAytQwGtAa4vx-f2fkL4TzC4-KpZl_H0CqF3N5Iv3tlnqjeOJOHW8a1SIa7vYqnHPtYUjileA8jWgZLKFPg8xohIvrulChTReL0U1CSM2wQdeGbtFCMU3Dxj27EtMsaeXLPRBr_cGewtodFp4Qg2XWuzzLrg25ttPddZRaZJfhFLlPlKqbzC4DP9LGE9Xw_4gWwKipu8RwsrwwqOINPi07IVRj89naT8zoX-EFDgXzpTUNmeYl04WVTevUtjaQnHMKnA6WY4GmBx",
    title: "Subscription Apps",
    desc: "Reduce monthly churn rates by monitoring user engagement patterns and identifying early drop-off signals.",
    bullets: ["Feature Adoption Tracking", "Renewal Probability Score"],
  },
];

const WHY_CARDS = [
  {
    icon: "integration_instructions",
    title: "No-code AI",
    desc: "Democratizing machine learning. No data science degree or engineering resources required.",
  },
  {
    icon: "dataset",
    title: "Works with any dataset",
    desc: "Our engine handles messy, incomplete, and varied data structures automatically.",
  },
  {
    icon: "bolt",
    title: "Fast results",
    desc: "From data upload to predictive insights in less than 5 minutes. Real-time value delivery.",
  },
  {
    icon: "verified_user",
    title: "Secure & private",
    desc: "Enterprise-grade encryption and SOC2 compliance to ensure your data stays yours.",
  },
];



/* ── Component ─────────────────────────────────── */
export default function working() {
  return (
    <>
      {/* ── Navbar ── */}

      <main className="lp-main">
        {/* ── Hero ── */}
        <section className="lp-hero">
          <div className="lp-hero__inner">
            {/* Text side */}
            <div className="lp-hero__text">
              <h1 className="lp-hero__headline">
                Turn Your Data Into{" "}
                <span className="lp-hero__accent">Retention Insights</span>
              </h1>
              <p className="lp-hero__sub">
                No-code AI platform to predict and reduce customer churn. Empower
                your business with machine learning without writing a single line
                of code.
              </p>
              <div className="lp-hero__ctas">
                
                
              </div>
            </div>

            {/* Image side */}
            <div className="lp-hero__media">
              <div className="lp-hero__blob lp-hero__blob--top" />
              <div className="lp-hero__blob lp-hero__blob--bottom" />
              <div className="lp-hero__img-wrap">
                <img
                  className="lp-hero__img"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDQScEonT9e1ZQBAAhJk13rzs-4KYGI4pf6QKvhWQWZ3nslFt_1wJYZgf1Zn_YpdOkwbfIbMm0jMPeC2EfWk_RNNw2j7BAX240GPQOQXZpGhYg5QiTUagF6_Epd9iZZLTHqNzZxcPhJ35j9tW57xGnGLDXFA7Q9dNTTVj5HMrmXhNA3cHwMHp7yLNcMOyS4agQDStM5KXnJiBqhcDBHUsyBKXhcJzzMAJrzRZ7PaMSdSi57-1WvtFFQiH5wwD_8sdzhHgBpxYXU5aP"
                  alt="AI neural network visualization"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Steps ── */}
        <section className="lp-steps">
          <div className="lp-section__inner">
            <div className="lp-section__header">
              <h2 className="lp-section__title">A simple four-step process</h2>
              <p className="lp-section__sub">
                Go from raw data to actionable churn predictions in minutes.
              </p>
            </div>
            <div className="lp-steps__grid">
              <div className="lp-steps__line" aria-hidden="true" />
              {STEPS.map((step) => (
                <div key={step.title} className="lp-step">
                  <div className={`lp-step__icon lp-step__icon--${step.color}`}>
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </div>
                  <h3 className="lp-step__title">{step.title}</h3>
                  <p className="lp-step__desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section className="lp-usecases">
          <div className="lp-section__inner">
            <div className="lp-usecases__header">
              <div>
                <h2 className="lp-section__title">Built for every industry</h2>
                <p className="lp-section__sub">
                  See how RetainAI adapts to your specific business model.
                </p>
              </div>
              <button className="lp-usecases__explore">
                Explore all use cases{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="lp-usecases__grid">
              {USE_CASES.map((uc) => (
                <div key={uc.title} className="lp-card glass-card">
                  <div className="lp-card__img-wrap">
                    <img className="lp-card__img" src={uc.img} alt={uc.title} />
                  </div>
                  <h3 className="lp-card__title">{uc.title}</h3>
                  <p className="lp-card__desc">{uc.desc}</p>
                  <ul className="lp-card__bullets">
                    {uc.bullets.map((b) => (
                      <li key={b} className="lp-card__bullet">
                        <span
                          className="material-symbols-outlined lp-card__check"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Section ── */}
        <section className="lp-why">
          <div className="lp-section__inner">
            <div className="lp-section__header">
              <h2 className="lp-section__title">Why businesses trust RetainAI</h2>
              <p className="lp-section__sub">
                Professional-grade intelligence without the enterprise complexity.
              </p>
            </div>
            <div className="lp-why__grid">
              {WHY_CARDS.map((card) => (
                <div key={card.title} className="lp-why-card">
                  <span className="material-symbols-outlined lp-why-card__icon">
                    {card.icon}
                  </span>
                  <h4 className="lp-why-card__title">{card.title}</h4>
                  <p className="lp-why-card__desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="lp-cta-section">
          <div className="lp-cta">
            <div className="lp-cta__blob lp-cta__blob--tr" />
            <div className="lp-cta__blob lp-cta__blob--bl" />
            <h2 className="lp-cta__title">Start predicting churn today</h2>
            <p className="lp-cta__sub">
              Join over 500 companies using RetainAI to boost their retention and
              grow their bottom line through automated intelligence.
            </p>
            <div className="lp-cta__btns">
              
              <button className="lp-btn lp-btn--ghost lp-btn--lg">Talk to Sales</button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      
    </>
  );
}