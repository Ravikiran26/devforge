import LegalLayout, { Section, P, UL } from './LegalLayout'

export default function Refund() {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="May 2026">
      <Section title="Our Commitment">
        <P>We want every SprintForge student to succeed. If you feel the program is not right for you, we offer a fair refund window — but please read the conditions carefully before enrolling.</P>
      </Section>

      <Section title="Full Refund — Within 7 Days">
        <P>You are eligible for a <strong style={{ color: '#e6edf3' }}>full refund</strong> if you request it within 7 calendar days of payment and have not completed more than 2 lessons.</P>
        <P>To request a refund, email <a href="mailto:support@sprintforge.in" style={{ color: '#f59e0b' }}>support@sprintforge.in</a> with your registered email and reason. Refunds are processed within 5–7 business days to the original payment method.</P>
      </Section>

      <Section title="No Refund After 7 Days">
        <P>After 7 days from payment — or once you have completed more than 2 lessons (whichever comes first) — <strong style={{ color: '#e6edf3' }}>no refund is issued</strong>.</P>
        <P>This policy exists because:</P>
        <UL items={[
          'Course content and mentor time are delivered from Day 1',
          'AI review infrastructure costs are incurred per submission',
          'Cohort seats are limited — a held seat cannot be offered to another student',
        ]} />
      </Section>

      <Section title="Exceptions">
        <P>We will consider exceptions on a case-by-case basis for:</P>
        <UL items={[
          'Serious medical emergencies (documentation required)',
          'Significant platform downtime (more than 72 hours) caused by SprintForge',
          'Duplicate payments (full refund of duplicate amount, immediately)',
        ]} />
        <P>Email us at <a href="mailto:support@sprintforge.in" style={{ color: '#f59e0b' }}>support@sprintforge.in</a> with supporting details. We respond within 2 business days.</P>
      </Section>

      <Section title="Deferral Option">
        <P>If you cannot continue due to personal circumstances after the refund window, you may request a <strong style={{ color: '#e6edf3' }}>one-time deferral</strong> to the next batch (subject to seat availability). Deferrals must be requested before Week 4 begins. No cash refund is issued in lieu of deferral.</P>
      </Section>

      <Section title="Career Plan — Mock Interviews">
        <P>The Career Plan includes resume review and 2 mock interviews. These are scheduled in Week 12. If you do not complete the program, unused sessions are forfeited — they cannot be refunded or transferred.</P>
      </Section>

      <Section title="Chargebacks">
        <P>Filing a chargeback without contacting us first will result in immediate account suspension and a permanent ban from SprintForge. We keep detailed records of course access and will contest any fraudulent chargeback. Please contact us first — we are reasonable people.</P>
      </Section>

      <Section title="How to Request a Refund">
        <P>Email <a href="mailto:support@sprintforge.in" style={{ color: '#f59e0b' }}>support@sprintforge.in</a> with:</P>
        <UL items={[
          'Subject line: "Refund Request — [your name]"',
          'Your registered email address',
          'Razorpay payment ID (found in your payment confirmation email)',
          'Brief reason for the request',
        ]} />
        <P>We will acknowledge within 24 hours and process eligible refunds within 5–7 business days.</P>
      </Section>
    </LegalLayout>
  )
}
