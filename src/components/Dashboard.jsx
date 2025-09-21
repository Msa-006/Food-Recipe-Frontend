import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, LogOut, Search, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FoodRecipeApp from './FoodRecipeApp';
import apiService from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = (localStorage.getItem('authToken') || '').trim();
    if (!token) {
      navigate('/');
    } else {
      const cachedFullName = (localStorage.getItem('fullName') || '').trim();
      if (cachedFullName) {
        setUser({ name: cachedFullName });
      }
      // Fetch full name from backend using token
      (async () => {
        try {
          const response = await apiService.getFullName(token);
          if (typeof response === 'string' && response.startsWith('401::')) {
            // Fallback to email prefix if available
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
              setUser({ name: userEmail.split('@')[0] });
            } else {
              setUser({ name: 'User' });
            }
          } else if (typeof response === 'string') {
            const name = response.trim();
            setUser({ name });
            if (name) localStorage.setItem('fullName', name);
          } else {
            setUser({ name: 'User' });
          }
        } catch (e) {
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            setUser({ name: userEmail.split('@')[0] });
          } else {
            setUser({ name: 'User' });
          }
        }
      })();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Food Recipe
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Welcome, {user.name}!</span>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="shimmer-btn flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-2 rounded-full hover:shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to top button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 shimmer-btn bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-full shadow-lg"
          aria-label="Back to top"
        >
          ↑ Top
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            The World Of <span className="text-orange-500">Recipes</span>
          </h1>
          <p className="text-xl text-gray-600">Discover amazing recipes from around the globe</p>
        </motion.div>

        <FoodRecipeApp />
      </main>
    </div>
  );
};

export default Dashboard;