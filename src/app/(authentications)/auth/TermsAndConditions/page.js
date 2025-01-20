import React from 'react';
import Link from 'next/link';

const TermsAndConditions = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Terms and Conditions</h1>

      <p>Welcome to FinestShare! These Terms and Conditions Terms outline the rules and regulations for using our website and services. By accessing or using FinestShare Website, you agree to comply with these Terms. Please read them carefully.</p>

      <hr />

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing our Website, you accept these Terms in full. If you disagree with any part of these Terms, you must not use our Website.</p>

      <h2>2. Modification of Terms</h2>
      <p>FinestShare reserves the right to revise these Terms at any time without prior notice. Changes will be effective immediately upon posting on this page. Your continued use of the Website after changes are posted constitutes acceptance of the revised Terms.</p>

      <h2>3. Use of the Website</h2>
      <ul>
        <li>You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the Website.</li>
        <li>You are prohibited from using the Website to engage in any fraudulent, harmful, or malicious activities.</li>
      </ul>

      <h2>4. User Accounts</h2>
      <ul>
        <li>You may be required to create an account to access certain features of the Website.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</li>
        <li>You must notify FinestShare immediately of any unauthorized use of your account.</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>All content on this Website, including text, graphics, logos, images, and software, is the property of FinestShare or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or exploit any content without prior written permission from FinestShare.</p>

      <h2>6. Third-Party Links</h2>
      <p>The Website may contain links to third-party websites for your convenience. FinestShare does not endorse or assume responsibility for the content or practices of any third-party websites. You access linked websites at your own risk.</p>

      <h2>7. Limitation of Liability</h2>
      <p>FinestShare will not be liable for any damages arising from your use of the Website, including but not limited to direct, indirect, incidental, consequential, or punitive damages. We do not guarantee that the Website will be error-free, secure, or uninterrupted.</p>

      <h2>8. Indemnification</h2>
      <p>You agree to indemnify and hold FinestShare, its affiliates, employees, and partners harmless from any claims, losses, or damages arising out of your use of the Website or violation of these Terms.</p>

      <h2>9. Termination</h2>
      <p>FinestShare reserves the right to suspend or terminate your access to the Website at any time, without notice, for any violation of these Terms or for any other reason. Upon termination, your right to use the Website will cease immediately.</p>

      <h2>10. Privacy Policy</h2>
      <p>Your use of the Website is also governed by our Privacy Policy, which is incorporated by reference into these Terms.</p>

      <h2>11. Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising out of these Terms will be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].</p>

      <h2>12. Contact Information</h2>
      <p>If you have any questions about these Terms, please contact us at:</p>
      <address>
        FinestShare<br />
        Email: <a href="mailto:support@finestshare.com">support@finestshare.com</a>
      </address>

      <p>Thank you for choosing FinestShare. Enjoy our services!</p>
      <Link  className='flex justify-end w-full' href={"/auth/signup"}><button className='bg-slate-700   hover:bg-slate-500 m-2 rounded-sm p-3'>Back To Sign Up</button></Link>
    </div>
  );
};

export default TermsAndConditions;
