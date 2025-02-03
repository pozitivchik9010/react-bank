import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
const PrivateRoute = ({ children }) => {
  const { currentAuth } = useContext(AuthContext);
  console.log("=0000=", currentAuth);
  return currentAuth.token ? children : <Navigate to="/signin" />;
};
export default PrivateRoute;
