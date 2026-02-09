import Link from 'next/link'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    ArrowLeft
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold uppercase">Big Bazar</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 py-6">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-800">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <header className="bg-white border-b px-8 py-6 sticky top-0 z-10">
                    <h2 className="text-xl font-bold">Dashboard</h2>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
