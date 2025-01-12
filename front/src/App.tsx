import { BrowserRouter, Routes, Route } from "react-router-dom";
import WellcomePage from "./page/welcome";
import SignupPage from "./page/signup";
import SigninPage from "./page/signin";
import SignupConfirmPage from "./page/signup-confirm";
import AuthRoute from "./page/auth-route";
import PrivateRoute from "./page/private-route.js";
import BalancePage from "./page/balance";
import NotificationsPage from "./page/notifications";
import SettingsPage from "./page/settings";
import RecoveryPage from "./page/recovery";
import RecoveryConfirmPage from "./page/recovery-confirm";
import SendPage from "./page/send";
import RecivePage from "./page/recive";
import TransactionPage from "./page/transaction";
import Error from "./page/error";
import  { createContext,  useEffect,  useState } from "react";




// Створення контексту
export const AuthContext = createContext({});



function App() {
const [currentAuth, setAuth] = useState(() => { const storedAuth = localStorage.getItem('auth'); return storedAuth ? JSON.parse(storedAuth) : 
	{ email: "", token: "", confirm: false, transaction: [], notification: [], balance: [] }});
useEffect(() => { localStorage.setItem('auth', JSON.stringify(currentAuth)); }, [currentAuth]);
const contextValue = {currentAuth, setAuth}

    return (
		<AuthContext.Provider value={contextValue}>
		  <BrowserRouter>
			<Routes>
			  <Route
				index
				element={
				  <AuthRoute>
					<WellcomePage />
				  </AuthRoute>
				}
			  />
			  <Route
				path="/signup"
				element={
				  <AuthRoute>
					<SignupPage />
				   </AuthRoute>
				}
			  />
			  <Route
				path="/signup-confirm"
				element={
				  <PrivateRoute>
					<SignupConfirmPage />
				 </PrivateRoute>
				}
			  />
			  <Route
				path="/signin"
				element={
				  <AuthRoute>
					<SigninPage />
				  </AuthRoute>
				}
			  />
			  <Route
				path="/recovery"
				element={
				  <AuthRoute>
					<RecoveryPage />
				  </AuthRoute>
				}
			  />
			  <Route
				path="/recovery-confirm"
				element={
				  <AuthRoute>
					<RecoveryConfirmPage />
				  </AuthRoute>
				}
			  />
			  <Route
				path="/balance"
				element={
				  <PrivateRoute>
					<BalancePage />
				  </PrivateRoute>
				}
			  />
			  <Route
				path="/notifications"
				element={
				  <PrivateRoute>
					<NotificationsPage />
				  </PrivateRoute>
				}
			  />
			  <Route
				path="/settings"
				element={
				  <PrivateRoute>
					<SettingsPage />
				  </PrivateRoute>
				}
			  />
			  <Route
				path="/recive"
				element={
				  <PrivateRoute>
					<RecivePage />
				  </PrivateRoute>
				}
			  />
			  <Route
				path="/send"
				element={
				  <PrivateRoute>
					<SendPage />
				  </PrivateRoute>
				}
			  />
			  <Route
				path="/transaction/:transactionId"
				element={
				  <PrivateRoute>
					<TransactionPage />
				  </PrivateRoute>
				}
			  />
			  <Route path="*" Component={Error} />
			</Routes>
		  </BrowserRouter>
		</AuthContext.Provider>
	  )

}

export default App;
