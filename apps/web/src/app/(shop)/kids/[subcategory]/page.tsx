import { redirect } from 'next/navigation';

export default async function KidsSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;
    const sub = subcategory.toLowerCase();
    
    if (sub === 'girls') {
        redirect('/products?category=kids-girls');
    } else {
        redirect('/products?category=kids-boys');
    }
}
