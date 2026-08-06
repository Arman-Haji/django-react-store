// pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.detail || data.non_field_errors?.[0] || 'Invalid login credentials';
        throw new Error(msg);
      }

      const profileRes = await fetch('http://localhost:8000/accounts/profile/', {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      
      let userData = data.user || {};
      if (profileRes.ok) {
        const profile = await profileRes.json();
        userData = { ...userData, ...profile };
      }

      login(userData, { access: data.access, refresh: data.refresh });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-800/30 p-8 animate-fade-in transition-colors duration-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="login"
            placeholder="Username, Email or Phone Number"
            value={formData.login}
            onChange={handleChange}
            required
            helper="Enter your username, email or phone number"
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" loading={loading}>
            Log In
          </Button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-blue dark:text-brand-blue font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;