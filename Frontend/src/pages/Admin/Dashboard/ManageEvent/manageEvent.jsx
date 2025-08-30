import React, { useState, useEffect } from 'react'
import './manageEvent.css'
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { backendUrl } from '../../../../config';

const ManageEvent = (props) => {
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
            withCredentials: true
        };
    };

    const [title, setTitle] = useState("");
    const [data, setData] = useState([])

    const fetchData = async () => {
        props.showLoader();
        const token = localStorage.getItem("token");
        await axios.get(`${backendUrl}/api/notification/get`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((resp) => {
            console.log(resp)
            setData(resp.data.notifications)
        }).catch(err => {
            toast.error(err?.response?.data?.error)

        }).finally(() => {
            props.hideLoader();
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmitEvent = async(e)=>{
        e.preventDefault();
        if (title.trim().length === 0) return toast.error("Please Enter Title");
        props.showLoader();
        const token = localStorage.getItem("token");
        await axios.post(`${backendUrl}/api/notification/add`, {title}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((resp)=>{
            
            setData([resp.data.notification,...data]);
            setTitle("")
        }).catch(err => {
            toast.error(err?.response?.data?.error)

        }).finally(() => {
            props.hideLoader();
        })
    }
    const filterOutEvent = (id)=>{
        let newArr = data.filter((item)=>item._id!==id);
        setData(newArr)
    }

    const handleDeleteEvent = async(id)=>{
        props.showLoader();
        const token = localStorage.getItem("token");
        await axios.delete(`${backendUrl}/api/notification/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((resp)=>{
            filterOutEvent(id)
        }).catch(err => {
            toast.error(err?.response?.data?.error)

        }).finally(() => {
            props.hideLoader();
        })
    }

    return (
        <div className='add-staffs-box'>
            <form onSubmit={handleSubmitEvent} className='register-form'>
                <div className=''>
                    <div className='register-input-box'>
                        <input value={title} onChange={(event) => setTitle(event.target.value)} className='input-box-register mngEventInp' type='text' placeholder='Add Events' />
                    </div>
                </div>
                <button type='submit' className='form-btn reg-btn'>Add</button>

            </form>

            <div className='list-staffs'>

                {
                    data.map((item, index) => {
                        return (
                            <div className='list-staff'>
                                <div>{item.title.slice(0,60)}...</div>
                                <div className='list-staff-btns'>
                                    <div onClick={()=>handleDeleteEvent(item._id)} style={{ cursor: "pointer" }}><DeleteIcon /></div>

                                </div>

                            </div>
                        );
                    })
                }
            </div>

            <ToastContainer />
        </div>
    )
}

export default ManageEvent