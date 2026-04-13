import MainLayout from '@/app/components/layout/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Kossti',
  description: 'Terms of Service for Kossti - Please read these terms carefully before using our website.',
};

export default function TermsOfServicePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: April 13, 2026</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Kossti ("the Website"), you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Permission is granted to temporarily access the materials (information or software) on Kossti's 
              website for personal, non-commercial transitory viewing only. This is the grant of a license, not a 
              transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on Kossti's website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              This license shall automatically terminate if you violate any of these restrictions and may be 
              terminated by Kossti at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you create an account with us, you must provide information that is accurate, complete, and current 
              at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination 
              of your account on our Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for safeguarding the password that you use to access the Service and for any activities 
              or actions under your password. You agree not to disclose your password to any third party. You must notify 
              us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. User Content</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our Service allows you to post, link, store, share and otherwise make available certain information, 
              text, graphics, or other material ("Content"). You are responsible for the Content that you post on or 
              through the Service, including its legality, reliability, and appropriateness.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              By posting Content on or through the Service, you grant us the right and license to use, modify, publicly 
              perform, publicly display, reproduce, and distribute such Content on and through the Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You represent and warrant that: (i) the Content is yours or you have the right to use it and grant us the 
              rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service 
              does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>In any way that could disable, overburden, damage, or impair the site or interfere with any other party's use of the Service</li>
              <li>To use any robot, spider, or other automatic device, process, or means to access the Service for any purpose</li>
              <li>To introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Product Information and Pricing</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to provide accurate product information and pricing. However, we do not warrant that product 
              descriptions, pricing, or other content on this site is accurate, complete, reliable, current, or error-free. 
              Prices and availability of products are subject to change without notice. We reserve the right to correct any 
              errors, inaccuracies or omissions and to change or update information at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Reviews and Comments</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Users may post reviews, comments, and other content; send communications; and submit suggestions, ideas, 
              comments, questions, or other information, as long as the content is not illegal, obscene, threatening, 
              defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right (but not the obligation) to remove or edit such content, but do not regularly review 
              posted content. You grant Kossti a non-exclusive, royalty-free, perpetual, irrevocable right to use, 
              reproduce, modify, adapt, publish, translate, create derivative works from, and distribute such content 
              throughout the world in any media.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content (excluding Content provided by users), features and functionality are 
              and will remain the exclusive property of Kossti and its licensors. The Service is protected by copyright, 
              trademark, and other laws of both the country and foreign countries. Our trademarks and trade dress may not 
              be used in connection with any product or service without the prior written consent of Kossti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service may contain links to third-party websites or services that are not owned or controlled by Kossti. 
              Kossti has no control over, and assumes no responsibility for, the content, privacy policies, or practices of 
              any third-party websites or services. You further acknowledge and agree that Kossti shall not be responsible or 
              liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with 
              use of or reliance on any such content, goods or services available on or through any such websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. KOSSTI MAKES NO REPRESENTATIONS OR WARRANTIES 
              OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE SERVICE OR THE INFORMATION, CONTENT, MATERIALS, OR 
              PRODUCTS INCLUDED ON THE SERVICE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              IN NO EVENT SHALL KOSSTI, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE 
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF 
              PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY 
              TO ACCESS OR USE THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend, indemnify and hold harmless Kossti and its licensee and licensors, and their employees, 
              contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, 
              liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or 
              arising out of a) your use and access of the Service, or b) a breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">13. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
              whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the 
              Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">14. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of Bangladesh, without regard to its 
              conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered 
              a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">15. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
              material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes 
              a material change will be determined at our sole discretion. By continuing to access or use our Service after 
              those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">16. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
              <li>By visiting our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a></li>
              <li>By email: monir0space@gmail.com</li>
            </ul>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
