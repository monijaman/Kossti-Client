'use client';

import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';

// Dynamically import ReactQuill from react-quill-new (React 18+ compatible)
const ReactQuill = dynamic(
    () => import('react-quill-new'),
    {
        ssr: false,
        loading: () => (
            <div className="react-quill-loading h-48 bg-gray-100 animate-pulse rounded flex items-center justify-center">
                <span>Loading editor...</span>
            </div>
        )
    }
);

interface ReactQuillWrapperProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    modules?: Record<string, unknown>;
    formats?: string[];
    theme?: string;
    allowHtmlSource?: boolean;
}

// Quill's Delta model only understands the tags/attributes listed in `defaultFormats`
// below. Any other markup (semantic containers, custom classes, tables, etc.) is
// silently dropped the moment it round-trips through the visual editor. AI-generated
// and hand-imported reviews are wrapped in tags like <article>/<section>/<div>, so once
// that HTML reaches the Quill view it gets stripped on the very next edit - this is what
// was cutting the <article> wrapper (and everything Quill couldn't represent) out of
// reviews on save. Detect that markup and keep such content in the raw HTML view instead
// of ever handing it to Quill, unless the user explicitly opts into the visual editor.
const UNSUPPORTED_HTML_RE = /<\/?(article|section|div|table|thead|tbody|tr|td|th|style|script|footer|header|nav|aside|figure|figcaption)\b/i;

// Create a wrapper that disables strict mode for ReactQuill
const ReactQuillWrapper = forwardRef<HTMLDivElement, ReactQuillWrapperProps>(
    ({ value, onChange, placeholder, className, id, style, modules, formats, theme = 'snow', allowHtmlSource = false }, ref) => {
        const [htmlSource, setHtmlSource] = React.useState(
            () => allowHtmlSource && UNSUPPORTED_HTML_RE.test(value || '')
        );
        // Once the user explicitly picks a view, stop auto-switching on their behalf.
        const userToggledRef = React.useRef(false);

        React.useEffect(() => {
            if (!allowHtmlSource || userToggledRef.current) return;
            if (UNSUPPORTED_HTML_RE.test(value || '')) {
                setHtmlSource(true);
            }
        }, [value, allowHtmlSource]);

        const toggleHtmlSource = () => {
            userToggledRef.current = true;
            setHtmlSource((current) => !current);
        };

        // Default modules for toolbar
        const defaultModules = {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ],
            ...modules
        };

        const defaultFormats = [
            'header',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background',
            'list',
            'align',
            'link', 'image',
            ...(formats || [])
        ];

        return (
            <div ref={ref} className="react-quill-wrapper">
                {allowHtmlSource && (
                    <button
                        type="button"
                        onClick={toggleHtmlSource}
                        className="mb-2 rounded border border-gray-300 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                    >
                        {htmlSource ? 'Visual Editor' : 'HTML'}
                    </button>
                )}
                {htmlSource ? (
                    <textarea
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder="Paste HTML review here..."
                        className="min-h-[240px] w-full rounded border border-gray-300 p-3 font-mono text-sm"
                        aria-label="Review HTML source"
                    />
                ) : (
                    <ReactQuill
                        theme={theme}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={className}
                        id={id}
                        style={style}
                        modules={defaultModules}
                        formats={defaultFormats}
                    />
                )}
            </div>
        );
    }
);

ReactQuillWrapper.displayName = 'ReactQuillWrapper';

export default ReactQuillWrapper;
