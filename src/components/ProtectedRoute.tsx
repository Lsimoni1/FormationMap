import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "./ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if(loading) {
    return(
      <div className="grid place-items-center min-h-screen">                                                                                                                                                
        <Spinner className="h-10 w-10" />                                                                                                                                                                   
      </div>                                                                                                                                                                                                
    );          
  }

  if(!user) {
    return <Navigate to="/login" replace/>
  }

  return children;
};

export default ProtectedRoute;
