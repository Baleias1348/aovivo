import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export const RestaurantCardSkeleton = () => (
  <Card className="overflow-hidden shadow-lg flex flex-col bg-card animate-pulse h-full">
    <div className="w-full h-48 bg-muted"></div>
    <CardHeader>
      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </CardHeader>
    <CardContent className="flex-grow space-y-2">
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
    </CardContent>
    <CardFooter className="grid grid-cols-2 gap-2">
      <div className="h-10 bg-muted rounded w-full"></div>
      <div className="h-10 bg-muted rounded w-full"></div>
    </CardFooter>
  </Card>
);