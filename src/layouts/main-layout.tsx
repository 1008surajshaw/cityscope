import TopicsSidebar from '@/layouts/sidebar/topics-sidebar';
import UserActivitySidebar from '@/layouts/sidebar/user-activity-sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px] gap-4 h-full">
      {/* Left sidebar - fixed */}
      <div className="hidden md:block sticky top-[80px] self-start h-[calc(100vh-100px)] overflow-hidden">
        <TopicsSidebar />
      </div>
      
      {/* Main content - scrollable */}
      <main className="min-h-[calc(100vh-100px)] overflow-y-auto">
        {children}
      </main>
      
      {/* Right sidebar - fixed */}
      <div className="hidden lg:block sticky top-[80px] self-start h-[calc(100vh-100px)] overflow-hidden">
        <UserActivitySidebar />
      </div>
    </div>
  );
}