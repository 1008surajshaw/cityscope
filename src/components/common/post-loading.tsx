import React from 'react'

export function LoadingPosts() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-[250px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-[200px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-[200px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex justify-between pt-2">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
