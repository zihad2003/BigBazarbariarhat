import ShopPage from '@/app/(shop)/shop/page';

export default function CategoryPage({ params }: { params: { slug: string } }) {
    return <ShopPage params={params} />;
}
