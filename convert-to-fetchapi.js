#!/usr/bin/env node
/**
 * Script to convert fetch calls to fetchApi in TypeScript files
 */

const fs = require('fs');
const path = require('path');

// Files to convert
const filesToConvert = [
    'src/hooks/useBrands.ts',
    'src/hooks/useProducts.ts',
    'src/hooks/useReviews.ts',
    'src/hooks/useSpecifications.ts',
    'src/hooks/useSpecificationsKeys.ts'
];

// Common replacements
const replacements = [
    // Add imports
    {
        from: /^(import.*?;)\n/m,
        to: '$1\nimport fetchApi from "@/lib/fetchApi";\nimport { apiEndpoints } from "@/lib/constants";\n'
    },

    // Remove environment variable usage
    {
        from: /const apiUrl = process\.env\.NEXT_PUBLIC_API_URL;\n?/g,
        to: ''
    },

    // Remove API URL checks
    {
        from: /\s*if \(!apiUrl\) \{\s*return Promise\.reject\(\s*new Error\("API URL is not defined in environment variables"\)\s*\);\s*\}\s*/g,
        to: ''
    },

    // Replace basic fetch with fetchApi
    {
        from: /const response = await fetch\("\/api\/post",\s*\{\s*method:\s*"POST",\s*headers:\s*\{\s*"Content-Type":\s*"application\/json",?\s*\},?\s*body:\s*JSON\.stringify\(([^)]+)\),?\s*\}\);/g,
        to: 'const response = await fetchApi(endpoint, {\n        method: "POST",\n        body: JSON.stringify($1),\n      });'
    },

    // Replace fullUrl patterns
    {
        from: /const fullUrl = `\$\{apiUrl\}\/([^`]+)`;\s*const response = await fetch\(fullUrl\);/g,
        to: 'const response = await fetchApi("/$1");'
    },

    // Replace response.json() calls
    {
        from: /const dataset = await response\.json\(\);/g,
        to: 'const dataset = response;'
    },

    // Replace response.ok checks
    {
        from: /if \(!response\.ok\) \{\s*throw new Error\([^}]+\}\s*/g,
        to: ''
    }
];

function convertFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if already has fetchApi import
        if (content.includes('import fetchApi')) {
            console.log(`${filePath} already has fetchApi import, skipping...`);
            return;
        }

        // Apply replacements
        replacements.forEach(({ from, to }) => {
            content = content.replace(from, to);
        });

        // Write back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Converted ${filePath}`);

    } catch (error) {
        console.error(`❌ Error converting ${filePath}:`, error.message);
    }
}

// Convert all files
filesToConvert.forEach(convertFile);

console.log('\n🎉 Conversion complete! Please review the files and make manual adjustments as needed.');
