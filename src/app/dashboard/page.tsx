import DashBoardActionBar from '@/components/DashBoardActionBar'
import DashBoardStats from '@/components/DashBoardStats'
import React from 'react'

const Dashboard = () => {
    return (
        <div className='h-screen'>
            <DashBoardStats />
            <DashBoardActionBar />
        </div>
    )
}

export default Dashboard