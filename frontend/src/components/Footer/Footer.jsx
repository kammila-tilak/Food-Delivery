import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img className ="footer-logo" src={assets.logo} alt="" />
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem aliquid nostrum sint reprehenderit sapiente, hic expedita adipisci delectus totam pariatur repellendus animi saepe distinctio at illum excepturi? Molestiae, incidunt eius.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91 9898989889</li>
                <li>contact@baratie.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Baratie.com - All Rights Reserved</p>
    </div>
  )
}

export default Footer
