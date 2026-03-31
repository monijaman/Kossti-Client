# CSS Changes Not Reflecting - Troubleshooting Guide

## 🔧 **Quick Fixes:**

### 1. **Hard Refresh Browser:**

- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or open DevTools → Network tab → check "Disable cache"

### 2. **Restart Development Server:**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 3. **Clear Next.js Cache:**

```bash
rm -rf .next
npm run dev
```

### 4. **Check Browser DevTools:**

- Open F12 → Elements tab
- Check if Tailwind classes are applied
- Look for CSS errors in Console

## ✅ **Files Updated:**

- `globals.scss` - Added @tailwind imports
- `layout.tsx` - Updated to import globals.scss
- `[locale]/layout.tsx` - Updated import path

## 🧪 **Test:**

Try adding this to any component:

```jsx
<div className="bg-red-500 text-white p-4">Test Tailwind</div>
```

If this shows red background, Tailwind is working!
