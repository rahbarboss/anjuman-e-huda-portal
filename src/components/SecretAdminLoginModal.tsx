import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, ShieldAlert, X, Eye, EyeOff, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SecretAdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await login(username.trim(), password.trim());
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setUsername('');
          setPassword('');
        }, 1000);
      } else {
        setErrorMsg(result.message || 'Access Denied: Invalid credentials.');
      }
    } catch {
      setErrorMsg('Authentication error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('anjuman');
    setPassword('anjuman2026');
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <motion.div
          key="secret-admin-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          id="secret-admin-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <motion.div
            key="secret-admin-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden text-stone-100"
          >
            {/* Header decorative bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />

            {/* Close button */}
            <button
              id="close-admin-modal-btn"
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
                    Executive Gateway
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white">Central Admin Login</h3>
                </div>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed mb-6">
                This is a restricted portal for authorized executive council members of{' '}
                <strong className="text-emerald-400">ANJUMAN-E-HUDA</strong>. All access requests are logged.
              </p>

              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl flex items-start gap-2.5 text-red-200 text-xs leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {success && (
                <div className="mb-5 p-3.5 bg-emerald-950/70 border border-emerald-500/60 rounded-xl flex items-center gap-2.5 text-emerald-200 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access Granted. Redirecting to Executive Panel...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5" htmlFor="admin-username">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="admin-username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter admin username"
                      className="w-full bg-stone-950/80 border border-stone-700 rounded-xl py-2.5 pl-9 pr-3.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5" htmlFor="admin-password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security key"
                      className="w-full bg-stone-950/80 border border-stone-700 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="admin-login-submit-btn"
                    type="submit"
                    disabled={loading || success}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authenticate & Enter Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>Required: anjuman / anjuman2026</span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
