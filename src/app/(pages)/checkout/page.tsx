import CheckoutContent from '@/components/Checkout/CheckoutContent';
import { Suspense } from 'react';

const page = () => {
    return (
        <Suspense fallback={<div className='flex items-center justify-center h-96'>Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}

export default page