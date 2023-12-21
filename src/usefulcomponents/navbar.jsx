import React, { useEffect, useState } from 'react';
import style from "@/styles/compnents.module.css";
import { motion } from "framer-motion";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Signup from './signup';
import axios from 'axios';

const sa=process.env.NEXT_PUBLIC_API_URL;


function Navbar(prop) {
  const { width, askedHistory, isUserLoggedIn } = prop;
  const [isMobile, setIsMobile] = useState(null);
  const [imageBuffer, setImageBuffer] = useState(null);

  const setsignuprequester = () => {
    prop.requestedsignup();
  }

  const handeuserprofileview = () => {
    prop.handeuserprofileview();
  }

  useEffect(() => {
    const getprofilepic = async () => {
      try {
        const response = await axios.get(`${sa}/userpic`, { withCredentials: true, responseType: 'arraybuffer' });
        
        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        setImageBuffer(imageUrl);

      } catch (error) {
        console.error("Error fetching user profile picture:", error);
      }
    }

    getprofilepic();
  }, [isUserLoggedIn])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div>
        {!isMobile ? (
          <div style={!width && !askedHistory ? { width: "calc(100vw - 30px)" } : { width: "calc(100vw - 300px)" }} className={style.Navbar}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <h1 style={{ marginLeft: "20px", fontSize: "40px", fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif", fontWeight: "bolder", textShadow: "revert" }}>Todo List</h1>
              <img src="/checklist.png" height={40} width={40} alt="" />
            </div>
            {isUserLoggedIn && imageBuffer ? (
              <div onClick={handeuserprofileview} style={{ cursor: "pointer" }}>
                <img src={imageBuffer} alt="Profile" height={50} />
              </div>
            ) : (
              <motion.input
                onClick={setsignuprequester}
                animate={{ scale: "1.1" }}
                whileHover={{ scale: "1.1", color: "grey" }}
                style={{ marginRight: "20px", backgroundColor: "transparent", borderWidth: "0", color: "white", fontSize: "19px", fontWeight: "700", cursor: "pointer" }}
                type='button'
                value="Signin"
              />
            )}
          </div>
        ) : (
          <div className={style.Navbar}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <h1 style={{ marginLeft: "20px", fontSize: "30px", fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif", fontWeight: "bolder", textShadow: "revert" }}>Todo List</h1>
            </div>
            {isUserLoggedIn ? (
              <div onClick={handeuserprofileview} style={{ cursor: "pointer" }}>
                <img src={imageBuffer} alt="Profile" height={40} width={40} style={{ borderRadius: "50%" }} />
              </div>
            ) : (
              <motion.input onClick={setsignuprequester} animate={{ scale: "1.1" }} whileHover={{ scale: "1.1", color: "crimson" }} style={{ marginRight: "20px", backgroundColor: "transparent", borderWidth: "0", color: "white", fontSize: "19px", fontWeight: "700", cursor: "pointer" }} type='button' value="Signin" />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
