import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="MoveScout" className="h-5" />
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            ← Back
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: Tuesday, March 31, 2026</p>

          <div className="prose prose-gray max-w-none">
            <p>
              MoveScout ("we," "us," or "our") respects your privacy and is committed to protecting any information you provide through our testimonial submission page at testimonials.movescout.net. This Privacy Policy explains how we collect, use, and protect your information when you submit a testimonial.
            </p>

            <h2>Information We Collect</h2>
            <p>When you submit a testimonial, we may collect:</p>
            <ul>
              <li>Your name</li>
              <li>Company name</li>
              <li>Email address (if provided)</li>
              <li>Phone number (if provided)</li>
              <li>Video testimonial or uploaded media</li>
              <li>Written testimonial content (if provided)</li>
              <li>Any additional information you choose to submit</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>By submitting a testimonial, you agree that MoveScout may use, edit, reproduce, and distribute your submission for business and marketing purposes, including:</p>
            <ul>
              <li>Displaying your testimonial on our website</li>
              <li>Using your testimonial in advertisements, social media, and email marketing</li>
              <li>Showcasing feedback to prospective clients</li>
              <li>Creating promotional materials featuring your testimonial</li>
            </ul>
            <p>We may edit your testimonial for clarity, length, or formatting, but we will not misrepresent your experience.</p>

            <h2>Public Display</h2>
            <p>
              Your testimonial may be publicly displayed along with your name and/or company name. We will not publicly display sensitive personal contact information such as your email address or phone number.
            </p>

            <h2>Incentives</h2>
            <p>MoveScout may offer incentives (such as account credits) in exchange for submitted testimonials.</p>
            <ul>
              <li>Credits are issued at our discretion after review and approval of the submission.</li>
              <li>Submissions must meet basic quality and authenticity standards.</li>
            </ul>

            <h2>Authenticity</h2>
            <p>By submitting a testimonial, you confirm that:</p>
            <ul>
              <li>The testimonial reflects your genuine experience with MoveScout</li>
              <li>You have the right to share any content submitted</li>
              <li>The information provided is accurate to the best of your knowledge</li>
            </ul>

            <h2>Sharing of Information</h2>
            <p>
              We do not sell your personal information. Your testimonial may be shared publicly as described above. We do not share your private contact details with third parties except as necessary to operate our services (e.g., hosting, form processing tools).
            </p>

            <h2>Data Storage & Security</h2>
            <p>
              We take reasonable measures to protect your information. However, no method of transmission over the internet is completely secure.
            </p>

            <h2>Your Rights</h2>
            <p>
              You may request to update or remove your testimonial at any time by contacting us. We will honor reasonable requests to modify or remove submitted content.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services (such as hosting providers, form tools, or cloud storage) to collect, store, and manage submissions.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last Updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:<br />
              <a href="mailto:Info@Movescout.net" className="text-blue-600 hover:underline">Info@Movescout.net</a>
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
