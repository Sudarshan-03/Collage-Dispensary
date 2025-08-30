import React, { useState, useEffect } from 'react'
import './manageStaff.css'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { backendUrl } from '../../../../config';
const ManageStaff = (props) => {
    const [inputField, setInputField] = useState({ name: "", email: "", password: "", designation: "", mobileNo: "" })
    const [staffs, setStaffs] = useState([])
    const [clickedStaff, setClickedStaff] = useState(null);

    const handleOnChange = (event, key) => {
        setInputField({ ...inputField, [key]: event.target.value })
    }

    const fetchData = async () => {
        props.showLoader()
        const token = localStorage.getItem("token");
        await axios.get(`${backendUrl}/api/auth/get-staff`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((respnse) => {
            setStaffs(respnse.data.staffs)

        }).catch(err => {
            console.log(err)
        }).finally(() => {
            props.hideLoader()
        })
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdate =async()=>{
        const token = localStorage.getItem("token");
        await axios.put(`${backendUrl}/api/auth/update-staff/${clickedStaff?._id}`,inputField,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then(response=>{
            window.location.reload();
        }).catch(err => {
            toast.error(err?.response?.data?.error)

        })
    }

    const handleAddStaff =async(e)=>{
        e.preventDefault()

        if(clickedStaff){
            handleUpdate();
            return;
        }

        if (inputField.name.trim().length === 0 || inputField.email.trim().length === 0 || inputField.password.trim().length === 0 || inputField.designation.trim().length === 0 || inputField.mobileNo.trim().length === 0) return toast.error("Please fill all the details.");
        props.showLoader()
        const token = localStorage.getItem("token");
        await axios.post(`${backendUrl}/api/auth/add-staff`,inputField,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((resp)=>{
            console.log(resp)
            toast.success(resp.data.message);
            setStaffs([inputField, ...staffs])
            setInputField({ name: "", email: "", password: "", designation: "", mobileNo: "" })
            
        }).catch(err => {
            toast.error(err?.response?.data?.error)

        }).finally(() => {
            props.hideLoader();
        })
    }

    const handleOnEditBtn =async(item)=>{
        setClickedStaff(item);
        setInputField({...inputField,...item})
    }

    const filterOutData = (id) => {
        let newArr = staffs.filter((item) => item?._id !== id);
        setStaffs(newArr)
    }

    const handleDelete = async(id)=>{
        const token = localStorage.getItem("token");
        await axios.delete(`${backendUrl}/api/auth/delete-staff/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((response)=>{
            filterOutData(id)
        }).catch(err => {
            
            toast.error(err?.response?.data?.error)

        })
    }
    return (
        <div className='add-staffs-box'>
            <form className='register-form'>
                <div className='register-form-div'>
                    <div className='register-input-box'>
                        <input value={inputField.name} onChange={(event) => handleOnChange(event, "name")} className='input-box-register' type='text' placeholder='Staff Name' />
                    </div>
                    <div className='register-input-box'>
                        <input value={inputField.email} disabled={clickedStaff} onChange={(event) => handleOnChange(event, "email")} className='input-box-register' type='text' placeholder='Email Id' />
                    </div>
                    {
                      !clickedStaff &&  <div className='register-input-box'>
                        <input value={inputField.password} onChange={(event) => handleOnChange(event, "password")} className='input-box-register' type='text' placeholder='Password' />
                    </div>
                    }
                    <div className='register-input-box'>
                        <input value={inputField.designation} onChange={(event) => handleOnChange(event, "designation")} className='input-box-register' type='text' placeholder='Designation' />
                    </div>
                    <div className='register-input-box'>
                        <input value={inputField.mobileNo} onChange={(event) => handleOnChange(event, "mobileNo")} className='input-box-register' type='text' placeholder='Mobile No.' />
                    </div>
                </div>
                <button type='submit' className='form-btn reg-btn' onClick={handleAddStaff}>{!clickedStaff?"Add":"Update"}</button>

            </form>

            <div className='list-staffs'>

                {
                    staffs.map((item, index) => {
                        return (
                            <div className='list-staff'>
                                <div>{item.name}</div>
                                <div className='list-staff-btns'>
                                    <div onClick={()=>handleOnEditBtn(item)} style={{ cursor: "pointer" }}><EditIcon /></div>
                                    <div onClick={()=>handleDelete(item._id)} style={{ cursor: "pointer" }}><DeleteIcon /></div>

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

export default ManageStaff