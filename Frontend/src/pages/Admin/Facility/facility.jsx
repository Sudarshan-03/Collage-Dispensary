import React, { useState, useEffect } from 'react'
import './facility.css'
import { Link } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Modal from '../../../components/Modal/modal';
import FacilityModal from './FacilityModal/facilityModal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { backendUrl } from '../../../config';
const Facility = (props) => {
    const [modal, setModal] = useState(false)
    const [data, setData] = useState([]);
    const [clickedItem,setClickedItem] = useState(null)


    const onOFModal = () => {
        if(modal){
            setClickedItem(null)
        }
        setModal(prev => !prev)
    }

    const fetchData = async () => {
        props.showLoader();
        const token = localStorage.getItem("token");
        await axios.get(`${backendUrl}/api/facility/get`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((resp) => {
            setData(resp.data.facility)
        }).catch(err => {
            toast.error(err?.response?.data?.error)

        }).finally(() => {
            props.hideLoader();
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (item)=>{
        setClickedItem(item)
        setModal(true)

    }

    const filterOutData = (id)=>{
        let newArr = data.filter((item)=>item._id!==id);
        setData(newArr);
    }
    const handlDelete = async(id)=>{
        props.showLoader()
        const token = localStorage.getItem("token");
        await axios.delete(`${backendUrl}/api/facility/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }).then((resp)=>{
            filterOutData(id)
        }).catch(err => {
            toast.error(err?.response?.data?.error)

        }).finally(() => {
            props.hideLoader();
        })
    }
    return (
        <div className='admin-facility'>
            <div className='go-back'><Link to={'/admin/dashboard'}><ArrowBackIcon /> Back To Dashboard</Link></div>

            <div className='admin-facility-header'>
                <div>Facilities</div>
                <div className='add-facility-btn' onClick={onOFModal}>Add </div>
            </div>

            <div className='admin-facility-rows'>

                {
                    data.map((item) => {
                        return (
                            <div className='admin-facility-row'>

                                <div className='admin-facility-left'>
                                    <div className='admin-facility-title'>{item.title}</div>
                                    <div>{item.description}</div>
                                    <div style={{ marginTop: "10px" }}>Added By : {item?.addedBy?.name}</div>
                                </div>

                                <div className='admin-facility-btns'>
                                    <div onClick={()=>handleEdit(item)}><EditIcon /></div>
                                    <div onClick={()=>handlDelete(item._id)}><DeleteIcon /></div>
                                </div>

                            </div>
                        );
                    })
                }




            </div>
            {modal && <Modal headers="Add Facility" handleClose={onOFModal} children={<FacilityModal clickedItem={clickedItem} />} />}
            <ToastContainer />
        </div>
    )
}

export default Facility