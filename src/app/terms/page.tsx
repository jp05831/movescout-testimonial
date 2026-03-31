import Link from "next/link";

export default function Terms() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: Tuesday, March 31, 2026</p>

          <div className="prose prose-gray max-w-none">
            <p>
              By submitting a testimonial to MoveScout through this page, you agree to the following:
            </p>

            <h2>Consent to Use</h2>
            <p>
              You grant MoveScout the right to use, reproduce, edit, and distribute your testimonial (including video, written content, and any submitted media) for marketing and promotional purposes. This may include use on our website, advertisements, social media, and other marketing materials.
            </p>

            <h2>Authenticity</h2>
            <p>You confirm that:</p>
            <ul>
              <li>Your testimonial reflects your genuine experience with MoveScout</li>
              <li>The information you provide is accurate</li>
              <li>You have the right to share any content submitted</li>
            </ul>

            <h2>Editing</h2>
            <p>
              MoveScout may edit testimonials for clarity, formatting, or length, but will not misrepresent your experience.
            </p>

            <h2>Incentives</h2>
            <p>If a testimonial incentive (such as account credits) is offered:</p>
            <ul>
              <li>Incentives are issued at MoveScout's discretion</li>
              <li>Submissions must be reviewed and approved</li>
              <li>Submissions must meet basic quality and authenticity standards</li>
            </ul>

            <h2>No Obligation</h2>
            <p>
              Submitting a testimonial does not create any ongoing obligation between you and MoveScout.
            </p>

            <h2>Contact</h2>
            <p>
              If you have any questions or would like your testimonial removed, contact:<br />
              <a href="mailto:Info@movescout.net" className="text-blue-600 hover:underline">Info@movescout.net</a>
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
