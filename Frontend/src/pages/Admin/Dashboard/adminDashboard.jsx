import React, { useState } from 'react';
import './adminDashboard.css';
import Modal from '../../../components/Modal/modal';
import ManageStaff from './ManageStaff/manageStaff';
import ManageEvent from './ManageEvent/manageEvent';
import { Link } from 'react-router-dom';

const AdminDashboard = (props) => {
  const [manageStaffModal, setmanageStaffModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);

  const openCloseModal = (value) => {
    if (value === 'event') {
      setEventModal((prev) => !prev);
    } else {
      setmanageStaffModal((prev) => !prev);
    }
  };

  let userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  return (
    <div className='adminDashboard'>
      <div className='welcome-header'>
        <div className='welcome-admin'>Welcome To Admin Panel</div>
        <div className='welcome-admin-right-side'>
          {userInfo?.role?.toLowerCase() === 'admin' && (
            <div
              className='manage-staff-btn'
              onClick={() => {
                openCloseModal('staff');
              }}
            >
              <i className='fas fa-users-cog'></i>
              <span>Manage Staffs</span>
            </div>
          )}
          <div
            className='manage-staff-btn'
            onClick={() => {
              openCloseModal('event');
            }}
          >
            <i className='fas fa-calendar-alt'></i>
            <span>Events</span>
          </div>
        </div>
      </div>

      <div className='admin-dashboard-cards'>
        <Link to={'/admin/register-student'} className='admin-dashboard-card'>
          <i className='fas fa-user-plus'></i>
          <span>Register & Search Student</span>
        </Link>
        <Link to={'/admin/manage-medicine'} className='admin-dashboard-card'>
          <i className='fas fa-pills'></i>
          <span>Manage Medicines</span>
        </Link>
        <Link to={'/admin/record'} className='admin-dashboard-card'>
          <i className='fas fa-file-medical'></i>
          <span>Records</span>
        </Link>
        <Link to={'/admin/facility'} className='admin-dashboard-card'>
          <i className='fas fa-hospital'></i>
          <span>Facilities</span>
        </Link>
        <Link to={'/admin/nearByHospital'} className='admin-dashboard-card'>
          <i className='fas fa-clinic-medical'></i>
          <span>Near By Hospitals</span>
        </Link>
        <Link to={'/admin/gallary'} className='admin-dashboard-card'>
          <i className='fas fa-images'></i>
          <span>Gallery</span>
        </Link>
      </div>
      {manageStaffModal && (
        <Modal
          value={'staff'}
          handleClose={openCloseModal}
          header={'Manage Staffs'}
          children={
            <ManageStaff
              showLoader={props.showLoader}
              hideLoader={props.hideLoader}
            />
          }
        />
      )}
      {eventModal && (
        <Modal
          value={'event'}
          handleClose={openCloseModal}
          header={'Manage Events'}
          children={
            <ManageEvent
              showLoader={props.showLoader}
              hideLoader={props.hideLoader}
            />
          }
        />
      )}
    </div>
  );
};

export default AdminDashboard;
