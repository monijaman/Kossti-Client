"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/apiUrl";

const MAX_FEEDBACK_LENGTH = 2000;

export default function UserReviewForm({ productId, locale = "en" }: { productId: number; locale?: string }) {
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
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
    // Regular sign-in stores the access token in localStorage, while some
    // admin/auth flows use a cookie. Support both so submitting feedback does
    // not incorrectly redirect an already signed-in user to the sign-in page.
    // The localStorage token is refreshed by the normal sign-in flow. Prefer
    // it over an older cookie token, which can otherwise cause a false 401.
    const token = (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
      Cookies.get("accessToken") || Cookies.get("theAccessToken");
    if (!token) {
      const returnUrl = `${window.location.pathname}${window.location.search}#share-your-experience`;
      window.location.href = `/signin?redirect=${encodeURIComponent(returnUrl)}`;
      return;
    }
    if (reviews.length === 0 || !rating) {
      setMessage("Please write a comment and select a rating.");
      return;
    }
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`${getApiUrl()}/product-feedback/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: reviews, rating, source_url: sourceUrl || undefined }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Remove expired credentials so middleware does not treat them as a
          // valid session and redirect /signin to /admin/dashboard.
          Cookies.remove("accessToken", { path: "/" });
          Cookies.remove("theAccessToken", { path: "/" });
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          const returnUrl = `${window.location.pathname}${window.location.search}#share-your-experience`;
          window.location.href = `/signin?redirect=${encodeURIComponent(returnUrl)}`;
          return;
        }
        throw new Error(data.error || "Could not submit review");
      }
      // Keep the original language and create the opposite-language version.
      // Translation is best-effort: the original feedback is still saved if
      // the translation service is unavailable.
      const targetLocale = locale === "bn" ? "en" : "bn";
      try {
        const translationResponse = await fetch("/api/ai/translate-bengali", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: reviews, targetLocale }),
        });
        const translation = await translationResponse.json();
        if (translationResponse.ok && translation.data && data.feedback?.id) {
          await fetch(`${getApiUrl()}/feedback-translation`, {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ feedback_id: data.feedback.id, locale: targetLocale, translated_content: translation.data }),
          });
        }
      } catch { /* original feedback remains available */ }
      setReviews(""); setRating(""); setSourceUrl(""); setMessage("Thanks! Your comment was submitted.");
      // Refresh the server-rendered feedback list without navigating away.
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#product-feedback`);
      window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not submit review"); }
    finally { setSaving(false); }
  }

  return <form id="share-your-experience" onSubmit={submit} className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-semibold text-gray-900">Share your experience</h3>
    <textarea ref={reviewInputRef} required minLength={3} maxLength={MAX_FEEDBACK_LENGTH} value={reviews} onChange={e => setReviews(e.target.value)} placeholder="What did you think?" aria-describedby="feedback-character-count feedback-limit-warning" className="mb-2 min-h-24 w-full rounded border p-3" />
    <div className="mb-3 flex justify-between text-xs">
      <span id="feedback-limit-warning" className={reviews.length >= MAX_FEEDBACK_LENGTH - 200 ? "text-amber-600" : "text-gray-500"}>
        {reviews.length >= MAX_FEEDBACK_LENGTH - 200 ? "You are close to the character limit." : "You can submit up to 10 feedback entries per day."}
      </span>
      <span id="feedback-character-count" className={reviews.length >= MAX_FEEDBACK_LENGTH - 200 ? "font-semibold text-amber-600" : "text-gray-500"}>
        {MAX_FEEDBACK_LENGTH - reviews.length} characters left
      </span>
    </div>
    <label className="mb-3 block text-sm text-gray-700">
      Rating <span className="text-red-600">*</span>
      <input type="hidden" name="rating" required value={rating} />
      <span className="mt-1 flex items-center gap-1" role="radiogroup" aria-label="Rating from 1 to 5">
        {[1, 2, 3, 4, 5].map(value => {
          const selected = Number(rating) >= value;
          return <button key={value} type="button" role="radio" aria-checked={rating === String(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`} onClick={() => setRating(String(value))} className={`text-3xl leading-none transition-colors ${selected ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>
            ★
          </button>;
        })}
        <span className="ml-2 text-sm text-gray-500">{rating ? `${rating} / 5` : "Select a rating"}</span>
      </span>
    </label>
    <label className="mb-3 block text-sm text-gray-700">
      Source URL <span className="text-gray-400">(optional)</span>
      <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://example.com" className="mt-1 w-full rounded border p-3" />
    </label>
    <button disabled={saving} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">{saving ? "Submitting..." : "Submit review"}</button>
    {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
  </form>;
}
