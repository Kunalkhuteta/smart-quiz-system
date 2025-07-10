import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import "../styles/Register.css"; 

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  const navigate=useNavigate();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //this will take the direction to server->index.js->by ..../api it goes to authRoutes->/api/register 
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, user);
      //after res with data.message will be seen
      setMsg(res.data.message);
      
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
  <h2>🔐 Register</h2> 
  <form onSubmit={handleSubmit}> 
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <button type="submit">Sign Up</button>
      <br /><br /><br />
      <b><i>wants to Login -- </i></b>
      <button onClick={()=> navigate('/login')}> Login </button>
      <p>{msg}</p>
      </form>
    </div>
  );
};

export default Register;
    