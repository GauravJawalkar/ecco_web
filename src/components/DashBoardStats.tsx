import React from 'react'

const DashBoardStats = () => {
    return (
        <div className='grid grid-cols-3 text-center my-10 gap-5 dark:text-neutral-800'>
            {/* Total No oF orders */}
            <div className='bg-gray-100 min-h-20 rounded-md place-content-center'>
                Total Orders : 150
            </div>
            {/* Revenue Generated */}
            <div className='bg-gray-100 min-h-20 rounded-md place-content-center'>
                Revenue Generated : ₹2000
            </div>
            {/* Stock Availabel */}
            <div className='bg-gray-100 min-h-20 rounded-md place-content-center'>
                Available Items 2
            </div>
        </div>
    )
}

export default DashBoardStats