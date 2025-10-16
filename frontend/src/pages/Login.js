import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function doLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://10.210.76.70:5000/api/admin/login", {
        username: u,
        password: p,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMsg("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMsg("❌ Invalid username or password");
      }
    } catch (err) {
      setMsg("❌ Login failed! Please check your credentials.");
    }
  }

  useEffect(() => {
    const card = document.querySelector(".login-card");
    card.classList.add("fade-in");
  }, []);

  return (
    <div style={styles.container}>
      <div className="login-card" style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={doLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={u}
              onChange={(e) => setU(e.target.value)}
              placeholder="Enter username"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              placeholder="Enter password"
              style={styles.input}
              required
            />
          </div>
          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
        <p style={styles.message}>{msg}</p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity:1; transform: translateY(0); }
          }

          .fade-in {
            animation: fadeIn 1s ease forwards;
          }

          input:focus {
            border-color: #007bff;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
            outline: none;
            transition: all 0.3s ease;
          }

          button:hover {
            background-color: #111;
            transform: scale(1.02);
            transition: all 0.3s ease;
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f0f0f, #2b2b2b)",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2.5rem 3rem",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    textAlign: "center",
    width: "360px",
    maxWidth: "90%",
    color: "#111",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "#111",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#555",
    marginBottom: "2rem",
  },
  field: {
    marginBottom: "1.2rem",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "0.4rem",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f8f8f8",
    fontSize: "1rem",
    color: "#000",
    transition: "0.3s ease",
  },
  button: {
    width: "100%",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    padding: "0.8rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    marginTop: "0.5rem",
    transition: "0.3s ease",
  },
  message: {
    marginTop: "1rem",
    fontSize: "0.95rem",
    color: "#333",
  },
};
