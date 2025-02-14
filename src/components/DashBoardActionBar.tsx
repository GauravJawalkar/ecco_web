import React from 'react'

const DashBoardActionBar = ({ isVisible }: any) => {
    return (
        <div className='flex items-center justify-around gap-4'>
            {/* My Products List */}
            <div>
                <button className='bg-gray-50 px-4 py-2 rounded' onClick={() => { }}>Add product</button>
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
    )
}

export default DashBoardActionBar