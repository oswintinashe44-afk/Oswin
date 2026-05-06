/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Delivery from './pages/Delivery';
import Chat from './pages/Chat';
import AITools from './pages/AITools';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Sell from './pages/Sell';
import Commissioning from './pages/Commissioning';

function AppContent() {
  const { user, loading } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center justify-center min-h-screen bg-brand-black text-white p-6 fixed inset-0 z-[100]"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-8 animate-pulse shadow-xl shadow-brand-orange/10">
              <div className="w-10 h-10 rounded-xl bg-brand-orange shadow-lg shadow-brand-orange/30" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-dashed border-brand-orange/20 rounded-full"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-2xl font-display font-black uppercase tracking-tighter italic">
              Hustle <span className="text-brand-orange">Hub</span>
            </h2>
            <p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-[0.3em] animate-pulse">
              Synchronizing Empire...
            </p>
          </motion.div>
        </motion.div>
      ) : !user ? (
        <motion.div 
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-brand-black"
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </motion.div>
      ) : (
        <motion.div 
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scan" element={<Scanner />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/ai" element={<AITools />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/commissions" element={<Commissioning />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

