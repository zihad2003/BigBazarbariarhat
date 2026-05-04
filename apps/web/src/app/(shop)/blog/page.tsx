'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const posts = [
  {
    category: 'Style',
    title: 'The Essential Wardrobe: 10 Pieces Every Man Needs in 2026',
    excerpt: 'A curated guide to building a functional and stylish wardrobe that stands the test of time — without breaking the bank.',
    date: 'Apr 15, 2026',
    readTime: '5 min read',
  },
  {
    category: 'Fashion',
    title: 'Summer Essentials for the Modern Woman',
    excerpt: 'From breezy linen sets to bold prints, here are the pieces that define effortless summer dressing this season.',
    date: 'Apr 10, 2026',
    readTime: '4 min read',
  },
  {
    category: 'Kids',
    title: 'Back to School: Dressing Your Kids for Comfort and Confidence',
    excerpt: 'Practical tips and style picks to help your children feel great and perform their best throughout the school year.',
    date: 'Apr 5, 2026',
    readTime: '3 min read',
  },
  {
    category: 'Lifestyle',
    title: 'How We Source Our Fabrics: A Commitment to Quality',
    excerpt: 'An inside look at our supplier relationships and the standards we hold every piece of fabric to before it reaches your hands.',
    date: 'Mar 28, 2026',
    readTime: '6 min read',
  },
  {
    category: 'Sustainability',
    title: 'Our Progress on Sustainable Packaging in 2026',
    excerpt: 'We reduced plastic packaging by 60% this quarter. Here is how we are continuing the journey toward zero-waste shipping.',
    date: 'Mar 20, 2026',
    readTime: '4 min read',
  },
  {
    category: 'Style',
    title: 'Eid Collection 2026: Behind the Design',
    excerpt: 'Our designers share the inspiration behind this year\'s festive collection — a blend of heritage craft and modern silhouettes.',
    date: 'Mar 12, 2026',
    readTime: '5 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Stories & Updates</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Blog</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="h-2 bg-gray-900 group-hover:bg-black transition-colors" />
              <div className="p-8 flex flex-col flex-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">{post.category}</span>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-snug mb-3 flex-1">{post.title}</h2>
                <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-black text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Shop
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
