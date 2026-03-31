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
