import { redirect } from 'next/navigation';

export default function HomeDecorPage() {
    redirect('/products?category=home-decor');
}
