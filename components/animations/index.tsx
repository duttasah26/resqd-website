import type { ComponentType } from "react";
import type { FeatureAnim } from "@/lib/features";
import { SensorDetect } from "./SensorDetect";
import { LiveMap } from "./LiveMap";
import { Routing } from "./Routing";
import { Broadcast } from "./Broadcast";
import { LiveSync } from "./LiveSync";

export const FEATURE_ANIMATIONS: Record<FeatureAnim, ComponentType> = {
  "sensor-detect": SensorDetect,
  "live-map": LiveMap,
  routing: Routing,
  broadcast: Broadcast,
  "live-sync": LiveSync,
};
