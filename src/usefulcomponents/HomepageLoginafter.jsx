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
import { RotatingLines } from "react-loader-spinner";
import { Circle } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";


const sa=process.env.serveraddress;


function checkTimeStatus(targetTime) {
  const currentTime = new Date();
  const targetDateTime = new Date(targetTime);
  
  // Check if the target time is in the past
  if (currentTime > targetDateTime) {
    
    return `due over`
    // You can display a message or take appropriate action for time being over
  } else {
    // Calculate the time difference
    const timeDifference = targetDateTime - currentTime;

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

   return `dueTime:${hours}h ${minutes}m`
  }
}



function DisplayCard(prop) {
  const { elment } = prop;

  const handleTaskDone = () => {
    prop.taskdone(elment._id);
  };

  const handleDeleteData = () => {
    prop.deletedata(elment._id);
  };

  return (
    <div style={{ display: "flex",justifyContent:"center" }}>
      <div className={sty.displaycard}>
        <p className={sty.displaycardp}>{elment.taskName}</p>
        <div style={{display:"grid",height:"100%",placeItems:"center",backgroundColor:"#15232d",paddingLeft:"5px",paddingRight:"10px"}}>
            {elment.dueDate && (<p style={{fontSize:"12px",color:"#fffffb",fontWeight:"bold"}}>{checkTimeStatus(elment.dueDate)}</p>)}
        <div style={{ display: "flex",justifyContent:"center",alignItems:"center", gap: "15px" }}>
        {elment.completed ? (<Circle style={{color: green[500],fontSize:"10px"}} />):(<Circle style={{color: red[500],fontSize:"10px"}} />)}
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
    </div>
  );
}

function Homepage(prop) {
  const [isMobile, setIsMobile] = useState(null);
  const [askedHistory, setAskedHistoryOrNot] = useState(true);
  const [todolistdata, settododata] = useState(null);
  const [dataloaded, setdataloaded] = useState(false);
  const [signupreq,setsignupreq]=useState(false);
  const [profileviewreq ,setprofileviewreq]=useState(false);
  const [logoutstatus,setlogoutstatus]=useState(false);
  const [requesteddatadate,setrequesteddatadate]=useState(null)

  const clickeddata=async(e)=>{
    try{
      setrequesteddatadate(e);
    } 
    catch{

    }
    finally{
    }
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

  const fetchData = async () => {
    try {
      const res = await axios.get(`${sa}/tasks`, { withCredentials: true });
      settododata(res.data.tasks);
      setdataloaded(true);
    } catch (error) {
      console.log({"msg":"error in fetching data"});
    }
  }; 
  

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount


  useEffect(()=>{
const getfilterdtaskwithdates=async(e)=>{
  const res=await axios.get(`${sa}/filteredtasksondate?date=${e}`,{withCredentials:true});
  settododata(res.data);
}
if(requesteddatadate!=null){
  getfilterdtaskwithdates(requesteddatadate);

}
  },[requesteddatadate])


  const handletaskdone = async (taskId) => {
    const updatedata = {
      taskId: taskId,
      updatetodo: "true",
      type: "completion",
    };
  
    try {
      const restaskdone = await axios.put(`${sa}/updatetodolistroute`, updatedata, { withCredentials: true });
      toast('task updation successful!')
      // After updating, refetch the data
      fetchData();
    } catch (error) {
      console.log({"msg":"error updtaing task"});
    }
  };
  
  const handletaskdelete = async (taskId) => {
    const deletetask = {
      taskId: taskId,
    };
    try {
      const restaskdone = await axios.delete(`${sa}/deletetask`, { withCredentials: true, data: deletetask });
      fetchData();
      toast('task deletion successful')

    } catch (error) {
      console.log({"msg":"error deleting task"});
    }
  };
  

  const handleaddtask = async (e) => {
    e.preventDefault();

    const taskName = e.target.elements.text.value;
    const addtask = {
      tododata: taskName
    };

    try {
      const addtaskres = await axios.post(`${sa}/todolist`, addtask,{ withCredentials: true});
      fetchData();
      toast('task added successfully')

    } catch (error) {
      console.log({"msg":"error adding task"});
    }
  };

  const handlerequestedsignup=()=>{
    setsignupreq(!signupreq);
   }



   const handeuserprofileview=(e)=>{
    setprofileviewreq(!profileviewreq);
    
   }
  return (
    <div className={sty.homepage} >
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
      {!isMobile && (
        <div style={{ width: askedHistory ? "300px" : "30px" }} className={sty.sidenavbarandarraowimgdiv}>
          {askedHistory && <SideHistorySlide clickeddata={clickeddata} elements={dataloaded ? todolistdata : []} />}
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

      <div
        style={{ width: isMobile ? "100%" : askedHistory ? "calc(100% - 300px)" : "100%" }}
        className={sty.homepagemaindiv}
      >
        <Navbar isUserLoggedIn={prop.isuserlogedin} handeuserprofileview={handeuserprofileview} width={isMobile} askedHistory={askedHistory} requestedsignup={handlerequestedsignup} />
        
        <div className={sty.allcardsdiv}>
          {dataloaded &&
            todolistdata &&
            todolistdata.map((elment, index) => (
              <DisplayCard key={index} elment={elment} taskdone={handletaskdone} deletedata={handletaskdelete} />
            ))}
        </div>

        {!isMobile ? (
          <form
            style={!isMobile && !askedHistory ? { width: "calc(65% - 30px)" } : { width: "calc(65% - 200px)" }}
            className={sty.inputdata}
            onSubmit={handleaddtask}
            action="submit"
          >
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
        ) : (
          <form className={sty.inputdata} onSubmit={handleaddtask} action="submit">
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
      {prop.isuserlogedin && profileviewreq && (<Userprofile  handeuserprofileview={handeuserprofileview}/> )}
      <div style={profileviewreq ?({backgroundColor:"black",width:"100vw",height:"100vh",position:"fixed",zIndex:"2001"}):({})}></div>
      {!dataloaded && (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%",justifyContent:"center",alignItems:"center",display:"flex", background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))", zIndex: 1000 }}>
<RotatingLines
  strokeColor="black"
  strokeWidth="5"
  animationDuration="0.75"
  width="50"
  visible={true}
/>  </div>
)}
    </div>
  );
}


export default Homepage;