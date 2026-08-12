"use client";

import { FormEvent, useState } from "react";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/apiUrl";

export default function UserReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const token = Cookies.get("accessToken") || Cookies.get("theAccessToken");
    if (!token) {
      window.location.href = `/signin?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`${getApiUrl()}/reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, reviews, source_url: sourceUrl || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit review");
      setReviews(""); setSourceUrl(""); setMessage("Thanks! Your review was submitted.");
      window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not submit review"); }
    finally { setSaving(false); }
  }

  return <form onSubmit={submit} className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-semibold text-gray-900">Share your experience</h3>
    <div className="mb-3 flex items-center gap-3">
      <label htmlFor="review-rating" className="text-sm font-medium">Rating</label>
      <select id="review-rating" value={rating} onChange={e => setRating(Number(e.target.value))} className="rounded border px-2 py-1">
        {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} / 5</option>)}
      </select>
    </div>
    <textarea required minLength={3} value={reviews} onChange={e => setReviews(e.target.value)} placeholder="What did you think?" className="mb-3 min-h-24 w-full rounded border p-3" />
    <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="Optional: link to your Google review or source" className="mb-3 w-full rounded border p-3" />
    <button disabled={saving} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">{saving ? "Submitting..." : "Submit review"}</button>
    {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
  </form>;
}
