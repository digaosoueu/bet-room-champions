
import React from 'react';
import { LogOut, User, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  userName: string;
  credits: number;
  onLogout: () => void;
}

const Navbar = ({ userName, credits, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              BetRooms
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-lg">
              <Coins className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-emerald-700">{credits}</span>
              <span className="text-sm text-emerald-600">créditos</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">{userName}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
