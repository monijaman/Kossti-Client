"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var LanguageSwitcher_1 = require("../Language/LanguageSwitcher");
var AccountDropdown_1 = require("../ui/AccountDropdown");
var DarkModeToggle_1 = require("../ui/DarkModeToggle");
var Sidebar_1 = require("../ui/Sidebar/Sidebar");
var MainLayout = function (_a) {
    var children = _a.children, sidebarProps = _a.sidebarProps, _b = _a.isAuthenticated, isAuthenticated = _b === void 0 ? false : _b, heroContent = _a.heroContent;
    var locale = (sidebarProps === null || sidebarProps === void 0 ? void 0 : sidebarProps.countryCode) || 'bn';
    var isBangla = locale === 'bn';
    var withLocale = function (path) { return "/" + locale + path; };
    return (React.createElement("div", { className: "min-h-screen flex flex-col mx-auto bg-transparent", suppressHydrationWarning: true },
        React.createElement("header", { className: "bg-gray-200 text-white px-2 md:px-4 py-2 md:py-3 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2 md:gap-4 relative z-40 overflow-visible" },
            React.createElement(link_1["default"], { href: withLocale(''), suppressHydrationWarning: true, className: "flex-shrink-0 dark:bg-white dark:rounded-lg dark:px-2 dark:py-1" },
                React.createElement(image_1["default"], { src: "/logo.png", alt: "Kosti", style: {
                        width: "auto",
                        height: "80px"
                    }, width: 500, height: 170, className: "rounded w-auto" })),
            React.createElement("div", { className: "w-full md:w-auto md:ml-auto flex flex-row items-center justify-end gap-2 md:gap-4 relative z-50 overflow-visible" },
                React.createElement(AccountDropdown_1["default"], { isAuthenticated: isAuthenticated }),
                React.createElement(DarkModeToggle_1["default"], null),
                React.createElement(LanguageSwitcher_1["default"], { currentLocale: locale }))),
        heroContent && (React.createElement("div", { className: "w-full" }, heroContent)),
        React.createElement("div", { className: "flex flex-col md:flex-row flex-grow bg-transparent" },
            React.createElement(Sidebar_1["default"], __assign({}, sidebarProps)),
            React.createElement("main", { className: "flex-1 bg-gray-100 p-3 md:p-4 lg:p-6" }, children)),
        React.createElement("footer", { className: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4 border-t-4 border-blue-600" },
            React.createElement("div", { className: "max-w-7xl mx-auto" },
                React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" },
                    React.createElement("div", { className: "space-y-4" },
                        React.createElement("div", { className: "flex items-center space-x-2" },
                            React.createElement("div", { className: "bg-blue-600 p-2 rounded-lg" },
                                React.createElement("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }))),
                            React.createElement("h3", { className: "text-xl font-bold" }, "Kossti")),
                        React.createElement("p", { className: "text-gray-300 text-sm leading-relaxed" }, isBangla ? 'বিশ্বস্ত পণ্য রিভিউ ও তুলনার মাধ্যমে সঠিক সিদ্ধান্ত নেওয়া সহজ করি।' : 'Your trusted source for honest, detailed product reviews and comparisons. Making informed decisions easier.'),
                        React.createElement("div", { className: "flex space-x-3 pt-2" },
                            React.createElement("a", { href: "https://www.facebook.com/profile.php?id=61572569735552", className: "bg-gray-700 hover:bg-blue-600 p-2 rounded-lg transition-colors", "aria-label": "Facebook" },
                                React.createElement("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24" },
                                    React.createElement("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }))))),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-lg font-bold mb-4 text-white flex items-center" },
                            React.createElement("span", { className: "bg-blue-600 w-1 h-6 mr-2 rounded" }),
                            isBangla ? 'দ্রুত লিংক' : 'Quick Links'),
                        React.createElement("ul", { className: "space-y-3" },
                            React.createElement("li", null,
                                React.createElement(link_1["default"], { href: withLocale(''), className: "text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group" },
                                    React.createElement("svg", { className: "w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
                                    isBangla ? 'হোম' : 'Home')),
                            React.createElement("li", null,
                                React.createElement(link_1["default"], { href: withLocale('/about'), className: "text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group" },
                                    React.createElement("svg", { className: "w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
                                    isBangla ? 'আমাদের সম্পর্কে' : 'About Us')),
                            React.createElement("li", null,
                                React.createElement(link_1["default"], { href: withLocale('/contact'), className: "text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group" },
                                    React.createElement("svg", { className: "w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
                                    isBangla ? 'যোগাযোগ' : 'Contact')),
                            React.createElement("li", null,
                                React.createElement(link_1["default"], { href: withLocale('/disclaimer'), className: "text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group" },
                                    React.createElement("svg", { className: "w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
                                    isBangla ? 'দায়মুক্তি' : 'Disclaimer')))),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-lg font-bold mb-4 text-white flex items-center" },
                            React.createElement("span", { className: "bg-blue-600 w-1 h-6 mr-2 rounded" }),
                            isBangla ? 'আইনি তথ্য' : 'Legal'),
                        React.createElement("ul", { className: "space-y-3" },
                            React.createElement("li", null,
                                React.createElement(link_1["default"], { href: withLocale('/privacy-policy'), className: "text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group" },
                                    React.createElement("svg", { className: "w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
                                    isBangla ? 'গোপনীয়তা নীতি' : 'Privacy Policy')),
                            React.createElement("li", null,
                                React.createElement(link_1["default"], { href: withLocale('/terms'), className: "text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group" },
                                    React.createElement("svg", { className: "w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
                                    isBangla ? 'সেবার শর্তাবলি' : 'Terms of Service')),
                            React.createElement("li", null,
                                React.createElement(link_1["default"], { href: withLocale('/editorial-policy'), className: "text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group" },
                                    React.createElement("svg", { className: "w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
                                    isBangla ? 'সম্পাদকীয় নীতি' : 'Editorial Policy')),
                            React.createElement("li", { className: "pt-4 border-t border-gray-700" },
                                React.createElement("div", { className: "flex items-center space-x-2 text-xs text-gray-400" },
                                    React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })),
                                    React.createElement("span", null, isBangla ? 'আপনার তথ্য সুরক্ষিত' : 'Your data is protected'))))),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-lg font-bold mb-4 text-white flex items-center" },
                            React.createElement("span", { className: "bg-blue-600 w-1 h-6 mr-2 rounded" }),
                            "Get in Touch"),
                        React.createElement(link_1["default"], { href: "/en/contact", className: "inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500" }, "Contact Us"))),
                React.createElement("div", { className: "border-t border-gray-700 pt-6 mt-6" },
                    React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0" },
                        React.createElement("p", { className: "text-sm text-gray-400 text-center md:text-left" },
                            "\u00A9 2026 ",
                            React.createElement("span", { className: "text-white font-semibold" }, "Kossti"),
                            ". ",
                            isBangla ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'),
                        React.createElement("div", { className: "flex items-center space-x-2 text-sm text-gray-400" },
                            React.createElement("span", null, isBangla ? 'ভালোবাসায় তৈরি' : 'Crafted with'),
                            React.createElement("svg", { className: "w-4 h-4 text-red-500 animate-pulse", fill: "currentColor", viewBox: "0 0 20 20" },
                                React.createElement("path", { fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd" })),
                            React.createElement("span", null, isBangla ? 'দ্বারা' : 'by'),
                            React.createElement("span", { className: "text-blue-400 font-medium" }, "Monir"))))))));
};
exports["default"] = MainLayout;
