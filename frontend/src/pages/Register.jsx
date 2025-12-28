import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = register({ email, password })
    if (!res.success) {
      alert(res.message)
      return
    }
    navigate('/dashboard')
  }

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
      <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>Register</h1>
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "320px",
        gap: "1rem",
        marginTop: "2rem"
      }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" style={{ padding: "0.5rem", fontSize: "1rem" }} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={{ padding: "0.5rem", fontSize: "1rem" }} />
        <button type="submit" style={{ padding: "0.5rem", fontSize: "1rem" }}>Register</button>
      </form>
    </div>
  );
}