'use client';
"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var react_1 = require("react");
function ProductImageGallery(_a) {
    var productImages = _a.productImages, productName = _a.productName;
    var _b = react_1.useState(productImages[0] || '/noimage.webp'), selectedImage = _b[0], setSelectedImage = _b[1];
    return (React.createElement("div", { className: "w-full  flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-12" },
        React.createElement("div", { className: "w-full md:w-[50%] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-4 md:p-8 relative overflow-hidden flex-shrink-0", style: { minHeight: '300px', height: '70vw', maxHeight: '800px', minWidth: 0 } },
            React.createElement(image_1["default"], { src: selectedImage, alt: productName, fill: true, priority: true, className: "object-contain" })),
        React.createElement("div", { className: "w-full md:w-[50%] flex items-center justify-center overflow-x-auto md:overflow-x-hidden md:overflow-y-auto", style: { maxHeight: '800px' } },
            React.createElement("div", { className: "flex flex-row flex-wrap justify-center content-start gap-0" }, productImages.map(function (img, index) { return (React.createElement("button", { key: index, onClick: function () { return setSelectedImage(img); }, className: "w-[250vw] h-[30vw] md:w-[44%] md:h-auto aspect-square flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all cursor-pointer hover:border-blue-400 " + (selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'), style: { minWidth: '180px', maxHeight: '120px' } },
                React.createElement("div", { className: "relative w-full h-full bg-gray-50" },
                    React.createElement(image_1["default"], { src: img, alt: productName + " " + (index + 1), fill: true, loading: "eager", className: "object-contain p-1" })))); })))));
}
exports["default"] = ProductImageGallery;
