# DevForge — Student Build Products
## USP Document · All Three Products
**Version 1.0 · Confidential · Internal Use Only**

---

## Overview

Students in the DevForge AI Developer Program build three real, market-ready products
as their curriculum projects. These are not practice apps — they are real software
products with identified market gaps, real target customers, and a clear path to revenue.

Each product is designed to be:
- Buildable by a learning developer in 3 weeks
- Sellable to a real paying market immediately after launch
- Distinct enough in tech stack to teach progressively advanced skills

---

---

# PRODUCT 1 — InvoiceWala
## GST Invoice Manager for Indian Freelancers

**Tagline:** *"Send GST invoices in 60 seconds. Get paid faster."*

**Built in:** Weeks 2–4 | **Tech:** Node.js + React + PostgreSQL + PDF generation

---

### The Problem

India has over 15 million freelancers — developers, designers, writers, consultants,
video editors — and almost all of them struggle with the same thing: invoicing.

- They send invoices over WhatsApp as screenshots
- They use Word/Excel templates that don't calculate GST correctly
- They have no idea which clients have paid and which haven't
- They lose money chasing payments manually
- Foreign tools (FreshBooks, Wave, QuickBooks) don't understand Indian GST structure
  (CGST / SGST / IGST), are priced in USD, and require VPN to work properly
- Indian tools (Zoho Invoice, Vyapar) are built for businesses — too complex for a
  solo freelancer who just wants to send one invoice

**The result:** Freelancers lose hours every month on invoicing admin, and some
never follow up on unpaid invoices because it's too much hassle.

---

### The Solution — InvoiceWala

A dead-simple GST invoice manager built specifically for Indian solo freelancers.
No accounting jargon. No complex setup. Open it, fill in the details, send the PDF.

---

### Target Audience

| Primary | Secondary |
|---|---|
| Freelance developers | Graphic designers |
| UI/UX designers | Content writers |
| Video editors | Social media managers |
| Consultants and coaches | Independent photographers |

**Geography:** India — Tier 1, 2, and 3 cities
**Income level:** ₹30,000–₹3,00,000/month freelance income
**Tech comfort:** Uses Notion, Figma, Google Drive — comfortable with web apps

---

### Key Features

| Feature | Description |
|---|---|
| **Client management** | Add clients once — name, GST number, address. Reuse forever |
| **GST-correct invoices** | Auto-calculates CGST + SGST (same state) or IGST (different state) based on client address |
| **PDF generation** | One click → professional PDF with your logo, bank details, and GST breakdown |
| **Payment tracking** | Mark invoices as Paid / Partially Paid / Overdue. Dashboard shows total outstanding |
| **Payment reminders** | Automated WhatsApp/email reminder when invoice is 7, 14, 30 days overdue |
| **Recurring invoices** | Set up monthly retainer invoices — auto-generated on the 1st of every month |
| **Expense tracking** | Log business expenses. View profit vs expenses per month |
| **Multi-currency** | Invoice international clients in USD/EUR — auto-converts for your GST filing |

---

### Why InvoiceWala Wins

| Competitor | Problem for Indian Freelancers |
|---|---|
| FreshBooks | USD pricing, no CGST/SGST split, built for Western accounting |
| Zoho Invoice | Too complex, designed for businesses not solo freelancers |
| Vyapar | Desktop app, heavy, overkill for service-based freelancers |
| Wave | No Indian GST support, foreign bank integration only |
| Excel template | Manual, error-prone, no tracking, no reminders |
| **InvoiceWala** | ✅ Indian GST built-in · ✅ ₹199/month · ✅ Minimal, 60-second invoicing |

**The real advantage:** Every competitor either doesn't understand Indian GST or is
designed for a business with an accountant. InvoiceWala is the first tool built
*specifically* for the Indian solo freelancer with no accounting knowledge.

---

### Pricing

| Plan | Price | What's included |
|---|---|---|
| **Free** | ₹0/month | 3 invoices/month, 2 clients, basic PDF |
| **Pro** | ₹199/month | Unlimited invoices, unlimited clients, reminders, recurring |
| **Annual** | ₹1,999/year | Everything in Pro — 2 months free |

