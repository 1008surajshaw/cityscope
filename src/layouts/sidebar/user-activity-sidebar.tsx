import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function UserActivitySidebar() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Your Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs defaultValue="liked">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="liked">Liked</TabsTrigger>
            <TabsTrigger value="commented">Commented</TabsTrigger>
          </TabsList>
          <TabsContent value="liked" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Posts you've liked will appear here.
              </p>
              <Link 
                href="/posts/liked" 
                className="text-sm text-primary hover:underline block"
              >
                View all liked posts
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="commented" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Posts you've commented on will appear here.
              </p>
              <Link 
                href="/posts/commented" 
                className="text-sm text-primary hover:underline block"
              >
                View all commented posts
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}