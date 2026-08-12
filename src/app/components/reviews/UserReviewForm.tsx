"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/apiUrl";

export default function UserReviewForm({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const reviewInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (window.location.hash === "#share-your-experience") {
      // The product review section can render after the initial page load.
      // Wait one frame so the form is present before scrolling to it.
      requestAnimationFrame(() => {
        document.getElementById("share-your-experience")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        reviewInputRef.current?.focus();
      });
    }
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const token = Cookies.get("accessToken") || Cookies.get("theAccessToken");
    if (!token) {
      const returnUrl = `${window.location.pathname}${window.location.search}#share-your-experience`;
      window.location.href = `/signin?redirect=${encodeURIComponent(returnUrl)}`;
      return;
    }
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`${getApiUrl()}/product-feedback/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: reviews }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit review");
      setReviews(""); setMessage("Thanks! Your comment was submitted.");
      window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not submit review"); }
    finally { setSaving(false); }
  }

  return <form id="share-your-experience" onSubmit={submit} className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-semibold text-gray-900">Share your experience</h3>
    <textarea ref={reviewInputRef} required minLength={3} value={reviews} onChange={e => setReviews(e.target.value)} placeholder="What did you think?" className="mb-3 min-h-24 w-full rounded border p-3" />
    <button disabled={saving} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">{saving ? "Submitting..." : "Submit review"}</button>
    {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
  </form>;
}
