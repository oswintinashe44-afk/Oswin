import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Truck, MessageCircle, Bot, User, LayoutGrid, ScanLine } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutGrid, label: 'Market', path: '/' },
  { icon: ScanLine, label: 'Scan', path: '/scan' },
  { icon: ShoppingBag, label: 'Sell', path: '/sell' },
  { icon: Truck, label: 'Delivery', path: '/delivery' },
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <nav className="max-w-md mx-auto px-6 py-2 flex items-center justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center py-1 transition-all",
              isActive ? "text-brand-orange" : "text-gray-400 hover:text-brand-dark"
            )}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
