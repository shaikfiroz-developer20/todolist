import React, { useState, useEffect } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import style from "@/styles/userprofile.module.css";
import { Cancel } from '@mui/icons-material';
import axios from 'axios';
import { Logout } from '@mui/icons-material';
import { RotatingLines, Vortex } from 'react-loader-spinner';


const sa=process.env.NEXT_PUBLIC_API_URL;


function UserProfile(prop) {
  const [userdata, setuserdata] = useState({});
  const [imageBuffer, setImageBuffer] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getuserdata = async () => {
      try {
        const userdata = await axios.get(`${sa}/getuserdetails`, { withCredentials: true });
        setuserdata(userdata.data);
        setLoaded(true);

        const response = await axios.get(`${sa}/userpic`, { withCredentials: true, responseType: 'arraybuffer' });

        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        setImageBuffer(imageUrl);
        console.log(imageUrl);
      } catch (error) {
        console.log({"msg":"error retriving profile pic"});
      }
    };
    getuserdata();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageBuffer(file);
      setLoaded(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('phoneNumber', e.target.number.value);
    formData.append('profileImage', imageBuffer);

    try {
      const updateProfile = await axios.post(`${sa}/updateprofile`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });

      const blob = new Blob([updateProfile.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);

      setuserdata({ ...userdata, username: e.target.name.value, mobilenum: e.target.number.value });
      setImageBuffer(imageUrl);
      setLoaded(true);

      console.log(updateProfile.data);
      if (updateProfile.status === 200) {
        location.reload();
      }
    } catch (error) {
      console.log({"msg":"error retriving profile data"});
    }
  };

  const handleUserView = () => {
    prop.handeuserprofileview();
  };

  const handleUserViewlogout = async () => {
    try {
      const reqlogout = await axios.get(`${sa}/logout`, { withCredentials: true });
      if (reqlogout.status === 200) {
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.backgeound}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px", marginRight: "5px" }}>
        <div style={{ cursor: "pointer", marginTop: "5px", marginLeft: "5px" }} onClick={handleUserViewlogout}><Logout style={{ fontSize: "35px" }} /></div>
        <div style={{ cursor: "pointer" }} onClick={handleUserView}><Cancel style={{ fontSize: "35px" }} /></div>
      </div>
      <form className={style.formusers} onSubmit={handleSubmit}>
        <div className={style.profileSection}>
          {loaded ? (
            <img src={imageBuffer} alt="Profile" height={50} />
          ) : (
            <AccountCircle style={{ fontSize: "70px" }} />
          )}
          <input name='pic' id='pic' onChange={handleImageChange} style={{ backgroundColor: "transparent", color: "white", paddingLeft: "50px", outline: "none" }} type="file" />
        </div>
        <div className={style.inputGroup}>
          <label htmlFor="name">Name:</label>
          <input
            onChange={(e) => setuserdata({ ...userdata, username: e.target.value })}
            name="name"
            id="name"
            type="text"
            value={userdata && userdata.username}
            placeholder='Name'
          />
        </div>
        <div className={style.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={userdata && userdata.email}
            readOnly
          />
        </div>
        <div className={style.inputGroup}>
          <label htmlFor="number">Number:</label>
          <input
            onChange={(e) => setuserdata({ ...userdata, mobilenum: e.target.value })}
            name='number'
            value={userdata && userdata.mobilenum}
            id='number'
            type="number"
            placeholder='Phone'
          />
        </div>
        <input
          style={{ backgroundColor: "#041655", color: "white", fontSize: "20px", fontFamily: "monospace" }}
          type="submit"
          value="Save"
        />
      </form>
    </div>
  );
}

export default UserProfile;
