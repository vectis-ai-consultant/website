// The industry layer.
//
// The four services (agents, social, chatbot, training) are horizontal: they say
// what we build, and leave the reader to work out whether it applies to them. This
// says it for them. Every workflow below is one of those same four services wearing
// the language of a particular trade — that is the whole trick, and it is why this
// costs content rather than engineering.
//
// ADR-0001 governs what may be written here: no client names, no testimonials, no
// outcome numbers. So `wins` are the buyer's own measures stated without a figure
// attached, and every workflow describes what the system does, never what it
// achieved for someone else.

export type Workflow = { title: string; body: string }
export type Industry = {
  slug: string
  name: string
  /** The one line that appears on the card, in the reader's language, not ours. */
  promise: string
  /** Who this is for, and where a person stays in the loop. */
  lede: string
  /** Three measures the buyer already tracks. Never numbers. */
  wins: [string, string, string]
  workflows: Workflow[]
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'legal-professional',
    name: 'Legal & Professional Services',
    promise: 'Take on more matters without adding more admin.',
    lede: 'For firms where the billable hour is the product and intake, documents and follow-up are the tax on it. Every draft stays a draft until someone qualified approves it.',
    wins: ['Faster intake', 'Nothing dropped', 'More billable time'],
    workflows: [
      { title: 'Client intake', body: 'Collect the file, read what was sent, and open the matter with the details already filled in.' },
      { title: 'Document drafting', body: 'Assemble first drafts from your own precedents and put them in front of a person to approve.' },
      { title: 'Deadline tracking', body: 'Watch limitation dates and filing windows, and raise the ones that need a decision.' },
      { title: 'Client updates', body: 'Answer "where is my file" from the matter record instead of from someone\'s memory.' },
      { title: 'Conflict and document checks', body: 'Flag missing signatures, missing IDs, and files that are not ready to proceed.' },
      { title: 'Firm knowledge', body: 'Give the team answers out of your own precedents, policies and past matters.' },
    ],
  },
  {
    slug: 'immigration-education',
    name: 'Immigration & Study Abroad',
    promise: 'Run more applications at once without losing track of any of them.',
    lede: 'For consultancies handling long, document-heavy applications across time zones and languages. The system prepares; a licensed consultant decides.',
    wins: ['Shorter turnaround', 'Cleaner files', 'Fewer status calls'],
    workflows: [
      { title: 'Document collection', body: 'Chase the missing passport page or transcript automatically, in the applicant\'s own language.' },
      { title: 'Form preparation', body: 'Fill application forms from what the client already gave you, ready for review.' },
      { title: 'Eligibility screening', body: 'Sort enquiries by programme against published criteria before anyone books a call.' },
      { title: 'Application tracking', body: 'Keep every file\'s stage current and surface the ones that have gone quiet.' },
      { title: 'Bilingual enquiry handling', body: 'Answer routine questions on your site around the clock, in English or Chinese.' },
      { title: 'Deadline and intake windows', body: 'Track school intakes and submission windows, and flag what must move this week.' },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    promise: 'Be the first to answer, every time.',
    lede: 'For agents and brokerages where the lead that waits an hour is already someone else\'s. Answering is automatic; advising stays yours.',
    wins: ['Immediate lead response', 'Consistent follow-up', 'Fuller pipeline'],
    workflows: [
      { title: 'Lead response', body: 'Reply to a portal or form enquiry in seconds, at any hour, and book the showing.' },
      { title: 'Listing content', body: 'Turn the feature sheet into listing copy and a week of social posts in your voice.' },
      { title: 'Long-term nurture', body: 'Keep in touch with the buyer who is twelve months out without anyone remembering to.' },
      { title: 'Showing coordination', body: 'Handle scheduling and reminders so fewer appointments quietly fall through.' },
      { title: 'Neighbourhood questions', body: 'Answer school, transit and fee questions on your site from sources you control.' },
      { title: 'Transaction follow-through', body: 'Track conditions and deadlines, and raise what is at risk of being missed.' },
    ],
  },
  {
    slug: 'home-services',
    name: 'Trades & Home Services',
    promise: 'Win the jobs you are currently missing while on site.',
    lede: 'For contractors and service businesses where the phone rings while both hands are busy. Quotes are prepared for you to send, never sent for you.',
    wins: ['More booked jobs', 'Faster quotes', 'Less evening paperwork'],
    workflows: [
      { title: 'After-hours call and chat handling', body: 'Capture the job, the address and the urgency when nobody is free to pick up.' },
      { title: 'Quote preparation', body: 'Turn site notes and photos into a priced draft quote for you to check and send.' },
      { title: 'Scheduling and reminders', body: 'Fill the calendar and cut no-shows with confirmations people actually read.' },
      { title: 'Review requests', body: 'Ask for the review at the right moment, once, without anyone remembering to.' },
      { title: 'Local social presence', body: 'Post finished work regularly so the business looks busy because it is.' },
      { title: 'Recurring maintenance', body: 'Bring back last year\'s customers before the season, not after it.' },
    ],
  },
  {
    slug: 'clinics-wellness',
    name: 'Clinics & Wellness',
    promise: 'Fill the schedule without adding front-desk hours.',
    lede: 'For clinics and practitioners whose front desk is the bottleneck. Nothing here touches clinical judgement, and no system answers a medical question.',
    wins: ['Fewer empty slots', 'Shorter phone queues', 'Steadier rebooking'],
    workflows: [
      { title: 'Booking and rescheduling', body: 'Take routine bookings and changes around the clock, straight into your calendar.' },
      { title: 'Reminders and recalls', body: 'Cut no-shows, and bring back patients who are due without a manual list.' },
      { title: 'Pre-visit intake', body: 'Collect forms and history before the appointment so the visit starts on time.' },
      { title: 'Service and pricing questions', body: 'Answer what you treat, what it costs and what is covered — from your own material.' },
      { title: 'Waitlist filling', body: 'Offer a cancelled slot to the right person automatically instead of letting it go.' },
      { title: 'Clinic social presence', body: 'Keep a steady, compliant stream of posts running without a marketing hire.' },
    ],
  },
  {
    slug: 'retail-ecommerce',
    name: 'Retail & Ecommerce',
    promise: 'Answer the question that decides the sale, at the moment it is asked.',
    lede: 'For stores where most carts are abandoned over one unanswered question. Answers come from your catalogue and policies, not from a general model guessing.',
    wins: ['Higher conversion', 'Lighter support load', 'More repeat orders'],
    workflows: [
      { title: 'Product questions', body: 'Answer sizing, stock, shipping and returns from your catalogue, on the page.' },
      { title: 'Order status', body: 'Handle "where is my order" without a ticket and without a person.' },
      { title: 'Product content', body: 'Write and refresh descriptions across the catalogue in a consistent voice.' },
      { title: 'Social and UGC', body: 'Keep posting across platforms from the products and content you already have.' },
      { title: 'Win-back and retention', body: 'Reach the customer who bought once, at the point it is worth reaching them.' },
      { title: 'Review and feedback reading', body: 'Turn what customers keep saying into a short list of things to fix.' },
    ],
  },
  {
    slug: 'hospitality',
    name: 'Restaurants & Hospitality',
    promise: 'Respond like a bigger team than you have.',
    lede: 'For venues where enquiries arrive during service and get answered after it. Built to hand off to a human the moment it matters.',
    wins: ['Faster guest response', 'More direct bookings', 'Fewer missed enquiries'],
    workflows: [
      { title: 'Enquiry handling', body: 'Answer hours, menus, dietary and parking questions instantly, in any language.' },
      { title: 'Reservations and events', body: 'Take bookings and qualify private-event enquiries before they reach a manager.' },
      { title: 'Review responses', body: 'Draft a reply to every review for an owner to approve and post.' },
      { title: 'Social presence', body: 'Post specials and events on a schedule instead of whenever someone remembers.' },
      { title: 'Staff knowledge', body: 'Give new staff instant answers on menu, allergens and process during a shift.' },
      { title: 'Quiet-period campaigns', body: 'Push the offer to past guests when the room needs filling, not the week after.' },
    ],
  },
  {
    slug: 'finance-accounting',
    name: 'Accounting & Bookkeeping',
    promise: 'Spend the season advising, not chasing paperwork.',
    lede: 'For firms whose busiest weeks are spent collecting documents and answering the same client questions. Every figure stays under professional review.',
    wins: ['Shorter close', 'Less chasing', 'More advisory time'],
    workflows: [
      { title: 'Document collection', body: 'Chase the missing receipt or slip until it arrives, without anyone doing it.' },
      { title: 'Client onboarding', body: 'Take a new client from first enquiry to a complete file with nothing missing.' },
      { title: 'Routine client questions', body: 'Answer deadline, deduction and process questions from your own guidance.' },
      { title: 'Internal knowledge', body: 'Give staff answers out of your procedures instead of interrupting a partner.' },
      { title: 'Deadline management', body: 'Track filing dates per client and raise what is going to be tight.' },
      { title: 'Team training', body: 'Get the whole firm using AI tools properly, and safely, on client data.' },
    ],
  },
]

export const bySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug)
