export default function TestTailwind() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-blue-600 mb-8">Tailwind Test Page</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Color Test */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Colors</h2>
                        <div className="space-y-2">
                            <div className="bg-red-500 h-8 rounded"></div>
                            <div className="bg-blue-500 h-8 rounded"></div>
                            <div className="bg-green-500 h-8 rounded"></div>
                            <div className="bg-yellow-500 h-8 rounded"></div>
                            <div className="bg-purple-500 h-8 rounded"></div>
                        </div>
                    </div>

                    {/* Spacing Test */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Spacing</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-200 p-2 rounded">p-2</div>
                            <div className="bg-gray-200 p-4 rounded">p-4</div>
                            <div className="bg-gray-200 p-6 rounded">p-6</div>
                            <div className="bg-gray-200 m-4 p-2 rounded">m-4</div>
                        </div>
                    </div>

                    {/* Interactive Test */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive</h2>
                        <div className="space-y-4">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                                Hover Me
                            </button>
                            <div className="bg-gray-100 hover:bg-gray-200 p-3 rounded cursor-pointer transition-colors">
                                Hover Box
                            </div>
                            <div className="transform hover:scale-105 transition-transform bg-green-100 p-3 rounded">
                                Scale on Hover
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg text-white">
                    <h3 className="text-2xl font-bold">Gradient Background</h3>
                    <p className="mt-2">If you can see this gradient and all colors above, Tailwind is working perfectly!</p>
                </div>
            </div>
        </div>
    );
}
