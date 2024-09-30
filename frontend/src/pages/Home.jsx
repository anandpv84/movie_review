import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <>

            <div class="main">
                <h1>THE WOLRD OF<div class="roller">
                    <span id="rolltext">MOVIE<br />CINEMA<br /></span>
                    <span id="spare-time">pure magic</span>
                </div>
                </h1>
            </div>
            <div className='d-flex justify-content-center bb col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
                <Link to={'/login'}><button class="custom-btn btn-3 me-4"><span>Login</span></button></Link>
                <Link to={'/register'}><button class="custom-btn btn-3"><span>Register</span></button></Link>
            </div>



        </>
    )
}

export default Home