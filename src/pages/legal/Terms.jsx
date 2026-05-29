import LegalLayout, { Section, P, UL } from './LegalLayout'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 2026">
      <Section title="1. Acceptance of Terms">
        <P>By applying to, paying for, or using SprintForge ("Platform"), you agree to these Terms of Service. If you do not agree, do not use the Platform. These terms form a binding agreement between you and SprintForge (sprintforge.in).</P>
      </Section>

      <Section title="2. What SprintForge Provides">
        <P>SprintForge is a 12-week project-based full-stack developer training program. The Platform includes:</P>
        <UL items={[
          'Structured weekly lessons (text-based, self-paced reading)',
          'Real-world project assignments (Restaurant Flow, Lead Bill, ClientDesk AI)',
          'AI-powered pull request code reviews via Claude',
          'Mentor feedback and grading within 24 hours of submission',
          'Jira-based sprint workflow (RF, LB, CA project boards)',
          'Career batch: resume review and mock interview (Career plan only)',
        ]} />
      </Section>

      <Section title="3. Eligibility">
        <P>SprintForge is open to anyone who can write basic JavaScript and use a terminal. You must be at least 18 years old or have parental consent. Students are expected to have a working laptop and stable internet connection.</P>
      </Section>

      <Section title="4. Student Responsibilities">
        <UL items={[
          'Complete lessons and assignments honestly — no copying others\' code',
          'Submit only your own original work for AI and mentor review',
          'Maintain a respectful environment in any cohort communication channels',
          'Keep your GitHub account active and your PR URLs accessible for review',
          'Notify us if you cannot continue — we do not offer make-up weeks',
        ]} />
      </Section>

      <Section title="5. Payment">
        <P>Fees are charged upfront at enrollment. Current pricing:</P>
        <UL items={[
          'Core Plan: ₹7,000 — full 12-week curriculum + AI reviews + mentor feedback',
          'Career Plan: ₹12,000 — Core Plan + resume review + 2 mock interviews',
        ]} />
        <P>All payments are processed by Razorpay. By paying, you agree to Razorpay\'s Terms of Service. GST is included in the stated price where applicable.</P>
      </Section>

      <Section title="6. Refund Policy">
        <P>Please read our <a href="/refund" style={{ color: '#f59e0b' }}>Refund Policy</a> carefully before enrolling. Refund eligibility is time-limited and subject to conditions described therein.</P>
      </Section>

      <Section title="7. Intellectual Property">
        <P>All SprintForge curriculum content, lesson text, project specifications, and platform code are owned by SprintForge. You may not copy, redistribute, or resell any course materials.</P>
        <P>The code you write during the program is yours. We do not claim ownership of your project submissions.</P>
      </Section>

      <Section title="8. AI Code Review">
        <P>SprintForge uses Anthropic Claude to review your pull request code. By submitting a PR URL, you consent to your code diff being sent to Anthropic's API for analysis. AI reviews are for educational feedback only — they are not professional software audits. Final grades are assigned by human mentors.</P>
      </Section>

      <Section title="9. Placement Assistance">
        <P>SprintForge provides career support (resume, mock interviews) on the Career plan. We do not guarantee job placement. Our role is to prepare you — hiring decisions are made by employers independently.</P>
      </Section>

      <Section title="10. Suspension & Termination">
        <P>We reserve the right to suspend or terminate access for violations of these terms, including academic dishonesty, harassment, or chargebacks without valid reason. No refund is issued on termination for cause.</P>
      </Section>

      <Section title="11. Limitation of Liability">
        <P>SprintForge is provided "as is." We are not liable for indirect, incidental, or consequential damages. Our total liability to you shall not exceed the amount you paid for the program.</P>
      </Section>

      <Section title="12. Governing Law">
        <P>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Hyderabad, Telangana.</P>
      </Section>

      <Section title="13. Contact">
        <P>Questions about these terms: <a href="mailto:support@sprintforge.in" style={{ color: '#f59e0b' }}>support@sprintforge.in</a></P>
      </Section>
    </LegalLayout>
  )
}
