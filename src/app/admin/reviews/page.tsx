import ManageReviewsClient from '@/app/components/admin/reviews/ManageReviewsClient';
import { SearchParams } from '@/lib/types';

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const ManageReviews = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  return <ManageReviewsClient searchParams={resolvedSearchParams} />;
};

export default ManageReviews;
