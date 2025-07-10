"use client";

import { Loader2 } from "lucide-react";
import React from "react";

const Loader = ({ title }: { title: string }) => {
    return (
        <div>
            <span className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" />
                {title}
            </span>
        </div>
    );
};

export default Loader;
