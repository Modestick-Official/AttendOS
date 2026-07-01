'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, Layers, Users, Activity, Terminal, Clock, Cpu, Sparkles, Check, Copy, ArrowRight, Search, ShieldCheck, AlertTriangle, Mail, LogOut, Plus, Play, Globe, Wifi, Clock3, UserCheck, RefreshCw, Menu, X, TrendingUp, Server, Lock, Shield
} from 'lucide-react';

// ==========================================
// TYPES & CONSTANTS
// ==========================================

interface Worker {
  id: string;
  name: string;
  designation: string;
  department: 'Engineering' | 'Operations' | 'Product' | 'Security' | 'Executive';
  uid: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
}

interface CorporateShift {
  id: string;
  name: string;
  time: string;
  active: boolean;
  nodeId: string;
  headcount: number;
}

interface TelemetryLog {
  id: string;
  timestamp: string;
  node: string;
  uid: string;
  status: 'AUTHORIZED' | 'SUSPICIOUS' | 'REVOKED' | 'WARNING';
  payload: string;
}

const INITIAL_WORKERS: Worker[] = [
  { id: 'emp-01', name: 'Dr. Aris Thorne', designation: 'Principal Hardware Architect', department: 'Engineering', uid: '0x7C:1E:FA:90', status: 'Online', lastSeen: '08:42:15 AM' },
  { id: 'emp-02', name: 'Elena Rostova', designation: 'Senior RF Signal Specialist', department: 'Engineering', uid: '0x2D:C3:54:1B', status: 'Online', lastSeen: '09:05:03 AM' },
  { id: 'emp-03', name: 'Marcus Chen', designation: 'Operations Site Warden', department: 'Operations', uid: '0x4A:BE:91:2C', status: 'Online', lastSeen: '08:58:12 AM' },
  { id: 'emp-04', name: 'Rajiv Mehta', designation: 'Logistics Control Supervisor', department: 'Operations', uid: '0x2C:A3:41:DD', status: 'Online', lastSeen: '06:14:05 AM' },
  { id: 'emp-05', name: 'Sarah Jenkins', designation: 'Lead Technical Product Manager', department: 'Product', uid: '0x3E:F2:88:12', status: 'Online', lastSeen: '09:15:42 AM' },
  { id: 'emp-06', name: 'Chloe Bennett', designation: 'Information Security Lead', department: 'Security', uid: '0x8A:5C:B9:E1', status: 'Offline', lastSeen: 'Yesterday' },
  { id: 'emp-07', name: 'Kenji Sato', designation: 'Embedded Firmware Auditor', department: 'Engineering', uid: '0x5B:8F:A1:CC', status: 'Online', lastSeen: '08:42:15 AM' },
  { id: 'emp-08', name: 'Samantha Cole', designation: 'Chief Information Officer', department: 'Executive', uid: '0x5D:1E:F4:A2', status: 'Online', lastSeen: '07:45:11 AM' },
  { id: 'emp-09', name: 'Lisa Wong', designation: 'Facilities Safety Manager', department: 'Operations', uid: '0x7E:9C:5D:2F', status: 'Offline', lastSeen: '2 days ago' },
];

const INITIAL_SHIFTS: CorporateShift[] = [
  { id: 'sh-01', name: 'Global Production Alpha', time: '06:00 AM - 02:00 PM', active: true, nodeId: 'ESP32-NODE-01', headcount: 48 },
  { id: 'sh-02', name: 'Engineering Core Delta', time: '08:00 AM - 05:00 PM', active: true, nodeId: 'ESP32-NODE-03', headcount: 94 },
  { id: 'sh-03', name: 'Security Warden Rotation', time: '02:00 PM - 10:00 PM', active: true, nodeId: 'ESP32-NODE-02', headcount: 14 },
  { id: 'sh-04', name: 'Night Logistics Lambda', time: '10:00 PM - 06:00 AM', active: false, nodeId: 'ESP32-NODE-05', headcount: 31 },
];

