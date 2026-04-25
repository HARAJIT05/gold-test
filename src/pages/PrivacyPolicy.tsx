import React from 'react';
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
          <p className="text-gray-500 text-sm">Last updated: April 2026 · NABA GOLD</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 space-y-12">

        <Section title="Introduction">
          <p>
            This Privacy Policy of NABA GOLD outlines how we collect, use, and protect the information shared through our website and business interactions. This policy applies solely to information collected through our website/application.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p>We may collect the following information from you:</p>
          <ul>
            <li>Name, company name, contact number, and email address</li>
            <li>Order and transaction-related details</li>
            <li>Any information voluntarily provided through inquiries or communication</li>
          </ul>
        </Section>

        <Section title="Use of Information">
          <p>The information collected from our website is used for:</p>
          <ul>
            <li>Processing and fulfilling orders</li>
            <li>Communicating with clients regarding orders, updates, and services</li>
            <li>Informing you about offers, promotions, and business updates</li>
            <li>Improving our services based on your feedback and suggestions</li>
          </ul>
        </Section>

        <Section title="Collection & Sharing of Information">
          <ul>
            <li>We collect information only for business purposes and communication.</li>
            <li>Your information will not be sold, rented, or traded to third parties.</li>
            <li>Information may be shared only when required by law or for necessary business operations.</li>
          </ul>
        </Section>

        <Section title="Safety of Information">
          <p>
            We take all necessary precautions to protect your personal and business information both online and offline.
          </p>
          <p>
            All sensitive data is secured using appropriate encryption and security measures to prevent unauthorized access or misuse.
          </p>
        </Section>

        <Section title="Access & Correction of Information">
          <p>You have the right to:</p>
          <ul>
            <li>View the information we have about you</li>
            <li>Correct or update your details</li>
            <li>Raise concerns regarding how your data is used</li>
          </ul>
          <p>You can do so by contacting us via email or phone provided on our website.</p>
        </Section>

        <Section title="Data Retention">
          <p>We retain your information only as long as necessary to:</p>
          <ul>
            <li>Fulfill business transactions</li>
            <li>Respond to your queries</li>
            <li>Provide updates and services</li>
          </ul>
          <p>Upon request, your data can be deleted from our records.</p>
        </Section>

        <Section title="Use of Cookies">
          <p>Our website may use cookies to enhance your browsing experience. Cookies help us:</p>
          <ul>
            <li>Recognize returning users</li>
            <li>Track preferences and improve services</li>
            <li>Maintain session details like inquiries or interactions</li>
          </ul>
          <p>You may choose to disable cookies through your browser settings.</p>
        </Section>

        <Section title="Consent">
          <p>
            By using our website/application, you consent to the terms of this Privacy Policy.
          </p>
        </Section>

        <Section title="Changes to Privacy Policy">
          <p>
            We reserve the right to update, modify, or change this Privacy Policy at any time without prior notice. Continued use of our services implies acceptance of such changes.
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
