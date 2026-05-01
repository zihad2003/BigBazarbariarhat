'use client';

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">403 - Unauthorized</h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
                You do not have permission to access the Admin Dashboard.
                Please contact an administrator if you believe this is an error.
            </p>
            <div className="flex space-x-4">
                <button 
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Sign Out
                </button>
                <Link
                    href="/"
                    className="bg-gray-200 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
