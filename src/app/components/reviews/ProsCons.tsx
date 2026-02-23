const ProsCons = () => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pro and cons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pros */}
                <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white bg-green-600 px-4 py-2 rounded-t-lg -mx-6 -mt-6 mb-4">
                        Pros
                    </h3>
                    <div className="text-sm text-gray-700">
                        See detailed reviews below for pros
                    </div>
                </div>

                {/* Cons */}
                <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white bg-red-600 px-4 py-2 rounded-t-lg -mx-6 -mt-6 mb-4">
                        Cons
                    </h3>
                    <div className="text-sm text-gray-700">
                        See detailed reviews below for cons
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProsCons;