const INITIAL_TELEMETRY: TelemetryLog[] = [
  { id: 't-01', timestamp: '15:39:58', node: 'Node-ESP32-01', uid: '0x7C:1E:FA:90', status: 'AUTHORIZED', payload: 'Dr. Aris Thorne (Principal Hardware Architect) passed Gate B' },
  { id: 't-02', timestamp: '15:39:24', node: 'Node-ESP32-03', uid: '0x2D:C3:54:1B', status: 'AUTHORIZED', payload: 'Elena Rostova (Senior RF Signal Specialist) entered Lab Sector 4' },
  { id: 't-03', timestamp: '15:38:11', node: 'Node-ESP32-02', uid: '0x8A:5C:B9:E1', status: 'WARNING', payload: 'Antenna Collision: Chloe Bennett registered spatial drift warning' },
  { id: 't-04', timestamp: '15:37:45', node: 'Node-ESP32-05', uid: '0xFF:FF:FF:FF', status: 'SUSPICIOUS', payload: 'Unknown Transponder Signature blocked at Cargo Bay Gate C' },
  { id: 't-05', timestamp: '15:36:02', node: 'Node-ESP32-01', uid: '0x4A:BE:91:2C', status: 'AUTHORIZED', payload: 'Marcus Chen (Operations Site Warden) synced main gate transit' },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Home() {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<'overview' | 'employees' | 'shifts' | 'reports'>('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auth
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [userRole, setUserRole] = useState('Principal Administrator');
  const [authError, setAuthError] = useState('');

  // Data
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [shifts, setShifts] = useState<CorporateShift[]>(INITIAL_SHIFTS);
  const [telemetry, setTelemetry] = useState<TelemetryLog[]>(INITIAL_TELEMETRY);

  // Employees Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<'All' | 'Engineering' | 'Operations' | 'Product' | 'Security'>('All');
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerDesignation, setNewWorkerDesignation] = useState('');
  const [newWorkerDept, setNewWorkerDept] = useState<'Engineering' | 'Operations' | 'Product' | 'Security'>('Engineering');
  const [newWorkerUid, setNewWorkerUid] = useState('0x3B:D2:C1:' + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0'));
  const [workerAddSuccess, setWorkerAddSuccess] = useState(false);

  // Reports Tab
  const [simulatedStaffVolume, setSimulatedStaffVolume] = useState(380);
  const [diagnosticFocus, setDiagnosticFocus] = useState<'bottlenecks' | 'security' | 'shifts'>('bottlenecks');
  const [aiLoadingState, setAiLoadingState] = useState<'idle' | 'fetching' | 'matching' | 'finalizing' | 'done'>('idle');
  const [generatedReportText, setGeneratedReportText] = useState<string | null>(null);

  // UI
  const [clockTime, setClockTime] = useState('15:40:28');
  const [clipboardFeedback, setClipboardFeedback] = useState(false);

  // LIVE CLOCK
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClockTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // LIVE TELEMETRY STREAM
  useEffect(() => {
    if (currentScreen !== 'dashboard') return;

    const interval = setInterval(() => {
      const nodes = ['Node-ESP32-01', 'Node-ESP32-02', 'Node-ESP32-03', 'Node-ESP32-04', 'Node-ESP32-05'];
      const nodeSelected = nodes[Math.floor(Math.random() * nodes.length)];

      const namesList = [
        { name: 'Dr. Aris Thorne', des: 'Principal Hardware Architect', uid: '0x7C:1E:FA:90' },
        { name: 'Elena Rostova', des: 'Senior RF Signal Specialist', uid: '0x2D:C3:54:1B' },
        { name: 'Marcus Chen', des: 'Operations Site Warden', uid: '0x4A:BE:91:2C' },
        { name: 'Rajiv Mehta', des: 'Logistics Control Supervisor', uid: '0x2C:A3:41:DD' },
        { name: 'Sarah Jenkins', des: 'Lead Technical Product Manager', uid: '0x3E:F2:88:12' },
        { name: 'Kenji Sato', des: 'Embedded Firmware Auditor', uid: '0x5B:8F:A1:CC' }
      ];

      const person = namesList[Math.floor(Math.random() * namesList.length)];
      const randomUidPart = () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');

      const roll = Math.random();
      let status: 'AUTHORIZED' | 'SUSPICIOUS' | 'REVOKED' | 'WARNING' = 'AUTHORIZED';
      let payload = '';
      let uidStr = person.uid;

      if (roll > 0.85) {
        status = 'SUSPICIOUS';
        uidStr = `0x${randomUidPart()}:${randomUidPart()}:${randomUidPart()}:${randomUidPart()}`;
        payload = `Unidentified RFID transponder signature (${uidStr}) rejected at gateway.`;
      } else if (roll > 0.7) {
        status = 'WARNING';
        payload = `Rapid sweep detected on ${nodeSelected}. Credential scan threshold triggered.`;
      } else {
        payload = `${person.name} (${person.des}) validated at ${nodeSelected}.`;
      }

      const newLog: TelemetryLog = {
        id: `t-live-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        node: nodeSelected,
        uid: uidStr,
        status,
        payload
      };

      setTelemetry(prev => [newLog, ...prev.slice(0, 18)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [currentScreen]);

  // AUTH
  const triggerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError('Email is required');
      return;
    }
    setAuthError('');
    setCurrentScreen('dashboard');
  };

  const triggerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authName) {
      setAuthError('All fields required');
      return;
    }
    setAuthError('');
    setUserRole('Gate Supervisor');
    setCurrentScreen('dashboard');
  };

  // ADD WORKER
  const addNewWorkerAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName || !newWorkerDesignation) return;

    const created: Worker = {
      id: `emp-${Date.now()}`,
      name: newWorkerName,
      designation: newWorkerDesignation,
      department: newWorkerDept,
      uid: newWorkerUid,
      status: 'Online',
      lastSeen: 'Just Now'
    };

    setWorkers(prev => [created, ...prev]);
    setNewWorkerName('');
    setNewWorkerDesignation('');
    setNewWorkerUid('0x3B:D2:C1:' + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0'));
    setWorkerAddSuccess(true);
    setTimeout(() => setWorkerAddSuccess(false), 3000);
  };

  // TOGGLE SHIFT
  const toggleShiftActiveState = (id: string) => {
    setShifts(prev => prev.map(sh => sh.id === id ? { ...sh, active: !sh.active } : sh));
  };

  // INJECT SWIPE
  const injectSimulatedSwipe = () => {
    const nodes = ['Node-ESP32-01', 'Node-ESP32-02', 'Node-ESP32-03', 'Node-ESP32-04', 'Node-ESP32-05'];
    const names = ['Dr. Aris Thorne', 'Elena Rostova', 'Marcus Chen', 'Rajiv Mehta', 'Sarah Jenkins'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const selectedNode = nodes[Math.floor(Math.random() * nodes.length)];
    const generatedUid = '0x' + Math.floor(Math.random() * 10000000).toString(16).toUpperCase();

    const injectedLog: TelemetryLog = {
      id: `t-inject-${Date.now()}`,
      timestamp: clockTime,
      node: selectedNode,
      uid: generatedUid,
      status: 'AUTHORIZED',
      payload: `[Simulated] Token ${generatedUid} for ${selectedName} validated at ${selectedNode}.`
    };

    setTelemetry(prev => [injectedLog, ...prev]);
  };

  // AI INFERENCE
  const executeStatisticalInference = () => {
    setAiLoadingState('fetching');
    setGeneratedReportText(null);

    setTimeout(() => setAiLoadingState('matching'), 800);
    setTimeout(() => setAiLoadingState('finalizing'), 1600);

    setTimeout(() => {
      setAiLoadingState('done');
      const cap = simulatedStaffVolume;
      const calculatedPresence = Math.round(cap * 0.934);
      const calculatedSuspicious = Math.round(cap * 0.015 + 2);

      let text = '';
      if (diagnosticFocus === 'bottlenecks') {
        text = `ATTENDOS AI THROUGHPUT ANALYSIS\nDataset: ${cap} Active RFID Transponders\n\n[CRITICAL SUMMARY]\n✓ Online ESP32 Nodes: 12/12 Operational\n✓ Ingress Efficiency: 98.4% within nominal bounds\n⚠ Peak Congestion Window: 08:48-09:12 AM (72.4% daily load)\n\n[DIAGNOSTICS]\nReconciled ${calculatedPresence} unique hardware signatures.\nIdentified processing delays at Node-03 (East Corridor). RSSI signal distortion causes 14ms avg validation latency.\n\n[MITIGATION]\n→ Calibrate antenna cooldown to 250ms in ESP32-S3 driver\n→ Stagger Global Production Alpha team entry by 15 min\n→ Deploy secondary antennas at loading bay entrance`;
      } else if (diagnosticFocus === 'security') {
        text = `ATTENDOS CRYPTOGRAPHIC SECURITY AUDIT\nDataset: ${cap} Active RFID Transponders\n\n[THREAT MATRIX]\n✓ Token Authenticators: 99.85% Cryptographic Confidence\n⚠ Anomalous Signatures Detected: ${calculatedSuspicious}\n🔴 Active Isolation Loops: 1\n\n[FINDINGS]\nTag 0x4A:BE:91:2C (Marcus Chen) triggered parallel events at Node-01 and Node-03 within 11 seconds. Geographical impossibility indicates potential card duplication.\n\n[COUNTERMEASURES]\n→ Upgrade to encrypted 3DES sector blocks\n→ Enforce anti-passback: require exit logs before re-entry\n→ Automatic lockdown on duplicate detections`;
      } else {
        text = `ATTENDOS WORKFORCE FATIGUE INDEX\nDataset: ${cap} Active RFID Transponders\n\n[ALLOCATION FORECAST]\n✓ Optimal Daily Slots: ${Math.round(cap * 0.85)}\n⚠ Overtime Risk (>48hrs/5days): 14 personnel\n⚠ Predicted Sick Leave: ~6.8% next Monday\n\n[BEHAVIORAL ANALYSIS]\nMorning shift: 14.2min avg lateness. Engineering teams compensate with late exits (post 8:30 PM). Product teams show regularized 8hr patterns.\n\n[STRATEGIC RECOMMENDATIONS]\n→ Deploy temporary badges at loading docks\n→ Auto-dim building after 9 PM for wellness\n→ Send push alerts to engineers working >9 PM`;
      }
      setGeneratedReportText(text);
    }, 2400);
  };

  // COPY
  const copyReportText = () => {
    if (!generatedReportText) return;
    navigator.clipboard.writeText(generatedReportText);
    setClipboardFeedback(true);
    setTimeout(() => setClipboardFeedback(false), 2000);
  };

  // FILTER
  const filteredWorkersList = useMemo(() => {
    return workers.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDeptFilter === 'All' ? true : emp.department === selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }, [workers, searchQuery, selectedDeptFilter]);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 font-sans relative overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_30%),linear-gradient(135deg,_#02050b_0%,_#000000_46%,_#05070f_100%)]" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/12 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-cyan-500/12 rounded-full blur-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* LANDING */}
          {currentScreen === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col justify-between">
              <header className="w-full border-b border-slate-700/80 bg-[#03060b]/90 backdrop-blur-xl sticky top-0 z-50 shadow-[0_0_24px_rgba(16,185,129,0.08)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 via-green-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.28)]">
                      <Radio className="h-5 w-5 text-black stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block">Enterprise Core</span>
                      <h1 className="text-xl font-bold text-white">AttendOS</h1>
                    </div>
                  </div>

                  <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
                    <a href="#platform" className="hover:text-emerald-400 transition-colors">Platform</a>
                    <a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a>
                    <a href="#security" className="hover:text-emerald-400 transition-colors">Security</a>
                    <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
                  </nav>

                  <div className="flex items-center gap-3">
                    <button onClick={() => setCurrentScreen('login')} className="hidden sm:inline-flex px-4 py-2 text-xs font-mono font-bold tracking-wider text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">SIGN IN</button>
                    <button onClick={() => setCurrentScreen('signup')} className="px-4 sm:px-6 py-2.5 text-xs font-mono font-bold tracking-wider bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black rounded-lg transition-all shadow-[0_0_24px_rgba(16,185,129,0.25)] cursor-pointer">BOOK DEMO</button>
                  </div>
                </div>
              </header>

              <main className="flex-1 px-4 sm:px-6 lg:px-10 py-14 md:py-20">
                <div className="max-w-7xl mx-auto space-y-10 md:space-y-14">
                  <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
                    <div className="space-y-7">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 shadow-[0_0_18px_rgba(16,185,129,0.12)]">
                        <Wifi className="h-4 w-4 text-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400 font-semibold">LIVE MQTT STREAM • QoS 1 • 60s KEEPALIVE</span>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                          Modern <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">RFID operations</span> for enterprise teams.
                        </h2>
                        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                          AttendOS unifies access control, edge telemetry, and AI-driven insights in one premium command center built for secure, high-scale environments.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={() => setCurrentScreen('login')}
                          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-bold uppercase text-sm tracking-wider rounded-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer group"
                        >
                          <span>Launch Dashboard</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={() => { setUserRole('Executive Director'); setCurrentScreen('dashboard'); }}
                          className="px-8 py-4 bg-[#0d1527] hover:bg-[#111b2f] border border-slate-700/80 text-slate-200 font-bold uppercase text-sm tracking-wider rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.08)] cursor-pointer"
                        >
                          Quick Demo
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-300 pt-2">
                        <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /><span>12 live nodes</span></div>
                        <div className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /><span>98.4% throughput efficiency</span></div>
                        <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#ffaa00]" /><span>24/7 anomaly detection</span></div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-700/80 bg-[#0d1527]/95 p-6 sm:p-7 shadow-[0_0_28px_rgba(16,185,129,0.12)]">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400">Live overview</p>
                          <h3 className="text-lg font-semibold text-white mt-1">Command Center Pulse</h3>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono font-bold shadow-[0_0_16px_rgba(16,185,129,0.12)]">ONLINE</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Verified throughput', value: '2.8K events / hr', icon: TrendingUp, accent: 'text-emerald-400' },
                          { label: 'Security posture', value: '99.85% confidence', icon: ShieldCheck, accent: 'text-cyan-400' },
                          { label: 'Field latency', value: '14ms avg response', icon: Server, accent: 'text-[#ffaa00]' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-[#060b12] px-4 py-3 shadow-[0_0_16px_rgba(34,211,238,0.05)]">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg bg-black/60 ${item.accent} flex items-center justify-center border border-slate-700/70`}>
                                <item.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{item.label}</p>
                                <p className="text-sm font-semibold text-white">{item.value}</p>
                              </div>
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-slate-700/80 bg-[#0d1527]/90 px-6 py-5 sm:px-8 sm:py-6 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">Trusted by modern ops leaders</p>
                        <h3 className="text-lg font-semibold text-white mt-1">Built for secure facilities, smart campuses, and industrial teams.</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Cortex Logistics', 'Nova Labs', 'Northstar HQ', 'BlueLine Secure', 'Aegis Campus'].map((brand) => (
                          <span key={brand} className="px-3 py-2 rounded-full border border-slate-700/80 bg-[#060b12] text-sm text-slate-300 shadow-[0_0_8px_rgba(16,185,129,0.06)]">{brand}</span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section id="platform" className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: Cpu,
                        title: 'Edge-to-cloud telemetry',
                        text: 'Monitor every ESP32 node with real-time validation, anomaly detection, and clean operator dashboards.'
                      },
                      {
                        icon: Shield,
                        title: 'Security-first workflows',
                        text: 'Protect credential flows with anti-passback rules, suspicious signal alerts, and expert-grade auditing.'
                      },
                      {
                        icon: Activity,
                        title: 'AI-guided operations',
                        text: 'Generate actionable alerts and workforce insights instantly with built-in inference workflows.'
                      }
                    ].map((card, index) => (
                      <div key={index} className="rounded-2xl border border-slate-700/80 bg-[#0d1527]/95 p-6 transition-all hover:border-emerald-400/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_16px_rgba(16,185,129,0.12)]">
                          <card.icon className="h-5 w-5" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">{card.title}</h4>
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">{card.text}</p>
                      </div>
                    ))}
                  </section>

                  <section id="solutions" className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center">
                    <div className="space-y-4">
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400">Why leaders choose AttendOS</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">A premium operating layer for physical access and workforce intelligence.</h3>
                      <p className="text-slate-300 leading-relaxed">From daily credential workflows to high-risk anomaly response, the platform gives teams a calm, precise, and deeply professional control surface.</p>
                      <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-3"><Check className="h-4 w-4 text-emerald-400 mt-0.5" /><span>Unified view of people, devices, and access zones across locations.</span></li>
                        <li className="flex gap-3"><Check className="h-4 w-4 text-cyan-400 mt-0.5" /><span>Executive-ready reporting with contextual insights that reduce downtime.</span></li>
                        <li className="flex gap-3"><Check className="h-4 w-4 text-[#ffaa00] mt-0.5" /><span>Fast setup for operations leaders who need clarity without clutter.</span></li>
                      </ul>
                    </div>

                    <div id="security" className="rounded-2xl border border-slate-700/80 bg-[#0d1527]/95 p-6 sm:p-7 shadow-[0_0_24px_rgba(34,211,238,0.06)]">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.12)]">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">Operational workflow</p>
                          <h4 className="text-lg font-semibold text-white">Designed for secure scale</h4>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { step: '01', title: 'Capture telemetry', desc: 'Edge devices stream each event in real time.' },
                          { step: '02', title: 'Validate instantly', desc: 'Policies and AI logic resolve risk in milliseconds.' },
                          { step: '03', title: 'Act with confidence', desc: 'Operators receive clean alerts and actionable next steps.' }
                        ].map((item) => (
                          <div key={item.step} className="flex gap-3 rounded-xl border border-slate-700/70 bg-[#060b12] p-4 shadow-[0_0_12px_rgba(34,211,238,0.04)]">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-sm font-bold">{item.step}</div>
                            <div>
                              <h5 className="text-sm font-semibold text-white">{item.title}</h5>
                              <p className="text-sm text-slate-300 mt-1">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section id="contact" className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 p-8 sm:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="max-w-2xl">
                        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400">Ready for your next deployment</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">Bring enterprise-grade access intelligence to your operations team.</h3>
                        <p className="text-slate-400 mt-3 leading-relaxed">Turn telemetry into a premium experience with a platform that looks sharp, feels fast, and performs under pressure.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => setCurrentScreen('signup')} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-bold uppercase text-sm tracking-wider rounded-lg transition-all shadow-[0_0_22px_rgba(16,185,129,0.24)] cursor-pointer">Start Free Trial</button>
                        <button onClick={() => setCurrentScreen('login')} className="px-6 py-3 bg-[#0d1527] hover:bg-[#111b2f] border border-slate-700/80 text-slate-200 font-bold uppercase text-sm tracking-wider rounded-lg transition-all cursor-pointer">Open Console</button>
                      </div>
                    </div>
                  </section>
                </div>
              </main>

              <footer className="w-full border-t border-slate-800/40 px-4 sm:px-6 lg:px-10 py-8 mt-8">
                <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-green-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.24)]">
                        <Radio className="h-5 w-5 text-black stroke-[2.5]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold">Enterprise Core</p>
                        <h4 className="text-lg font-semibold text-white">AttendOS</h4>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">Premium RFID and access intelligence for secure, data-driven organizations.</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-white mb-3">Explore</h5>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><a href="#platform" className="hover:text-emerald-400 transition-colors">Platform</a></li>
                      <li><a href="#solutions" className="hover:text-emerald-400 transition-colors">Solutions</a></li>
                      <li><a href="#security" className="hover:text-emerald-400 transition-colors">Security</a></li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-white mb-3">Contact</h5>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-400" /><span>hello@attendos.io</span></li>
                      <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-emerald-400" /><span>www.attendos.io</span></li>
                      <li className="flex items-center gap-2"><Users className="h-4 w-4 text-emerald-400" /><span>Global support desk</span></li>
                    </ul>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-slate-700/80 mt-6 pt-4 text-center text-xs text-slate-500 font-mono">
                  <span>AttendOS © 2026 • Global RFID Management System v4.8</span>
                </div>
              </footer>
            </motion.div>
          )}

          {/* LOGIN */}
          {currentScreen === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="min-h-screen flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="bg-[#0d1527] border border-slate-700/80 rounded-2xl p-8 shadow-[0_0_36px_rgba(16,185,129,0.1)]">
                  <div className="flex justify-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_22px_rgba(16,185,129,0.3)]">
                      <Radio className="h-7 w-7 text-black stroke-[2.5]" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-center text-white mb-1">Sign In</h2>
                  <p className="text-center text-sm text-slate-300 mb-8">Admin credential validation required</p>

                  <form onSubmit={triggerLogin} className="space-y-5">
                    {authError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 font-mono">
                        {authError}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-cyan-400" />
                        <input
                          type="email"
                          required
                          placeholder="admin@attendos.io"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-[#050b12] border border-slate-700/80 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-emerald-400/50 transition-all font-mono shadow-[0_0_12px_rgba(34,211,238,0.03)]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-wider rounded-lg transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-6"
                    >
                      <span>Authenticate</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-700/80 flex gap-3">
                    <button onClick={() => setCurrentScreen('landing')} className="flex-1 py-2 text-xs font-mono text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">← Back</button>
                    <button onClick={() => setCurrentScreen('signup')} className="flex-1 py-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">Create Account →</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SIGNUP */}
          {currentScreen === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="min-h-screen flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="bg-[#0d1527] border border-slate-700/80 rounded-2xl p-8 shadow-[0_0_36px_rgba(16,185,129,0.1)]">
                  <div className="flex justify-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_22px_rgba(16,185,129,0.3)]">
                      <Radio className="h-7 w-7 text-black stroke-[2.5]" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-center text-white mb-1">Create Account</h2>
                  <p className="text-center text-sm text-slate-300 mb-8">Provision node administrator profile</p>

                  <form onSubmit={triggerSignup} className="space-y-5">
                    {authError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 font-mono">
                        {authError}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold block">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Jane Administrator"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-[#050b12] border border-slate-700/80 rounded-lg py-3 px-4 text-sm text-slate-100 focus:outline-none focus:border-emerald-400/50 transition-all font-mono shadow-[0_0_12px_rgba(34,211,238,0.03)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-cyan-400" />
                        <input
                          type="email"
                          required
                          placeholder="jane@attendos.io"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-[#050b12] border border-slate-700/80 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-emerald-400/50 transition-all font-mono shadow-[0_0_12px_rgba(34,211,238,0.03)]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-bold uppercase text-xs tracking-wider rounded-lg transition-all shadow-[0_0_22px_rgba(16,185,129,0.24)] flex items-center justify-center gap-2 cursor-pointer mt-6"
                    >
                      <span>Create & Proceed</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-700/80 flex gap-3">
                    <button onClick={() => setCurrentScreen('landing')} className="flex-1 py-2 text-xs font-mono text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">← Back</button>
                    <button onClick={() => setCurrentScreen('login')} className="flex-1 py-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">Sign In →</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DASHBOARD */}
          {currentScreen === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-screen bg-[#000000] overflow-hidden">
              {/* MOBILE OVERLAY */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                  />
                )}

                {/* SIDEBAR */}
                <motion.aside
                  initial={isMenuOpen ? { x: -288 } : undefined}
                  animate={isMenuOpen ? { x: 0 } : undefined}
                  exit={isMenuOpen ? { x: -288 } : undefined}
                  className={`${isMenuOpen ? 'fixed' : 'hidden'} lg:flex w-72 bg-gradient-to-b from-[#05070f] to-[#000000] border-r border-slate-800/40 flex-col justify-between z-50 h-screen overflow-y-auto`}
                >
                  <div className="flex flex-col">
                    <div className="p-6 border-b border-slate-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                          <Radio className="h-5 w-5 text-black stroke-[2.5]" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold block">Core System</span>
                          <h1 className="text-base font-bold text-white">AttendOS</h1>
                        </div>
                      </div>
                      <button onClick={() => setIsMenuOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <nav className="p-4 space-y-1.5">
                      {[
                        { id: 'overview', label: 'Node Infrastructure', icon: Layers, badge: 'Live' },
                        { id: 'employees', label: 'Asset Registry', icon: Users, badge: String(workers.length) },
                        { id: 'shifts', label: 'Operational Shifts', icon: Clock3, badge: `${shifts.filter(s => s.active).length}/${shifts.length}` },
                        { id: 'reports', label: 'AI Inference', icon: Sparkles, badge: 'READY' }
                      ].map((tab: any) => (
                        <button
                          key={tab.id}
                          onClick={() => { setCurrentTab(tab.id); setIsMenuOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            currentTab === tab.id
                              ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-2'
                              : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                            currentTab === tab.id ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900/60 text-slate-600'
                          }`}>
                            {tab.badge}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-4 border-t border-slate-800/40 bg-[#000000] flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs flex-shrink-0">
                        {authName?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-200 block truncate">{authName || 'Administrator'}</span>
                        <span className="text-[9px] font-mono text-slate-500 block truncate">{userRole}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setCurrentScreen('landing'); setAuthEmail(''); setAuthName(''); }}
                      className="p-2 rounded-lg hover:bg-slate-900/60 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </motion.aside>
              </AnimatePresence>

              {/* MAIN */}
              <main className="flex-1 flex flex-col overflow-hidden">
                {/* HEADER */}
                <header className="h-16 border-b border-slate-800/40 px-4 sm:px-6 lg:px-10 flex items-center justify-between bg-[#000000]/60 backdrop-blur-sm flex-shrink-0 z-30">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono text-slate-400">System Online</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900/40 rounded-lg px-4 py-2 border border-slate-800/40 text-xs text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{clockTime}</span>
                  </div>
                </header>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
                    {/* OVERVIEW */}
                    {currentTab === 'overview' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/40 pb-6">
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">MQTT Network Infrastructure</h2>
                            <p className="text-sm text-slate-400 mt-1">Real-time ESP32-S3 edge node telemetry stream</p>
                          </div>
                          <button
                            onClick={injectSimulatedSwipe}
                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase rounded-lg transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                          >
                            <Play className="h-3.5 w-3.5 fill-current stroke-none" />
                            <span>Inject Swipe</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                          {[
                            { title: 'ONLINE NODES', value: '12 / 12', icon: Cpu, color: 'emerald' },
                            { title: 'ACTIVE STAFF', value: `${workers.filter(e => e.status === 'Online').length} / ${workers.length}`, icon: UserCheck, color: 'cyan' },
                            { title: 'ALERTS', value: String(telemetry.filter(t => t.status === 'SUSPICIOUS' || t.status === 'WARNING').length), icon: AlertTriangle, color: 'amber' },
                            { title: 'SHIFTS ACTIVE', value: `${shifts.filter(s => s.active).length}/${shifts.length}`, icon: Clock3, color: 'teal' }
                          ].map((card, i) => (
                            <div key={i} className="bg-[#0d1527]/95 border border-slate-700/80 p-6 rounded-xl hover:border-emerald-400/30 transition-all shadow-[0_0_16px_rgba(34,211,238,0.04)]">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">{card.title}</span>
                                  <p className="text-3xl font-bold tracking-tight text-white">{card.value}</p>
                                </div>
                                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                  <card.icon className="h-5 w-5" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#0d1527] border border-slate-700/80 rounded-xl overflow-hidden shadow-[0_0_28px_rgba(34,211,238,0.08)]">
                          <div className="p-5 border-b border-slate-700/80 bg-[#0a1220] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.16)]">
                              <Terminal className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">MQTT Telemetry Ingest Stream</h3>
                              <p className="text-[10px] font-mono text-slate-400">Live hardware validation events</p>
                            </div>
                          </div>
                          <div className="p-6 bg-[#02050a] font-mono text-xs text-cyan-300/90 overflow-y-auto max-h-96 space-y-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                            <AnimatePresence initial={false}>
                              {telemetry.map((log) => (
                                <motion.div
                                  key={log.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                                    log.status === 'AUTHORIZED'
                                      ? 'bg-emerald-500/10 border-emerald-400/30 shadow-[0_0_16px_rgba(16,185,129,0.08)]'
                                      : log.status === 'WARNING'
                                      ? 'bg-[#ffaa00]/10 border-[#ffaa00]/30 shadow-[0_0_16px_rgba(255,170,0,0.08)]'
                                      : 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_16px_rgba(244,63,94,0.08)]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                      log.status === 'AUTHORIZED'
                                        ? 'bg-emerald-500/15 text-emerald-400'
                                        : log.status === 'WARNING'
                                        ? 'bg-[#ffaa00]/15 text-[#ffaa00]'
                                        : 'bg-rose-500/15 text-rose-400'
                                    }`}>
                                      {log.status}
                                    </span>
                                    <span className="text-emerald-400 text-[9px] font-bold">{log.node}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500 text-[9px]">{log.uid}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500 text-[9px]">{log.timestamp}</span>
                                  </div>
                                  <p className="text-slate-300 text-[10px] leading-relaxed">{log.payload}</p>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* EMPLOYEES */}
                    {currentTab === 'employees' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="border-b border-slate-800/40 pb-6">
                          <h2 className="text-2xl sm:text-3xl font-bold text-white">Asset Registry</h2>
                          <p className="text-sm text-slate-400 mt-1">Manage enterprise RFID token credentials</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          <div className="lg:col-span-8 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                              <div className="flex-1 min-w-0 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                                <input
                                  type="text"
                                  placeholder="Search by name, UID, designation..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-full bg-black border border-slate-800/40 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                                />
                              </div>
                              <div className="flex gap-1.5 bg-black rounded-lg p-1.5 border border-slate-800/40 w-full sm:w-auto overflow-x-auto">
                                {(['All', 'Engineering', 'Operations', 'Product', 'Security'] as const).map(dept => (
                                  <button
                                    key={dept}
                                    onClick={() => setSelectedDeptFilter(dept)}
                                    className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded transition-all cursor-pointer whitespace-nowrap ${
                                      selectedDeptFilter === dept
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/30 shadow-[0_0_16px_rgba(16,185,129,0.14)]'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                    }`}
                                  >
                                    {dept}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="bg-[#0d1527] border border-slate-700/80 rounded-xl overflow-hidden shadow-[0_0_22px_rgba(16,185,129,0.08)]">
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-slate-700/80 bg-[#0a1220] text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                                      <th className="p-4 font-bold">Name</th>
                                      <th className="p-4 font-bold">Department</th>
                                      <th className="p-4 font-bold">UID</th>
                                      <th className="p-4 font-bold">Status</th>
                                      <th className="p-4 font-bold text-right">Last Seen</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800/40">
                                    {filteredWorkersList.map(worker => (
                                      <tr key={worker.id} className="hover:bg-slate-900/20 transition-colors">
                                        <td className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shadow-[0_0_12px_rgba(16,185,129,0.14)]">
                                              {worker.name.charAt(0)}
                                            </div>
                                            <div>
                                              <span className="font-bold text-slate-200 block text-xs">{worker.name}</span>
                                              <span className="text-[9px] text-slate-500">{worker.designation}</span>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="p-4 text-xs">
                                          <span className="px-2.5 py-1 rounded text-[9px] font-bold bg-[#0b1220] text-slate-200 border border-slate-700/70 uppercase">
                                            {worker.department}
                                          </span>
                                        </td>
                                        <td className="p-4 text-emerald-400 text-[10px] font-mono font-bold">{worker.uid}</td>
                                        <td className="p-4">
                                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold ${
                                            worker.status === 'Online'
                                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 shadow-[0_0_10px_rgba(16,185,129,0.12)]'
                                              : 'bg-slate-900/70 text-slate-500 border border-slate-700/70'
                                          }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${worker.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                            {worker.status}
                                          </span>
                                        </td>
                                        <td className="p-4 text-right text-slate-400 font-mono text-[10px]">{worker.lastSeen}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div className="lg:col-span-4 bg-[#0d1527] border border-slate-700/80 rounded-xl p-6 space-y-4 h-fit shadow-[0_0_22px_rgba(34,211,238,0.06)]">
                            <div className="flex items-center gap-2 border-b border-slate-800/40 pb-4">
                              <Users className="h-4 w-4 text-emerald-400" />
                              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Add New Credential</h3>
                            </div>

                            {workerAddSuccess && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg font-mono flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                <span>Credential issued</span>
                              </motion.div>
                            )}

                            <form onSubmit={addNewWorkerAction} className="space-y-3">
                              <input
                                type="text"
                                required
                                placeholder="Full Name"
                                value={newWorkerName}
                                onChange={(e) => setNewWorkerName(e.target.value)}
                                className="w-full bg-black border border-slate-800/40 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                              />
                              <input
                                type="text"
                                required
                                placeholder="Designation"
                                value={newWorkerDesignation}
                                onChange={(e) => setNewWorkerDesignation(e.target.value)}
                                className="w-full bg-black border border-slate-800/40 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                              />
                              <select
                                value={newWorkerDept}
                                onChange={(e) => setNewWorkerDept(e.target.value as any)}
                                className="w-full bg-black border border-slate-800/40 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                              >
                                <option value="Engineering">Engineering</option>
                                <option value="Operations">Operations</option>
                                <option value="Product">Product</option>
                                <option value="Security">Security</option>
                              </select>
                              <button
                                type="submit"
                                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-bold uppercase text-xs tracking-wider rounded-lg transition-all shadow-[0_0_18px_rgba(16,185,129,0.22)] flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Issue Token</span>
                              </button>
                            </form>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* SHIFTS */}
                    {currentTab === 'shifts' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="border-b border-slate-800/40 pb-6">
                          <h2 className="text-2xl sm:text-3xl font-bold text-white">Operational Shifts</h2>
                          <p className="text-sm text-slate-400 mt-1">Manage shift scheduling and antenna node assignments</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          {shifts.map(shift => (
                            <div key={shift.id} className="bg-[#0d1527] border border-slate-700/80 p-8 rounded-xl hover:border-emerald-400/30 transition-all shadow-[0_0_22px_rgba(16,185,129,0.07)]">
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">{shift.nodeId}</span>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-[9px] font-mono font-bold uppercase ${shift.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                                      {shift.active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => toggleShiftActiveState(shift.id)}
                                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                                        shift.active ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_16px_rgba(16,185,129,0.18)]' : 'bg-slate-800'
                                      }`}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition ${
                                          shift.active ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-lg font-bold text-white">{shift.name}</h3>
                                  <p className="text-xs font-mono text-cyan-400 mt-2 flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    {shift.time}
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
                                  <div className="text-xs text-slate-400 font-sans">
                                    <span>Headcount: </span>
                                    <span className="font-mono text-white font-bold">{shift.active ? shift.headcount : 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                                    <span className={`w-2 h-2 rounded-full ${shift.active ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'bg-slate-600'}`} />
                                    <span>{shift.active ? 'Streaming' : 'Offline'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* REPORTS */}
                    {currentTab === 'reports' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="border-b border-slate-800/40 pb-6">
                          <h2 className="text-2xl sm:text-3xl font-bold text-white">AI Inference Engine</h2>
                          <p className="text-sm text-slate-400 mt-1">Advanced MQTT telemetry analysis and insights</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          <div className="lg:col-span-4 bg-[#0d1527] border border-slate-700/80 rounded-xl p-8 space-y-6 h-fit shadow-[0_0_24px_rgba(16,185,129,0.08)]">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-slate-500 uppercase font-bold">Staff Volume</span>
                                <span className="text-cyan-400 font-bold">{simulatedStaffVolume}</span>
                              </div>
                              <input
                                type="range"
                                min="50"
                                max="1000"
                                value={simulatedStaffVolume}
                                onChange={(e) => setSimulatedStaffVolume(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-[#02050a] rounded-full appearance-none cursor-pointer accent-emerald-500"
                              />
                            </div>

                            <div className="space-y-2">
                              {(['bottlenecks', 'security', 'shifts'] as const).map(focus => (
                                <button
                                  key={focus}
                                  type="button"
                                  onClick={() => setDiagnosticFocus(focus)}
                                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer text-xs font-bold font-sans capitalize ${
                                    diagnosticFocus === focus
                                      ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.12)]'
                                      : 'bg-[#070d16] border-slate-700/70 text-slate-400 hover:border-cyan-400/30 hover:text-cyan-300'
                                  }`}
                                >
                                  {focus === 'bottlenecks' && '🌐 Throughput'}{focus === 'security' && '🛡️ Security'}{focus === 'shifts' && '🕒 Fatigue'}
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={executeStatisticalInference}
                              disabled={aiLoadingState !== 'idle' && aiLoadingState !== 'done'}
                              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase text-xs tracking-wider rounded-lg transition-all shadow-[0_0_22px_rgba(16,185,129,0.24)] flex items-center justify-center gap-2 cursor-pointer"
                            >
                              {aiLoadingState === 'idle' || aiLoadingState === 'done' ? (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  <span>Run Inference</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                  <span>Processing...</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="lg:col-span-8 bg-[#0d1527] border border-slate-700/80 rounded-xl overflow-hidden flex flex-col min-h-96 shadow-[0_0_24px_rgba(34,211,238,0.06)]">
                            <div className="p-5 border-b border-slate-700/80 bg-[#0a1220] flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">Output Stream</span>
                              </div>
                              {generatedReportText && (
                                <button
                                  type="button"
                                  onClick={copyReportText}
                                  className="px-3 py-1.5 rounded bg-[#060b12] hover:bg-[#0b1424] border border-slate-700/80 text-[10px] font-mono text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_16px_rgba(34,211,238,0.05)]"
                                >
                                  {clipboardFeedback ? (
                                    <>
                                      <Check className="h-3 w-3 text-emerald-400" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="flex-1 p-6 bg-[#02050a] font-mono text-xs text-cyan-300/90 leading-relaxed overflow-y-auto whitespace-pre-wrap shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                              {aiLoadingState === 'idle' && (
                                <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-3">
                                  <Sparkles className="h-8 w-8" />
                                  <p className="font-sans text-sm">Configure and run analysis</p>
                                </div>
                              )}
                              {aiLoadingState === 'fetching' && <div className="flex items-center justify-center gap-2 h-full"><RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" /><span className="text-emerald-400">Stage 1/3: Fetching...</span></div>}
                              {aiLoadingState === 'matching' && <div className="flex items-center justify-center gap-2 h-full"><RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" /><span className="text-cyan-400">Stage 2/3: Matching...</span></div>}
                              {aiLoadingState === 'finalizing' && <div className="flex items-center justify-center gap-2 h-full"><RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" /><span className="text-emerald-400">Stage 3/3: Finalizing...</span></div>}
                              {aiLoadingState === 'done' && generatedReportText && generatedReportText}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
