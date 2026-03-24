import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(password);
      navigate('/admin/dashboard', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid admin password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="container admin-login-container">
        <div className="admin-login-shell">
          <div className="admin-login-copy">
            <p className="admin-login-kicker">WedMeet Admin</p>
            <h1 className="admin-login-title">Access the dashboard</h1>
            <p className="admin-login-subtitle">
              Sign in to upload templates, manage video and PDF previews, and keep the invitation catalog current.
            </p>
          </div>

          <div className="card admin-login-card">
            <div className="admin-login-icon">
              <Lock size={28} color="var(--color-primary)" />
            </div>

            <h2 className="admin-login-card-title">Admin Panel</h2>
            <p className="admin-login-card-copy">Enter your password to continue.</p>

            <form onSubmit={handleSubmit} className="admin-login-form">
              <label className="admin-login-field">
                <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="admin-login-input"
              />
              </label>

              {error && (
                <p className="admin-login-error">
                  <AlertCircle size={16} /> {error}
                </p>
              )}

              <button type="submit" className="btn btn-primary admin-login-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
