import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from "../lib/api";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { username, password });
            localStorage.setItem("token", res.data.token);
            navigate("/admin");
            
        } catch (err:any) {
          console.error(err);
            setError("Invalid login");
            
        }
    }
  return (
    <section className="min-h-screen flex items-center justify-center">
    <form
      onSubmit={handleLogin}
      className="p-8 shadow-md bg-white rounded w-96 space-y-4"
    >
      <h2 className="text-xl font-bold">🔐 Admin Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
       
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Login
      </button>
    </form>
  </section>
  )
}

export default AdminLogin;