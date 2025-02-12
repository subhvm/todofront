import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
import './footer.css'

function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Please enter a valid username.');
      return;
    }

    if (password.length===0) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignup
        ? 'https://todo-back-8c7n.onrender.com/api/auth/signup'
        : 'https://todo-back-8c7n.onrender.com/api/auth/login';

      const response = await axios.post(endpoint, { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token);

        // Trigger App state update and navigate to todos page
        onLogin();
        navigate('/todos');
      } else {
        setError('Token not received from server.');
      }
    } catch (err) {
      console.error('Error during login/signup:', err);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div className="main">
      <h1>tick-r</h1>
      <h2>{isSignup ? 'Signup' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Signup' : 'Login')}
        </button>
      </form>
      <p className="toggle-link">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Login here' : 'Signup here'}
        </span>
      </p>
      
    </div><footer className="footer">
      <p>&copy; {new Date().getFullYear()} TICKR. All rights reserved.</p>
    </footer></div>
    
);

}

export default Auth;
