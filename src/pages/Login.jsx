import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'Hanna Odeh' && password === '123456789') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-navy)' }}>
      <div style={{ width: 420, maxWidth: '90%', background: 'var(--color-white)', padding: 28, borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <img src="/logos/cir-logo.png" alt="Pax Via" style={{ width: 150, height: 'auto', marginBottom: 6 ,marginLeft:`auto`,marginRight:`auto` }} />
          <h2 style={{ margin: 0, color: 'var(--color-navy)' }}>Pax Via Tours</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{ width: '100%', padding: '10px 12px', marginBottom: 12, borderRadius: 4, border: '1px solid #ddd' }}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{ width: '100%', padding: '10px 12px', marginBottom: 12, borderRadius: 4, border: '1px solid #ddd' }}
          />

          {error && <div style={{ color: '#b00020', marginBottom: 12 }}>{error}</div>}

          <button type="submit" style={{ width: '100%', padding: '10px 14px', background: 'var(--color-navy)', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700 }}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
