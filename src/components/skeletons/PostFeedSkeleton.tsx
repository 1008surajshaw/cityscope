import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function PostFeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-[200px] w-full rounded-md" />
          </CardContent>
          <CardFooter className="p-2 border-t flex justify-between">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
