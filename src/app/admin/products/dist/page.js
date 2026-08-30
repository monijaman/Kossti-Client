"use client";
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
var index_1 = require("@/app/components/Pagination/index");
var ProducDetails_1 = require("@/app/components/admin/ProducDetails");
var constants_1 = require("@/lib/constants");
var fetchApi_1 = require("@/lib/fetchApi");
var useDebounce_1 = require("@/lib/useDebounce");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var DarkSelect_1 = require("@/components/DarkSelect");
var ManageReviews = function () {
    var searchParams = navigation_1.useSearchParams();
    var router = navigation_1.useRouter();
    var page = parseInt(searchParams.get('page') || '1', 10);
    var _a = react_1.useState(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = react_1.useState([]), categories = _b[0], setCategories = _b[1];
    var debouncedSearchTerm = useDebounce_1["default"]({ value: searchTerm, delay: 500 });
    var limit = 10;
    var activeCategory = searchParams.get('category') || '';
    var activeBrands = searchParams.get('brand') || '';
    var activePriceRange = searchParams.get('price') || '';
    var showInactive = searchParams.get('include_inactive') === 'true';
    var importedOnly = searchParams.get('imported') === 'true';
    var activeStatus = searchParams.get('status') || '';
    var activeSortBy = searchParams.get('sortby') || '';
    var visibleCategories = Array.isArray(categories)
        ? categories.filter(function (cat) { return showInactive || Number(cat.status) === 1; })
        : [];
    var locale = searchParams.get('locale') || 'en';
    var _c = react_1.useState([]), products = _c[0], setProducts = _c[1];
    var _d = react_1.useState(0), totalPage = _d[0], setTotalPage = _d[1];
    var _e = react_1.useState(activeCategory ? parseInt(activeCategory, 10) : null), selectedCategory = _e[0], setSelectedCategory = _e[1];
    // Fetch products data; re-run when paging, filters or debounced search term change
    react_1.useEffect(function () {
        var fetchProductData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var params, response, apiResponse, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = {
                            page: page,
                            limit: limit,
                            locale: locale
                        };
                        if (activeCategory)
                            params.category = activeCategory;
                        if (activeBrands)
                            params.brand = activeBrands;
                        if (activePriceRange)
                            params.priceRange = activePriceRange;
                        if (showInactive)
                            params.include_inactive = 'true';
                        if (importedOnly)
                            params.imported = 'true';
                        if (activeStatus)
                            params.status = activeStatus;
                        if (activeSortBy)
                            params.sortby = activeSortBy;
                        if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
                            params.search = debouncedSearchTerm.trim();
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetchApi_1["default"](constants_1.apiEndpoints.getProducts, {
                                method: 'GET',
                                queryParams: params
                            })];
                    case 2:
                        response = _b.sent();
                        if (response.success && response.data) {
                            apiResponse = response.data;
                            setTotalPage(Math.ceil(((_a = apiResponse.meta) === null || _a === void 0 ? void 0 : _a.total) / limit) || 0);
                            setProducts(apiResponse.data || []);
                        }
                        else {
                            setProducts([]);
                            setTotalPage(0);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Error fetching products:', error_1);
                        setProducts([]);
                        setTotalPage(0);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchProductData();
    }, [page, debouncedSearchTerm, activeCategory, activeBrands, activePriceRange, locale, showInactive, importedOnly, activeStatus, activeSortBy]);
    var handleSearchChange = function (e) {
        setSearchTerm(e.target.value);
        var params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        router.replace("?" + params.toString());
    };
    // Fetch categories. The backend caps `limit` at 100 per request
    // regardless of what's asked for, so a single fetch silently drops
    // categories beyond the first page - page through until a short
    // (non-full) page comes back.
    var fetchCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var pageSize, offset, allCategories, response, apiResponse, batch, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    pageSize = 100;
                    offset = 0;
                    allCategories = [];
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetchApi_1["default"](constants_1.apiEndpoints.Categories + "?limit=" + pageSize + "&offset=" + offset)];
                case 2:
                    response = _a.sent();
                    apiResponse = response;
                    if (!apiResponse.success) {
                        console.error("Failed to fetch categories.");
                        return [3 /*break*/, 3];
                    }
                    batch = apiResponse.data.categories || [];
                    allCategories = allCategories.concat(batch);
                    if (batch.length < pageSize)
                        return [3 /*break*/, 3];
                    offset += pageSize;
                    return [3 /*break*/, 1];
                case 3:
                    setCategories(allCategories);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error fetching categories:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Function to handle category selection
    var handleCategoryChange = function (selectedOption) {
        if (selectedOption) {
            var categoryId = selectedOption.value;
            setSelectedCategory(categoryId);
            // Update URL with the selected category
            var params = new URLSearchParams(searchParams.toString());
            params.set('category', categoryId.toString());
            params.set('page', '1'); // Reset to page 1 when category changes
            router.push("?" + params.toString());
        }
        else {
            setSelectedCategory(null);
            // Remove category from URL
            var params = new URLSearchParams(searchParams.toString());
            params["delete"]('category');
            params.set('page', '1');
            router.push("?" + params.toString());
        }
    };
    var handleInactiveChange = function (checked) {
        var params = new URLSearchParams(searchParams.toString());
        if (checked)
            params.set('include_inactive', 'true');
        else
            params["delete"]('include_inactive');
        params.set('page', '1');
        router.push("?" + params.toString());
    };
    var handleImportedChange = function (checked) {
        var params = new URLSearchParams(searchParams.toString());
        if (checked)
            params.set('imported', 'true');
        else
            params["delete"]('imported');
        params.set('page', '1');
        router.push("?" + params.toString());
    };
    var handleStatusChange = function (selectedOption) {
        var params = new URLSearchParams(searchParams.toString());
        if (selectedOption && selectedOption.value)
            params.set('status', selectedOption.value);
        else
            params["delete"]('status');
        params.set('page', '1');
        router.push("?" + params.toString());
    };
    var handleSortByChange = function (selectedOption) {
        var params = new URLSearchParams(searchParams.toString());
        if (selectedOption && selectedOption.value)
            params.set('sortby', selectedOption.value);
        else
            params["delete"]('sortby');
        params.set('page', '1');
        router.push("?" + params.toString());
    };
    var statusOptions = [
        { value: '', label: 'All statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'all', label: 'Active + Inactive' },
    ];
    var sortByOptions = [
        { value: '', label: 'Default' },
        { value: 'priority', label: 'Priority' },
        { value: 'popular', label: 'Most popular (views)' },
        { value: 'rating', label: 'Highest rated' },
        { value: 'newest', label: 'Newest' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
    ];
    react_1.useEffect(function () {
        fetchCategories();
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("h2", { className: "text-2xl font-bold mb-4" }, " Products"),
        React.createElement(link_1["default"], { className: 'bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2', href: "/admin/createproduct" }, "Add New Product"),
        React.createElement("div", { className: 'py-4' },
            React.createElement("input", { type: "text", value: searchTerm, onChange: handleSearchChange, placeholder: "Search products...", className: "border border-gray-300 dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" })),
        React.createElement("div", null,
            React.createElement("div", { className: "mb-3 flex flex-wrap items-center justify-end gap-x-8 gap-y-2" },
                React.createElement("label", { className: "flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300" },
                    React.createElement("input", { type: "checkbox", checked: showInactive, onChange: function (e) { return handleInactiveChange(e.target.checked); }, className: "h-4 w-4 rounded border-gray-300" }),
                    "Show inactive categories"),
                React.createElement("label", { className: "flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300" },
                    React.createElement("input", { type: "checkbox", checked: importedOnly, onChange: function (e) { return handleImportedChange(e.target.checked); }, className: "h-4 w-4 rounded border-gray-300" }),
                    "Imported products only")),
            React.createElement("div", { className: "grid grid-cols-1 gap-2 md:grid-cols-3" },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("label", { htmlFor: "category", className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Category"),
                    React.createElement(DarkSelect_1["default"], { name: "category", value: Array.isArray(categories) && categories
                            .filter(function (cat) { return showInactive || Number(cat.status) === 1; })
                            .map(function (cat) { return ({
                            value: cat.id,
                            label: cat.name
                        }); })
                            .find(function (option) { return option.value === selectedCategory; }) || null, onChange: handleCategoryChange, options: visibleCategories
                            .map(function (cat) { return ({
                            value: cat.id,
                            label: cat.name
                        }); }), className: "block w-full", placeholder: "Select a category", isSearchable: true, isClearable: true })),
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Status"),
                    React.createElement(DarkSelect_1["default"], { name: "status", value: statusOptions.find(function (option) { return option.value === activeStatus; }) || statusOptions[0], onChange: handleStatusChange, options: statusOptions, className: "block w-full", placeholder: "Filter by status" })),
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("label", { htmlFor: "sortby", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Sort By"),
                    React.createElement(DarkSelect_1["default"], { name: "sortby", value: sortByOptions.find(function (option) { return option.value === activeSortBy; }) || sortByOptions[0], onChange: handleSortByChange, options: sortByOptions, className: "block w-full", placeholder: "Sort by" })))),
        React.createElement(ProducDetails_1["default"], { products: products, countryCode: 'en' }),
        React.createElement(index_1["default"], { currentPage: page, totalPages: totalPage, additionalParams: (debouncedSearchTerm === null || debouncedSearchTerm === void 0 ? void 0 : debouncedSearchTerm.trim()) ? { search: debouncedSearchTerm.trim() } : {} })));
};
exports["default"] = ManageReviews;
