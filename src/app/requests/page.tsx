"use client"

import axios from 'axios'
import React, { useEffect } from 'react'

const page = () => {


    useEffect(() => {
        async function getSellerRequests() {
            try {
                const response = await axios.get('/api/getSellerRequests')
            } catch (error) {
                console.log(error)
            }
        }
    }, [])


    return (
        <div className=''>
            Requests Page
        </div>
    )
}

export default page