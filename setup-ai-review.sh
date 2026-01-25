#!/bin/bash
# Quick Setup for AI Review Integration

echo "🚀 Setting up AI Review Integration..."

# 1. Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Other existing env variables should go here
EOF
    echo "✅ .env.local created - Add your OpenAI API key!"
else
    echo "✅ .env.local already exists"
fi

# 2. Verify files are in place
echo ""
echo "📋 Checking files..."

if [ -f "src/lib/openai-service.ts" ]; then
    echo "✅ openai-service.ts found"
else
    echo "❌ openai-service.ts NOT found"
fi

if grep -q "generateAIReview" "src/app/components/admin/reviews/ReviewTransForm.tsx"; then
    echo "✅ ReviewTransForm.tsx updated with AI Review"
else
    echo "❌ ReviewTransForm.tsx may not be updated"
fi

# 3. Check OpenAI package
if grep -q "openai" package.json; then
    echo "✅ OpenAI package detected in package.json"
else
    echo "⚠️  OpenAI package might not be installed"
fi

echo ""
echo "🎉 Setup check complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env.local"
echo "2. Restart the development server: npm run dev"
echo "3. Navigate to Admin > Reviews to test the AI Review button"
echo ""
echo "📚 Documentation: See AI_REVIEW_INTEGRATION.md for details"
