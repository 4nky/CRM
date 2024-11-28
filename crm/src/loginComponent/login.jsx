import React, { useState, useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import { Button, TextField } from '@mui/material/';
import './login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { SalesExecutivePage } from "../employee/salesExecutive";

export function Navbar({ showLogoutIcon }) {
  const navigate = useNavigate();
  function handleLogout() {
    navigate("/",{replace:true})
  }
  return (
    <div className="login-navbar">
      <nav className="navbar">
        <div className="logo">
          AnkSu.com
        </div>
        {showLogoutIcon && (
          <div className="logout" onClick={handleLogout}  style={{ cursor: "pointer" }}>
            <ExitToAppIcon fontSize="large"  style={{ fontSize:'50px', }} />
          </div>
        )}
      </nav>
    </div>
  );
}

const Login = () => {
  const [credentials, setCredentials] = useState({
    id: "",
    username: "",
    password: "",
    role: "",
  });

  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log("State updated:", credentials);
  // }, [credentials]);
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_customers/${loginCredentials.username}`);
      
      if (response.data) {
        setCredentials({
          id: response.data.id,
          username: response.data.username,
          password: response.data.password,
          role: response.data.role,
        });
        
        if (response.data.username === loginCredentials.username && response.data.password === loginCredentials.password) {
          toast.success(`Signed In Successfully as a ${response.data.role}`);
          if (response.data.role === "Admin") {
            navigate("/admin",{state:{admin:response.data.username}});
          }else if(response.data.role === "Sales Executive"){
            navigate("/sales-Executive",{state:{SalesExecutive:response.data.username}});
          }
        } else {
          toast.error("Invalid username or password");
        }
      } else {
        toast.error("No user found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while logging in");
    }
  };

  return (
    <div className="main-body">
      <div className="login-navbar">
        <Navbar />
      </div>
      <div className="login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-body">
          <div className="login-fields">
            <TextField
              style={{ marginBottom: '10px' }}
              id="username"
              label="Username"
              variant="outlined"
              value={loginCredentials.username}
              onChange={(e) => setLoginCredentials((prevData) => ({
                ...prevData,
                username: e.target.value,
              }))}
            />
            <TextField
              style={{ marginBottom: '10px' }}
              type="password"
              id="password"
              label="Password"
              variant="outlined"
              value={loginCredentials.password}
              onChange={(e) => setLoginCredentials((prevData) => ({
                ...prevData,
                password: e.target.value,
              }))}
            />
          </div>
          <div className="login-button">
            <Button style={{ width: '250px' }} variant="contained" type="submit">
              <strong>Login</strong>
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
