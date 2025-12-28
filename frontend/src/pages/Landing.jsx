// Landing.jsx
export default function Landing() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "1rem",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>Magic Maker Studio</h1>
      <p style={{ fontSize: "1rem", textAlign: "center", margin: "1rem 0" }}>
        Welcome to the Creative Learning Sandbox. Engage, learn, and explore!
      </p>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "300px",
        gap: "1rem"
      }}>
        </div>
    </div>
  );
}
