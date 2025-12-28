import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1>Magic Maker Studio</h1>
      <h2>SoundSteps</h2>
      <p>Learn phonics through play</p>

      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
}
