'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed. Please try again.');
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/sign-in');
                }, 2000);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
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
                        <CardTitle className="text-3xl font-black tracking-tight uppercase">Register</CardTitle>
                        <CardDescription className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">
                            Create Your Big Bazar Account
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
                        {success && (
                            <div className="bg-emerald-50 border-emerald-100 text-emerald-600 rounded-2xl p-4 border text-sm flex items-center">
                                <span className="text-[11px] font-black uppercase tracking-widest">Registration successful! Redirecting to sign in page...</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide ml-2">Full Name</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide ml-2">Email Address</label>
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
                            <label htmlFor="password" className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide ml-2">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-black"
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={loading || success}
                            className="w-full h-16 bg-black hover:bg-gray-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 transition-all group"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign Up <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="px-8 pb-10 flex flex-col items-center gap-6 border-t border-gray-50 pt-8">
                    <div className="flex items-center gap-3 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 mt-2">
                        <ShieldCheck className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Secure Registration</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Already have an account? <Link href="/sign-in" className="text-black hover:underline">Log In Here</Link>
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
