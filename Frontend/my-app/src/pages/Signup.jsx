
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((previous) => ({ ...previous, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // UI-only signup for the current project demo.
    // This does not create an account in the backend.
    localStorage.setItem("userEmail", form.email.trim());
    localStorage.setItem("isLoggedIn", "true");

    navigate("/dashboard");
  };

  return (
    <main className="main">
      <div className="layout">
        <section className="branding">
          <h1 className="branding__headline">
            Keep your customers.
            <br />
            <span className="branding__accent">
              Predict what comes next.
            </span>
          </h1>

          <p className="branding__subtext">
            Turn customer data into churn predictions and actionable
            retention insights with RetainAI.
          </p>
        </section>

        <section className="form-container">
          <div className="form-card">
            <header className="form-card__header">
              <h2 className="form-card__title">Create your account</h2>
              <p className="form-card__subtitle">
                Get started with RetainAI.
              </p>
            </header>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form__field">
                <label className="form__label" htmlFor="name">
                  Full name
                </label>

                <input
                  className="form__input"
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form__field">
                <label className="form__label" htmlFor="email">
                  Work email
                </label>

                <input
                  className="form__input"
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form__field">
                <label className="form__label" htmlFor="company">
                  Company name
                </label>

                <input
                  className="form__input"
                  id="company"
                  type="text"
                  placeholder="Your company"
                  value={form.company}
                  onChange={handleChange}
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="form__field">
                <label className="form__label" htmlFor="password">
                  Password
                </label>

                <input
                  className="form__input"
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <button className="form__submit" type="submit">
                Create account
              </button>
            </form>

            <footer className="form-card__footer">
              Already have an account?{" "}
              <Link to="/login" className="form-card__login-link">
                Sign in
              </Link>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
