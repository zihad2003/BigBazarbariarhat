import { redirect } from 'next/navigation';

export default function AccessoriesPage() {
    redirect('/products?category=accessories');
}
