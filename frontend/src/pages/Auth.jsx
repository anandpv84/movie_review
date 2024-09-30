import React, { useState } from 'react';
import '../pages/allcss.css';
import { loginApi, registerApi } from '../services/allApi';
import { useNavigate } from 'react-router-dom';

function Auth({ register }) {
  const registerForm = register || false;
  const navigate = useNavigate();

  const [userdata, setuserdata] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleregister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const result = await registerApi(userdata);
      console.log('Registration successful:', result);
      alert('Registration successful')
      navigate('/login')
      setuserdata({
        username: "",
        email: "",
        password: ""
      });
      // Optionally handle navigation or form reset here
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handlelogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const result = await loginApi(userdata);
      if (result.status === 200) {
        console.log(result);
        sessionStorage.setItem("existinguser", JSON.stringify(result.data.existingUser));
        sessionStorage.setItem("token", result.data.token);
        alert("User logged in successfully");
        setuserdata({
          username: "",
          email: "",
          password: ""
        });
        navigate('/dashboard');
      } else {
        alert(result.data); // Adjust based on the actual response structure
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data || error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="login-form" onSubmit={registerForm ? handleregister : handlelogin}>
          {registerForm && (
            <input
              type="text"
              placeholder="Username"
              value={userdata.username}
              onChange={(e) => setuserdata({ ...userdata, username: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={userdata.email}
            onChange={(e) => setuserdata({ ...userdata, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={userdata.password}
            onChange={(e) => setuserdata({ ...userdata, password: e.target.value })}
          />
          <button type="submit" className='font'>
            {registerForm ? 'REGISTER' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
