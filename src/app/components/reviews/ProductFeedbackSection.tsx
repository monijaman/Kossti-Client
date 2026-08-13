import fetchApi from '@/lib/fetchApi';
import UserReviewForm from './UserReviewForm';
import FeedbackHashScroll from './FeedbackHashScroll';

export default async function ProductFeedbackSection({ productId, locale = 'en' }: { productId: number; locale?: string }) {
  const requestedLocale = locale === 'bn' ? 'bn' : 'en';
  let comments: Array<{ id: number; content: string; rating?: string; source_url?: string | null; created_at?: string }> = [];
  try {
    const response = await fetchApi(`/product-feedback/${productId}?locale=${requestedLocale}`, { next: { revalidate: 0 } });
    const data = response.data as { data?: typeof comments } | undefined;
    comments = Array.isArray(data?.data) ? data.data : [];
  } catch {
    comments = [];
  }

  return <section id="product-feedback" className="my-8" aria-label="Product feedback">
        <FeedbackHashScroll />
    <h2 className="mb-2 text-xl font-bold text-gray-900">User Feedback</h2>
    <p className="mb-4 text-sm text-gray-500">Share feedback or ask a question about this product.</p>
    {comments.length > 0 && <div className="mb-4 space-y-3">
      {comments.map(comment => <article key={comment.id} className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-gray-700">{comment.content}</p>
        {comment.rating && <p className="mt-2 text-sm font-medium text-amber-600" aria-label={`Rating ${comment.rating} out of 5`}>
          <span aria-hidden="true">{"★".repeat(Math.max(0, Math.min(5, Number(comment.rating))))}{"☆".repeat(Math.max(0, 5 - Math.min(5, Number(comment.rating))))}</span>
          <span className="ml-2">{comment.rating} / 5</span>
        </p>}
        {comment.created_at && <time className="mt-2 block text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</time>}
        {comment.source_url && <p className="mt-3 border-t border-gray-100 pt-2 text-xs text-gray-500">Source: <a href={comment.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{comment.source_url}</a></p>}
      </article>)}
    </div>}
    <UserReviewForm productId={productId} locale={locale} />
  </section>;
}
