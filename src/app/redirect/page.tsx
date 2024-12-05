"use client";  // Ensure this is treated as a client-side component

import { useRouter } from "next/navigation";
import { useEffect } from "react";
const RedirectPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the desired page (e.g., /admin)
        router.replace("/admin"); // Replace this with any URL you want to redirect to
    }, [router]);

    return null; // No content needed, just redirect
};

export default RedirectPage;
