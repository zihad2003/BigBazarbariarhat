import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

const stats = [
    { title: 'Total Revenue', value: 125000, icon: '💰', change: '+12.5%' },
    { title: 'Total Products', value: 48, icon: '📦', change: '+3' },
    { title: 'Total Orders', value: 156, icon: '🛒', change: '+8' },
    { title: 'Customers', value: 89, icon: '👥', change: '+5' },
]

const recentOrders = [
    { id: 'ORD-001', customer: 'Karim Ahmed', items: 3, total: 3297, status: 'delivered' },
    { id: 'ORD-002', customer: 'Fatima Khan', items: 2, total: 2598, status: 'shipped' },
    { id: 'ORD-003', customer: 'Rahman Ali', items: 1, total: 999, status: 'processing' },
    { id: 'ORD-004', customer: 'Nadia Islam', items: 4, total: 4596, status: 'pending' },
]

const topProducts = [
    { name: 'Signature Tee', category: 'Men', stock: 45, price: 999 },
    { name: 'Classic Polo', category: 'Men', stock: 32, price: 1299 },
    { name: 'Essential Dress', category: 'Women', stock: 28, price: 1899 },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{stat.icon}</span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stat.title === 'Total Revenue' ? formatPrice(stat.value) : stat.value}
                                    </p>
                                    <p className="text-xs text-green-600 font-semibold mt-1">
                                        {stat.change}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm uppercase tracking-wide">Recent Orders</CardTitle>
                        <a href="/admin/orders" className="text-sm font-semibold text-gray-600 hover:text-black">
                            View All →
                        </a>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                    <div>
                                        <p className="font-semibold">{order.id}</p>
                                        <p className="text-sm text-gray-500">{order.customer} • {order.items} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatPrice(order.total)}</p>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm uppercase tracking-wide">Top Products</CardTitle>
                        <a href="/admin/products" className="text-sm font-semibold text-gray-600 hover:text-black">
                            View All →
                        </a>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product) => (
                                <div key={product.name} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                    <div>
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.category} • Stock: {product.stock}</p>
                                    </div>
                                    <p className="font-semibold">{formatPrice(product.price)}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
