import './Legal.css';

const PrivacyPolicy = () => {
  return (
    <main className="legal-page">
      <div className="container">
        <article className="legal-shell">
          <header className="legal-header">
            <p className="legal-brand">WedMeet - Digital Video Wedding Invitations</p>
            <h1 className="section-title">Privacy Policy</h1>
            <p className="legal-meta">
              Effective Date: March 22, 2026
              <br />
              +91 88306 59769 | @wedmeet.in
            </p>
          </header>

          <p className="legal-summary">
            This Privacy Policy explains how WedMeet collects, uses, stores, and protects customer information when providing digital video wedding invitation services.
          </p>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <ul>
              <li>Names of the couple and event-related details such as wedding date, venue, and requested text.</li>
              <li>Phone numbers and contact details shared through WhatsApp, Instagram, or other communication channels.</li>
              <li>Photos, videos, music preferences, and other customer-provided content used to create the invitation.</li>
              <li>Payment-related information required to confirm and complete the order.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To create, revise, and deliver customised digital video wedding invitations.</li>
              <li>To communicate about order status, draft approvals, revisions, delivery, and payment confirmation.</li>
              <li>To provide file re-sharing support where applicable.</li>
              <li>To maintain internal records related to your order and service history.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Data Sharing</h2>
            <ul>
              <li>WedMeet does not sell customer data.</li>
              <li>WedMeet does not share customer data with third parties for advertising or unrelated commercial use.</li>
              <li>Your information is used only to fulfil your order and related communication needs.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Confidentiality of Communication</h2>
            <ul>
              <li>Communications through WhatsApp and Instagram are treated as confidential.</li>
              <li>Customer details are handled only for the purpose of completing and supporting the order.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. File Storage and Retention</h2>
            <ul>
              <li>Final delivery links may be available for a limited period, and customers are expected to download files within 7 days.</li>
              <li>WedMeet may re-share the delivered file once within 30 days at no additional cost when requested.</li>
              <li>After the retention window, WedMeet is not responsible for lost files that were not downloaded by the customer.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Customer Rights</h2>
            <ul>
              <li>Customers may request deletion of their personal data after order completion by contacting WedMeet on WhatsApp.</li>
              <li>Customers are responsible for ensuring the information they provide is correct and up to date.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Portfolio and Marketing Use</h2>
            <ul>
              <li>WedMeet may use a completed video without personal details for portfolio or marketing use.</li>
              <li>If you do not want your completed invitation used in this way, you must clearly request that in writing.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Policy Updates</h2>
            <ul>
              <li>WedMeet may update this Privacy Policy from time to time.</li>
              <li>Updated policy details may be shared through official channels including Instagram at @wedmeet.in.</li>
            </ul>
          </section>

          <footer className="legal-footer">
            For privacy-related questions, contact WedMeet on WhatsApp: +91 88306 59769.
          </footer>
        </article>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
