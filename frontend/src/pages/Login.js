import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [u, setU] = useState();
  const [p, setP] = useState();
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function doLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post('http://10.210.76.70:5000/api/admin/login', {
        username: u,
        password: p
      });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setMsg('✅ Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/home'); 
        }, 800);
      } else {
        setMsg('❌ Invalid username or password');
      }
    } catch (err) {
      setMsg('❌ Login failed! Please check your credentials.');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={doLogin}>
          <div style={styles.field}>
            <label>Username</label>
            <input
              onChange={(e) => setU(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              
              onChange={(e) => setP(e.target.value)}
              style={styles.input}
            />
          </div>
          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
        <p style={styles.message}>{msg}</p>
        <p style={styles.hint}>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem 3rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    textAlign: 'center',
    width: '350px',
  },
  title: {
    color: '#3b82f6',
    marginBottom: '1.5rem',
  },
  field: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginTop: '0.3rem',
  },
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '0.7rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  },
  message: {
    marginTop: '1rem',
    color: '#333',
  },
  hint: {
    fontSize: '0.9rem',
    color: '#666',
  },
};
