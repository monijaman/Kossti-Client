# AI Review Integration Guide

## Overview
This document tracks the OpenAI integration for AI-powered review generation in the GoCrit application.

## What Was Implemented

### 1. **OpenAI Service Module** 
**File:** `src/lib/openai-service.ts`

Key features:
- `generateAIReview()` - Generates AI reviews using OpenAI Claude API
- `formatReviewAsHTML()` - Wraps content in proper HTML structure (following template format)
- `extractRatingFromReview()` - Automatically extracts rating from generated content
- Support for both English (en) and Bengali (bn) locales
- Uses the template structure from `review-template.go` as reference

### 2. **ReviewTransForm Component Updates**
**File:** `src/app/components/admin/reviews/ReviewTransForm.tsx`

Changes made:
- Added imports for `generateAIReview` and `extractRatingFromReview`
- Added state management:
  - `aiLoading` - tracks AI generation progress
  - `aiError` - handles errors gracefully
- Added `handleGenerateAIReview()` function that:
  - Calls OpenAI API with product name and selected locale
  - Extracts rating automatically
  - Updates ReactQuillWrapper with generated HTML
  - Shows success/error messages (bilingual)
- New UI elements:
  - **"✨ AI Review"** button (purple) - triggers AI generation
  - **"জমা দিন" / "Submit Translation"** button (blue) - submits the review
  - Error message display below form
  - Loading state with spinner animation

## HTML Template Structure

The generated reviews follow this structure (from `review-template.go`):

```html
<article class="[product-name]-review review-section">
  <header>
    <h1>Product Name: Brief Description</h1>
    <p class="rating"><strong>Overall Rating: X.XX/5 ⭐</strong></p>
  </header>

  <section class="executive-summary">
    <h2>Executive Summary</h2>
    <p>Brief overview of the product...</p>
  </section>

  <section class="network-quality">
    <h2>Key Features & Specifications</h2>
    <p>Detailed specifications...</p>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
    </ul>
  </section>

  <section class="pros">
    <h2>Pros (4 Main Advantages)</h2>
    <ul>
      <li><strong>Advantage 1</strong></li>
      <li><strong>Advantage 2</strong></li>
    </ul>
  </section>

  <section class="cons">
    <h2>Cons (8-10 Main Limitations)</h2>
    <ul>
      <li><strong>Limitation 1</strong></li>
      <li><strong>Limitation 2</strong></li>
    </ul>
  </section>

  <section class="verdict">
    <h2>Verdict</h2>
    <p>Final recommendation...</p>
  </section>
</article>
```

## Environment Setup Required

Add to your `.env.local`:
```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

**Note:** The `NEXT_PUBLIC_` prefix exposes this to the browser (for development/demo). For production, consider using a backend API proxy.

## Workflow

1. **User navigates to review form** for a specific product
2. **User selects language** (English or Bengali)
3. **User clicks "✨ AI Review"** button
4. System:
   - Shows loading state with spinner
   - Calls `generateAIReview()` with product name and locale
   - Extracts rating from generated content
   - Updates ReactQuillWrapper with formatted HTML
   - Shows success message
5. **User can edit** the AI-generated review if needed
6. **User clicks "Submit Translation"** to save the review

## Features Supported

✅ Bilingual support (English & Bengali)
✅ Automatic rating extraction
✅ HTML formatting with semantic structure
✅ Error handling with user-friendly messages
✅ Loading states and animations
✅ Integrates seamlessly with existing ReactQuillWrapper
✅ Follows existing template structure

## Future Enhancements

1. **Product Context Enhancement**
   - Add product category parameter to `generateAIReview()`
   - Include specifications/features in AI prompt
   - Reference competitor reviews if available

2. **Rating Refinement**
   - Implement rating scale selection (1-5, 1-10, etc.)
   - Custom rating extraction based on product type
   - Allow manual rating override before submission

3. **Template Customization**
   - Create different review templates by product category
   - Support different review formats (short/long form)
   - Add industry-specific sections

4. **Backend Integration**
   - Move OpenAI API calls to backend for security
   - Implement caching to reduce API costs
   - Add review history and versioning

5. **Quality Control**
   - Add review preview with edit capabilities
   - Implement plagiarism detection
   - Add fact-checking for specifications
   - User rating/feedback on AI-generated reviews

## Dependencies

- `openai@^4.76.1` - Already installed in `package.json`
- `ReactQuillWrapper` - For rich text editing
- `React 19.1.1` with hooks support

## Testing the Integration

1. Ensure `NEXT_PUBLIC_OPENAI_API_KEY` is set
2. Navigate to admin review form
3. Select a product and locale
4. Click "✨ AI Review" button
5. Wait for generation to complete
6. Review the generated content in the editor
7. Submit using the "Submit Translation" button

## File Locations Reference

- **Service:** `d:\GO\gocrit\crit_client\src\lib\openai-service.ts`
- **Component:** `d:\GO\gocrit\crit_client\src\app\components\admin\reviews\ReviewTransForm.tsx`
- **Template Reference:** `d:\GO\gocrit\gocrit_server\internal\infrastructure\database\migrations\review-template.go`
- **Config:** `.env.local` (create if not exists)

## Troubleshooting

### "API key not found" error
- Verify `NEXT_PUBLIC_OPENAI_API_KEY` is set in `.env.local`
- Restart dev server after adding environment variable

### "Rate limit exceeded"
- OpenAI API has rate limits on free tier
- Wait a few minutes before trying again
- Consider upgrading OpenAI plan for production

### Review content not appearing
- Check browser console for errors
- Verify ReactQuillWrapper is properly initialized
- Check if HTML content is too long (may hit token limits)

### Wrong locale content
- Ensure correct locale is selected before clicking AI Review
- System uses the currently selected locale for generation

## References

- OpenAI API Docs: https://platform.openai.com/docs/
- Claude Models: https://www.anthropic.com/
- React Quill: https://quilljs.com/
- Tailwind CSS: https://tailwindcss.com/
