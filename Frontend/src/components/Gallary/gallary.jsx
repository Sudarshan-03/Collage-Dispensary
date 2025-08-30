import React, { useState, useEffect } from 'react'
import './gallary.css'
import axios from 'axios'
import { backendUrl } from '../../config';
const Gallary = (props) => {


  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      props.showLoader()
      const token = localStorage.getItem("token");
      await axios.get(`${backendUrl}/api/gallary/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      }).then((response) => {
        setData(response.data.images)
      }).catch(err => {
        console.log(err)
      }).finally(()=>{
        props.hideLoader()
      })
    }

    fetchData()
  }, [])
  return (
    <div className='gallary-home'>

      {
        data.map((item, index) => {
          return (
            <div key={index} className='gallary-home-image-block'>
              <img src={item.link} className='gallary-home-image' />
            </div>
          );
        })
      }

    </div>
  )
}

export default Gallary