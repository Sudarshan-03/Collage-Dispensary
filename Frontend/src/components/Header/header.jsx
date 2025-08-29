import React,{useState,useEffect} from 'react'
import './header.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
import aa from './aa.png';
import logo from './logo.png';
import { backendUrl } from '../../config';
const Header = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const [eventpopup, setEventpopup] = useState(false);
    const [helpline, setHelpline] = useState(false);
    const [events, setEvenets] = useState([]);


    const handleOpenPopup = (popup)=>{
        if(popup==="event"){
            setEventpopup(true);
        }else{
            setHelpline(true)
        }
    }

    const fetchEvents = async()=>{
        await axios.get(`${backendUrl}/api/notification/get`).then(response=>{
            console.log("fetching data")
            setEvenets(response.data.notifications);
        }).catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        if(eventpopup){
            fetchEvents()

        }
    },[eventpopup])

    const handleClosePopup = (popup)=>{
        if(popup==="event"){
            setEventpopup(false);
        }else{
            setHelpline(false)
        }
    }

    const handleLogin=()=>{
        navigate('/login')
    }
    const handleLogout = async()=>{
        props.showLoader();
        await axios.post(`${backendUrl}/api/auth/logout`,{},{withCredentials:true}).then(response=>{
            console.log(response)
            props.handleLogin(false)
            localStorage.clear();
            navigate('/');
        }).catch(err => {
            console.log(err)
            toast.error(err?.response?.data?.error)
        }).finally(() => {
            props.hideLoader();
        })
    }

    return (
        <div className='header'>
            <div className='header-college-details'>
                <div className='header-college-details-left'>
                    <img className='header-college-details-left-logo' src={logo} alt='colegeLogo' />
                    <div>
                        <div className='header-college-details-name'>राष्ट्रीय प्रौद्योगिकी संस्थान,</div>
                        <div className='header-college-details-place'>Allahabad</div>
                        <div className='header-college-details-name'>National Institute of Technology, </div>
                        <div className='header-college-details-place'>Allahabad</div>
                    </div>
                </div>

                <div className='header-college-details-right'>
                    <div className='front-size-header'>
                    <button onClick={() => props.setFontSize((size) => Math.min(size + 2, 32))}>A+</button>
                    <button onClick={() => props.setFontSize((size) => Math.max(size - 2, 12))}>A-</button>

                        </div>
                    <input type='text' className='header-input-tags' placeholder='search' /> 
                </div>
            </div>

            <div className='navbar'>
                <Link to={'/'} className={`navbar-links ${location.pathname==="/"?'active-link':null}`}>
                    Home
                </Link>
                
                <Link to={'/stock'} className={`navbar-links ${location.pathname==="/stock"?'active-link':null}`}>
                    Stock View
                </Link>
                <div className='navbar-links event-link' onMouseEnter={()=>{handleOpenPopup("event")}} onMouseLeave={()=>{handleClosePopup("event")}} >
                    <div className='navbar-link-opt'>New Events  <ArrowDropDownIcon /></div>
                    
                    {
                        eventpopup && <div className='navbar-dropdown-popup event-pop'>
                        {
                            events.map((item,index)=>{
                                return(
                                    <div className='popup-notification'>. {item.title}</div>
                                );
                            })
                        }

                    </div>
                    }
                </div>
                <div className='navbar-links event-link'  onMouseEnter={()=>{handleOpenPopup("helpline")}} onMouseLeave={()=>{handleClosePopup("helpline")}}>
                    <div className='navbar-link-opt'>Helpline <ArrowDropDownIcon /></div>

                    {
                        helpline && <div className='navbar-dropdown-popup helpline-pop'>
                        <div className='popup-notification'>Disaster management : 1007</div>
                    </div>
                    }
                    
                </div>
                <div onClick={props.isLogin?handleLogout:handleLogin} className={`navbar-links ${location.pathname==="/login"?'active-link':null}`}>
                    {props.isLogin?"Logout":"Login"}
                </div>
            </div>

            {
                location.pathname==="/" && <div className='header-banner'>
               
                <img src={aa} className='header-banner-image2' />
            </div>
            }

            <ToastContainer />
        </div>
    )
}

export default Header



