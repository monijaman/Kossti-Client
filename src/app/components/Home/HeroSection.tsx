import { useTranslation } from '@/hooks/useLocale';
import Link from 'next/link';
import { Sparkles, TrendingUp, ShieldCheck, Users } from 'lucide-react';

interface HeroSectionProps {
  countryCode: string;
}

const HeroSection = ({ countryCode }: HeroSectionProps) => {
  const translation = useTranslation(countryCode);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl md:rounded-3xl mb-8 md:mb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-purple-100">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {countryCode === 'en' ? "Bangladesh's Most Trusted Review Platform" : "বাংলাদেশের সবচেয়ে বিশ্বস্ত রিভিউ প্ল্যাটফর্ম"}
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              {countryCode === 'en' ? 'Discover the Best' : 'খুঁজে নিন সেরা'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              {countryCode === 'en' ? 'Products & Reviews' : 'পণ্য এবং রিভিউ'}
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {countryCode === 'en' 
              ? 'Compare prices, read authentic reviews, and make informed decisions. Join 50,000+ smart shoppers in Bangladesh.'
              : 'দাম তুলনা করুন, সত্যিকারের রিভিউ পড়ুন, এবং সঠিক সিদ্ধান্ত নিন। বাংলাদেশের ৫০,০০০+ স্মার্ট ক্রেতাদের সাথে যোগ দিন।'
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/${countryCode}/mobile-phones`}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>{countryCode === 'en' ? 'Browse Products' : 'পণ্য ব্রাউজ করুন'}</span>
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href={`/${countryCode}/about`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg border-2 border-purple-100 hover:border-purple-300 transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>{countryCode === 'en' ? 'How It Works' : 'কিভাবে কাজ করে'}</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-3 shadow-lg">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">2,000+</div>
              <div className="text-xs md:text-sm text-gray-600">
                {countryCode === 'en' ? 'Products' : 'পণ্য'}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-3 shadow-lg">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-xs md:text-sm text-gray-600">
                {countryCode === 'en' ? 'Users' : 'ব্যবহারকারী'}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-3 shadow-lg">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">5K+</div>
              <div className="text-xs md:text-sm text-gray-600">
                {countryCode === 'en' ? 'Reviews' : 'রিভিউ'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
