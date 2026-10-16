/**
 * All page copy lives here so it can be edited in one place.
 * Voice: plain, concrete, numbers over adjectives. No marketing filler.
 */

export const site = {
  name: "ResQd",
  tagline: "Cloud-native wildfire response.",
  hero: {
    headline: "Wildfire response that keeps up with the fire.",
    sub: "Field sensors, citizen reports and evacuation routing on one live map, so dispatchers see the fire early and move people before it reaches the road.",
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
  heading: "What a dispatcher can do from one screen.",
  sub: "Detect a fire, confirm it, warn the people in its path and route them out, all from the same live map.",
} as const;

export const productStory = {
  heading: "One incident, from first reading to evacuation.",
  sub: "The dispatcher's console and a resident's phone, showing the same incident as it unfolds.",
  steps: [
    {
      time: "00:00",
      key: "detect",
      title: "A fire is detected",
      desc: "A field sensor's heat and smoke readings spike and the model flags a fire at 89% confidence. Residents can also report one with a photo from the app.",
    },
    {
      time: "00:04",
      key: "report",
      title: "A report lands on the map",
      desc: "The report drops onto the dispatcher's live map as a pending review.",
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
      desc: "The app routes each person to the nearest safe zone, along the path that stays clear of the active fire.",
    },
  ],
} as const;

export const howItWorks = {
  heading: "How a reading reaches the dispatcher.",
  sub: "One always-on API serves both the dashboard and the app.",
  steps: [
    { label: "Sensors report in", tech: "IoT sensors", note: "Readings every ~30 s", detail: "Dockerized nodes stream a reading about every 30 seconds." },
    { label: "Readings queue up", tech: "AWS SQS", note: "A burst drops nothing", detail: "A queue absorbs bursts of readings without dropping data, so a spike during a fire is not lost." },
    { label: "Checked for changes", tech: "AWS Lambda", note: "Validated, change-detected", detail: "Each reading is normalized and validated, then checked for meaningful change." },
    { label: "Latest reading held", tech: "Redis", note: "15 min TTL per sensor", detail: "The latest reading per sensor is held in a cache with a 15-minute TTL." },
    { label: "Pushed to every screen", tech: "FastAPI + WebSocket", note: "37 endpoints, live events", detail: "37 endpoints, with live events pushed to every connected client." },
    { label: "Incidents and photos stored", tech: "MongoDB Atlas + S3", note: "Incidents, reports, photos", detail: "Incidents and reports live in MongoDB; photos go straight to S3." },
    { label: "Dashboard and app", tech: "Responders and civilians", note: "One source of truth", detail: "Responders and civilians read from the same source of truth." },
  ],
} as const;

export const systemFacts = {
  label: "System facts",
  note: "From the simulated sensor network.",
  items: [
    { value: "7", unit: "sensor nodes", label: "northern Ontario towns", source: "Sensor layer" },
    { value: "13,611", unit: "readings", label: "behind the detection model", source: "Detection model" },
    { value: "12", unit: "metrics", label: "in every sensor reading", source: "Sensor layer" },
    { value: "14", unit: "events", label: "streamed over WebSocket", source: "Realtime layer" },
  ],
} as const;

export const dashboard = {
  heading: "One console for the whole response.",
  sub: "Dispatchers work the incident list, broadcasts, and pending fire reviews from a single live summary. Every number updates as reports come in.",
} as const;

export const gallery = {
  heading: "Dashboard and app, as built.",
  sub: "Captures from the dispatcher dashboard and the civilian app, running on simulated sensor data.",
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
    "ResQd is operational in testing and still in development ahead of deployment.",
  successTitle: "You're on the list.",
  successBody: "We'll be in touch as pilot spots open up.",
} as const;

export const footer = {
  tagline:
    "Wildfire response software for dispatchers, and for the people they need to reach.",
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
