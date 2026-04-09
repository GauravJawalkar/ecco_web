"use client"

import { useEffect } from "react";
import { useUserStore } from "@/store/UserStore";
import { userProps } from "@/interfaces/commonInterfaces";
import { JwtPayload } from "jsonwebtoken";

interface Props {
    user: JwtPayload | null;
}

export default function UserStoreInitializer({ user }: Props) {
    const { setUser, clearUser } = useUserStore();

    useEffect(() => {
        if (user) {
            setUser(user as userProps);
        } else {
            clearUser();
        }
    }, []);

    return null; // Renders nothing, just syncs server state → client store
}