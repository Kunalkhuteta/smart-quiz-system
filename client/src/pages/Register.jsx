import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("");
  const [referredBy, setReferredBy]=useState("")
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract referralId from query param in URL if student is registering via teacher
  // const searchParams = new URLSearchParams(location.search);
  // const referralId = searchParams.get("ref");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!role) {
    setMsg("Please select a role");
    return;
  }

  try {
    
    console.log("this is the referrel by", referredBy)
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/register`,
      {
        ...user,
        role,
        referralId:
          role === "student"
            ?  referredBy // ✅ use URL ref if present, else manual input
            : null,
          }
        );
        // console.log("this is the referrel id", referralId)
    setMsg(res.data.message || "Registered successfully");
  } catch (err) {
    setMsg(err.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="form-container">
      <h2>🔐 Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br />

        <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  required
>
  <option value="">Select Role</option>
  <option value="teacher">Teacher</option>
  <option value="student">Student</option>
</select>

{/* Show referral input only if role is student */}
{role === "student" && (
  <input
    type="text"
    placeholder="Enter referral ID from your teacher"
    value={referredBy}
    onChange={(e) => setReferredBy(e.target.value)}
    required
  />
)}


        <br />
        <button type="submit">Sign Up</button>
        <br />
        <br />
        <b>
          <i>After Registering Click on Login to Continue</i>
        </b>
        <br />
        <button type="button" onClick={() => navigate("/login")}>
          Login
        </button>
        <p>{msg}</p>
      </form>
    </div>
  );
};

export default Register;
