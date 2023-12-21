import React, { useEffect, useState } from 'react';
import { Cancel } from '@mui/icons-material';
import styles from '@/styles/signup.module.css';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const sa=process.env.NEXT_PUBLIC_API_URL;


const AuthForm = (props) => {

  const {signuporloginreq}=props;
  const [showSignup, setShowSignup] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(()=>{
    
    if(signuporloginreq==='signup'){
      setShowSignup(true);
    }
    else if(signuporloginreq==='login'){
      setShowSignup(false);
    }
  },[])

  const toggleView = () => {
    setShowSignup(!showSignup);
  };

  const handleClose = (e) => {
    props.handlesignup(e);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${sa}/signup`, formData);
      if (res.status === 201) {
        toast("User created successfully for signup. Plaese Login");
 setShowSignup(false)
      }
     
    } catch (error) {
       if(error.response.status===400){
        toast("User Already exists") }

      console.error(error.message);
    }
  };

  const handleloginstatus=()=>{
    props.handleloginstatus();
  }

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`${sa}/login`, formData, { withCredentials: true });
      console.log(res);
      if (res.status === 200) {
        toast("User logged in successfully!");
        props.handleloginstatus();
      }
    } catch ( error ) {
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        if (error.response.status === 401) {
          toast("Invalid email or password");
        } else if (error.response.status === 404) {
          toast("User not found");
        } else {
          toast("An error occurred while logging in");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.log({"msg":"error logging in"});
      }
      console.log({"msg":"error logging in"});
    }
  };
  

  return (
    <div className={styles.signupFormouterdiv}>
      <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", alignItems: "center" }}>
        <div onClick={()=>{handleClose(signuporloginreq)}} style={{ cursor: "pointer" }}>
          <Cancel style={{ fontSize: "40px" }} />
        </div>
      </div>
      
      <div className={styles.signupform}>
        <h2 style={{ marginBottom: "20px" }}>{showSignup ? 'Signup' : 'Login'}</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <label htmlFor="email">Email</label>
          <input
            className={styles.inputs}
            name='email'
            id='email'
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            name='password'
            id='password'
            className={styles.inputs}
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            className={styles.signupBtn}
            style={{ marginTop: "10px" }}
            type="button"
            value={showSignup ? 'Signup' : 'Login'}
            onClick={showSignup ? handleSignup : handleLogin}
          />
          <div className={styles.signupEnd}>
            <div className={styles.line1}></div>
            <h6>Or</h6>
            <div className={styles.line2}></div>
          </div>
          <button type="button" className={styles.googleSignupBtn}>
            {showSignup ? 'Signup with Google' : 'Login with Google'}
          </button>
          <h3>
            {showSignup ? "Already Have an account?" : "Don't have an account?"}
            <button
              onClick={toggleView}
              type='button'
              style={{ backgroundColor: "transparent", borderWidth: "0", color: "violet", cursor: "pointer", fontSize: "19px" }}
            >
              {showSignup ? 'Login' : 'Signup'}
            </button>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
