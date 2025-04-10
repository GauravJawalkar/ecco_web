'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';

export default function PostAuthRedirectPage() {
    const { setUser }: any = useUserStore();
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get('/api/me'); // 👈 API that returns cookie user
                if (response.data.data) {
                    setUser(response.data.data);
                }
                router.replace('/'); // Redirect again after setting Zustand
            } catch (error) {
                console.log("Error getting user from cookie ", error)
            }

        }

        fetchUser();
    }, []);

    return <p>Logging you in...</p>;
}
