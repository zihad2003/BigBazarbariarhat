'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Register the user via API
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (!data.success) {
                setError(data.message || 'Registration failed. Please try again.');
                return;
            }

            // Auto sign-in after successful registration
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Account created! Please log in.');
                router.push('/login');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] p-4 font-sans">
            <Card className="w-full max-w-md border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
                <div className="h-2 bg-black w-full" />
                <CardHeader className="space-y-4 pt-10 px-8 text-center">
                    <Link href="/" className="mx-auto w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-2 mb-2 shadow-xl overflow-hidden hover:scale-105 transition-all">
                        <img 
                            src="/favicon.ico" 
                            alt="Big Bazar Logo" 
                            className="w-full h-full object-contain" 
                        />
                    </Link>
                    <div>
                        <CardTitle className="text-3xl font-black tracking-tight uppercase">Create Account</CardTitle>
                        <CardDescription className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">
                            Join Big Bazar today
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-50 border-rose-100 text-rose-600 rounded-2xl p-4 border text-sm flex items-center">
                                <span className="text-[11px] font-black uppercase tracking-widest">{error}</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="e.g., Abdur Rahman"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-black"
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-16 bg-black hover:bg-gray-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 transition-all group"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </Button>

                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="h-px flex-1 bg-gray-100" />
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">or signup with</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <Button
                            type="button"
                            onClick={() => signIn('google', { callbackUrl })}
                            className="w-full h-14 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm transition-all"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="#EA4335"
                                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.87 3C6.19 7.56 8.87 5.04 12 5.04z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.1 2.66-2.33 3.48l3.61 2.8c2.12-1.95 3.78-4.83 3.78-8.43z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.26 14.22a7.17 7.17 0 010-4.44l-3.87-3a11.96 11.96 0 000 10.44l3.87-3z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.61-2.8c-1.01.68-2.31 1.09-3.96 1.09-3.13 0-5.81-2.52-6.74-5.52l-3.87 3C3.37 20.33 7.35 23 12 23z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="px-8 pb-10 flex flex-col items-center gap-6 border-t border-gray-50 pt-8">
                    <div className="flex items-center gap-3 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <ShieldCheck className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Secure Sign Up</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Already have an account? <Link href="/login" className="text-black hover:underline">Log In Here</Link>
                    </p>
                    <div className="h-px w-full bg-gray-100" />
                    <Link href="/" className="text-[10px] text-gray-400 hover:text-black font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