**Revenue model:** SaaS subscription. Target: 500 paying users at ₹199 = ₹99,500 MRR

---

### Market Opportunity

- 15 million freelancers in India (NASSCOM, 2024)
- Freelance economy growing 25% YoY
- Only 2–3% use any invoicing software → massive untapped market
- Even 0.1% penetration = 15,000 users → ₹30L MRR

---

### Where to Sell

- **ProductHunt launch** — target #3 product of the day
- **IndiaHacks / freelancer communities** on LinkedIn and Reddit r/IndiaFinance
- **Direct outreach** to freelancer Facebook groups (100k+ members each)
- **YouTube SEO** — "How to send GST invoice as a freelancer in India"

---

---

# PRODUCT 2 — ClassPro
## Coaching Center & Tuition Management System

**Tagline:** *"Run your coaching center. Not your WhatsApp group."*

**Built in:** Weeks 4–6 | **Tech:** Node.js + React + PostgreSQL + Razorpay + Roles

---

### The Problem

India has over 10 million coaching centers, tuition classes, and skill training institutes.
From IIT-JEE coaching in Kota to local math tuitions in every Tier 2 city — this is
one of the largest and most fragmented markets in India.

And almost all of them run on:
- WhatsApp groups for announcements and communication
- Paper registers for attendance
- Excel sheets for fee tracking
- Cash receipts written by hand
- No way for parents to check their child's attendance or fee status

**The pain is real:**
- Teachers spend 2–3 hours/week chasing fee defaulters individually
- Parents call to ask "has my child attended today?" — teacher has to check a register
- When a student pays in instalments, tracking becomes a nightmare
- There is no way to send batch-specific announcements — it goes to one big group
- End of year, there is no data on which students performed, who dropped out, why

**Existing tools like Teachmint, Classplus, and Extramarks are built for large
institutes with 500+ students and ₹50,000+/month budgets. A local coaching center
with 40–80 students cannot afford them and finds them too complex.**

---

### The Solution — ClassPro

A simple, affordable management system for small-to-medium coaching centers (20–200 students).
Built for the teacher who knows their subject but hates admin work.

---

### Target Audience

| Primary | Secondary |
|---|---|
| Independent tuition teachers | Spoken English institutes |
| Small IIT/NEET coaching centers | Personality development classes |
| Dance/music/art academies | Skill training institutes (coding, typing) |
| Sports coaching academies | Language coaching (IELTS, PTE) |

**Geography:** India — primarily Tier 2 and Tier 3 cities
**Center size:** 20–200 students
**Monthly fee charged to students:** ₹500–₹5,000/month
**Tech comfort of owner:** Uses smartphone, WhatsApp, knows basic apps

---

### Key Features

| Feature | Description |
|---|---|
| **Student enrollment** | Add students with parent details, photo, batch, fee plan |
| **Batch management** | Create multiple batches by subject, time, or level |
| **Attendance** | Mark attendance per class, per batch. Daily/monthly report auto-generated |
| **Fee management** | Set fee structure per batch. Track paid/partial/due. Auto-calculate installments |
| **Razorpay integration** | Students/parents pay online directly from the portal |
| **Fee receipts** | Auto-generated PDF receipt on every payment |
| **WhatsApp reminders** | Auto-send fee due reminders to parent's WhatsApp number |
| **Announcements** | Post announcements per batch — no more cluttered WhatsApp groups |
| **Performance tracking** | Record test marks per student. Generate progress report cards |
| **Parent portal** | Parent login → see child's attendance, fees, test marks |
| **Dashboard** | Teacher sees: today's attendance, fee collection this month, overdue fees |

---

### Why ClassPro Wins

