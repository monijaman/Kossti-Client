import MainLayout from '@/app/components/layout/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Kossti',
  description: 'Learn about Kossti - Your trusted source for honest product reviews and comparisons.',
};

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">About Kossti</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-8">
              <p className="text-xl text-gray-700 leading-relaxed">
                Kossti is your trusted destination for comprehensive, unbiased product reviews and comparisons. 
                We help consumers make informed purchasing decisions by providing detailed insights into the products that matter most.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower consumers with honest, detailed, and accurate product information. 
              In a world filled with marketing hype and biased reviews, we strive to cut through the noise 
              and provide you with the truth about products across various categories including technology, 
              electronics, home appliances, and more.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  In-Depth Reviews
                </h3>
                <p className="text-gray-600">
                  We provide comprehensive reviews covering features, specifications, performance, pros and cons, 
                  helping you understand exactly what you're getting.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Product Comparisons
                </h3>
                <p className="text-gray-600">
                  Compare products side-by-side with detailed specifications and performance metrics 
                  to find the perfect match for your needs.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Expert Ratings
                </h3>
                <p className="text-gray-600">
                  Our team evaluates products based on multiple criteria including quality, value, 
                  features, and user experience.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  User Community
                </h3>
                <p className="text-gray-600">
                  Read real user reviews and experiences to get a complete picture from actual product owners.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Values</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Independence</h3>
                <p className="text-gray-700">
                  We maintain editorial independence and provide unbiased reviews. Our opinions are our own 
                  and are not influenced by manufacturers or advertisers.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Transparency</h3>
                <p className="text-gray-700">
                  We believe in complete transparency. We clearly disclose affiliate relationships, 
                  advertising partnerships, and any potential conflicts of interest.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Accuracy</h3>
                <p className="text-gray-700">
                  We verify all specifications and claims. Our reviews are based on thorough research 
                  and real-world testing whenever possible.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">User-Focused</h3>
                <p className="text-gray-700">
                  Everything we do is focused on helping you make better purchasing decisions. 
                  Your trust is our most valuable asset.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Why Trust Kossti?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In an era of fake reviews and paid endorsements, Kossti stands out by prioritizing honesty and accuracy. 
              We don't just repeat manufacturer specifications – we dig deeper, analyze user feedback, compare alternatives, 
              and present you with a complete picture.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Comprehensive product database with detailed specifications</li>
              <li>Regular updates to reflect new products and price changes</li>
              <li>Multi-language support for global accessibility</li>
              <li>Easy-to-use comparison tools</li>
              <li>Community-driven reviews and ratings</li>
              <li>Clear, jargon-free explanations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to continuously improving our platform to serve you better. We regularly update 
              our content, add new features, and expand our product coverage. Your feedback helps us grow and 
              improve, so please don't hesitate to <a href="/contact" className="text-blue-600 hover:underline">reach out to us</a> with suggestions or concerns.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-semibold mb-3 text-blue-900">Get in Touch</h2>
            <p className="text-blue-800 mb-4">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you!
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
