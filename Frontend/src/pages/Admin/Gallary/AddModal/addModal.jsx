import React, { useState } from 'react'
import './addModal.css'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { backendUrl } from '../../../../config';
const AddModal = (props) => {
  const [image, setImage] = useState(null)
  const [loader, setLoader] = useState(false)

  const getAuthHeaders = () => {
      const token = localStorage.getItem("token");
      return {
          headers: {
              Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true
      };
  }

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);

    data.append('upload_preset', "college-dispensary");
    const cloudName = "dzsq32ffr"    // your cloud name
    setLoader(true)
    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);
      const imageUrl = response.data.url;
      setImage(imageUrl)

    } catch (err) {
      console.log(err)
    } finally {
      setLoader(false)
    }

  }

  const handleSubmit = async()=>{
    await axios.post(`${backendUrl}/api/gallary/add`, {link:image}, getAuthHeaders()).then(resp=>{
      window.location.reload();
    }).catch(err=>{
      console.log(err)
    })
  }

  return (
    <div className='addModal'>
      <div className='addModal-card'>
        <div>Add Image</div>
        <div className='modal-add-btns'>
          <div className='cancel-modal-btn' onClick={() => props.onClose()}>Cancel</div>

          <label htmlFor="fileInput" className='cancel-modal-btn' >Upload</label>
          <input id="fileInput" accept="image/*" onChange={(e) => { uploadImage(e) }} className='cancel-file' type='file' />
        </div>
        {
          loader && <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        }

        {
          image && <img src={image} style={{width:"200px",height:"200px",marginTop:20}} />
        }

        {
          image && <div className='cancel-modal-btn' onClick={handleSubmit}>Submit</div>
        }
      </div>

    </div>
  )
}

export default AddModal


// preset-name = college-dispensary

