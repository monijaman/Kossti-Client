"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import fetchApi from '@/lib/fetchApi';
import { apiEndpoints } from '@/lib/constants';
import { setAccessTokenCookie } from '@/lib/utils';

interface LoginResponse {
  token: string;
  refresh_token: string;
  email: string;
  type: string;
}

const AdminLogin = () => {
    const router = useRouter();
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check if user is already logged in by calling our session API
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/session', {
                    method: 'GET',
                    credentials: 'include',
                });

                // If session API returns OK, user is authenticated
                if (response.ok) {
                    router.push('/admin/dashboard');
                    return;
                }
            } catch {
                console.log('Auth check - user not logged in');
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const requestBody = {
            email: email,
            password: password
        };

        try {
            const response = await fetchApi(apiEndpoints.login, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: requestBody,
                signal: 15000, // 15 second timeout for login
            });

            if (response.success) {
                setError('');
                // Store the tokens and user info
                const loginData = response.data as LoginResponse;
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('refresh_token', loginData.refresh_token);
                localStorage.setItem('email', loginData.email);
                localStorage.setItem('userType', loginData.type);

                // Also set the token as a cookie for API routes
                setAccessTokenCookie(loginData.token);

                router.push("/admin/dashboard");
            } else {
                setError(response.error || "Login failed.");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    setError("Request timed out. Please check your connection and try again.");
                } else if (error.message.includes('fetch')) {
                    setError("Network error. Please check your internet connection.");
                } else {
                    setError(`Login failed: ${error.message}`);
                }
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Checking authorization...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">Admin</h1>
                    <p className="text-center text-gray-600 mt-2">Login to access the admin panel</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">Demo Credentials:</span><br />
                        Email: admin@example.com<br />
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
