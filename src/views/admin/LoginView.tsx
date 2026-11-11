import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { MASCOT_LOGO_URL } from '../../data/menuData';

export const LoginView: React.FC = () => {
  const { login, isLoginLoading, loginError, setCurrentScreen } = useAdmin();

  const [email, setEmail] = useState('rian.kasir@shiboss.id');
  const [password, setPassword] = useState('shiboss2026');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi.';
    } else if (!email.includes('@')) {
      errors.email = 'Format email tidak valid.';
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 4) {
      errors.password = 'Kata sandi minimal 4 karakter.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await login(email, password);
  };

  const handleFillDemo = (type: 'kasir' | 'manajer') => {
    if (type === 'kasir') {
      setEmail('rian.kasir@shiboss.id');
      setPassword('shiboss2026');
    } else {
      setEmail('dita.manager@shiboss.id');
      setPassword('shiboss2026');
    }
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-blue-100 p-2 mb-3">
            <img
              src={MASCOT_LOGO_URL}
              alt="Logo Shiboss"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#071747] tracking-tight">
            Kedai Susu Segar Shiboss
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Panel Administrasi & Pengelolaan Pesanan In-Store
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#071747]">Masuk ke Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan kredensial akun kasir atau staf Shiboss Anda.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="email-input">
                Email Admin / Kasir
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="nama.kasir@shiboss.id"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none ${
                    fieldErrors.email
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]'
                  }`}
                  disabled={isLoginLoading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700" htmlFor="password-input">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none ${
                    fieldErrors.password
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]'
                  }`}
                  disabled={isLoginLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0052cc] hover:bg-[#0040a2] active:bg-[#003380] text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoginLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Fillers */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-semibold block mb-2 uppercase tracking-wider">
              Kredensial Prototipe Cepat:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('kasir')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-left transition-colors"
              >
                <span className="font-bold block text-[#071747]">Kasir Shift</span>
                <span className="text-[10px] text-slate-500 font-mono">rian.kasir</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('manajer')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-left transition-colors"
              >
                <span className="font-bold block text-[#071747]">Manajer Outlet</span>
                <span className="text-[10px] text-slate-500 font-mono">dita.manager</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Customer Web */}
        <div className="text-center mt-6">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="text-xs text-slate-500 hover:text-[#0052cc] font-medium transition-colors"
          >
            ← Kembali ke Tampilan Dashboard Langsung
          </button>
        </div>
      </div>
    </div>
  );
};
