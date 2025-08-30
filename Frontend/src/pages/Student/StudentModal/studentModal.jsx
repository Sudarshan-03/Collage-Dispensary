import React from 'react';
import './studentModal.css';

const StudentModal = ({ selectedHistory }) => {
    if (!selectedHistory) {
        return null;
    }

    return (
        <div className='record-modal'>
            <div className='modal-header'>
                <h3>Medical Record Details</h3>
                <div className='record-date'>
                    {new Date(selectedHistory.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })}
                </div>
            </div>
            <div className='modal-body'>
                <div className='medicines-grid'>
                    <div className='grid-header'>Medicine Name</div>
                    <div className='grid-header'>Quantity</div>
                    {selectedHistory.medicines.map((item, index) => (
                        <React.Fragment key={index}>
                            <div className='grid-cell'>{item.name}</div>
                            <div className='grid-cell'>{item.requiredQuantity}</div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentModal;
