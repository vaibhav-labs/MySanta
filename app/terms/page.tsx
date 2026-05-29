import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using MySanta ("the Service"), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                MySanta is a gift list management platform that allows users to create, share, and manage
                wish lists for various occasions. The service enables users to:
              </p>
              <ul>
                <li>Create and manage personal gift lists</li>
                <li>Share lists with friends and family</li>
                <li>Track gift purchases and coordination</li>
                <li>Organize events and associated gift lists</li>
              </ul>

              <h2>3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password.
                You agree to accept responsibility for all activities that occur under your account or password.
              </p>

              <h2>4. User Content</h2>
              <p>
                You retain ownership of all content you submit, post, or display on or through the Service.
                By submitting content, you grant MySanta a non-exclusive, royalty-free license to use,
                modify, and display such content for the purpose of providing the Service.
              </p>

              <h2>5. Privacy Policy</h2>
              <p>
                Your privacy is important to us. We collect and use information in accordance with our
                Privacy Policy. By using our Service, you consent to the collection and use of information
                as outlined in our Privacy Policy.
              </p>

              <h2>6. Prohibited Uses</h2>
              <p>You may not use the Service:</p>
              <ul>
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>

              <h2>7. Gift Lists and Purchases</h2>
              <p>
                MySanta is a coordination platform only. We do not process payments or handle transactions
                between users. All purchases are made directly through third-party retailers. MySanta is
                not responsible for:
              </p>
              <ul>
                <li>Product availability, quality, or delivery</li>
                <li>Payment processing or transaction disputes</li>
                <li>Merchant policies or customer service</li>
                <li>Product warranties or returns</li>
              </ul>

              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall MySanta, its directors, employees, partners, agents, suppliers, or affiliates
                be liable for any indirect, incidental, special, consequential, or punitive damages, including
                without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>

              <h2>9. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without
                prior notice or liability, under our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will provide at least 30 days notice prior to any new terms
                taking effect.
              </p>

              <h2>11. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us through
                the support channels available on our platform.
              </p>

              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which
                MySanta operates, without regard to its conflict of law provisions.
              </p>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> These terms and conditions are provided as a template and should be
                  reviewed by legal counsel before implementation in a production environment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}