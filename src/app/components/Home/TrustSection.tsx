import { Shield, Star, ThumbsUp, TrendingUp } from 'lucide-react';

interface TrustSectionProps {
  countryCode: string;
}

const TrustSection = ({ countryCode }: TrustSectionProps) => {
  const features = [
    {
      icon: Shield,
      title: countryCode === 'en' ? 'Verified Reviews' : 'যাচাইকৃত রিভিউ',
      description: countryCode === 'en' 
        ? 'All reviews are verified by our expert team' 
        : 'সমস্ত রিভিউ আমাদের বিশেষজ্ঞ টিম দ্বারা যাচাই করা',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Star,
      title: countryCode === 'en' ? 'Expert Ratings' : 'বিশেষজ্ঞ রেটিং',
      description: countryCode === 'en' 
        ? 'Professional analysis and comprehensive ratings' 
        : 'পেশাদার বিশ্লেষণ এবং বিস্তৃত রেটিং',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: ThumbsUp,
      title: countryCode === 'en' ? 'User Trust' : 'ব্যবহারকারী বিশ্বাস',
      description: countryCode === 'en' 
        ? 'Trusted by 50,000+ happy customers' 
        : '৫০,০০০+ সন্তুষ্ট গ্রাহক দ্বারা বিশ্বস্ত',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      title: countryCode === 'en' ? 'Best Deals' : 'সেরা অফার',
      description: countryCode === 'en' 
        ? 'Compare prices and find the best offers' 
        : 'দাম তুলনা করুন এবং সেরা অফার খুঁজুন',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="my-12 md:my-16">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {countryCode === 'en' ? 'Why Choose Kossti?' : 'কেন কস্তি বেছে নেবেন?'}
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {countryCode === 'en' 
            ? 'Join thousands of satisfied customers who trust us for honest reviews and expert advice'
            : 'হাজার হাজার সন্তুষ্ট গ্রাহকদের সাথে যোগ দিন যারা সৎ রিভিউ এবং বিশেষজ্ঞ পরামর্শের জন্য আমাদের বিশ্বাস করেন'
          }
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`group ${feature.bgColor} hover:shadow-xl rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-transparent`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h4 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Line */}
              <div className={`mt-6 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustSection;
