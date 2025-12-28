import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import Blending from "./pages/Blending";
import Understanding from "./pages/Understanding";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
          <Route path="/blending" element={<PrivateRoute><Blending /></PrivateRoute>} />
          <Route path="/understanding" element={<PrivateRoute><Understanding /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
  );
}
