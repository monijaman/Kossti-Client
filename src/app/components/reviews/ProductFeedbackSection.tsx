import fetchApi from '@/lib/fetchApi';
import UserReviewForm from './UserReviewForm';

export default async function ProductFeedbackSection({ productId }: { productId: number }) {
  let comments: Array<{ id: number; content: string; created_at?: string }> = [];
  try {
    const response = await fetchApi(`/product-feedback/${productId}`);
    const data = response.data as { data?: typeof comments } | undefined;
    comments = Array.isArray(data?.data) ? data.data : [];
  } catch {
    comments = [];
  }

  return <section id="product-feedback" className="my-8" aria-label="Product feedback">
    <h2 className="mb-2 text-xl font-bold text-gray-900">User Feedback</h2>
    <p className="mb-4 text-sm text-gray-500">Share feedback or ask a question about this product.</p>
    {comments.length > 0 && <div className="mb-4 space-y-3">
      {comments.map(comment => <article key={comment.id} className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-gray-700">{comment.content}</p>
        {comment.created_at && <time className="mt-2 block text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</time>}
      </article>)}
    </div>}
    <UserReviewForm productId={productId} />
  </section>;
}
