"use client"
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  onLogout?: () => void;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  onLogout,
  className = "flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // Call the onLogout callback if provided (e.g., to close dropdown)
      if (onLogout) {
        onLogout();
      }
      
      // Navigate to login page
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </>
      )}
    </button>
  );
};

export default LogoutButton;