import React from 'react';
// Main application component for Magic Maker Studio frontend

function App() {
  return (
    <div className="app-container" style={{ fontFamily: 'system-ui', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #646cff', paddingBottom: '10px' }}>
        <h1 style={{ color: '#646cff' }}>🎨 Magic Maker Studio</h1>
        <nav>
          <strong>Navigation Stubs:</strong> Landing | Login | Register | Dashboard
        </nav>
      </header>

      <main style={{ marginTop: '40px', minHeight: '60vh' }}>
        {/* This is where the Pages (Landing, Dashboard, etc.) will be injected */}
        <div style={{ padding: '20px', border: '1px dashed #ccc' }}>
          <h2>Creative Learning Sandbox</h2>
          <p>Hello</p>
        </div>
      </main>

      <footer style={{ marginTop: '40px', fontSize: '0.8rem', color: '#666' }}>
        © 2025 Magic Maker Studio - Technical Setup Phase
      </footer>
    </div>
  );
}

export default App;