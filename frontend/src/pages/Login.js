import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/authForms.css';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
     <div className="login-page">
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="auth-switch-link">
        Don't have an account? <Link to="/signup">Signup</Link>
      </div>
    </div>
  </div>
  );
}

export default Login;
