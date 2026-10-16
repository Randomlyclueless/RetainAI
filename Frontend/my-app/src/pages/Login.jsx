
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo authentication for the project.
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", form.email.trim());

    navigate("/dashboard");
  };

  return (
    <main className="main">
      <div className="main__inner">
        <section className="card">
          <header className="card__header">
            <h1 className="card__title">Welcome back</h1>
            <p className="card__subtitle">
              Sign in to access your RetainAI dashboard.
            </p>
          </header>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form__field">
              <label className="form__label" htmlFor="email">
                Work email
              </label>

              <div className="form__input-wrap">
                <span className="form__icon material-symbols-outlined">
                  mail
                </span>

                <input
                  className="form__input"
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="password">
                Password
              </label>

              <div className="form__input-wrap">
                <span className="form__icon material-symbols-outlined">
                  lock
                </span>

                <input
                  className="form__input"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button className="form__submit" type="submit">
              Sign in
            </button>
          </form>

          <footer className="card__footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="card__signup-link">
                Create an account
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
