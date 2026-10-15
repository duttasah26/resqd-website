/**
 * All page copy lives here so it can be edited in one place.
 * Voice: plain, concrete, numbers over adjectives. No marketing filler.
 */

export const site = {
  name: "ResQd",
  tagline: "Cloud-native wildfire response.",
  hero: {
    headline: "Wildfire response that keeps up with the fire.",
    sub: "ResQd is a wildfire emergency-response platform. It pulls field sensors, citizen reports, and evacuation routing onto one live map, so dispatchers see the fire early and move people before it reaches the road.",
    primaryCta: { label: "Join the waitlist", href: "#waitlist" },
    secondaryCta: { label: "See how it works", href: "#how-it-works" },
  },
} as const;

export const nav = {
  // In page order.
  links: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Problem", href: "#problem" },
    { label: "Platform", href: "#platform" },
    { label: "Architecture", href: "#architecture" },
    { label: "Use cases", href: "#in-action" },
    { label: "Dashboard", href: "#dashboard" },
  ],
  cta: { label: "Join the waitlist", href: "#waitlist" },
} as const;

export const problem = {
  heading: "Fires move faster than the response.",
  body: "In Canada's forests a fire can be burning for hours before anyone with authority knows where it is. By the time an alert goes out, the people who need to leave are often the last to hear it.",
  stats: [
    {
      value: "8.3M",
      unit: "hectares",
      label: "burned in 2025, the second-worst wildfire season on record.",
      source: "Public Safety Canada, 2025",
    },
    {
      value: "6,000+",
      unit: "wildfires",
      label: "across nearly every province and territory in a single season.",
      source: "Public Safety Canada, 2025",
    },
    {
      value: "17.3M",
      unit: "hectares",
      label: "burned in 2023, the highest total since records began.",
      source: "Natural Resources Canada, 2024",
    },
  ],
  closing:
    "Detection is slow and communication only runs one way. ResQd closes both gaps.",
} as const;

export const platform = {
  heading: "One map for sensors, reports, and people.",
  sub: "Five parts of the same system. Each one feeds the live picture dispatchers work from.",
} as const;

export const productStory = {
  heading: "From first spark to a safe way out.",
  sub: "Follow one incident from the first spark to a safe exit. The dispatcher sees it on the live map while residents see it in the app.",
  steps: [
    {
      time: "00:00",
      key: "detect",
      title: "A fire is detected",
      desc: "A field sensor's heat and smoke readings spike, and the Random Forest model flags a fire at 89% confidence. Residents can also report one with a photo from the app.",
    },
    {
      time: "00:04",
      key: "report",
      title: "The report hits the map",
      desc: "The photo uploads straight to S3 and the report drops onto the dispatcher's live map as a pending review.",
    },
    {
      time: "00:11",
      key: "verify",
      title: "A responder verifies it",
      desc: "Dispatch reviews the report and converts it into a tracked incident with a severity band.",
    },
    {
      time: "00:19",
      key: "broadcast",
      title: "An evacuation zone goes out",
      desc: "The dispatcher draws a broadcast radius, sets the priority, and sends an urgent evacuation order.",
    },
    {
      time: "00:20",
      key: "alert",
      title: "Phones in the radius alert",
      desc: "Every device inside the zone picks up the warning on its next 15-second poll.",
    },
    {
      time: "00:27",
      key: "route",
      title: "The safest way out",
      desc: "The app routes each person to the nearest safe zone, scored from 0 to 100 to stay clear of the active fire.",
    },
  ],
} as const;

export const howItWorks = {
  heading: "Cloud-native, built to stay up.",
  sub: "Sensor data and citizen reports move through a queue, a cache, and one always-on API that serves both the dispatcher dashboard and the civilian app in real time.",
  steps: [
    { label: "IoT sensors", note: "Dockerised nodes stream readings every ~30s" },
    { label: "AWS SQS", note: "Queue absorbs bursts without dropping data" },
    { label: "AWS Lambda", note: "Normalises, validates, runs change detection" },
    { label: "Redis", note: "Latest reading per sensor, 15-minute TTL" },
    { label: "FastAPI + WebSocket", note: "37 endpoints, live events to every client" },
    { label: "MongoDB Atlas + S3", note: "Incidents and reports; photos in S3" },
    { label: "Dashboard + mobile app", note: "Responders and civilians, same source of truth" },
  ],
} as const;

export const useCases = {
  heading: "Where it earns its place.",
  items: [
    {
      icon: "local_fire_department",
      title: "Community structure fire",
      body: "A verified report becomes a tracked incident on the map. Dispatch draws an evacuation broadcast and every phone inside the radius gets it on the next poll.",
    },
    {
      icon: "alt_route",
      title: "Evacuation coordination",
      body: "Routing scores each way out against active hazards and picks the one that stays clear of the fire, not just the shortest one.",
    },
    {
      icon: "sensors",
      title: "Early detection in remote forest",
      body: "Sensors in high-risk zones flag a rising heat and smoke signature before anyone calls it in, so responders start moving sooner.",
    },
  ],
} as const;

export const dashboard = {
  heading: "One console for the whole response.",
  sub: "Dispatchers work the incident list, broadcasts, and pending fire reviews from a single live summary. Every number updates as reports come in.",
} as const;

export const gallery = {
  heading: "See it running.",
  sub: "Screen captures from the dispatcher dashboard and the civilian app.",
} as const;

export const waitlist = {
  heading: "Get early access.",
  body: "Join the waitlist to be first in line for pilot access and product updates.",
  roles: [
    "Fire service / first responder",
    "Emergency management",
    "Municipal / government",
    "Researcher",
    "Other",
  ],
  // The one place the site states its stage, right where people decide.
  status:
    "ResQd is in development and not yet operational. The sensor network runs on simulated data today.",
  successTitle: "You're on the list.",
  successBody: "We'll be in touch as pilot spots open up.",
} as const;

export const footer = {
  tagline:
    "Situational awareness from first spark to full evacuation. Built for the people making the call and the people getting out.",
  email: "sahildutta.work@gmail.com",
} as const;

export const references = [
  {
    text: "Public Safety Canada. (2025, October 30). Government of Canada provides update on 2025 wildfires as support continues.",
    href: "https://www.canada.ca/en/public-safety-canada/news/2025/10/government-of-canada-provides-update-on-2025-wildfires-as-support-continues.html",
  },
  {
    text: "Natural Resources Canada. (2024, December 27). Canada's record-breaking wildfires in 2023: A fiery wake-up call.",
    href: "https://natural-resources.canada.ca/stories/simply-science/canada-s-record-breaking-wildfires-2023-fiery-wake-call",
  },
  {
    text: "Statistics Canada. (n.d.). Measuring the economic cost of wildfires.",
    href: "https://www.statcan.gc.ca/o1/en/plus/8369-measuring-economic-cost-wildfires",
  },
] as const;
