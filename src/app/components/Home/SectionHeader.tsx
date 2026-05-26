import { ChevronRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  viewAllLink?: string;
  viewAllText?: string;
  gradientColor?: string;
}

const SectionHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  viewAllLink, 
  viewAllText = 'View All',
  gradientColor = 'from-purple-600 to-pink-600'
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <div className="flex items-start gap-3 md:gap-4">
        {/* Accent Bar */}
        <div className={`w-1.5 md:w-2 h-8 md:h-10 bg-gradient-to-b ${gradientColor} rounded-full flex-shrink-0 mt-1`}></div>
        
        <div>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`hidden md:flex w-10 h-10 bg-gradient-to-br ${gradientColor} rounded-xl items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          
          {subtitle && (
            <p className="text-sm md:text-base text-gray-600 mt-1.5 md:mt-2 ml-0 md:ml-13">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="group flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base transition-colors"
        >
          <span className="hidden sm:inline">{viewAllText}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
