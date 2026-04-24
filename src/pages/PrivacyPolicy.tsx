import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <Shield className="w-5 h-5 text-gold-400" />
            </div>
            <span className="text-[10px] uppercase tracking-[3px] text-gold-400 font-bold">Legal</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: April 2025 · NABA Gold Karigar</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 space-y-12">

        <Section title="1. Introduction">
          <p>
            NABA Gold Karigar ("we", "our", or "us"), a gold jewellery manufacturing and wholesale enterprise established in 1992 and operating from Kalyan (West), Maharashtra and Kalbadevi, Mumbai, is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website or contact us through any channel.
          </p>
          <p>
            By accessing or using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with its terms, please discontinue use of the website.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Identification Information:</strong> Name, phone number, email address, and business details that you voluntarily provide when contacting us via WhatsApp, email, or enquiry forms.</li>
            <li><strong>Usage Data:</strong> Information about how you access and use our website, including your IP address, browser type, pages viewed, and time spent on each page.</li>
            <li><strong>Communication Records:</strong> Records of any communications between you and NABA, including enquiries, orders, and feedback.</li>
            <li><strong>Transactional Information:</strong> Details of products you express interest in, quotes requested, and wholesale order discussions.</li>
          </ul>
          <p>We do <strong>not</strong> collect credit card numbers, banking details, or payment information through this website.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>The information we collect is used to:</p>
          <ul>
            <li>Respond to your enquiries and provide quotations for gold jewellery products.</li>
            <li>Process and manage wholesale orders.</li>
            <li>Send updates about our product catalogue, pricing, and promotions (only if you have opted in).</li>
            <li>Improve our website and user experience.</li>
            <li>Comply with applicable legal obligations under Indian law, including GST (GSTIN: 27AOQPS7242N1ZZ) and other statutory requirements.</li>
            <li>Prevent fraudulent activity and ensure the security of our operations.</li>
          </ul>
        </Section>

        <Section title="4. Legal Basis for Processing">
          <p>
            We process your personal data on the following legal bases under the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDPA):
          </p>
          <ul>
            <li><strong>Consent:</strong> Where you have provided explicit consent for processing.</li>
            <li><strong>Contractual Necessity:</strong> Where processing is necessary to fulfil a business agreement or respond to an enquiry.</li>
            <li><strong>Legal Compliance:</strong> Where we are required by law to process certain data (e.g., GST records, audits).</li>
            <li><strong>Legitimate Interests:</strong> For fraud prevention, security, and improving our services.</li>
          </ul>
        </Section>

        <Section title="5. Sharing of Information">
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share information with:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Trusted partners who assist in operating our website (e.g., hosting, analytics) under strict confidentiality agreements.</li>
            <li><strong>Government & Regulatory Authorities:</strong> Where legally required, such as for GST compliance, court orders, or law enforcement requests.</li>
            <li><strong>Business Partners:</strong> With your explicit consent, for joint promotional activities.</li>
          </ul>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable Indian law. Enquiry records may be retained for up to <strong>3 years</strong>. GST and financial records are retained for the statutory period of <strong>6 years</strong> as mandated by the GST Act.
          </p>
        </Section>

        <Section title="7. Cookies & Tracking Technologies">
          <p>
            Our website may use cookies or similar tracking technologies to enhance your browsing experience. These may include:
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with our site (e.g., Google Analytics).</li>
          </ul>
          <p>You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, some parts of the site may not function properly without cookies.</p>
        </Section>

        <Section title="8. Security">
          <p>
            We implement industry-standard security measures to protect your personal information, including HTTPS encryption, secure data storage, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="9. Your Rights">
          <p>Under applicable Indian data protection laws, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Correct inaccurate or incomplete data.</li>
            <li>Request deletion of your data (subject to legal retention requirements).</li>
            <li>Withdraw consent at any time, where processing is based on consent.</li>
            <li>Lodge a complaint with the relevant regulatory authority.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:naba.shaw1992@gmail.com" className="text-gold-400 hover:underline">naba.shaw1992@gmail.com</a>.</p>
        </Section>

        <Section title="10. Third-Party Links">
          <p>
            Our website may contain links to third-party websites (e.g., Google Maps, WhatsApp, YouTube, Instagram). We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies separately.
          </p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>
            Our website is intended for adult business-to-business users. We do not knowingly collect personal information from individuals under the age of 18. If we become aware that a child has provided us with personal information, we will delete it immediately.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. Your continued use of the website following any changes constitutes your acceptance of the revised policy.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact:</p>
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
