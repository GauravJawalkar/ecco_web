"use client"

import AddProductModal from '@/components/AddProductModal';
import DashBoardActionBar from '@/components/DashBoardActionBar'
import DashBoardStats from '@/components/DashBoardStats'
import { useState } from 'react';

const Dashboard = () => {
    const [showProductModal, setShowProductModal] = useState(false);

    return (
        <div className='h-screen'>
            <DashBoardStats />
            <div className='flex items-center justify-around gap-4'>
                {/* My Products List */}
                <div>
                    <button className='bg-gray-50 px-4 py-2 rounded' onClick={() => { setShowProductModal(true) }}>Add product</button>
                </div>

                {/* Add A Product */}
                <div>
                    <button className='bg-gray-50 px-4 py-2 rounded'>Orders Processing</button>
                </div>

                {/* Orders Completed */}
                <div>
                    <button className='bg-gray-50 px-4 py-2 rounded'>Orders Completed</button>
                </div>
            </div>
            <AddProductModal isVisible={showProductModal} onClose={() => { setShowProductModal(false) }} />
        </div >
    )
}

export default Dashboard