import React, { useState, useEffect } from 'react';
import './studentDashboard.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Modal from '../../components/Modal/modal';
import StudentModal from './StudentModal/studentModal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { backendUrl } from '../../config';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentDashboard = (props) => {
    const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
    const [history, setHistory] = useState([]);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [modal, setModal] = useState(false);

    const fetchData = async () => {
        props.showLoader();
        const token = localStorage.getItem("token");
        try {
            const resp = await axios.get(`${backendUrl}/api/history/get?roll=${userInfo?.roll}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });
            setHistory(resp.data.history);
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to fetch history');
        } finally {
            props.hideLoader();
        }
    };

    useEffect(() => {
        if (userInfo?.roll) {
            fetchData();
        }
    }, [userInfo?.roll]);

    const handleOnOfModal = (item) => {
        setModal(prev => !prev);
        setSelectedHistory(item ? item : null);
    };

    const downloadReport = () => {
        const doc = new jsPDF({ unit: 'px', format: 'a4' });
        doc.text('Student Medical Report', 20, 20);
        doc.text(`Name: ${userInfo?.name}`, 20, 30);
        doc.text(`Roll No: ${userInfo?.roll}`, 20, 40);
        doc.text(`Email: ${userInfo?.email}`, 20, 50);

        const tableColumn = ["Date", "Medicines", "Quantity"];
        const tableRows = [];

        history.forEach(record => {
            record.medicines.forEach(med => {
                const rowData = [
                    new Date(record.createdAt).toLocaleDateString(),
                    med.name,
                    med.requiredQuantity
                ];
                tableRows.push(rowData);
            });
        });

        autoTable(doc, { head: tableColumn, body: tableRows, startY: 60 });
        doc.save('medical_report.pdf');
    };

    return (
        <div className='student-dashboard'>
            <div className='dashboard-header'>
                <h1>Student Dashboard</h1>
                <button className='download-btn' onClick={downloadReport}>Download Report</button>
            </div>

            <div className='student-info-card'>
                <div className='info-item'><strong>Name:</strong> {userInfo?.name}</div>
                <div className='info-item'><strong>Roll No:</strong> {userInfo?.roll}</div>
                <div className='info-item'><strong>Email:</strong> {userInfo?.email}</div>
            </div>

            <div className='history-table'>
                <div className='history-header'>
                    <div>Date</div>
                    <div>View Details</div>
                </div>
                <div className='history-body'>
                    {history.length > 0 ? history.map((item, index) => (
                        <div className='history-row' key={index}>
                            <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                            <div onClick={() => handleOnOfModal(item)} className='view-icon'>
                                <RemoveRedEyeIcon />
                            </div>
                        </div>
                    )) : (
                        <div className='no-history'>No medical history found.</div>
                    )}
                </div>
            </div>

            {modal && <Modal header={"Details"} handleClose={handleOnOfModal} children={<StudentModal selectedHistory={selectedHistory} />} />}
            <ToastContainer />
        </div>
    );
};

export default StudentDashboard;
