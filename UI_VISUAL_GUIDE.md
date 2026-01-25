# UI Preview & Visual Guide

## Review Form Layout

```
┌─────────────────────────────────────────────────────────┐
│  Submit a Review for [Product Name]                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [ EN ]  [ BN ]         ← Language selector             │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Rating (0 to 5)                                        │
│  ┌─────────────────────────────────────┐                │
│  │ [input field for rating]            │                │
│  └─────────────────────────────────────┘                │
│                                                          │
│  Review (EN)                                            │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │        [ReactQuill Editor Area]                │    │
│  │     (Rich text with formatting tools)          │    │
│  │                                                 │    │
│  │                                                 │    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Additional Details                                     │
│  ┌─────────────────────────────────────┐                │
│  │ [Add details, links, etc.]          │                │
│  └─────────────────────────────────────┘                │
│                                                          │
│                 🔴 ERROR (if any)                       │
│  ┌─────────────────────────────────────┐                │
│  │ Failed to generate: [error message] │  ← Optional    │
│  └─────────────────────────────────────┘                │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  ✨ AI Review    │  │  📝 Submit        │             │
│  │  (Purple)       │  │  (Blue)          │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
│  ✅ Success message (if generated)                      │
│  ┌─────────────────────────────────────┐                │
│  │ AI review generated successfully    │  ← Transient   │
│  └─────────────────────────────────────┘                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Button States

### Normal State
```
┌──────────────────┐  ┌──────────────────┐
│  ✨ AI Review    │  │  📝 Submit       │
│                  │  │                  │
│ bg: purple-500   │  │ bg: blue-500     │
│ hover: purple-600│  │ hover: blue-600  │
└──────────────────┘  └──────────────────┘
```

### Loading State
```
┌──────────────────────────┐
│  ⏳ Generating...        │
│                          │
│ bg: gray-400             │
│ cursor: not-allowed      │
│ (disabled)               │
└──────────────────────────┘
```

## Message Display

### Success Message (Auto-hides after 3s)
```
┌─────────────────────────────────────────┐
│ ✅ AI review generated successfully     │
│    (or বাংলা text in Bengali mode)     │
└─────────────────────────────────────────┘
```

### Error Message (Auto-hides after 5s)
```
┌─────────────────────────────────────────┐
│ ❌ Failed to generate AI review:        │
│    [Detailed error message]             │
└─────────────────────────────────────────┘
```

## Workflow Visual

```
                    ┌──────────────────┐
                    │   User Opens     │
                    │  Review Form     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Select Language │
                    │   EN  or  BN     │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
       ┌──────▼────────┐          ┌────────▼──────┐
       │ Click Manual  │          │ Click AI      │
       │ Entry         │          │ Review        │
       └──────┬────────┘          └────────┬──────┘
              │                           │
              │                    ┌──────▼─────┐
              │                    │   Loading   │
              │                    │   State     │
              │                    └──────┬──────┘
              │                           │
              │                    ┌──────▼──────────┐
              │                    │ OpenAI API Call │
              │                    │ (5-10 seconds)  │
              │                    └──────┬──────────┘
              │                           │
              │                    ┌──────▼──────┐
              │                    │  Content    │
              │                    │  Populated  │
              │                    │  in Editor  │
              │                    └──────┬──────┘
              │                           │
              └──────────────┬────────────┘
                             │
                    ┌────────▼──────────┐
                    │  User can Edit    │
                    │  Content          │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │  Click Submit     │
                    │  Translation      │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │  Review Saved     │
                    │  to Database      │
                    └───────────────────┘
```

## English vs Bengali UI

### English Mode (EN)
```
Rating (0 to 5)
Review (EN)
Additional Details

[✨ AI Review]  [📝 Submit Translation]

AI review generated successfully
Failed to generate AI review: [error]
```

### Bengali Mode (BN)
```
রেটিং (০ থেকে ৫)
পর্যালোচনা (BN)
অতিরিক্ত বিস্তারিত

[✨ এআই পর্যালোচনা]  [📝 জমা দিন]

এআই দ্বারা পর্যালোচনা তৈরি সম্পন্ন হয়েছে
এআই পর্যালোচনা তৈরি ব্যর্থ: [error]
```

## Integration Points

```
ReviewTransForm.tsx
├── States
│   ├── selectedTranslation ──────┐
│   ├── selectedLocale ────────────┤──→ ReactQuillWrapper
│   ├── ratingInput ───────────────┤
│   ├── additionalDetails ────────┘
│   ├── aiLoading (NEW)
│   └── aiError (NEW)
│
├── Functions
│   ├── handleGenerateAIReview() (NEW)
│   │   ├── Calls generateAIReview()
│   │   ├── Extracts rating
│   │   └── Updates selectedTranslation
│   │
│   ├── handleSubmit()
│   │   └── Calls addReviewTranslation()
│   │
│   └── convertToEnglishNumber()
│
└── UI Components
    ├── Language Selector
    ├── Rating Input
    ├── ReactQuillWrapper (Editor)
    ├── AdditionalDetailsForm
    ├── Error Display (NEW)
    └── Button Group (NEW)
        ├── AI Review Button (NEW)
        └── Submit Translation Button
```

## Data Flow

```
User Input
    │
    ├─→ [Product Name from props]
    ├─→ [Selected Locale]
    └─→ [Click AI Review Button]
        │
        ▼
   generateAIReview()
        │
        ├─→ API Key (from env)
        ├─→ OpenAI API
        └─→ Chat Completions endpoint
            │
            ▼
        GPT Response (HTML string)
            │
            ├─→ extractRatingFromReview()
            │   └─→ Rating number
            │
            └─→ setSelectedTranslation()
                └─→ Updates form state
                    │
                    ▼
                ReactQuillWrapper
                    │
                    ▼
            User sees content in editor
                    │
                    ▼
              User can edit/submit
```

## Component Hierarchy

```
ReviewTransForm
├── Header (h2)
├── Locale Selector (button group)
│   ├── Button [EN]
│   └── Button [BN]
├── Form Content (conditional on selectedLocale)
│   ├── Rating Input
│   │   └── input[type="text"]
│   ├── Review Editor
│   │   └── ReactQuillWrapper
│   │       └── ReactQuill
│   ├── Additional Details
│   │   └── AdditionalDetailsForm
│   ├── Error Message (NEW)
│   │   └── div.bg-red-100
│   └── Button Group (NEW)
│       ├── AI Review Button
│       │   └── button[type="button"]
│       └── Submit Translation Button
│           └── button[type="submit"]
├── Success Message
│   └── div.text-green-700
└── Error Message
    └── div.text-red-600
```

## Styling Classes

### AI Review Button
- **Normal:** `bg-purple-500 hover:bg-purple-600 text-white`
- **Loading:** `bg-gray-400 cursor-not-allowed text-white`
- **Common:** `py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out`

### Error Display
- **Container:** `p-3 mb-4 text-sm rounded-lg bg-red-100 text-red-700 border border-red-300`

### Success Message
- **Container:** `p-4 mb-4 text-sm rounded-lg bg-green-100 text-green-700`

## Responsive Design

```
Desktop (>768px)
├─ Buttons side-by-side
│  [✨ AI Review]  [📝 Submit]
└─ Full-width editor

Mobile (<768px)
├─ Buttons stacked (flex-wrap)
│  [✨ AI Review]
│  [📝 Submit]
└─ Full-width editor
```

---

This visual guide helps understand:
- User interface layout
- Component states
- Data flow
- Integration points
- Responsive behavior
