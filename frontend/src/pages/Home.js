import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Class Timetable Scheduler</h1>
        <p style={styles.subtitle}>
          Welcome to the scheduler Portal — manage timetables and schedules easily.
        </p>
        <div style={styles.buttons}>
          <button style={styles.primaryBtn} onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/scheduler")}>
            Go to Scheduler
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1eff", // light gray
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "3rem 4rem",
    borderRadius: "16px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
    maxWidth: "450px",
    animation: "fadeIn 1s ease",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    fontSize: "2rem",
    color: "#1f1f1f",
    fontWeight: "700",
    marginBottom: "0.8rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "2rem",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  primaryBtn: {
    padding: "0.8rem 2rem",
    backgroundColor: "#111827", // dark gray/black
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  secondaryBtn: {
    padding: "0.8rem 2rem",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};

// animation + hover effect
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
button:hover {
  transform: translateY(-2px);
}
`;
document.head.appendChild(styleTag);
