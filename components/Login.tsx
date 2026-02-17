
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin({
        id: 'u1',
        name: 'Alex Sharma',
        email: email || 'alex@vedahealth.com',
        dosha: 'Vata-Pitta',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        medications: ['Warfarin', 'Amlodipine']
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ayur-cream p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-ayur-primary rounded-2xl items-center justify-center text-ayur-white text-3xl shadow-xl shadow-ayur-sage mb-6">
            🛡️
          </div>
          <h1 className="text-3xl font-extrabold text-ayur-charcoal tracking-tight">Ayur-Shield</h1>
          <p className="text-ayur-primary-dark mt-2">Traditional Wisdom, Modern Safety</p>
        </div>

        <div className="bg-ayur-white p-8 rounded-[2rem] shadow-xl shadow-ayur-sage border border-ayur-sage">
          <h2 className="text-xl font-bold text-ayur-charcoal mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ayur-primary-dark uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-ayur-cream border border-ayur-sage rounded-xl px-4 py-3 focus:ring-2 focus:ring-ayur-primary focus:outline-none transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ayur-primary-dark uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full bg-ayur-cream border border-ayur-sage rounded-xl px-4 py-3 focus:ring-2 focus:ring-ayur-primary focus:outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ayur-primary hover:bg-ayur-primary-dark text-ayur-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-ayur-sage mt-4 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-ayur-sage text-center">
            <p className="text-sm text-ayur-primary-dark">
              Don't have an account? <a href="#" className="text-ayur-accent font-bold hover:underline">Create Profile</a>
            </p>
          </div>
        </div>

        <p className="text-center text-ayur-primary-dark/60 text-xs mt-8">
          By signing in, you agree to our <span className="underline cursor-pointer">Health Data Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
