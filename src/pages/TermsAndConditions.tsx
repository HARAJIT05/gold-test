import React from 'react';
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
          <p className="text-gray-500 text-sm">Last updated: April 2026 · NABA GOLD</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 space-y-12">
        <Section title="Introduction">
          <p>Welcome to NABA GOLD. By engaging in business with us, you agree to the following terms:</p>
        </Section>

        <Section title="Business Nature">
          <p>
            We operate as a wholesale gold manufacturing company, dealing strictly on a business-to-business (B2B) basis with traders and showroom owners.
          </p>
        </Section>

        <Section title="Orders & Production">
          <ul>
            <li>All orders are processed based on client specifications, including design and weight.</li>
            <li>A minimum of 5–7 working days is required for order completion, depending on design and quantity.</li>
            <li>Once confirmed, orders cannot be canceled or modified.</li>
          </ul>
        </Section>

        <Section title="Gold Purity">
          <ul>
            <li>All products are manufactured in 22 Karat gold (91.6% purity).</li>
            <li>Purity and quality are strictly maintained as per industry standards.</li>
          </ul>
        </Section>

        <Section title="Gold-to-Gold Transactions">
          <ul>
            <li>Transactions with traders/showroom owners are conducted on a gold-to-gold basis.</li>
            <li>The company follows standard industry practices for such exchanges.</li>
          </ul>
        </Section>

        <Section title="Pricing & Payment">
          <ul>
            <li>Pricing shall be determined based on the prevailing gold rate on the date of delivery.</li>
            <li>Applicable GST and other charges will be added as per government norms.</li>
            <li>Payment terms must be fulfilled as agreed before delivery.</li>
          </ul>
        </Section>

        <Section title="Delivery">
          <ul>
            <li>Delivery timelines are estimated and may vary depending on production conditions.</li>
            <li>The company is not responsible for delays caused by external factors.</li>
          </ul>
        </Section>

        <Section title="Quality & Claims">
          <ul>
            <li>All products are crafted with high precision and quality standards.</li>
            <li>Any issues must be reported within 24–48 hours of delivery.</li>
          </ul>
        </Section>

        <Section title="Returns & Refunds">
          <ul>
            <li>No return or refund is applicable on customized orders.</li>
            <li>Returns (if any) are subject to company approval.</li>
          </ul>
        </Section>

        <Section title="Compliance">
          <p>
            We strictly follow all legal, taxation, and GST regulations, ensuring complete transparency.
          </p>
        </Section>

        <Section title="Changes to Terms">
          <p>
            The company reserves the right to update these terms at any time without prior notice.
          </p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/5 pb-10">
      <h2 className="font-serif text-xl font-bold text-gold-400 mb-4">{title}</h2>
      <div className="text-gray-400 text-base leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-white [&_a]:text-gold-400">
        {children}
      </div>
    </div>
  );
}
