import React, { useState } from 'react'
import './DemoFinalistCard.scss'

function DemoCard({ name }, { essaytitle }, { essaycontent }) {

    return (

        <div className='Card'>
            <div className='upper-container'>
                <div className='image-container'>
                    <img src="" alt="" height="100px" width="100px" />
                </div>
            </div>
            <div className='lower-container'>
                <h3> {name} </h3>
                <h3> {essaytitle} </h3>
                <h3> {essaycontent} </h3>
                <button> Read More</button>
            </div>


        </div>

    )

}

export default DemoCard