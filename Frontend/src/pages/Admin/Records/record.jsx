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
import { backendUrl } from '../../../config';

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


    const fetchData = async () => {
        props.showLoader()
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${backendUrl}/api/history/get-history?month=${selectedMonth}&year=${selectedYear}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );
            setData(response.data.history || []);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Failed to fetch data");
        } finally {
            props.hideLoader()
        }
    };

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            fetchData();
        }
    }, [selectedYear, selectedMonth]);

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
        const currentMonthIndex = new Date().getMonth();
        const pastAndCurrentMonths = months.slice(0, currentMonthIndex + 1);

        setListOfMonths(pastAndCurrentMonths);
        setSelectedMonth(pastAndCurrentMonths[pastAndCurrentMonths.length - 1]);
    }, []);

    const handleOnOpenModal = (item) => {
        setModal(true);
        setSelectedHistory(item);
    };

    const onOffModal = () => {
        setModal(false);
        setSelectedHistory(null);
    };

    const onOffAllRecordModal = () => {
        if(allRecordModal){
            setSelecetedAllDetaisl(null);
        }
        setAllRecordModal(prev=>!prev);
    };

    const onChangeField = (value) => {
        setStudentRoll(value);
    };

    const handleClick = async()=> {
        if(studentRoll.trim().length===0) {
            return toast.error("Please Enter Correct Roll No.");
        }
        props.showLoader();
        try {
            const token = localStorage.getItem("token");
            const resp = await axios.get(
                `${backendUrl}/api/history/get?roll=${studentRoll}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );
            setAllRecordModal(true);
            setSelecetedAllDetaisl(resp.data.history || []);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Failed to fetch student records");
        } finally {
            props.hideLoader();
        }
    };

    return (
        <div className='records'>
            <div className='go-back'>
                <Link to={'/admin/dashboard'}>
                    <ArrowBackIcon /> Back To Dashboard
                </Link>
            </div>

            <SearchBox
                handleClick={handleClick}
                value={studentRoll}
                onChange={onChangeField}
                placeholder="Search By Roll No."
            />

            <div className='record-date-block'>
                Select year
                <div className='record-date-year'>
                    {listOfYear.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedYear(item)}
                            className={`record-year ${selectedYear === item ? 'active-stats' : ""}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>

                Select Month
                <div className='record-date-year'>
                    {listOfMonth.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedMonth(item)}
                            className={`record-year ${selectedMonth === item ? 'active-stats' : ""}`}
                        >
                            {item}
                        </div>
                    ))}
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
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <div key={index} className='report-form-row'>
                                    <div className='' onClick={() => { handleOnOpenModal(item) }}>
                                        <RemoveRedEyeIcon sx={{ cursor: "pointer" }} />
                                    </div>
                                    <div className='col-2-mng'>{item?.student?.name}</div>
                                    <div className='col-2-mng'>{item?.student?.roll}</div>
                                    <div className='col-3-mng'>
                                        {item.createdAt?.slice(0, 10)?.split("-").reverse().join("-")}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='report-form-row'>
                                <div className=''>No Any records yet</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ToastContainer />
            {modal && (
                <Modal
                    header="Records"
                    handleClose={onOffModal}
                >
                    <RecordModal selectedHistory={selectedHistory} />
                </Modal>
            )}
            {allRecordModal && (
                <Modal
                    header="All Records"
                    handleClose={onOffAllRecordModal}
                >
                    <StudentAllFiles studnetAllDetails={selectedAllDetails} />
                </Modal>
            )}
        </div>
    );
};

export default Record;