| Competitor | Problem |
|---|---|
| Teachmint | Built for large schools/institutes, complex, ₹25,000+/month |
| Classplus | Requires app download, heavy features, expensive for small centers |
| Extramarks | Enterprise product, needs dedicated IT team to set up |
| Excel + WhatsApp | No structure, manual, no parent visibility, data lost easily |
| Paper registers | Zero digital, no reminders, no reports, no online payments |
| **ClassPro** | ✅ ₹499/month · ✅ 10-minute setup · ✅ Built for 20–200 students |

**The real advantage:** Every existing tool is built for the top 1% of coaching centers.
ClassPro is built for the 99% — the local teacher running a center from their home or
a rented room who just needs to stop chasing fee payments on WhatsApp.

---

### Pricing

| Plan | Price | Students |
|---|---|---|
| **Starter** | ₹299/month | Up to 50 students |
| **Growth** | ₹499/month | Up to 150 students |
| **Pro** | ₹799/month | Unlimited students + parent portal + Razorpay |
| **Annual discount** | 2 months free on any plan | — |

**Revenue model:** SaaS subscription. Target: 300 paying centers at ₹499 = ₹1,49,700 MRR

---

### Market Opportunity

- 10 million+ coaching centers in India (MHRD estimate)
- Only ~0.5% use any digital management software
- Average center pays ₹500–₹800/month for any software they currently use
- Even 5,000 centers at ₹499 = ₹25L MRR = ₹3Cr ARR
- Word-of-mouth is very strong in this market — teachers know teachers

---

### Where to Sell

- **YouTube** — "How to manage your coaching center without WhatsApp" — gets organic traffic
- **Teacher Facebook groups** — massive communities of 50k–200k coaching teachers
- **Local education expos** in Tier 2 cities (Indore, Nagpur, Patna, Jaipur)
- **WhatsApp outreach** — directly message coaching center admins found on Google Maps
- **Referral program** — give 1 month free for every referral → teachers refer other teachers

---

---

# PRODUCT 3 — DeliverDesk
## Client Portal for Freelancers and Small Agencies

**Tagline:** *"Stop sending files on WhatsApp. Look like a pro agency."*

**Built in:** Weeks 6–8 | **Tech:** Node.js + React + MongoDB + Socket.io + Cloudinary

---

### The Problem

Every freelancer and small agency has the same workflow problem:

1. Project starts → share brief on email
2. Work done → share file on Google Drive or WeTransfer
3. Client reviews → feedback comes on WhatsApp voice note
4. Revision done → another Drive link on email
5. Approval needed → chasing client for a reply on WhatsApp
6. Final files → another Drive folder
7. Invoice → WhatsApp photo of a PDF

**This is unprofessional, chaotic, and loses deals.** When a client asks "where is the
latest version?" neither the freelancer nor the client knows.

Bigger agencies use tools like Basecamp, Notion, or Monday.com — but these are
either too expensive or too complex for a freelancer or 2–5 person agency.

**There is no clean, affordable, purpose-built client portal for small creative agencies.**

---

### The Solution — DeliverDesk

A dedicated client portal where freelancers and agencies deliver work, collect feedback,
get approvals, and communicate — all in one place. Clients don't need to download anything.
They open a link, see their project, and leave feedback directly.

---

### Target Audience

| Primary | Secondary |
|---|---|
| Freelance web developers | Video production companies |
| Graphic designers | Social media agencies |
| UI/UX designers | SEO and digital marketing agencies |
| Branding agencies (2–10 people) | Copywriting freelancers |

**Geography:** Global — India, Southeast Asia, Middle East, UK, USA
**Agency size:** Solo freelancer to 10-person agency
**Monthly revenue:** $2,000–$50,000/month
**Tech comfort:** High — uses Figma, Slack, Linear, Notion

---

### Key Features

| Feature | Description |
|---|---|
| **Project workspace** | One clean space per client project — no more scattered Drive links |
| **File delivery** | Upload deliverables directly. Client sees versioned files with timestamps |
| **Annotation feedback** | Client clicks on an image and leaves a comment directly on it |
| **Approval system** | Client clicks Approve or Request Changes — logged with timestamp |
| **Real-time notifications** | Instant notification when client views, comments, or approves (Socket.io) |
| **Activity timeline** | Full history — who uploaded what, who approved, when |
| **Client login** | Client gets a magic link — no password needed. One click access |
| **Revision rounds** | Set revision limit per project. Client sees "2 of 3 revisions used" |
| **Project status** | Visual stages: Brief → In Progress → Review → Approved → Delivered |
| **Invoice integration** | Generate invoice from within the portal — connected to the project |
| **White label** | Agency can use their own domain and logo — client sees agency brand |

