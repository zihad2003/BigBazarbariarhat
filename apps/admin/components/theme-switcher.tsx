'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Moon, Sun, Monitor } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Predefined modern color palettes
const themes = [
    { name: 'Light', value: 'light', icon: Sun },
    { name: 'Dark', value: 'dark', icon: Moon },
    { name: 'System', value: 'system', icon: Monitor },
];

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl p-2">
                <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Appearance</DropdownMenuLabel>
                {themes.map((t) => (
                    <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium ${theme === t.value ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <t.icon className="h-4 w-4" />
                        {t.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
