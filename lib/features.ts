export type FeatureAnim =
  | "sensor-detect"
  | "live-map"
  | "routing"
  | "broadcast"
  | "live-sync";

export interface Feature {
  id: string;
  index: string;
  name: string;
  headline: string;
  body: string;
  points: string[];
  anim: FeatureAnim;
}

export const features: Feature[] = [
  {
    id: "detection",
    index: "01",
    name: "Sensor network + fire detection",
    headline: "Catch the fire while it's still small.",
    body: "Today it runs on simulated IoT nodes that replay real environmental data; in production these would be physical sensors placed in high fire-probability areas, streaming live temperature, humidity, and air-quality readings. A Random Forest model watches a rolling window of each sensor's last ten readings and flags a fire before it spreads.",
    points: [
      "12 raw environmental metrics per reading",
      "60 rolling-window features, 200-tree ensemble vote",
      "Returns fire / no-fire, a confidence score, and a severity band",
    ],
    anim: "sensor-detect",
  },
  {
    id: "map",
    index: "02",
    name: "Live situational-awareness map",
    headline: "Everything happening, on one screen.",
    body: "Incidents, unverified citizen reports, broadcast zones, safe zones, and sensor status all render on the same Mapbox map. Layers toggle on and off so dispatch sees only what matters right now.",
    points: [
      "Severity-coloured incident pins, priority-coloured broadcast circles",
      "Eight toggleable overlays: population heatmap, traffic, fire density, more",
      "Every change syncs to all responders over WebSocket",
    ],
    anim: "live-map",
  },
  {
    id: "routing",
    index: "03",
    name: "Hazard-scored evacuation routing",
    headline: "The safe way out, not just the short one.",
    body: "Routing pulls every active hazard, buffers it by severity, and tests each candidate route against those zones. It returns the path that stays clear of the fire, with a 0-100 safety score and plain-language warnings.",
    points: [
      "Checks up to three route alternatives per safe zone",
      "Priority-weighted exposure scoring, critical-hazard floor",
      "Same endpoint serves dispatch and the civilian app",
    ],
    anim: "routing",
  },
  {
    id: "broadcast",
    index: "04",
    name: "Emergency broadcasts",
    headline: "Reach the radius in one action.",
    body: "Dispatch draws a shape on the map, writes a message, sets a priority, and sends. The civilian app picks it up on its next 15-second poll and warns everyone inside the zone.",
    points: [
      "Circle, rectangle, or freehand areas",
      "Four priority levels, colour-coded end to end",
      "Full audit trail on every broadcast",
    ],
    anim: "broadcast",
  },
  {
    id: "sync",
    index: "05",
    name: "Citizen reports and live sync",
    headline: "A report from the ground shows up right away.",
    body: "A civilian submits a photo and a description. The image goes straight to S3, the report lands in the review queue, and a WebSocket event puts it on every dispatcher's map without a refresh.",
    points: [
      "Two-phase upload: photo to S3, metadata to the API",
      "Responders verify, reject, or convert to a tracked incident",
      "14 real-time event types keep every client in step",
    ],
    anim: "live-sync",
  },
];
