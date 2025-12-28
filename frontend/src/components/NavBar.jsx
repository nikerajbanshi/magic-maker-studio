import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth()

  const linkStyle = ({ isActive }) => ({
    padding: "0.45rem 0.85rem",
    textDecoration: "none",
    color: isActive ? "#fff" : "#333",
    background: isActive ? "#4CAF50" : "transparent",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 14,
  });

  return (
    <nav style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
      <NavLink to="/" style={linkStyle} end>
        Home
      </NavLink>
      {!user && (
        <>
          <NavLink to="/login" style={linkStyle}>
            Login
          </NavLink>
          <NavLink to="/register" style={linkStyle}>
            Register
          </NavLink>
        </>
      )}
      {user && (
        <>
          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>
          <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
        </>
      )}
    </nav>
  );
}
