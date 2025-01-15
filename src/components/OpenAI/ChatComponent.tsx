'use client';
import { useState } from 'react';

const ChatComponent = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I assist you today?' },
    ]);
    const [userInput, setUserInput] = useState('show now');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInput.trim()) return;

        const updatedMessages = [
            ...messages,

            {
                role: "system",
                content:
                    "You are an expert in consumer electronics. Generate a comprehensive and structured report for a given smartphone model, including specifications, detailed features, pros, cons, use cases, pricing, and comparisons with similar devices in its category."
            },
            {
                role: "user",
                "content": "Provide a detailed review and specifications for Yamaha MT-15. Include specs, performance, design, features, use cases, pricing, pros/cons, and competitor comparisons. then review in html. then convert to bangla "
                // "content": "Provide a detailed review of the Walton XANON X90 smartphone including the following details: display size, resolution, aspect ratio, brightness, and protection type; processor details; storage options; camera specifications for both rear and front cameras, including additional features like night mode, portrait mode, and HDR; battery capacity and charging speed; connectivity options; security features; build quality; software features; and audio features. Also, include pros, cons, use cases, pricing, and compare with similar models. data fromat json. key in lower cse. then convert to bangla "

            }


        ];

        setMessages(updatedMessages); // Update UI with the user's input immediately
        setUserInput('');

        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessages([
                    ...updatedMessages,
                    { role: 'assistant', content: data.result },
                ]);
            } else {
                setMessages([
                    ...updatedMessages,
                    { role: 'assistant', content: `Error: ${data.error}` },
                ]);
            }
        } catch (error) {
            console.error('Something went wrong:', error);
            setMessages([
                ...updatedMessages,
                { role: 'assistant', content: 'Something went wrong. Please try again.' },
            ]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    OpenAI Chat
                </h1>
                <div className="flex flex-col space-y-4 mb-6">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg ${msg.role === 'user'
                                ? 'bg-blue-100 text-right self-end'
                                : 'bg-gray-100 text-left self-start'
                                }`}
                        >
                            <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <textarea
                        className="w-full p-4 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;
