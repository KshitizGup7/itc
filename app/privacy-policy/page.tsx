import React from "react";
import Link from "next/link";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">
          Indian Tufted Carpets
        </h1>
        <Link
          href="/#footer"
          className="flex items-center text-gray-600 hover:text-gray-900 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </nav>

      {/* About Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policies</h2>
        <p className="text-gray-700 leading-relaxed mb-4 tracking-wide">

At Indian Tufted Carpets, we are committed to protecting your privacy. This Privacy Policy explains how we handle the personal information you provide to us through our website.
<br/>
1. What This Policy Covers

This policy applies to the website for Indian Tufted Carpets. Our website is a portfolio designed to showcase our work. We do not require users to sign in or create an account, and we do not use cookies to track personal data.
<br/>
2. Information We Collect

The only personal information we collect is the information you voluntarily provide to us through our contact form. This typically includes:

Your email address.

Any other information you choose to share in the body of your message (such as your name, company, or inquiry details).
<br/>
3. How We Use Your Information

We use the information you provide for the sole purpose of responding to your inquiry. We do not use your email address for marketing lists or share it with third parties for their marketing purposes.
<br/>
4. Data Protection and Sharing

We take reasonable measures to keep the information you provide secure.

We do not sell, rent, or trade your personal information with any third parties.

Information will only be accessed by our team members who need it to respond to your communication.
<br/>
5. Your Consent

By using our contact form to send us a message, you consent to the collection and use of your information as described in this Privacy Policy.
<br/>
6. Contact Us

If you have any questions or concerns about our privacy practices, please contact us at: itizksh87@gmail.com
        </p>
      </section>
    </div>
  );
};

export default Privacy;
