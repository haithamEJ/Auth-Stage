import { useState } from 'react';
import {Header} from '../Components/header';
import {Footer} from '../Components/footer';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 px-6 py-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Stage</h1>
              <p className="text-gray-300">Your professional workspace</p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
                <p className="text-gray-600 mb-4">
                  Thank you for joining Stage. We're excited to have you on board and help you achieve your goals.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <button className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition duration-150">
                    Explore Dashboard
                  </button>
                  <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition duration-150">
                    View Services
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Key Features</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">Analytics</h4>
                    <p className="text-sm text-gray-600">Access real-time insights and statistics</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">Management</h4>
                    <p className="text-sm text-gray-600">Organize and streamline your workflow</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">Support</h4>
                    <p className="text-sm text-gray-600">24/7 assistance for all your needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}