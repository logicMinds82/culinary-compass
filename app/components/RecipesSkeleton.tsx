import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function RecipesSkeleton() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Title Skeleton */}
        <h2 className="text-4xl font-bold text-foreground text-center mb-8">
          Recipe <span className="text-primary">Explorer</span>
        </h2>

        {/* Search Bar & Filters Skeleton */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <Skeleton height={40} className="flex-1 min-w-[180px]" />
          <Skeleton height={40} width={150} />
          <Skeleton height={40} width={150} />
        </div>

        {/* Recipes Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              {/* Image Skeleton */}
              <Skeleton height={224} />

              <div className="p-5">
                {/* Title Skeleton */}
                <Skeleton height={28} className="mb-2" />

                {/* Meta Info Skeleton */}
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton height={20} width={80} />
                  <Skeleton height={20} width={60} />
                </div>

                {/* Description Skeleton */}
                <Skeleton height={40} className="mb-4" />

                {/* Categories Skeleton */}
                <div className="flex gap-2 mb-4">
                  <Skeleton height={24} width={60} />
                  <Skeleton height={24} width={70} />
                  <Skeleton height={24} width={50} />
                </div>

                {/* Button Skeleton */}
                <Skeleton height={40} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height={40} width={40} />
          ))}
        </div>
      </div>
    </section>
  );
}