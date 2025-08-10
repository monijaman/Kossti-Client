// Test component to verify Tailwind CSS is working

const TailwindTest = () => {
    return (
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-2">Tailwind CSS Test</h1>
            <p className="text-sm">If you can see this styled properly, Tailwind is working!</p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2 transition-colors">
                Test Button
            </button>
        </div>
    );
};

export default TailwindTest;