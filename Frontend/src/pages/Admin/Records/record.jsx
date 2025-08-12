import React, { useEffect, useState } from 'react'
import './record.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import SearchBox from '../../../components/SearchBox/searchBox';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Modal from '../../../components/Modal/modal';
import RecordModal from './RecordModal/recordModal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import StudentAllFiles from './StudentAllDetails/studentAllFiles';
const Record = (props) => {
    const [studentRoll, setStudentRoll] = useState("");
    const [listOfYear, setListOfYear] = useState([]);
    const [listOfMonth, setListOfMonths] = useState([]);
    const currentYear = new Date().getFullYear();
    const [modal, setModal] = useState(false)
    const [allRecordModal,setAllRecordModal] = useState(false)
    const [data, setData] = useState([]);
    const [selectedHistory,setSelectedHistory] = useState(null)
    const [selectedAllDetails,setSelecetedAllDetaisl] = useState(null)

    const [selectedYear, setSelectedYear] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("")

    const onOffModal = () => {
        setModal(prev => !prev)
    }
    const onOffAllRecordModal = ()=>{
        if(allRecordModal){
            setSelecetedAllDetaisl(null)
        }
        setAllRecordModal(prev=>!prev)
    }

    const onChangeField = (value) => {
        setStudentRoll(value)
    }

    const fetchData = async () => {
        props.showLoader()
        await axios.get(`http://localhost:4000/api/history/get-history?month=${selectedMonth}&year=${selectedYear}`, { withCredentials: true }).then(response => {
            console.log(response)
            setData(response.data.history)
        }).catch(err => {
            console.log(err)
            toast.error(err?.response?.data?.error);

        }).finally(() => {
            props.hideLoader()
        })
    }

    useEffect(() => {
        if (selectedMonth === "" || selectedYear === "") {
            return;
        }
        fetchData();

    }, [selectedYear, selectedMonth])

    useEffect(() => {
        let arr = [];
        for (let i = 2025; i <= parseInt(currentYear); i++) {
            arr.unshift(i.toString())
        }

        setListOfYear(arr);
        setSelectedYear(arr[0]);

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const currentMonthIndex = new Date().getMonth(); // 0 for Jan, 1 for Feb, ..., 11 for Dec

        const pastAndCurrentMonths = months.slice(0, currentMonthIndex + 1);
        setListOfMonths(pastAndCurrentMonths)
        setSelectedMonth(pastAndCurrentMonths[pastAndCurrentMonths.length - 1])

    }, [])

    const handleOnOpenModal = (item) => {
        setModal(prev => !prev)
        setSelectedHistory(item?item:null)

    }

    const handleClick = async()=>{
        if(studentRoll.trim().length===0) return toast.error("Please Enter Correct Roll No.");
        props.showLoader()
        await axios.get(`http://localhost:4000/api/history/get?roll=${studentRoll}`,{withCredentials:true}).then(resp=>{
            console.log(resp)
            setAllRecordModal(true)
            setSelecetedAllDetaisl(resp.data.history)
        }).catch(err => {
            console.log(err)
            toast.error(err?.response?.data?.error);

        }).finally(() => {
            props.hideLoader()
        })
    }
    return (
        <div className='records'>
            <div className='go-back'><Link to={'/admin/dashboard'}><ArrowBackIcon /> Back To Dashboard</Link></div>

            <SearchBox handleClick={handleClick} value={studentRoll} onChange={onChangeField} placeholder="Search By Roll No." />

            <div className='record-date-block'>
                Select year
                <div className='record-date-year'>
                    {
                        listOfYear.map((item, index) => {
                            return (
                                <div onClick={() => setSelectedYear(item)} className={`record-year ${selectedYear === item ? 'active-stats' : null}`}>{item}</div>

                            );
                        })
                    }



                </div>

                Select Month
                <div className='record-date-year'>
                    {
                        listOfMonth.map((item, index) => {
                            return (
                                <div onClick={() => setSelectedMonth(item)} className={`record-year ${selectedMonth === item ? 'active-stats' : null}`}>{item}</div>

                            );
                        })
                    }

                </div>
            </div>

            <div className='manageMedicine-card'>
                <div className='report-form-rows'>
                    <div className='report-form-header'>
                        <div className=''>View</div>
                        <div className='col-2-mng'>Student Name</div>
                        <div className='col-2-mng'>Roll No.</div>
                        <div className='col-3-mng'>Date</div>
                    </div>

                    <div className='report-form-row-block'>
                        {
                            data.map((item, index) => {
                                return (
                                    <div className='report-form-row' >
                                        <div className='' onClick={() => { handleOnOpenModal(item) }}><RemoveRedEyeIcon sx={{ cursor: "pointer" }} /></div>
                                        <div className='col-2-mng'>{item?.student?.name}</div>
                                        <div className='col-2-mng'>{item?.student?.roll}</div>

                                        <div className='col-3-mng'>{item.createdAt.slice(0, 10).split("-").reverse().join("-")}</div>
                                    </div>
                                );
                            })
                        }

                        {
                            data.length===0 && <div className='report-form-row' >
                            <div className=''>No Any records yet</div>

                        </div>
                        }


                    </div>


                </div>
            </div>
            <ToastContainer/>
            {modal && <Modal header="Records" handleClose={onOffModal} children={<RecordModal selectedHistory={selectedHistory} />} />}
            {allRecordModal && <Modal header="All Records" handleClose={onOffAllRecordModal} children={<StudentAllFiles studnetAllDetails={selectedAllDetails}/>} />}
        </div>
    )
}

export default Record