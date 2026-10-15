"use client";

import { useState } from "react";
import CountUp from "react-countup";
// Phosphor, like the rest of the site; aliased to the dashboard's own names.
import { Fire as Flame } from "@phosphor-icons/react/dist/ssr/Fire";
import { House as Home } from "@phosphor-icons/react/dist/ssr/House";
import { Bell } from "@phosphor-icons/react/dist/ssr/Bell";
import { Broadcast as Radio } from "@phosphor-icons/react/dist/ssr/Broadcast";
import { Users } from "@phosphor-icons/react/dist/ssr/Users";
import { DeviceMobile as Smartphone } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { User as UserRound } from "@phosphor-icons/react/dist/ssr/User";
import { SignOut as LogOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import { Warning as TriangleAlert } from "@phosphor-icons/react/dist/ssr/Warning";
import { ShieldWarning as ShieldAlert } from "@phosphor-icons/react/dist/ssr/ShieldWarning";
import { Pulse as Activity } from "@phosphor-icons/react/dist/ssr/Pulse";
import { ChartBar as BarChart3 } from "@phosphor-icons/react/dist/ssr/ChartBar";
import { CheckCircle as CheckCircle2 } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { ArrowsClockwise as RefreshCw } from "@phosphor-icons/react/dist/ssr/ArrowsClockwise";

/*
  A self-contained, light-themed recreation of the ResQd dispatcher "Alerts /
  Current Summary" view (see public/screenshots/dashboard.png). Rendered as an
  interactive product shot inside a browser frame on the marketing page.
*/

type IncidentStatus = "Active" | "Contained" | "Resolved" | "Cancelled";

interface Incident {
  name: string;
  ref: string;
  status: IncidentStatus;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "Low" | "Medium" | "High" | "Urgent";
  created: string;
  category: string;
}

const STAT_CARDS = [
  { label: "Total incidents", value: 12, suffix: "", sub: "12 records", tone: "neutral", Icon: ShieldAlert },
  { label: "Active", value: 75, suffix: "%", sub: "9 active", tone: "red", Icon: BarChart3 },
  { label: "Contained", value: 17, suffix: "%", sub: "2 contained", tone: "amber", Icon: Activity },
  { label: "Resolved", value: 8, suffix: "%", sub: "1 resolved", tone: "green", Icon: CheckCircle2 },
  { label: "Pending reviews", value: 1, suffix: "", sub: "awaiting triage", tone: "orange", Icon: Clock },
] as const;

const INCIDENT_DIST = [
  { label: "Active", count: 9, pct: 100, color: "#e84045" },
  { label: "Contained", count: 2, pct: 22, color: "#f8a340" },
  { label: "Resolved", count: 1, pct: 11, color: "#12b76a" },
  { label: "Cancelled", count: 0, pct: 0, color: "#98a2b3" },
];

const BROADCAST_MIX = [
  { label: "Low", count: 0, pct: 0, color: "#98a2b3" },
  { label: "Medium", count: 1, pct: 17, color: "#fdb022" },
  { label: "High", count: 3, pct: 50, color: "#f8a340" },
  { label: "Urgent", count: 2, pct: 33, color: "#e84045" },
];

const INCIDENTS: Incident[] = [
  { name: "vehicle fire", ref: "381bb4b9-a65…", status: "Resolved", severity: "Medium", priority: "High", created: "4/9/2026", category: "Road Block" },
  { name: "structure fire", ref: "356d773f-af7…", status: "Active", severity: "Low", priority: "High", created: "4/9/2026", category: "Wildfire" },
  { name: "grass fire", ref: "9c1a02e5-b40…", status: "Active", severity: "High", priority: "Urgent", created: "4/9/2026", category: "Wildfire" },
  { name: "smoke report", ref: "5f77ac13-e21…", status: "Contained", severity: "Medium", priority: "Medium", created: "4/8/2026", category: "Air Quality" },
  { name: "power line spark", ref: "a30bd9c7-1f4…", status: "Active", severity: "Critical", priority: "Urgent", created: "4/8/2026", category: "Infrastructure" },
];

const TABS: { key: IncidentStatus | "All"; label: string; count?: number }[] = [
  { key: "All", label: "All" },
  { key: "Active", label: "Active", count: 9 },
  { key: "Contained", label: "Contained", count: 2 },
  { key: "Resolved", label: "Resolved", count: 1 },
  { key: "Cancelled", label: "Cancelled" },
];

const toneText: Record<string, string> = {
  neutral: "text-slate-900",
  red: "text-[#c81e1e]",
  amber: "text-[#b45309]",
  green: "text-[#047857]",
  orange: "text-[#c2410c]",
};
const toneBorder: Record<string, string> = {
  neutral: "border-slate-200",
  red: "border-[#e84045]/30",
  amber: "border-[#f8a340]/30",
  green: "border-[#12b76a]/30",
  orange: "border-[#f79009]/30",
};

const statusPill: Record<IncidentStatus, string> = {
  Active: "bg-red-50 text-[#c81e1e] ring-[#e84045]/20",
  Contained: "bg-amber-50 text-[#b45309] ring-amber-500/20",
  Resolved: "bg-emerald-50 text-[#047857] ring-emerald-500/20",
  Cancelled: "bg-slate-100 text-slate-500 ring-slate-400/20",
};
const chip = "bg-amber-50 text-[#b45309] ring-amber-500/20";

export function DashboardMock() {
  const [tab, setTab] = useState<IncidentStatus | "All">("All");
  const [spin, setSpin] = useState(false);

  const rows =
    tab === "All" ? INCIDENTS : INCIDENTS.filter((i) => i.status === tab);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      {/* browser chrome */}
      <div className="flex items-center border-b border-slate-200 bg-slate-100 px-3.5 py-2.5">
        <div className="mx-auto rounded-md bg-white px-3 py-1 text-[12px] text-slate-500 ring-1 ring-slate-200">
          app.resqd.ca/alerts
        </div>
      </div>

      <div className="flex text-slate-900" style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
        {/* rail */}
        <nav className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-white py-4 sm:flex">
          <div className="mb-3 grid h-9 w-9 place-content-center rounded-lg bg-[#e84045]/10 text-[#c81e1e]">
            <Flame className="h-5 w-5" />
          </div>
          {([[Home, "Home"], [Bell, "Alerts"], [Radio, "Broadcasts"], [Users, "Users"]] as const).map(([Ic, name], i) => (
            <button
              type="button"
              aria-label={name}
              aria-current={i === 1 ? "page" : undefined}
              key={i}
              className={`grid h-9 w-9 place-content-center rounded-lg ${
                i === 1
                  ? "bg-[#e84045]/10 text-[#c81e1e]"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Ic className="h-[18px] w-[18px]" />
            </button>
          ))}
          <div className="mt-auto flex flex-col items-center gap-1">
            {([[Smartphone, "Mobile app"], [UserRound, "Account"], [LogOut, "Sign out"]] as const).map(([Ic, name], i) => (
              <button
                type="button"
                aria-label={name}
                key={i}
                className="grid h-9 w-9 place-content-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <Ic className="h-[18px] w-[18px]" />
              </button>
            ))}
          </div>
        </nav>

        {/* body */}
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          {/* top bar */}
          <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wide text-slate-500">
              <TriangleAlert className="h-3.5 w-3.5 text-[#c2410c]" />
              ResQd / Alerts
            </span>
            <span className="rounded-md bg-red-50 px-2 py-1 text-[#c81e1e] ring-1 ring-[#e84045]/20">
              12 incidents · <b>9 active</b>
            </span>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-[#b45309] ring-1 ring-amber-500/20">
              6 broadcasts · <b>2 urgent</b>
            </span>
            <span className="rounded-md bg-orange-50 px-2 py-1 text-[#c2410c] ring-1 ring-[#f79009]/20">
              1 pending reviews
            </span>
            <div className="ml-auto hidden items-center gap-1.5 sm:flex">
              {["Incidents", "Broadcasts", "Fire Reviews"].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    i === 2
                      ? "bg-[#c2410c] text-white"
                      : "text-slate-500 ring-1 ring-slate-200"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <h3 className="mt-5 text-xl font-bold tracking-tight sm:text-2xl">
            Current Summary
          </h3>

          {/* stat cards */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STAT_CARDS.map((c) => (
              <div
                key={c.label}
                className={`rounded-lg border bg-white p-3.5 ${toneBorder[c.tone]}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {c.label}
                  </span>
                  <c.Icon className="h-3.5 w-3.5 text-slate-300" />
                </div>
                <div
                  className={`mt-1.5 text-2xl font-bold tabular-nums ${toneText[c.tone]}`}
                >
                  <CountUp
                    end={c.value}
                    suffix={c.suffix}
                    duration={1.6}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <span className="text-[11px] text-slate-500">{c.sub}</span>
              </div>
            ))}
          </div>

          {/* distribution panels */}
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <BarPanel title="Incident Distribution" Icon={BarChart3} rows={INCIDENT_DIST} />
            <BarPanel title="Broadcast Priority Mix" Icon={Radio} rows={BROADCAST_MIX} />
          </div>

          {/* incidents table */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#c81e1e]" />
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    Current Incidents
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    {INCIDENTS.length} records
                    <span className="flex items-center gap-1 text-[#c2410c]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f79009]" />
                      LIVE
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSpin(true);
                  window.setTimeout(() => setSpin(false), 700);
                }}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${spin ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    tab === t.key
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {t.label}
                  {t.count != null ? (
                    <span className="ml-1 font-normal">({t.count})</span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Name</th>
                    <th className="py-2 pr-3 font-semibold">Status</th>
                    <th className="py-2 pr-3 font-semibold">Severity</th>
                    <th className="py-2 pr-3 font-semibold">Priority</th>
                    <th className="py-2 pr-3 font-semibold">Created</th>
                    <th className="py-2 font-semibold">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.ref}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-2.5 pr-3">
                        <span className="border-l-2 border-[#e84045] pl-2 font-medium">
                          {r.name}
                        </span>
                        <span className="ml-2 text-[10px] text-slate-500">
                          {r.ref}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusPill[r.status]}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${chip}`}
                        >
                          {r.severity}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${chip}`}
                        >
                          {r.priority}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-300" />
                          {r.created}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600">{r.category}</td>
                    </tr>
                  ))}
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No incidents in this state.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarPanel({
  title,
  Icon,
  rows,
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  rows: { label: string; count: number; pct: number; color: string }[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-slate-500" />
        {title}
      </div>
      <div className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{r.label}</span>
              <span className="font-semibold text-slate-700">{r.count}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              {/* scaleX, not width: compositor-only, no layout per frame */}
              <div
                className="h-full origin-left rounded-full transition-transform duration-700"
                style={{ transform: `scaleX(${r.pct / 100})`, backgroundColor: r.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
