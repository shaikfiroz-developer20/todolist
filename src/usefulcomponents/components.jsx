import React, { useEffect, useState } from 'react';
import style from '@/styles/compnents.module.css';
import HistorySharpIcon from '@mui/icons-material/HistorySharp';
import axios from 'axios';
import { RotatingLines, Vortex } from 'react-loader-spinner';


function Datess({ element }) {
  const formattedDateString = element.dueDate;
  return <>{formattedDateString}</>;
}

function HistoryDisplayCard(prop) {
  const {element}=prop;

  const handlesenddatetohome=()=>{
    prop.clickeddata(element.dueDate)
  }
  return (
    <div onClick={()=>{handlesenddatetohome()}} className={style.Historycard}>
      <h3>{element && <Datess element={element} />}</h3>
    </div>
  );
}

function SideHistorySlide(prop) {
  const [historyExist, setHistoryExists] = useState(false);
  const [dataofdates, setdataofdates] = useState([]);
  const [dataloaded, setdataloaded] = useState(false);
  const [dataloadedstarted, setdataloadedstatus] = useState(false);
  const [logedin,setlogedin]=useState(null);


const clickeddata=(e)=>{
prop.clickeddata(e);
  }
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setdataloadedstatus(true);
        const gethistoryofdata = await axios.get("http://localhost:8000/gethistoryofdatestasksadded", { withCredentials: true });
        setdataofdates(gethistoryofdata.data);
        setdataloaded(true);
        setdataloadedstatus(false);
        setHistoryExists(gethistoryofdata.data.length !== 0);
      } catch (error) {
        setdataloadedstatus(false);
        if(error.response.status===401){
         setlogedin(false);
        }
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [dataloaded]);

  return (
    <div className={style.sidenav}>
      <div>
        <HistorySharpIcon
          style={{ height: '40px', width: '40px', marginTop: '5px', marginLeft: '5px' }}
        />
      </div>
      {dataloaded  ? (
        historyExist ? (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", height: "90%", marginLeft: "0%", gap: "20px", alignItems: "center" }}>
            {dataofdates.map((element, index) => (
              <HistoryDisplayCard clickeddata={clickeddata} key={index} element={element} />
            ))}
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >History Not available
          </div>
        )
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {dataloadedstarted && (<h2 style={{color:"grey"}}><RotatingLines
  strokeColor="grey"
  strokeWidth="5"
  animationDuration="0.75"
  width="50"
  visible={true}
/> </h2>)}
{!dataloaded && !logedin   && (<h2  style={{color:"grey",opacity:"0.5"}}>Login...Now!</h2>)}
        </div>
      )}


    </div>
  );
}

export default SideHistorySlide;

