"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const searchParams = useSearchParams();
    const prodId = searchParams.get('id');
    const router = useRouter();

    if (!prodId) {
        return router.back();
    }
    return (
        <div>page:{prodId}</div>
    )
}

export default page