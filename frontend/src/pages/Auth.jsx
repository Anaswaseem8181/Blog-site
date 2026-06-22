import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, setError, login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const { user, error } = await login(formData.email, formData.password);
      if (!error && user) {
        onAuthSuccess(user);
      }
    } else {
      const { error } = await register(formData.username, formData.email, formData.password);
      if (!error) {
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
        setError('Registration successful! Please login.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-slate-500 font-light">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Join our developer community today.'}
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-xl mb-6 text-sm border ${error.includes('successful') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="john_doe"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : isLogin ? (
              <>
                <LogIn className="h-4 w-4" /> Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Register
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 pt-6 border-t border-slate-100">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-1.5 text-slate-900 font-medium hover:underline transition-all"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
