"use client";

import Link from 'next/link';
import { Smartphone, Car, Building2, Laptop, Home as HomeIcon, Zap, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CategoryNavigationProps {
  countryCode: string;
}

const CategoryNavigation = ({ countryCode }: CategoryNavigationProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categories = [
    {
      name: countryCode === 'en' ? 'Mobile Phones' : 'মোবাইল ফোন',
      slug: 'mobile-phones',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: countryCode === 'en' ? 'Cars' : 'গাড়ি',
      slug: 'cars',
      icon: Car,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
    },
    {
      name: countryCode === 'en' ? 'Banking' : 'ব্যাংকিং',
      slug: 'banking',
      icon: Building2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      name: countryCode === 'en' ? 'Laptops' : 'ল্যাপটপ',
      slug: 'laptops',
      icon: Laptop,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      name: countryCode === 'en' ? 'Home Appliances' : 'গৃহস্থালী যন্ত্র',
      slug: 'home-appliances',
      icon: HomeIcon,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
    {
      name: countryCode === 'en' ? 'Electronics' : 'ইলেকট্রনিক্স',
      slug: 'electronics',
      icon: Zap,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
            {countryCode === 'en' ? 'Browse by Category' : 'ক্যাটাগরি অনুযায়ী ব্রাউজ করুন'}
          </h3>
          <p className="text-gray-600 mt-2 ml-5">
            {countryCode === 'en' ? 'Find the perfect product for your needs' : 'আপনার প্রয়োজনের জন্য নিখুঁত পণ্য খুঁজুন'}
          </p>
        </div>

        <Link
          href={`/${countryCode}/categories`}
          className="hidden md:flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold group"
        >
          <span>{countryCode === 'en' ? 'View All' : 'সব দেখুন'}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug}
              href={`/${countryCode}?category=${category.slug}`}
              className={`group relative ${category.bgColor} hover:shadow-xl rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-transparent overflow-hidden`}
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Category Name */}
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-sm leading-tight">
                  {category.name}
                </h4>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-purple-600" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile View All Button */}
      <div className="md:hidden mt-6">
        <Link
          href={`/${countryCode}/categories`}
          className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-semibold w-full py-3 bg-purple-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all"
        >
          <span>{countryCode === 'en' ? 'View All Categories' : 'সব ক্যাটাগরি দেখুন'}</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default CategoryNavigation;
