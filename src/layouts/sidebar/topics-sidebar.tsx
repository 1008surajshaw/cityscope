import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Static topics for now
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

export default function TopicsSidebar() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Topics</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <nav className="space-y-1">
          {TOPICS.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}`}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              <span className="text-lg">{topic.icon}</span>
              <span>{topic.label}</span>
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}