import ShopPage from '@/app/(shop)/shop/page';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    return <ShopPage params={params} />;
}
