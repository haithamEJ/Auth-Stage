import { useState } from 'react';
import axios from 'axios';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [formErrors, setFormErrors] = useState({ email: false, password: false, passwordLength: false });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = {
      email: email.trim() === '',
      password: password.trim() === '',
      passwordLength: password.trim() !== '' && password.length < 6
    };
    
    setFormErrors(errors);
    
    if (!errors.email && !errors.password && !errors.passwordLength) {
      setShowOtpModal(true);
    }
  };

  const handleConfirmOtp = () => {
    // Pour l'intégration avec Node.js plus tard
    console.log('Code OTP confirmé:', otp);
    setShowOtpModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Connexion</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="votre@email.com"
              />
              {formErrors.email && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  L'email est requis
                </div>
              )}
            </div>
            
            <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Mot de passe
            </label>
            <div className="relative">
                <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="••••••••"
                />
                <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                )}
                </button>
            </div>
            {formErrors.password && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                Le mot de passe est requis
                </div>
            )}
            {formErrors.passwordLength && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                Le mot de passe doit contenir au moins 6 caractères
                </div>
            )}
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
      
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                <img src="data:image/png;base64,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" alt="Auth" className="w-16 h-16" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4 text-center">Entrez le code de vérification</h3>
            
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                Code OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-400 text-center tracking-widest text-lg"
                placeholder="123456"
                maxLength={6}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmOtp}
                className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition duration-200"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}