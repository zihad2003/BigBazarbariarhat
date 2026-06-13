import { redirect } from 'next/navigation';

export default async function AccessoriesSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;
    redirect(`/products?category=accessories&subcategory=${encodeURIComponent(subcategory.toLowerCase())}`);
}
