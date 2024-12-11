'use client'
import { useState } from 'react';

const ChatComponent = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            if (res.ok) {
                setResponse(data.result);
            } else {
                setResponse(`Error: ${data.error}`);
            }
        } catch (error) {
            console.log(error)
            setResponse('Something went wrong');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    OpenAI Chat
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <textarea
                        className="w-full p-4 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Generate
                    </button>
                </form>
                {response && (
                    <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                        <h2 className="text-lg font-medium text-gray-700 mb-2">Response:</h2>
                        <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatComponent;
