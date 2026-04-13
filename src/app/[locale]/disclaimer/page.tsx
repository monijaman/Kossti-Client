import MainLayout from '@/app/components/layout/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Kossti',
  description: 'Disclaimer for Kossti - Important information about the use of our website and content.',
};

export default function DisclaimerPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Disclaimer</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: April 13, 2026</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                Please read this disclaimer carefully before using Kossti. By accessing and using this website, 
                you acknowledge and agree to the terms outlined below.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. General Information</h2>
            <p className="text-gray-700 leading-relaxed">
              The information provided by Kossti ("we," "us," or "our") on our website is for general informational 
              purposes only. All information on the site is provided in good faith; however, we make no representation 
              or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, 
              availability, or completeness of any information on the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Product Reviews and Recommendations</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The product reviews, comparisons, and recommendations provided on Kossti are based on our research, 
              analysis, and available information at the time of publication. Please note:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Product specifications, features, and prices may change without notice</li>
              <li>Individual experiences with products may vary</li>
              <li>Reviews reflect our opinions and should not be considered professional advice</li>
              <li>We are not responsible for decisions made based on information from our site</li>
              <li>Always verify product details with manufacturers or authorized retailers before purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. No Professional Advice</h2>
            <p className="text-gray-700 leading-relaxed">
              The content on Kossti is not intended to be a substitute for professional advice. The information we 
              provide should not be considered as professional, financial, legal, or technical advice. Before making 
              any purchasing decisions or taking any action based on information from our website, we strongly recommend 
              consulting with appropriate professionals or conducting your own thorough research.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Affiliate Relationships and Advertising</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Kossti may contain affiliate links, sponsored content, and advertisements. Please be aware:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>We may earn commissions from purchases made through affiliate links</li>
              <li>We display Google AdSense and other third-party advertisements</li>
              <li>Affiliate relationships do not influence our editorial content or product reviews</li>
              <li>We maintain editorial independence and provide honest opinions</li>
              <li>Sponsored content is clearly labeled when present</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Third-Party Websites and Content</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites, products, or services that are not owned or 
              controlled by Kossti. We have no control over and assume no responsibility for the content, privacy 
              policies, or practices of any third-party websites. We do not warrant the offerings of any of these 
              entities/individuals or their websites. You acknowledge and agree that we shall not be responsible or 
              liable for any damage or loss caused or alleged to be caused by or in connection with the use of any 
              such content, goods or services available on or through any such third-party websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. User-Generated Content</h2>
            <p className="text-gray-700 leading-relaxed">
              Kossti may allow users to submit reviews, comments, and other content. The views and opinions expressed 
              in user-generated content are those of the individual authors and do not necessarily reflect the official 
              policy or position of Kossti. We do not verify the accuracy of user-submitted content and are not 
              responsible for any statements or representations in user reviews or comments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Pricing and Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to provide accurate pricing information and product availability, prices and stock status 
              displayed on Kossti may not reflect current retail prices or availability. Prices are subject to change 
              without notice. We recommend verifying current prices and availability with retailers before making a purchase. 
              Kossti is not responsible for any price changes, product discontinuations, or stock issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Technical Accuracy</h2>
            <p className="text-gray-700 leading-relaxed">
              We make every effort to ensure that technical specifications, product features, and other technical 
              information are accurate and up-to-date. However, manufacturers may update products or specifications 
              without notice. We are not liable for any inaccuracies in technical specifications or product information. 
              Always verify technical details with the manufacturer or authorized distributor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. No Warranty</h2>
            <p className="text-gray-700 leading-relaxed">
              THE WEBSITE AND ALL INFORMATION, CONTENT, MATERIALS, PRODUCTS, AND SERVICES INCLUDED ON OR OTHERWISE MADE 
              AVAILABLE TO YOU THROUGH THIS WEBSITE ARE PROVIDED BY KOSSTI ON AN "AS IS" AND "AS AVAILABLE" BASIS, UNLESS 
              OTHERWISE SPECIFIED IN WRITING. KOSSTI MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, 
              AS TO THE OPERATION OF THIS WEBSITE OR THE INFORMATION, CONTENT, MATERIALS, PRODUCTS, OR SERVICES INCLUDED ON 
              OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THIS WEBSITE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, KOSSTI SHALL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND 
              ARISING FROM THE USE OF THIS WEBSITE OR FROM ANY INFORMATION, CONTENT, MATERIALS, PRODUCTS, OR SERVICES 
              INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THIS WEBSITE, INCLUDING BUT NOT LIMITED TO DIRECT, 
              INDIRECT, INCIDENTAL, PUNITIVE, AND CONSEQUENTIAL DAMAGES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">11. Changes and Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, update, or discontinue any part of our website at any time without notice. 
              Information on this website may be changed or updated without notice. We may also make improvements and/or 
              changes in the products and/or the programs described in this information at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">12. Regional Variations</h2>
            <p className="text-gray-700 leading-relaxed">
              Product availability, specifications, and features may vary by region or country. Information on Kossti 
              may not be applicable to all geographic locations. We recommend checking with local retailers and 
              distributors for region-specific product information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">13. Use at Your Own Risk</h2>
            <p className="text-gray-700 leading-relaxed">
              You acknowledge that your use of this website and any reliance upon any information available through 
              this website is at your sole risk. It is your responsibility to evaluate the accuracy, completeness, 
              and usefulness of any opinions, advice, services, or other information provided through the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">14. Errors and Omissions</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive for accuracy, our website may contain typographical errors, inaccuracies, or omissions 
              that may relate to product descriptions, pricing, promotions, offers, and availability. We reserve the 
              right to correct any errors, inaccuracies, or omissions and to change or update information at any time 
              without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this disclaimer, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
              <li>By visiting our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a></li>
              <li>By email: monir0space@gmail.com</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-8">
            <h3 className="text-xl font-semibold mb-3 text-blue-900">Agreement</h3>
            <p className="text-blue-800">
              By using Kossti, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. 
              If you do not agree with any part of this disclaimer, please do not use our website.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
