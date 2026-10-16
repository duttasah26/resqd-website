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
    body: "Simulated IoT nodes stream readings today. A 200-tree Random Forest model checks each sensor's last ten readings and flags a fire.",
    points: [
      "60 rolling features per window",
      "Reports fire or no fire, with confidence and severity",
    ],
    anim: "sensor-detect",
  },
  {
    id: "map",
    index: "02",
    name: "Live situational-awareness map",
    headline: "Incidents, reports and sensors on one map.",
    body: "Broadcast zones and safe zones sit on the same Mapbox map, with layers you can switch off.",
    points: [
      "Eight overlays, from heatmap to traffic",
      "Changes reach every responder at once",
    ],
    anim: "live-map",
  },
  {
    id: "routing",
    index: "03",
    name: "Hazard-scored evacuation routing",
    headline: "The safe way out, not just the short one.",
    body: "Each candidate route is tested against buffered hazards, and the safest comes back with a 0-100 score.",
    points: [
      "Up to three alternatives per safe zone",
      "Dispatch and the civilian app use the same routes",
    ],
    anim: "routing",
  },
  {
    id: "broadcast",
    index: "04",
    name: "Emergency broadcasts",
    headline: "Reach the radius in one action.",
    body: "Draw an area, write a message, set a priority and send. Phones in the zone get it on their next poll.",
    points: [
      "Circle, rectangle or freehand",
      "Four priority levels, full audit trail",
    ],
    anim: "broadcast",
  },
  {
    id: "sync",
    index: "05",
    name: "Citizen reports and live sync",
    headline: "Citizen reports reach every dispatcher at once.",
    body: "A photo and a note go from the citizen's phone to every dispatcher's map on submit, with no refresh.",
    points: [
      "Verify, reject or convert to an incident",
    ],
    anim: "live-sync",
  },
];
