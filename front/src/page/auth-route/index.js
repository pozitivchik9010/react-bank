// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { saveSession } from "../../util/sesion";
// const AuthRoute = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("Checking session...");
//     if (window.session) {
//       const { user } = window.session;
//       if (user && user.isConfirm) {
//         navigate("/balance");
//       } else {
//         navigate("/signup-confirm");
//       }
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   return children;
// };

// export default AuthRoute;
