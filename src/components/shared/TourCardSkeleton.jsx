import React from 'react';
    import { Skeleton } from "@/components/ui/skeleton";
    import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

    const TourCardSkeleton = () => {
      return (
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
          <Skeleton className="h-52 w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-1/2" />
          </CardFooter>
        </Card>
      );
    };

    export default TourCardSkeleton;