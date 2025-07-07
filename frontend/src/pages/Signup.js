import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/authForms.css';

function Signup({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert(data.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <div className="auth-switch-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Signup;
