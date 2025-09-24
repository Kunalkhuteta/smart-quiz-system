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
import Chatbot from "./components/Chatbot";
import CreateQuiz from "./pages/CreateQuiz";
import AttemptQuiz from "./pages/AttemptQuiz";

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

          <Route path="/admin" element={<AdminPanel />} />
<Route path="/leaderboard" element={<Leaderboard />} />
 <Route path="/create-quiz" element={<CreateQuiz />} />
 <Route path="/edit-quiz/:quizId" element={<CreateQuiz />} /> {/* Edit Quiz */}
 <Route path="/attempt-quiz/:quizId" element={<AttemptQuiz />} />

      </Routes>
     
      <Chatbot />
   
    </Router>
  );
}

export default App;
