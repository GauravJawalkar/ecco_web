"use client"

import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/UserStore";
import { userProps } from "@/interfaces/commonInterfaces";

interface Props {
    user: Record<string, any> | null;
}

export default function UserStoreInitializer({ user }: Props) {
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        if (user) {
            // SSR confirmed valid session — hydrate store
            setUser(user as userProps);
        } else {
            // SSR found no valid session — clear any stale localStorage data
            // This handles the case where cookies expired but localStorage still has old user
            clearUser();
        }
    }, []);

    return null;
}