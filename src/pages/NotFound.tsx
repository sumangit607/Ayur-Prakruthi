import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      <Card className="p-12 md:p-16 max-w-2xl mx-4 text-center shadow-[var(--shadow-large)] border-2 border-primary/10 bg-gradient-to-br from-card via-card to-muted/5 relative overflow-hidden animate-scale-in">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="mb-8 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-glow"></div>
              <div className="relative p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl backdrop-blur-sm border border-primary/20 shadow-glow inline-block">
                <Leaf className="w-16 h-16 md:w-20 md:h-20 text-primary animate-float" />
              </div>
            </div>
          </div>
          
          <h1 className="text-8xl md:text-9xl font-extrabold mb-4 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent animate-gradient">
            404
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Page Not Found
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into the forest. 
            Let's get you back to exploring leaves!
          </p>
          
          <Link to="/">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary via-primary-light to-accent hover:shadow-glow-lg text-white font-semibold px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
