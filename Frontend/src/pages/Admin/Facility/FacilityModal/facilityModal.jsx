import React, { useState,useEffect } from 'react'
import './facilityModal.css'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../../../../config';
const FacilityModal = (props) => {

    const [inputField, setInputField] = useState({ title: "", description: "" });
    const handleOnChange = (event, key) => {
        setInputField({ ...inputField, [key]: event.target.value });
    }

    useEffect(()=>{
        if(props.clickedItem){
            setInputField({...inputField,title:props.clickedItem.title,description:props.clickedItem.description});
        }
    },[])
    const updateFacility = async()=>{
        const token = localStorage.getItem("token");
        await axios.put(`${backendUrl}/api/facility/update/${props.clickedItem._id}`, inputField, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((resp)=>{
            window.location.reload();
        }).catch(err => {
            toast.error(err?.response?.data?.error)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        if (inputField.title.trim().length === 0 || inputField.description.trim().length === 0) {
            return toast.error("Please enter all fields")
        }

        if(props.clickedItem){
            updateFacility();
            return;
        }

        const token = localStorage.getItem("token");
        await axios.post(`${backendUrl}/api/facility/add`, inputField, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then(resp => {
            window.location.reload();
        }).catch(err => {
            toast.error(err?.response?.data?.error)
        })

    }
    return (
        <div className='facilty-modal'>
            <form className='register-form' onSubmit={handleSubmit}>
                <div className=''>
                    <div className='register-input-box'>
                        <input value={inputField.title} onChange={(event) => handleOnChange(event, "title")} className='input-box-register' placeholder='Enter Title' type='text' />
                    </div>
                    <div className='register-input-box' style={{ marginTop: 20 }}>
                        <textarea value={inputField.description} onChange={(event) => handleOnChange(event, "description")} cols={450} rows={10} type='text' className='input-box-register' placeholder='Add Description' />
                    </div>

                </div>


                <button type='submit' className='form-btn reg-btn' >{props.clickedItem?"Update":"Add"}</button>
                <ToastContainer />
            </form>
        </div>
    )
}

export default FacilityModal