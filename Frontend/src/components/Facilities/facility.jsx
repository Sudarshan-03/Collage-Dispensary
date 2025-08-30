import React, { useState, useEffect } from 'react'
import './facility.css'
import axios from 'axios';
import { backendUrl } from '../../config';
const Facility = (props) => {

  const [data, setData] = useState([]);

  const fetchData = async () => {
    props.showLoader()
    const token = localStorage.getItem("token");
    await axios.get(`${backendUrl}/api/facility/get`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    }).then((response) => {
      setData(response.data.facility);
    }).catch(err => {
      console.log(err)
    }).finally(()=>{
      props.hideLoader()
    })
  }
//fefs
  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div className='facility'>
      <div className='facility-header'>
        List of facilities available at NIT HEALTH CENTRE:
      </div>
      <div className='facility-lists'>

        {
          data.map((item, index) => {
            return (
              <div className='facility-list'>
                <div className='facility-list-header'>{item.title}</div>
                <p className='facility-list-value'>{item.description}</p>
              </div>
            );
          })
        }






      </div>
    </div>
  )
}

export default Facility