---

### Why DeliverDesk Wins

| Competitor | Problem |
|---|---|
| Basecamp | Too broad, not focused on client delivery workflow, $99/month |
| Monday.com | Built for internal teams, overwhelming for clients, expensive |
| Notion | Not built for client portals, no approval workflow, complex to set up |
| Google Drive + Email | No approval flow, no versioning, zero professionalism |
| Bonsai | US-focused, USD pricing, no file annotation |
| **DeliverDesk** | ✅ Purpose-built for client delivery · ✅ $19/month · ✅ Client needs zero setup |

**The real advantage:** Every competitor is either an internal project management tool
repurposed for clients, or a full agency suite priced at $100+/month. DeliverDesk
does one thing perfectly — delivering work to clients and getting approvals — at a
price any freelancer can afford.

---

### Pricing

| Plan | Price | Projects |
|---|---|---|
| **Freelancer** | $19/month | 5 active projects, 10GB storage |
| **Agency** | $49/month | Unlimited projects, 50GB, white label |
| **Lifetime Deal** | $129 one-time | Freelancer plan forever — AppSumo launch |

**Revenue model:** SaaS + AppSumo lifetime deal launch to get first 500 users.
Target: 300 monthly subscribers at $29 avg = $8,700 MRR

---

### Market Opportunity

- 59 million freelancers globally (Upwork/Statista 2024)
- Creative agency market growing 12% YoY
- No dominant player in the sub-$50/month client portal category
- AppSumo lifetime deal can generate $50,000–$200,000 in first 30 days if positioned right

---

### Where to Sell

- **ProductHunt launch** — target #1 product of the day in Productivity
- **AppSumo lifetime deal** — proven to generate 1,000–5,000 customers in 30 days
- **Twitter/X** — freelance and agency Twitter is very active, organic reach is high
- **YouTube SEO** — "Best client portal for freelancers 2025" gets consistent traffic
- **Indie Hackers / Hacker News** — Show HN: DeliverDesk

---

---

# Summary — All Three Products

| | InvoiceWala | ClassPro | DeliverDesk |
|---|---|---|---|
| **Market** | Indian freelancers | Indian coaching centers | Global freelancers/agencies |
| **Problem solved** | GST invoicing chaos | Paper/WhatsApp admin | Client delivery chaos |
| **Biggest competitor** | Zoho Invoice | Teachmint | Basecamp |
| **Our advantage** | India-first, simple | Built for 20–200 students | Purpose-built delivery portal |
| **Price** | ₹199/month | ₹499/month | $19/month |
| **Target MRR** | ₹99,500 (500 users) | ₹1,49,700 (300 centers) | $8,700 (300 users) |
| **Sell via** | ProductHunt + Communities | WhatsApp outreach + YouTube | AppSumo + ProductHunt |
| **Built in weeks** | 2–4 | 4–6 | 6–8 |
| **Tech highlight** | PDF generation | Razorpay + multi-role | Socket.io + real-time |

---

## Why This Trio Works

**Progressive complexity** — each product teaches new skills on top of the previous one.
Students are never overwhelmed, but they are always levelling up.

**Three different markets** — InvoiceWala targets Indian freelancers, ClassPro targets
Indian coaching centers, DeliverDesk targets the global market. Three separate
revenue streams, three separate audiences, minimal overlap.

**All three have real paying customers waiting** — these are not ideas. These are
documented pain points with large, underserved markets and weak or non-existent
competition at the price point we are targeting.

---

*DevForge AI Developer Program · Product USP Document · Version 1.0*
*Prepared by: Program Team · Confidential*
