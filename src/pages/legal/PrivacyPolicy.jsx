import LegalLayout, { Section, P, UL } from './LegalLayout'

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 2026">
      <Section title="1. Who We Are">
        <P>SprintForge ("we", "us", "our") operates sprintforge.in, a project-based full-stack developer training platform. Our contact email is <a href="mailto:support@sprintforge.in" style={{ color: '#f59e0b' }}>support@sprintforge.in</a>.</P>
      </Section>

      <Section title="2. Information We Collect">
        <P>When you apply, register, or use SprintForge, we collect:</P>
        <UL items={[
          'Name, email address, and phone number (provided during application)',
          'College name and location (optional, for cohort matching)',
          'GitHub profile URL (optional, for project submissions)',
          'Payment information (processed securely by Razorpay — we never store card details)',
          'Course activity data: lessons watched, assignments submitted, PR URLs, AI review results',
          'Browser and device information (for security and debugging)',
        ]} />
      </Section>

      <Section title="3. How We Use Your Information">
        <UL items={[
          'To provide and improve the SprintForge platform and curriculum',
          'To communicate course updates, assignment feedback, and announcements',
          'To process payments via Razorpay',
          'To run AI-powered code reviews on your pull request submissions',
          'To monitor platform health and fix technical issues',
          'To comply with legal obligations',
        ]} />
        <P>We do not sell, rent, or share your personal data with third parties for marketing purposes.</P>
      </Section>

      <Section title="4. Third-Party Services">
        <P>SprintForge uses the following third-party services to operate:</P>
        <UL items={[
          'Razorpay — payment processing (governed by Razorpay\'s Privacy Policy)',
          'Anthropic Claude API — AI code review (PR diffs are sent for analysis)',
          'GitHub — pull request submission and review',
          'Railway — backend hosting and database',
          'Vercel — frontend hosting',
        ]} />
        <P>Each service operates under its own privacy policy. We only share the minimum data required for each service to function.</P>
      </Section>

      <Section title="5. Data Retention">
        <P>We retain your account data for the duration of your enrollment and up to 2 years after your last activity, to support placement assistance and transcript requests. You may request deletion at any time by emailing us.</P>
      </Section>

      <Section title="6. Your Rights">
        <P>You have the right to:</P>
        <UL items={[
          'Access the personal data we hold about you',
          'Correct inaccurate data',
          'Request deletion of your account and data',
          'Withdraw consent for non-essential communications',
        ]} />
        <P>To exercise any of these rights, email <a href="mailto:support@sprintforge.in" style={{ color: '#f59e0b' }}>support@sprintforge.in</a>.</P>
      </Section>

      <Section title="7. Cookies">
        <P>SprintForge uses browser localStorage and sessionStorage to keep you logged in and remember your progress. We do not use advertising cookies or tracking pixels.</P>
      </Section>

      <Section title="8. Security">
        <P>Passwords are hashed using bcrypt and never stored in plain text. All data is transmitted over HTTPS. Access tokens expire after 15 minutes. We take reasonable technical measures to protect your data, but no system is 100% secure.</P>
      </Section>

      <Section title="9. Changes to This Policy">
        <P>We may update this policy from time to time. We will notify enrolled students by email of material changes. Continued use of SprintForge after changes constitutes acceptance of the updated policy.</P>
      </Section>

      <Section title="10. Contact">
        <P>For privacy-related questions, email <a href="mailto:support@sprintforge.in" style={{ color: '#f59e0b' }}>support@sprintforge.in</a>.</P>
      </Section>
    </LegalLayout>
  )
}
