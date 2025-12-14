import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </div>

        <h2 className="text-3xl font-bold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Sorry, the page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
