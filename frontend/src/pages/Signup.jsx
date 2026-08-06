// pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    password2: '',
  });
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
      const response = await fetch('http://localhost:8000/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = [];
        if (typeof data === 'object') {
          Object.keys(data).forEach(key => {
            const messages = Array.isArray(data[key]) ? data[key] : [data[key]];
            errorMessages.push(`${key}: ${messages.join(' ')}`);
          });
        }
        throw new Error(errorMessages.join(' ') || 'Registration failed');
      }

      navigate('/login');
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join us today</p>
        </div>

        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="username"
            placeholder="Username *"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            name="email"
            placeholder="Email (optional but recommended)"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            type="text"
            name="phone_number"
            placeholder="Phone Number (optional)"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <div className="text-xs text-gray-400 dark:text-gray-500 text-center -mt-2">
            At least one of Email or Phone Number is required
          </div>

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            required
          />

          <Button type="submit" loading={loading}>
            Sign Up
          </Button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue dark:text-brand-blue font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;