import React from 'react';
    import { Skeleton } from "@/components/ui/skeleton";

    const TourDetailSkeleton = () => {
      return (
        <div className="container py-12 md:py-16 animate-pulse">
          <div className="mb-12 text-center">
            <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="col-span-2 row-span-2 h-64 md:h-96 rounded-lg" />
                <Skeleton className="h-32 md:h-48 rounded-lg" />
                <Skeleton className="h-32 md:h-48 rounded-lg" />
              </div>
              
              <div>
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
              </div>

              <div>
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                </div>
                <div>
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              
              <Skeleton className="h-10 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-1/4" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-full mt-4" />
              <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
            </div>
          </div>
        </div>
      );
    };

    export default TourDetailSkeleton;