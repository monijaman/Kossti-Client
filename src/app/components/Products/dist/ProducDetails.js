"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var SpecDetails_1 = require("@/app/components/Products/SpecDetails");
var ProductReviewsSection_1 = require("@/app/components/reviews/ProductReviewsSection");
var ProductFeedbackSection_1 = require("@/app/components/reviews/ProductFeedbackSection");
var ProductImageGallery_1 = require("@/app/components/Products/ProductImageGallery");
var useLocale_1 = require("@/hooks/useLocale");
var constants_1 = require("@/lib/constants");
var fetchApi_1 = require("@/lib/fetchApi");
var react_1 = require("react");
function ProducDetails(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var product = _a.product, _j = _a.countryCode, countryCode = _j === void 0 ? 'en' : _j;
    return __awaiter(this, void 0, void 0, function () {
        var quickSpecs, specsLoading, response, _k, photos, response, _l, displayName, productImages, t;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    quickSpecs = [];
                    specsLoading = false;
                    _m.label = 1;
                case 1:
                    _m.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchApi_1["default"](constants_1.apiEndpoints.getPublicSpecs(product.id), {
                            queryParams: { locale: countryCode },
                            // This endpoint returns expiring S3 URLs; never reuse an old response.
                            next: { revalidate: 0 }
                        })];
                case 2:
                    response = _m.sent();
                    if (response.success && ((_b = response.data) === null || _b === void 0 ? void 0 : _b.dataset)) {
                        quickSpecs = response.data.dataset.slice(0, 6);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _k = _m.sent();
                    return [3 /*break*/, 4];
                case 4:
                    photos = [];
                    _m.label = 5;
                case 5:
                    _m.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fetchApi_1["default"]("/productimages/" + product.id, {
                            next: { revalidate: 60 }
                        })];
                case 6:
                    response = _m.sent();
                    if (response.success && ((_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.images) === null || _d === void 0 ? void 0 : _d.length)) {
                        photos = response.data.images;
                    }
                    return [3 /*break*/, 8];
                case 7:
                    _l = _m.sent();
                    return [3 /*break*/, 8];
                case 8:
                    displayName = product.translated_name ||
                        (countryCode !== 'en'
                            ? (_f = (_e = product.translations) === null || _e === void 0 ? void 0 : _e.find(function (tr) { return tr.locale === countryCode; })) === null || _f === void 0 ? void 0 : _f.translated_name : undefined) ||
                        product.name;
                    productImages = photos.length > 0
                        ? photos.map(function (p) { return p.url || p.asset_url || product.photo || '/noimage.webp'; })
                        : [product.photo || '/noimage.webp'];
                    t = useLocale_1.useTranslation(countryCode);
                    return [2 /*return*/, (React.createElement("div", { className: "w-full mx-auto px-2 md:px-4 py-3 md:py-6" },
                            React.createElement("nav", { className: "text-xs md:text-sm mb-3 md:mb-6 text-gray-600 overflow-x-auto" },
                                React.createElement("span", null, t.nav_home || 'Home'),
                                React.createElement("span", { className: "mx-1 md:mx-2" }, "\u203A"),
                                React.createElement("span", null, countryCode === 'bn' && ((_g = product.brand) === null || _g === void 0 ? void 0 : _g.translated_name) ? product.brand.translated_name : (_h = product.brand) === null || _h === void 0 ? void 0 : _h.name),
                                React.createElement("span", { className: "mx-1 md:mx-2" }, "\u203A"),
                                React.createElement("span", { className: "text-gray-900 font-medium" }, displayName)),
                            React.createElement("h1", { className: "text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight" }, countryCode === 'bn' && product.translated_name ? product.translated_name : displayName),
                            product.description && product.description.trim().length > 0 && (React.createElement("p", { className: "text-gray-700 text-base leading-relaxed mb-6 md:mb-8 max-w-3xl" }, (countryCode !== 'en' && product.translated_description) ? product.translated_description : product.description)),
                            React.createElement(ProductImageGallery_1["default"], { key: product.id, productImages: productImages, productName: displayName }),
                            React.createElement("div", { className: "mt-8 md:mt-12" },
                                React.createElement("div", { className: "lg:col-span-3" },
                                    React.createElement("div", { className: "bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 mb-4 md:mb-6" },
                                        React.createElement("p", { className: "text-xs md:text-sm text-yellow-800" }, t.unofficial_specs || 'Unofficial specifications')),
                                    React.createElement("h2", { className: "text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6" }, t.label_specifications || 'Specifications'),
                                    React.createElement(react_1.Suspense, { fallback: React.createElement("div", { className: "space-y-2", "aria-hidden": "true" }, [1, 2, 3, 4, 5, 6].map(function (i) { return React.createElement("div", { key: i, className: "h-10 bg-gray-100 rounded animate-pulse" }); })) },
                                        React.createElement(SpecDetails_1["default"], { productId: product.id, countryCode: countryCode }))),
                                React.createElement("div", { className: "mt-8 border-t border-gray-200 pt-8 md:mt-12 md:pt-10" },
                                    React.createElement(react_1.Suspense, { fallback: React.createElement("div", { className: "my-8 space-y-3", "aria-hidden": "true" }, [1, 2, 3].map(function (i) { return React.createElement("div", { key: i, className: "h-24 bg-gray-100 rounded-lg animate-pulse" }); })) },
                                        React.createElement(ProductReviewsSection_1["default"], { productId: product.id, countryCode: countryCode }),
                                        React.createElement(ProductFeedbackSection_1["default"], { productId: product.id, locale: countryCode }))))))];
            }
        });
    });
}
exports["default"] = ProducDetails;
