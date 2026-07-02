"use client";
import { useState, useEffect } from 'react';
import { Sparkles, Mail, Lock, LogOut, UserCheck } from 'lucide-react';

export default function ProfilePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setUser({ email: data.email });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
    } else {
      if (isLogin) {
        setUser({ email: data.email });
      } else {
        setIsLogin(true); // Switch to login after successful register
        alert('Account created! Please log in.');
      }
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  if (loading) return <div className="min-h-screen w-full bg-black flex items-center justify-center text-neutral-500">Syncing with TiDB...</div>;

  if (user) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-6 text-white">
        <div className="w-full max-w-sm bg-neutral-900/40 border border-neutral-800/60 rounded-3xl p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8"/>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">Account Active</h1>
          <p className="text-neutral-400 text-sm mb-6">{user.email}</p>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-red-950/40 text-neutral-300 hover:text-red-400 border border-neutral-700 hover:border-red-900/50 py-3 rounded-xl transition-all">
            <LogOut className="w-4 h-4"/> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-6 py-12 text-white">
      <div className="w-full max-w-sm bg-neutral-900/40 border border-neutral-800/60 rounded-3xl p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-4">
            <Sparkles className="w-6 h-6 text-emerald-400"/>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isLogin ? 'Welcome Back' : 'Join MangaLume'}
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Read your favorite manga anywhere.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"/>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"/>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
