import { useState } from 'react';
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:8080/api';

export  function Login() {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [urlData, setUrlData] = useState(''); // For QR code
  const [isLoading, setIsLoading] = useState(false);
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
    passwordLength: false,
  });
  
  // Handle login form submission
  const handleSubmit = async () => {
    // Reset errors
    const errors = {
      email: !email,
      password: !password,
      passwordLength: password.length > 0 && password.length < 6,
    };
    
    setFormErrors(errors);
    
    // If there are errors, don't submit
    if (errors.email || errors.password || errors.passwordLength) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Submit login credentials to server
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      
      // Handle successful login
      if (response.data.success) {
        if (response.data.requireTOTP) {
          // If TOTP is required, show OTP modal
          setShowOtpModal(true);
          
          // If we received a QR code (first time setup), show it
          if (response.data.qrCode) {
            setUrlData(response.data.qrCode);
          } else {
            // Otherwise, fetch the existing QR code
            fetchQrCode();
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch QR code for existing users
  const fetchQrCode = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-qrcode`, {
        params: { email }
      });
      
      if (response.data.success) {
        setUrlData(response.data.qrCode);
      }
    } catch (error) {
      console.error('Failed to fetch QR code:', error);
      alert('Failed to load QR code. Please try again.');
    }
  };
  
  // Handle OTP verification
  const handleConfirmOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-totp`, {
        email,
        token: otp
      });
      
      if (response.data.success) {
        // Authentication successful
        alert('Login successful!');
        setShowOtpModal(false);
        
        // Here you would typically:
        // 1. Store user info in state/context
        // 2. Redirect to dashboard or home page
        // For example:
        // navigate('/dashboard');
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
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Chargement...' : 'Valider'}
            </button>
          </div>
        </div>
      </div>
      
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700">
            {urlData && (
              <div className="flex justify-center mb-4">
                <div className="w-50 h-50 bg-gray-700 rounded-md flex items-center justify-center p-2">
                  <img src={urlData} alt="QR Code" className="w-full h-auto" />
                </div>
              </div>
            )}
            
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
                disabled={isLoading}
                className={`flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Chargement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}