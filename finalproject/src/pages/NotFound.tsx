
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { MoveLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
        <p className="text-2xl text-foreground mb-4">Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
            <MoveLeft className="mr-2 h-4 w-4" />
            {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
