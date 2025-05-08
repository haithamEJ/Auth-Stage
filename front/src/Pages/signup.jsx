import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [urlData, setUrlData] = useState(''); // For QR code
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    password: false,
    passwordLength: false,
    passwordMatch: false
  });
  
  const handleSubmit = async () => {
    const errors = {
      name: !name,
      email: !email,
      password: !password,
      passwordLength: password.length > 0 && password.length < 6,
      passwordMatch: password !== confirmPassword
    };
    
    setFormErrors(errors);
    
    if (errors.name || errors.email || errors.password || errors.passwordLength || errors.passwordMatch) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        name,
        email,
        password,
      });
      
      if (response.data.success) {
        setUserId(response.data.userId);
        
        if (response.data.qrCode) {
          setUrlData(response.data.qrCode);
          setShowOtpModal(true);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  


const handleConfirmOtp = async () => {
  if (!otp || otp.length !== 6) {
    alert('Please enter a valid 6-digit code');
    return;
  }
  
  setIsLoading(true);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-totp`, {
      token: otp,
      userId
    });
    
    if (response.data.success) {
      setShowOtpModal(false);
      setSignupSuccess(true);
      alert('Account created and verified successfully! You can now login.');
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    alert(error.response?.data?.message || 'Verification failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Créer un compte</h2>
          
          {signupSuccess ? (
            <div className="text-center py-8">
              <div className="text-green-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Inscription réussie!</h3>
              <p className="text-gray-300 mb-6">Votre compte a été créé avec succès avec l'authentification à deux facteurs.</p>
              <button
                onClick={() => window.location.href = '/*/login'}
                className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition duration-200"
              >
                Aller à la page de connexion
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Votre nom"
                />
                {formErrors.name && (
                  <div className="flex items-center mt-1 text-red-400 text-sm">
                    Le nom est requis
                  </div>
                )}
              </div>
              
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
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="••••••••"
                />
                {formErrors.passwordMatch && (
                  <div className="flex items-center mt-1 text-red-400 text-sm">
                    Les mots de passe ne correspondent pas
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Chargement...' : 'Créer un compte'}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-gray-400">
                  Déjà inscrit? <a href="/login" className="text-white hover:underline">Se connecter</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Configuration de l'authentification à deux facteurs</h3>
            
            <div className="mb-6 text-gray-300 text-sm">
              <p>Scannez ce QR code avec une application d'authentification comme Google Authenticator ou Authy pour configurer l'authentification à deux facteurs.</p>
            </div>
            
            {urlData && (
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-md">
                  <img src={urlData} alt="QR Code" className="w-full h-auto" />
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                Entrez le code à 6 chiffres de votre application
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
            
            <button
              onClick={handleConfirmOtp}
              disabled={isLoading || otp.length !== 6}
              className={`w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition duration-200 ${
                isLoading || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Vérification...' : 'Vérifier et activer'}
            </button>
            
            <div className="mt-4 text-gray-400 text-sm text-center">
              <p>Attention: Vous devez configurer l'authentification à deux facteurs pour continuer.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}