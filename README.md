# HERACLES | Personal Calendar & To-Do PWA

An executive-grade multi-timezone workload calendar and To-Do Progressive Web App (PWA) crafted with Next.js 15, React 19, TypeScript, and Tailwind CSS. Faithfully designed to match the high-density dual-timezone matrix layout shown in the reference screenshot.

Hosted on: **[deepthakkar.vercel.app/personal-calendar](https://deepthakkar.vercel.app/personal-calendar)**

---

## Key Features

1. **Screenshot-Accurate Month Matrix**:
   - **Header Title**: `HERACLES` (Customizable in Settings)
   - **Gradient Summary Badges**:
     - `TOTAL: 115` (Burgundy / Ruby gradient `#7a1236`)
     - `IST: 79 | CST: 36` (Deep violet / indigo gradient `#431773`)
   - **7-Column Calendar Grid (`SUN` to `SAT`)**:
     - Day numbers in the top-right corner.
     - Bold centered daily workload numerals.
     - Dual-timezone pill chips (`IST X` in sage green, `CST Y` in ice blue).
     - Color-coded workload heat levels:
       - **0**: Neutral slate (`#ecece5`)
       - **1 – 5**: Soft mint (`#dbeef0`)
       - **6 – 12**: Warm wheat amber (`#f6ebd4`)
       - **13+**: Soft coral rose (`#fcdcdc`, e.g. Day 9 with 17 items)
     - **Active Day Indicator**: Crisp rounded blue border ring on Day 11 (matching the photo).

2. **Sliding Day Detail Drawer**:
   - Click any day cell in the matrix to open a smooth slide-over workspace without losing month context.
   - **Dual-Timezone Hourly Timeline**: Side-by-side synchronized IST and CST times for clear cross-timezone collaboration.
   - **Meeting Cards**: 1-click video call join buttons (`Join Google Meet`, `Join Teams`, `Join Zoom`).
   - **Daily To-Do Task Checklist**: Interactive check-offs, priority tags (Urgent, High, Medium, Low), and instant task addition.

3. **Multi-Calendar & To-Do Synchronization**:
   - **iCal / WebCal Subscriptions**: Paste private ICS feeds (Microsoft Outlook WebCal, Google Calendar secret URL, Apple Calendar).
   - **CORS-Free Serverless Proxy**: Next.js route `/api/ical-proxy` safely pulls and parses external ICS feeds.
   - **Google & Microsoft Ready**: Connect personal Gmail or corporate Office 365 accounts.
   - **Local-First & Offline Ready**: IndexedDB caching ensures full functionality even without an internet connection.

4. **Multiple View Modes (Left Navigation Ribbon)**:
   - **Month Matrix** (Default executive workload overview)
   - **Week Timeline** (Dual-timezone hourly view)
   - **To-Do Master Hub** (Unified pending and completed task boards)
   - **Sync Hub & Settings** (Configure timezones, labels, and working hours)

5. **ICRB & Critical Deadlines Bottom Bar**:
   - Bottom alert ticker displaying impending reviews and high-priority commitments within 96 hours.
   - Purple notification bubble showing badge count (e.g. `16`).

---

## Quick Start (Local Development)

```bash
# Navigate to the project
cd heracles-calendar

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000/personal-calendar](http://localhost:3000/personal-calendar) in your browser.

---

## Deploy to Vercel (Zero-Config)

This application has been engineered with a zero-database client-first architecture, making it 100% ready for Vercel deployment:

- **Repository**: [https://github.com/imdeepthakkar/personal-calander](https://github.com/imdeepthakkar/personal-calander)
- **Live Gateway URL**: [https://deepthakkar.vercel.app/personal-calendar](https://deepthakkar.vercel.app/personal-calendar)
