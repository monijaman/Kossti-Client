import MainLayout from '@/app/components/layout/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial Policy - Kossti',
  description:
    'Learn how Kossti researches, writes, and fact-checks product reviews. Our editorial standards, review methodology, and independence policy.',
};

export default function EditorialPolicyPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Editorial Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: June 2026</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
          <p className="text-lg text-gray-700 leading-relaxed">
            Kossti is committed to publishing accurate, honest, and useful product reviews. This page explains how our
            editorial team researches products, writes reviews, and maintains independence from commercial interests.
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Our Review Methodology</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every product reviewed on Kossti goes through a structured evaluation process. Our reviewers follow a
              consistent framework so that comparisons across products and categories are fair and meaningful.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Research phase:</strong> We gather official specifications, manufacturer claims, and publicly
                available technical data before testing or writing begins.
              </li>
              <li>
                <strong>Hands-on testing where possible:</strong> For flagship and popular products, our team
                evaluates real-world performance, build quality, and usability.
              </li>
              <li>
                <strong>User feedback aggregation:</strong> We read and analyse verified user reports from
                multiple sources to complement our own findings.
              </li>
              <li>
                <strong>Scoring:</strong> Products are rated on a 10-point scale across key criteria including
                performance, value for money, build quality, features, and after-sales support.
              </li>
              <li>
                <strong>Final verdict:</strong> Every full review ends with a clear verdict, a pros &amp; cons
                summary, and a buying recommendation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Editorial Independence</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our editorial team operates independently of our commercial team. Advertisers and affiliate partners
              have no influence over review scores, verdicts, or the selection of products we cover.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Products are selected for review based on reader interest, market relevance, and availability in
              Bangladesh — not on commercial relationships.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Affiliate Links &amp; Advertising Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some pages on Kossti may contain affiliate links or display advertisements. When you click an affiliate
              link and make a purchase, we may earn a small commission at no extra cost to you. This helps fund our
              editorial operations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Affiliate relationships do not influence our editorial opinions. A product we earn commission on can
              receive a low score if that is our honest assessment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Accuracy &amp; Fact-Checking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Before publication, all specifications and key claims are cross-referenced against at least two
              independent sources (manufacturer specs, retailer listings, or verified benchmark databases).
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you spot an error in any of our content, please contact us at{' '}
              <a href="mailto:monir0space@gmail.com" className="text-blue-600 hover:underline">
                monir0space@gmail.com
              </a>
              . We review all corrections promptly and update articles with a visible correction note.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Content Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              Product prices, availability, and specifications change over time. We aim to review and update
              existing articles when significant changes occur. Each article displays a &quot;Last Updated&quot; date
              so readers know how current the information is.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Comment &amp; User Review Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              User-submitted reviews on Kossti are published as-is, representing the personal experience of
              individual users. They are not edited for tone, but they are moderated for spam, hate speech, and
              content that violates our terms of service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              User reviews are clearly distinguished from our editorial reviews and do not affect the editorial
              rating or verdict of a product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Contact Our Editorial Team</h2>
            <p className="text-gray-700 leading-relaxed">
              For editorial enquiries, corrections, or partnership requests, contact us at{' '}
              <a href="mailto:monir0space@gmail.com" className="text-blue-600 hover:underline">
                monir0space@gmail.com
              </a>
              . We aim to respond within 2 business days.
            </p>
          </section>

        </div>
      </div>
    </MainLayout>
  );
}
