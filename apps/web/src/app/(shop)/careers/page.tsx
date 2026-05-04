'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const openings = [
  { title: 'Senior Fashion Buyer',          dept: 'Merchandising', location: 'Chittagong', type: 'Full-time' },
  { title: 'E-Commerce Manager',            dept: 'Digital',       location: 'Dhaka',      type: 'Full-time' },
  { title: 'Customer Support Specialist',   dept: 'Operations',    location: 'Remote',     type: 'Full-time' },
  { title: 'Visual Merchandiser',           dept: 'Retail',        location: 'Chittagong', type: 'Full-time' },
  { title: 'Social Media Content Creator',  dept: 'Marketing',     location: 'Remote',     type: 'Contract'  },
  { title: 'Logistics Coordinator',         dept: 'Supply Chain',  location: 'Chittagong', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Company</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Careers</h1>
          <p className="text-gray-400 font-medium mt-4 text-sm max-w-lg">
            Join our team and help shape the future of fashion retail in Bangladesh. We are always looking for passionate, driven people.
          </p>
        </div>

        <div className="space-y-3 mb-16">
          {openings.map((job, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md transition-all p-8 flex items-center justify-between gap-6 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{job.dept}</p>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{job.title}</h3>
                <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{job.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" />{job.type}</span>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="rounded-xl text-[9px] font-black uppercase tracking-widest border-gray-100 group-hover:border-gray-300 shrink-0 gap-2">
                  Apply <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-black text-white rounded-3xl p-10 text-center">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Don&#39;t see your role?</h2>
          <p className="text-gray-400 text-sm font-medium mb-8">Send your CV and tell us how you would contribute. We are always open to exceptional talent.</p>
          <Link href="/contact">
            <Button className="bg-white text-black hover:bg-gray-100 rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest">
              Send Open Application
            </Button>
          </Link>
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
