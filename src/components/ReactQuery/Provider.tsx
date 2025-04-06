"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

interface providerProps {
    children: React.ReactNode
}

const Provider = ({ children }: providerProps) => {

    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

export default Provider