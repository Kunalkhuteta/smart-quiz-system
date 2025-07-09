import React, { useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import "../styles/Login.css"; 

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const navigate=useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //this will take the direction to server->index.js->by ..../api it goes to authRoutes->/api/login 
      const res = await axios.post("/api/login", user);
      
      setMsg("Login successful");

      // save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // navigate or reload
      window.location.href = "/dashboard"; // change if using React Router
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-container">
  <h2>🔐 Login</h2> 
  <form onSubmit={handleSubmit}> 
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <button type="submit">Log In</button>
        <br /><br /><br />
        <b><i>wants to register -- </i></b>

        <button onClick={()=> navigate('/register')}> Register </button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default Login;
