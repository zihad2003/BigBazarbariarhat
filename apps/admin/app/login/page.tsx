'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Mock auth
        await new Promise(r => setTimeout(r, 400));
        if (email === 'admin@bigbazar.com' && password === 'admin123') {
            router.push('/');
        } else {
            setError('Invalid email or password');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm">
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary mb-4">
                        <span className="text-sm font-bold text-primary-foreground">BB</span>
                    </div>
                    <h1 className="text-lg font-semibold text-foreground">Admin Login</h1>
                    <p className="text-[13px] text-muted-foreground mt-1">Login to manage your store</p>
                </div>

                {/* Form Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-[13px] font-medium text-foreground">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@bigbazar.com"
                                    className="w-full h-10 pl-10 pr-3 bg-background border border-input rounded-lg text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-[13px] font-medium text-foreground">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full h-10 pl-10 pr-3 bg-background border border-input rounded-lg text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
                        </button>
                    </form>
                </div>

                <p className="text-[11px] text-muted-foreground text-center mt-6">
                    Big Bazar Bariarhat &copy; 2024
                </p>
            </div>
        </div>
    );
}
