import React, { useState, useEffect } from 'react';
import './footer.css'
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import CloudIcon from '@mui/icons-material/Cloud';
import aa from './logo.png';
const Footer = () => {

    const [todayDate, setTodayDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTodayDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className='footer'>
            <div className='foooter-left'>
                <img className='footer-logo' src={aa} />
                <div className='footer-text-white'>MNNIT Allahabad</div>
                <div className='footer-text-white'>Prayagraj</div>
                <div className='footer-text-smaller'>UP-211004</div>
                <div className='footer-text-smaller'><PhoneIcon /> 1346-257400</div>
                <div className='footer-text-smaller'><LanguageIcon /> www.mnnit.ac.in</div>
            </div>

            <div className='foooter-center'>
                <div className='important-link'>Important Links</div>
                <a href='https://academics.mnnit.ac.in/new' target='_blank'>Academic Portel</a>
                <a href='https://mnnit.ac.in/index.php/anti-ragging' target='_blank'>Anti-Ragging Initiative</a>
                <a href='https://tpo.mnnit.ac.in/tnp/index.php' target='_blank'>Tranning and Placement </a>
                
                <a href='https://www.mnnit.ac.in/index.php/contact-us' target='_blank'>Contact Us</a>
                <a href='https://mnnit.ac.in' target='_blank'> Official Website</a>

            </div>

            <div className='footer-right'>
                <div className='footer-right-name'><CloudIcon/>MNNIT</div>
                <div className='today-date-footer'>{todayDate.toDateString()}</div>
                <div className='today-date-footer'> {todayDate.toLocaleTimeString()}</div>
            </div>
        </div>
    )
}

export default Footer