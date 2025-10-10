import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Class Timetable Scheduler</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
        <button style={styles.button} onClick={() => navigate('/scheduler')}>
          Go to Scheduler
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
    color: '#fff',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1.5rem',
  },
  button: {
    padding: '0.8rem 2rem',
    background: '#fff',
    color: '#3b82f6',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default Home;
