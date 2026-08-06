// pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { AvatarUpload } from '../components/common/AvatarUpload';

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    profile_image: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/accounts/profile/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserData({
        username: data.username || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        profile_image: data.profile_image || null,
      });
      
      updateUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setError('');
      setSuccess('');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/accounts/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
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
        throw new Error(errorMessages.join(' ') || 'Password change failed');
      }

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ old_password: '', new_password: '', new_password2: '' });
      
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      setPasswordError(err.message);
      setTimeout(() => setPasswordError(''), 3000);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', userData.username || '');
      formData.append('email', userData.email || '');
      formData.append('phone_number', userData.phone_number || '');
      formData.append('first_name', userData.first_name || '');
      formData.append('last_name', userData.last_name || '');
      
      if (imageFile) {
        formData.append('profile_image', imageFile);
      }

      const response = await fetch('http://localhost:8000/accounts/profile/', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = [];
        if (typeof data === 'object') {
          Object.keys(data).forEach(key => {
            const messages = Array.isArray(data[key]) ? data[key] : [data[key]];
            errorMessages.push(`${key}: ${messages.join(' ')}`);
          });
        }
        throw new Error(errorMessages.join(' ') || 'Update failed');
      }

      setUserData({
        username: data.username || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        profile_image: data.profile_image || null,
      });
      
      updateUser(data);
      
      setImageFile(null);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading && !userData.username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8 transition-colors duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-800/30 p-8 animate-fade-in transition-colors duration-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account information</p>
        </div>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <AvatarUpload
            imagePreview={userData.profile_image}
            username={userData.username}
            onFileChange={handleFileChange}
          />

          <Input
            name="username"
            placeholder="Username *"
            value={userData.username || ''}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email || ''}
            onChange={handleChange}
            helper="Leave blank to remove"
          />

          <Input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={userData.phone_number || ''}
            onChange={handleChange}
            helper="Leave blank to remove"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="first_name"
              placeholder="First Name"
              value={userData.first_name || ''}
              onChange={handleChange}
            />
            <Input
              name="last_name"
              placeholder="Last Name"
              value={userData.last_name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button type="submit" loading={saving} variant="primary">
              Save Changes
            </Button>
            <Button
              type="button"
              onClick={() => setShowChangePassword(!showChangePassword)}
              variant="warning"
            >
              {showChangePassword ? 'Cancel' : 'Change Password'}
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              variant="danger"
            >
              Logout
            </Button>
          </div>
        </form>

        {showChangePassword && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
            
            <Alert type="error" message={passwordError} />
            <Alert type="success" message={passwordSuccess} />

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                name="old_password"
                placeholder="Current Password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                required
              />
              <Input
                type="password"
                name="new_password"
                placeholder="New Password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
              <Input
                type="password"
                name="new_password2"
                placeholder="Confirm New Password"
                value={passwordData.new_password2}
                onChange={handlePasswordChange}
                required
              />
              <Button type="submit" loading={passwordLoading} variant="success">
                Change Password
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;