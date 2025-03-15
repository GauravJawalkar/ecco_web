"use client"

import React from 'react'

interface ProductHolderProps {
    rank: number
}

const ProductHolder = ({ rank }: ProductHolderProps) => {
    return (
        <div className='my-10'>
            <div className='grid grid-cols-[1fr_2fr] gap-10 ' dir={`${rank % 2 ? "ltr" : "rtl"}`} >
                <div className='border p-5 bg-red-100 h-64'>
                    1
                </div>
                <div className='border p-5'>1</div>
            </div>
        </div >
    )
}

export default ProductHolder