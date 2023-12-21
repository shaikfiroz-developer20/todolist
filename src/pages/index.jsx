import SideHistorySlide from "@/usefulcomponents/components.jsx";
import style from "@/styles/compnents.module.css";
import sty from "@/styles/index.module.css";
import { useState, useEffect } from "react";
import Navbar from "@/usefulcomponents/navbar";
import axios from "axios";
import { motion } from "framer-motion";
import Applicationoptions from "@/usefulcomponents/applicationoptions";
import AuthForm from "@/usefulcomponents/signup";
import Userprofile from "@/usefulcomponents/userprofile";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from "@/usefulcomponents/HomepageLoginafter";
import Head from "next/head";
import handleGlobalErrors from "@/usefulcomponents/sanitizeerror";

handleGlobalErrors();


function DisplayCard(prop) {
  const { elment } = prop;

  const handleTaskDone = () => {
    prop.taskdone(elment._id);
  };

  const handleDeleteData = () => {
    prop.deletedata(elment._id);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className={sty.displaycard}>
        <p className={sty.displaycardp}>{elment.taskName}</p>

        <div style={{ display: "flex", gap: "15px" }}>
          <motion.img
            initial={{ opacity: 0.5 }}
            onClick={handleTaskDone}
            style={{ cursor: "pointer" }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            src="/done.svg"
            width={30}
            height={30}
            alt=""
          />
          <motion.img
            initial={{ opacity: 0.5 }}
            onClick={handleDeleteData}
            style={{ cursor: "pointer" }}
            whileHover={{ opacity: 1 }}
            src="/delete.svg"
            width={30}
            height={30}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}


export default function Homepage1() {
  const [isMobile, setIsMobile] = useState(null);
  const [askedHistory, setAskedHistoryOrNot] = useState(true);
  const [logedin, setLogedin] = useState(null);
  const [dataloaded, setDataloaded] = useState(false);
  const [signupreq, setSignupreq] = useState(false);
 const [signuporloginreq,setsignuporloginreq]=useState('signup');


const clickeddata=(e)=>{
  alert(e)
}

  const handleShowHistory = () => {
    setAskedHistoryOrNot(true);
  };

  const handleNotShowHistory = () => {
    setAskedHistoryOrNot(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // useEffect runs only once with an empty dependency array

  const handleRequestedSignup =(e) => {
    setSignupreq(!signupreq);
    setsignuporloginreq(e);
  };


  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const isUserLoggedIn = await axios.get("http://localhost:8000/amilogedin", { withCredentials: true });

        if (isUserLoggedIn.status === 200) {
          setLogedin(true);
        } else {
          setLogedin(false);
        }

        setDataloaded(true);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setLogedin(false);
          setDataloaded(true);
        } else {
          console.log({"msg":"error checking credentials"});
        }
      }
    };

    checkUserLogin();
  }, []);

  const handleloginstatus=()=>{
setLogedin(true);
  }

  const handleAddTask = (e) => {
    e.preventDefault();
   toast("Please Login First");
  };

  return (
    
    <div>
      <Head>
        <link rel="icon" href="/checklist.png" />
        <title>TodoList</title>
      </Head>
<ToastContainer
className={sty.toastposition}
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
      {dataloaded && logedin && (
        <Homepage  isuserlogedin={logedin} isMobile={isMobile} askedHistory={askedHistory} dataloaded={dataloaded} handleShowHistory={handleShowHistory} handleNotShowHistory={handleNotShowHistory} />
      ) }
      
      
      {dataloaded && !logedin && 
        (<div className={sty.homepage}>
          {!isMobile && (
            <div style={{ width: askedHistory ? "300px" : "30px" }} className={sty.sidenavbarandarraowimgdiv}>
              {askedHistory && <SideHistorySlide clickeddata={clickeddata}/>}
              {askedHistory ? (
                <img
                  style={{ marginLeft: "-15px", zIndex: "2001", cursor: "pointer", marginTop: "5px" }}
                  src="/rightarr.svg"
                  width={30}
                  onClick={handleNotShowHistory}
                  height={30}
                  alt=""
                />
              ) : (
                <img
                  style={{ cursor: "pointer", marginTop: "7px" }}
                  src="/leftarr.svg"
                  width={30}
                  onClick={handleShowHistory}
                  height={30}
                  alt=""
                />
              )}
            </div>
          )}

          <div style={{ width: isMobile ? "100%" : askedHistory ? "calc(100% - 300px)" : "100%" }} className={sty.homepagemaindiv}>
            <Navbar width={isMobile} askedHistory={askedHistory} requestedsignup={handleRequestedSignup} />
            <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <h1 style={{color:"black",fontSize:"50px",fontFamily:"serif",fontWeight:"1000",fontStyle:"inherit"}}>TODO LIST</h1>
      </div>
             <Applicationoptions handleRequestedSignup={handleRequestedSignup} />
            {!isMobile ? (
              <form
                style={!isMobile && !askedHistory ? { width: "calc(65% - 30px)" } : { width: "calc(65% - 200px)" }}
                className={sty.inputdata}
                action="submit"
                onSubmit={handleAddTask}
              >
                <input autoComplete="off" placeholder="Sign in to get started...." className={sty.inputdatainputbox} name="text" id="text" />
                <button style={{ background: "transparent", borderWidth: "0px" }}>
                  <motion.img
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    src="/upload.svg"
                    style={{ cursor: "pointer" }}
                    width={40}
                    height={40}
                    alt=""
                  />
                </button>
              </form>
            ) : (
              <form className={sty.inputdata} onSubmit={handleAddTask} action="submit">
                <input autoComplete="off" className={sty.inputdatainputbox} name="text" id="text" />
                <button style={{ background: "transparent", borderWidth: "0px" }}>
                  <motion.img
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    src="/upload.svg"
                    style={{ cursor: "pointer" }}
                    width={40}
                    height={40}
                    alt=""
                  />
                </button>
              </form>
            )}
          </div>
          {signupreq && <AuthForm signuporloginreq={signuporloginreq} handlesignup={handleRequestedSignup} handleloginstatus={handleloginstatus}/>}
          {signupreq && <div style={signupreq ? { backgroundColor: "black", width: "100vw", height: "100vh", position: "fixed", zIndex: "2001" } : {}}></div>}
        </div>
      )}
    </div>
  );
}
