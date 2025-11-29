import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Mail, Lock, User, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        navigate('/onboarding');
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100">
          <div className="flex justify-center">
            <div className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                <Baby className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ParentAI
              </h1>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isSignUp
                ? 'Join thousands of parents using ParentAI'
                : 'Your AI co-pilot for parenting'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="form-group">
                <label className="label-base">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="input-base pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="label-base">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-base pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label-base">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-base pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm animate-slide-left">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline ml-1"
              >
                {isSignUp ? 'Sign in instead' : 'Create one'}
              </button>
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
            <p className="text-blue-900 text-xs">
              Demo credentials: test@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
