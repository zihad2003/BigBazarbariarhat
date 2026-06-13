import { redirect } from 'next/navigation';

export default function KidsPage() {
    redirect('/products?category=kids-boys');
}
