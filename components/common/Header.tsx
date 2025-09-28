
import React from 'react';
import { RenaultLogo } from '../icons/RenaultLogo';
import type { UserRole } from '../../types';

interface HeaderProps {
  activeView: UserRole;
  setActiveView: (view: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const navItems: { role: UserRole, label: string }[] = [
    { role: 'CLIENTE', label: 'Cliente' },
    { role: 'VENDEDOR', label: 'Vendedor' },
    { role: 'ADMIN', label: 'Admin' },
  ];

  return (
    <header className="bg-renault-dark shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <RenaultLogo className="h-8 w-auto" />
            <span className="text-white ml-3 text-xl font-bold">Plan Rombo</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.role}
                onClick={() => setActiveView(item.role)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeView === item.role
                    ? 'bg-renault-yellow text-renault-dark'
                    : 'text-gray-300 hover:bg-renault-gray hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;