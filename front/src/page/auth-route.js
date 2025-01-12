import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

const AuthRoute = ({ children }) => {
  const { currentAuth } = useContext(AuthContext);
  if (currentAuth.token) {
    if (!currentAuth.confirm) {
      return <Navigate to="/signup-confirm" />;
    } else {
      return <Navigate to="/balance" />;
    }
  }
  return children;
};
export default AuthRoute;
