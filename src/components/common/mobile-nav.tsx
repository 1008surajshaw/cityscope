'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// Static topics for now (same as in topics-sidebar)
const TOPICS = [
  { id: 'economics', label: 'Economics', icon: '📈' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'hollywood', label: 'Hollywood', icon: '🎬' },
  { id: 'politics', label: 'Politics', icon: '🏛️' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'education', label: 'Education', icon: '🎓' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="px-2 py-6">
            <h2 className="mb-4 text-lg font-semibold">Topics</h2>
            <nav className="space-y-1">
              {TOPICS.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{topic.icon}</span>
                  <span>{topic.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}