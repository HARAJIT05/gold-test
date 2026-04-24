import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="bg-navy-950 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-white/5 py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-gold-400/70 hover:text-gold-400 font-bold mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gold-400" />
            </div>
            <span className="text-[10px] uppercase tracking-[3px] text-gold-400 font-bold">Legal</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Terms &amp; Conditions</h1>
          <p className="text-gray-500 text-sm">Last updated: April 2025 · NABA Gold Karigar</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 space-y-12">

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the website of NABA Gold Karigar ("NABA", "we", "our", or "us"), you agree to be bound by these Terms and Conditions. These terms apply to all visitors, clients, wholesale buyers, and any other users of our website.
          </p>
          <p>
            NABA Gold Karigar is a gold jewellery manufacturing and wholesale enterprise established in 1992, operating from Kalyan (West), Maharashtra and Kalbadevi, Mumbai. Our GSTIN is <strong>27AOQPS7242N1ZZ</strong>.
          </p>
          <p>If you do not agree to these terms, please discontinue use of this website immediately.</p>
        </Section>

        <Section title="2. Nature of Business">
          <p>
            NABA Gold Karigar is a <strong>22K gold manufacturing and wholesale business</strong>. All products featured on this website are manufactured in-house by skilled artisans (Karigars) and are exclusively available for wholesale purchase by registered jewellers, retailers, and authorised business entities.
          </p>
          <p>
            This website is <strong>not a retail e-commerce platform</strong>. Pricing displayed is indicative and based on live market rates. Final pricing, weight, making charges, and terms of sale are confirmed separately through official business communication channels.
          </p>
        </Section>

        <Section title="3. Product Information & Pricing">
          <ul>
            <li>All jewellery displayed is <strong>22 Karat (22K) gold</strong> unless otherwise specified.</li>
            <li>Prices shown on this website are <strong>live estimates</strong> calculated based on real-time gold market rates (sourced from IBJA/international spot price) and are subject to change without prior notice.</li>
            <li>Making charges, weight, and GST (3%) are confirmed at the time of actual order placement and may vary from estimates shown.</li>
            <li>All products are <strong>BIS Hallmarked</strong> as per the Bureau of Indian Standards requirements for gold jewellery.</li>
            <li>Product images are for reference purposes only. Slight variations in design, finish, and weight may exist in the actual delivered piece.</li>
          </ul>
        </Section>

        <Section title="4. Orders & Wholesale Enquiries">
          <ul>
            <li>Orders are accepted only from authorised wholesale buyers and registered business entities.</li>
            <li>All enquiries must be submitted via WhatsApp, phone, or email. Online order placement through this website is not currently available.</li>
            <li>NABA reserves the right to accept, modify, or decline any order at its sole discretion.</li>
            <li>A confirmed order is binding only upon execution of a written order confirmation by an authorised representative of NABA.</li>
            <li>Minimum order quantities (MOQ) and advance payment terms apply and are communicated separately.</li>
          </ul>
        </Section>

        <Section title="5. Payment Terms">
          <ul>
            <li>All transactions are subject to GST at the rate applicable to gold jewellery (currently 3% under HSN Code 7113).</li>
            <li>Payment must be made via bank transfer (NEFT/RTGS/IMPS), cheque, or any other mutually agreed mode. Cash transactions are subject to the limits prescribed under the Income Tax Act, 1961.</li>
            <li>Advance payment may be required for new buyers or custom orders as communicated at the time of order confirmation.</li>
            <li>NABA shall issue a proper GST invoice for all sales as mandated by the Goods and Services Tax Act, 2017.</li>
          </ul>
        </Section>

        <Section title="6. Delivery & Shipping">
          <ul>
            <li>Delivery timelines are indicative and communicated at the time of order confirmation.</li>
            <li>NABA is not responsible for delays caused by force majeure events, government restrictions, natural disasters, or carrier issues.</li>
            <li>Risk of loss or damage to goods passes to the buyer upon dispatch from NABA's premises, unless otherwise agreed in writing.</li>
            <li>Shipping costs, insurance, and applicable taxes are the buyer's responsibility unless stated otherwise.</li>
          </ul>
        </Section>

        <Section title="7. Returns, Exchanges & Warranty">
          <ul>
            <li>All sales of gold jewellery are <strong>final</strong>. Returns or exchanges are accepted only in cases of documented manufacturing defects, verified at NABA's sole discretion.</li>
            <li>Any claim for defects must be reported in writing within <strong>7 days</strong> of receipt of goods.</li>
            <li>NABA does not accept returns due to market price fluctuations, changes in gold rates, or buyer's change of mind.</li>
            <li>Hallmarked jewellery returned must have BIS Hallmark intact and undamaged.</li>
          </ul>
        </Section>

        <Section title="8. Intellectual Property">
          <p>
            All content on this website — including text, images, product photographs, logo, brand name "NABA", and design elements — is the exclusive intellectual property of NABA Gold Karigar.
          </p>
          <ul>
            <li>You may not reproduce, copy, distribute, or use any content from this website without prior written consent from NABA.</li>
            <li>Unauthorised use of our brand name, logo, or product images may result in legal action.</li>
          </ul>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>
            This website and its content are provided on an <strong>"as is"</strong> basis without warranties of any kind, either express or implied. NABA does not warrant that:
          </p>
          <ul>
            <li>The website will be uninterrupted, error-free, or free of viruses.</li>
            <li>Gold rate estimates displayed are 100% accurate at the time of viewing (rates are market-driven and may lag real-time market prices).</li>
            <li>Product availability shown reflects actual stock at all times.</li>
          </ul>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable Indian law, NABA Gold Karigar shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:
          </p>
          <ul>
            <li>Your use of, or inability to use, this website.</li>
            <li>Any errors or omissions in website content.</li>
            <li>Fluctuations in gold prices between enquiry and order confirmation.</li>
            <li>Delay or failure in delivery due to circumstances beyond NABA's control.</li>
          </ul>
          <p>Our total liability to you for any cause of action shall not exceed the value of the order in question.</p>
        </Section>

        <Section title="11. Governing Law & Dispute Resolution">
          <p>
            These Terms and Conditions are governed by and construed in accordance with the laws of the <strong>Republic of India</strong>. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts at <strong>Kalyan, Thane District, Maharashtra</strong>.
          </p>
          <p>
            In the event of a dispute, the parties agree to first attempt resolution through good-faith negotiation. If unresolved within 30 days, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Mumbai, Maharashtra.
          </p>
        </Section>

        <Section title="12. Compliance">
          <p>NABA Gold Karigar operates in full compliance with:</p>
          <ul>
            <li>Goods and Services Tax Act, 2017 (GSTIN: 27AOQPS7242N1ZZ)</li>
            <li>Bureau of Indian Standards (BIS) Hallmarking regulations for gold jewellery</li>
            <li>Prevention of Money Laundering Act, 2002 (PMLA)</li>
            <li>Income Tax Act, 1961</li>
            <li>Digital Personal Data Protection Act, 2023 (DPDPA)</li>
          </ul>
        </Section>

        <Section title="13. Amendments">
          <p>
            NABA reserves the right to amend or update these Terms and Conditions at any time without prior notice. Continued use of the website after any modifications indicates your acceptance of the revised terms. We encourage you to review this page periodically.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p>For any questions regarding these Terms and Conditions, please reach out to us:</p>
          <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 mt-4 space-y-1 text-sm">
            <p className="font-bold text-white font-serif text-lg">NABA Gold Karigar</p>
            <p>Rajguru Niwas, Room No 4, Jijamata Colony, Narayanwadi, Kalyan (West), Pin – 421301</p>
            <p>GSTIN: <span className="font-mono text-gold-400">27AOQPS7242N1ZZ</span></p>
            <p>Email: <a href="mailto:naba.shaw1992@gmail.com" className="text-gold-400 hover:underline">naba.shaw1992@gmail.com</a></p>
            <p>Phone: <a href="tel:+919892242785" className="text-gold-400 hover:underline">+91 98922 42785</a></p>
          </div>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/5 pb-10">
      <h2 className="font-serif text-xl font-bold text-gold-400 mb-4">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-white [&_a]:text-gold-400">
        {children}
      </div>
    </div>
  );
}
