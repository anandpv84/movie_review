import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminloginApi } from '../services/allApi'

function Adlogin() {

  const navigate = useNavigate()

  const [userdata, setuserdata] = useState({
    username: "",
    password: ""
  })


  const adminlogin = async (e) => {
    e.preventDefault();
    const { username, password } = userdata;

    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }

    try {
      const result = await adminloginApi(userdata);

      if (result.status === 200) {
        console.log(result);
        sessionStorage.setItem("existinguserad", JSON.stringify(result.data.admin));
        sessionStorage.setItem("tokenad", result.data.tokenad);
        alert(result.data.message);
        setuserdata({ username: "", password: "" });
        navigate('/admin');
      } if (result.status === 401) {
        alert("invalid password")
      }
    } catch (error) {
      const errorMessage = error.data || "Invalid email or password";
      alert(errorMessage);
    }
  };



  return (
    <>


      <div className="login-page">
        <div className="form">
          <form className="login-form">
            <input value={userdata.username} onChange={(e) => setuserdata({ ...userdata, username: e.target.value })} type="text" placeholder="username" />
            <input value={userdata.password} onChange={(e) => setuserdata({ ...userdata, password: e.target.value })} type="text" placeholder="Password" />
            <button style={{ backgroundColor: "yellowgreen", color: "black" }} onClick={adminlogin}>LOGIN</button>
          </form>
        </div>
      </div>


    </>
  )
}

export default Adlogin