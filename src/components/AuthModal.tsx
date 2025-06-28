'use client';

import {useState, useEffect} from 'react';
import {Dialog} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {EyeIcon} from '@heroicons/react/24/outline';
import {QuestionMarkCircleIcon} from '@heroicons/react/24/outline';

type AuthMode = 'login' | 'register';
type ValidationErrors = { [key: string]: string };

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rememberMe');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rememberMe', JSON.stringify(rememberMe));
      if (rememberMe) {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) setEmail(savedEmail);
      }
    }
  }, [rememberMe]);

  const handlePasswordReset = async () => {
    if (!email) {
      setErrors({ email: 'Sisesta e-posti aadress parooli taastamiseks' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Parooli taastamine ebaõnnestus');
      }

      setErrors({});
      alert('Parooli taastamise link on saadetud teie e-posti aadressile');
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Parooli taastamine ebaõnnestus',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'E-post on kohustuslik';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Vale e-posti formaat';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Salasõna on kohustuslik';
    } else if (password.length < 8) {
      newErrors.password = 'Salasõna peab olema vähemalt 8 tähemärki pikk';
    }

    if (mode === 'register') {
      // Confirm password validation
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Salasõna kordamine on kohustuslik';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Salasõnad ei kattu';
      }

      // Phone validation (optional)
      if (phone && !/^\+?[1-9]\d{7,14}$/.test(phone)) {
        newErrors.phone = 'Vale telefoni number';
      }

      // Terms acceptance validation
      if (!acceptedTerms) {
        newErrors.terms = 'Kasutustingimustega nõustumine on kohustuslik';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode,
          email,
          password,
          rememberMe,
          ...(mode === 'register' && {
            confirmPassword,
            phone,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Midagi läks valesti');
      }

      // Handle successful auth
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('userEmail');
      }
      onClose();
      // TODO: Update auth state and redirect

    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Midagi läks valesti',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTooltip = (text: string) => (
    <div className="group relative inline-block">
      <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48">
        {text}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md rounded-lg bg-white p-6 pt-10 min-h-[600px] mt-[-2rem]">
          <button
            onClick={onClose}
            className="absolute top-3 right-5 text-gray-600 hover:text-gray-800"
          >
            <XMarkIcon className="h-6 w-6 font-bold stroke-2" />
          </button>

          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold">
              {mode === 'login' ? 'Logi sisse' : 'Loo konto'}
            </Dialog.Title>
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrors({});
              }}
              className="text-xl font-bold text-orange-500 hover:text-orange-600"
            >
              {mode === 'login' ? 'Loo konto' : 'Logi sisse'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-post
              </label>
              {renderTooltip('Sisesta kehtiv e-posti aadress')}
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}

            <div className="relative">
              <div className="flex items-center gap-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Salasõna
                </label>
                {renderTooltip('Vähemalt 8 tähemärki')}
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
              >
                <EyeIcon className="h-5 w-5" />
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-600">Nõustun kasutustingimustega</span>
                  </label>
                  {renderTooltip('Nõustudes kasutustingimustega kinnitate, et olete tutvunud ja nõustute meie teenuse kasutustingimuste ja privaatsuspoliitikaga.')}
                </div>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                )}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Korda salasõna
                    </label>
                    {renderTooltip('Sisesta sama salasõna uuesti')}
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                    onMouseDown={() => setShowConfirmPassword(true)}
                    onMouseUp={() => setShowConfirmPassword(false)}
                    onMouseLeave={() => setShowConfirmPassword(false)}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefon (valikuline)
                    </label>
                    {renderTooltip('Sisesta telefoninumber koos riigi koodiga')}
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+372"
                    className={`mt-1 block w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Jäta mind meelde</span>
              </label>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Unustasin salasõna?
                </button>
              )}
            </div>

            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Palun oota...' : mode === 'login' ? 'Logi sisse' : 'Loo konto'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
