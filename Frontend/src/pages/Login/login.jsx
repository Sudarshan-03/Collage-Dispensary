import React, { useState } from 'react'
import './login.css'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ForgotModal from '../../components/FogotModal/forgotModal'
import { backendUrl } from '../../config';
const Login = (props) => {

    const navigate = useNavigate();

    const [forgotPassword, setForgotPassword] = useState(false);
    const [loginField, setLoginField] = useState({ email: "", password: "" });
    const [registerField, setRegisterField] = useState({ name: "", email: "", password: "", roll: "" });


    const handleForgotModal = ()=>{
        setForgotPassword(prev=>!prev)
    }

    const handleOnChange = (event, key, card) => {
        if (card === "login") {
            setLoginField({ ...loginField, [key]: event.target.value })
        } else {
            setRegisterField({ ...registerField, [key]: event.target.value })
        }
    }

    const handleLogin = async () => {
        if (loginField.email.trim() === "" || loginField.password.trim() === "") return toast.error("Please enter the credentials");
        props.showLoader();

        await axios.post(`${backendUrl}/api/auth/login`, loginField, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            localStorage.setItem('isLogin', true);
            props.handleLogin(true);
            if (response.data.user.role === "student") {
                navigate(`/student/${response.data.user._id}`)
            } else {
                navigate('/admin/dashboard')
            }

        }).catch(err => {
            console.log(err)
            toast.error(err?.response?.data?.error);
        }).finally(() => {
            props.hideLoader()
        })

    }

    const handleRegister = async () => {
        if (registerField.email.trim() === "" || registerField.password.trim() === "" || registerField.name.trim() === "" || registerField.roll.trim() === "") return toast.error("Please enter all the credentials");
        if (registerField.name.length < 3) return toast.error("Name should be greater than 2 characters ")
        props.showLoader();
        await axios.post(`${backendUrl}/api/auth/register`, registerField).then(response => {
            toast.success("User Registered Successfully")
        }).catch(err => {
            toast.error(err?.response?.data?.error);
        }).finally(() => {
            props.hideLoader();
        })
    }

    return (
        <div className='login-page'>

            <div className='login-page-card'>
                <div className='card-header-form'>Login</div>
                <div className='form-input-fields'>
                    <input value={loginField.email} onChange={(event) => handleOnChange(event, 'email', 'login')} className='form-input' type='email' placeholder='Enter Email Id' />
                    <input value={loginField.password} onChange={(event) => handleOnChange(event, 'password', 'login')} className='form-input' type='password' placeholder='Your Password' />
                    <div className='form-btn' onClick={handleLogin}>Login</div>
                </div>
                <div className='forgot-password-link' onClick={handleForgotModal}>Forgot Password ?</div>
            </div>

            <div className='signup-page-card'>
                <div className='card-header-form'>Register</div>
                <div className='form-input-fields'>

                    <input value={registerField.name} onChange={(event) => handleOnChange(event, 'name', 'register')} className='form-input' type='text' placeholder='Enter your name' />
                    <input value={registerField.email} onChange={(event) => handleOnChange(event, 'email', 'register')} className='form-input' type='email' placeholder='Enter your mail id' />
                    <input value={registerField.password} onChange={(event) => handleOnChange(event, 'password', 'register')} className='form-input' type='password' placeholder='Your Password' />
                    <input value={registerField.roll} onChange={(event) => handleOnChange(event, 'roll', 'register')} className='form-input' type='text' placeholder='Enter your roll no' />

                    <div className='form-btn' onClick={handleRegister}>Register</div>
                </div>
            </div>
            <ToastContainer />
            {
                forgotPassword && <ForgotModal showLoader={props.showLoader} hideLoader={props.hideLoader} closeModal={handleForgotModal} />
            }

        </div>
    )
}

export default Login