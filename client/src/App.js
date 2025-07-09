// client/src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Attempts from "./pages/Attempts";
import AttemptDetails from "./pages/AttemptDetails";
import Leaderboard from "./pages/Leaderboard";
import "./App.css"
import AdminPanel from "./pages/AdminPanel";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

<Route path="/attempts" element={<Attempts />} />
 <Route path="/attempts/:id" element={<AttemptDetails />} />

<Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminPanel />} />

      </Routes>
    </Router>
  );
}

export default App;
