import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm({ ...form, [id]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", form.email);
    navigate("/dashboard");
  };

  const handleDemoLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "demo@retainai.com");
    navigate("/dashboard");
  };

  return (
      <main className="main">
        <div className="main__inner">
          {/* Login Card */}
          <div className="card">
            <div className="card__header">
              <h1 className="card__title">Welcome Back</h1>
              <p className="card__subtitle">Please enter your details to sign in</p>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form__field">
                <label className="form__label" htmlFor="email">Work Email</label>
                <div className="form__input-wrap">
                  <span className="form__icon material-symbols-outlined">mail</span>
                  <input
                      className="form__input"
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form__field">
                <label className="form__label" htmlFor="password">Password</label>
                <div className="form__input-wrap">
                  <span className="form__icon material-symbols-outlined">lock</span>
                  <input
                      className="form__input"
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                  />
                </div>
              </div>

              {/* Actions Row */}
              <div className="form__actions">
                <label className="form__remember">
                  <input
                      className="form__checkbox"
                      id="remember"
                      type="checkbox"
                      checked={form.remember}
                      onChange={handleChange}
                  />
                  <span className="form__remember-label">Remember me</span>
                </label>
                <a href="#" className="form__forgot">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <button className="form__submit" type="submit">
                Sign In
              </button>
            </form>

            {/* Demo Login Button */}
            <button className="form__demo-btn" onClick={handleDemoLogin}>
              Login without authentication (Demo)
            </button>

            {/* Footer Link */}
            <div className="card__footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="card__signup-link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
  );
}