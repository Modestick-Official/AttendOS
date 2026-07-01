import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  Layers, 
  Users, 
  Activity, 
  Terminal, 
  Clock, 
  Cpu, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Mail, 
  User, 
  LogOut, 
  Power, 
  RefreshCw,
  Plus,
  Play,
  Globe,
  Wifi,
  Server,
  Hash,
  Fingerprint,
  Clock3,
  UserCheck,
  Compass,
  FileText,
  ChevronRight,
  Shield,
  KeyRound,
  Info,
  ExternalLink,
  SlidersHorizontal,
  HelpCircle
} from 'lucide-react';

// ==========================================
// STATIC CONSTANTS & HARDWARE DICTIONARIES
// ==========================================

interface Worker {
  id: string;
  name: string;
  designation: string;
  department: 'Engineering' | 'Operations' | 'Product' | 'Security' | 'Executive';
  uid: string; // Hex format
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

export default function App() {
  // Navigation Routing States
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<'overview' | 'employees' | 'shifts' | 'reports'>('overview');

  // Enterprise Custom Auth / Persona State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [userRole, setUserRole] = useState('Principal Administrator');
  const [userEmail, setUserEmail] = useState('ahaseebmalik082@gmail.com');
  const [authError, setAuthError] = useState('');

  // Interactive landing page state helpers
  const [activeBlueprintTab, setActiveBlueprintTab] = useState<'cpp' | 'python' | 'rust'>('cpp');
  const [selectedTopologyNode, setSelectedTopologyNode] = useState<string>('Node-ESP32-01');
  const [nodePingsCount, setNodePingsCount] = useState<Record<string, number>>({
    'Node-ESP32-01': 1024,
    'Node-ESP32-02': 892,
    'Node-ESP32-03': 1541,
    'Node-ESP32-04': 412,
    'Node-ESP32-05': 619
  });
  const [pingSuccessMessage, setPingSuccessMessage] = useState<string | null>(null);

  // Core Dynamic Data Storage
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [shifts, setShifts] = useState<CorporateShift[]>(INITIAL_SHIFTS);
  const [telemetry, setTelemetry] = useState<TelemetryLog[]>(INITIAL_TELEMETRY);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<'All' | 'Engineering' | 'Operations' | 'Product' | 'Security'>('All');

  // New Employee Input Fields
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerDesignation, setNewWorkerDesignation] = useState('');
  const [newWorkerDept, setNewWorkerDept] = useState<'Engineering' | 'Operations' | 'Product' | 'Security'>('Engineering');
  const [newWorkerUid, setNewWorkerUid] = useState('0x3B:D2:C1:' + Math.floor(Math.random() * 256).toString(16).toUpperCase());
  const [workerAddSuccess, setWorkerAddSuccess] = useState(false);

  // AI Insights Control Panel States
  const [simulatedStaffVolume, setSimulatedStaffVolume] = useState(380);
  const [diagnosticFocus, setDiagnosticFocus] = useState<'bottlenecks' | 'security' | 'shifts'>('bottlenecks');
  const [aiLoadingState, setAiLoadingState] = useState<'idle' | 'fetching' | 'matching' | 'finalizing' | 'done'>('idle');
  const [generatedReportText, setGeneratedReportText] = useState<string | null>(null);

  // General App Helpers
  const [clockTime, setClockTime] = useState('15:40:28');
  const [clipboardFeedback, setClipboardFeedback] = useState(false);

  // Live real-time clock generator
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClockTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live simulation of MQTT Telemetry Ingest Stream
  useEffect(() => {
    if (currentScreen !== 'dashboard') return;

    const interval = setInterval(() => {
      const nodes = ['Node-ESP32-01', 'Node-ESP32-02', 'Node-ESP32-03', 'Node-ESP32-04', 'Node-ESP32-05'];
      const nodeSelected = nodes[Math.floor(Math.random() * nodes.length)];
      
      const namesList = [
        { name: 'Dr. Aris Thorne', des: 'Principal Hardware Architect', uid: '0x7C:1E:FA:90', dept: 'Engineering' },
        { name: 'Elena Rostova', des: 'Senior RF Signal Specialist', uid: '0x2D:C3:54:1B', dept: 'Engineering' },
        { name: 'Marcus Chen', des: 'Operations Site Warden', uid: '0x4A:BE:91:2C', dept: 'Operations' },
        { name: 'Rajiv Mehta', des: 'Logistics Control Supervisor', uid: '0x2C:A3:41:DD', dept: 'Operations' },
        { name: 'Sarah Jenkins', des: 'Lead Technical Product Manager', dept: 'Product', uid: '0x3E:F2:88:12' },
        { name: 'Kenji Sato', des: 'Embedded Firmware Auditor', dept: 'Engineering', uid: '0x5B:8F:A1:CC' }
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
        payload = `Unidentified RFID transponder card (${uidStr}) rejected by local gateway antenna configuration.`;
      } else if (roll > 0.7) {
        status = 'WARNING';
        payload = `Rapid sweep interval flag on Node ${nodeSelected}. Hardware credential duplicated scan threshold trigger.`;
      } else {
        payload = `${person.name} (${person.des}) validated successfully at ${nodeSelected} checkpoint.`;
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

  // Auth Submit Handlers
  const triggerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError('An authentic administrative email token is required.');
      return;
    }
    setAuthError('');
    if (authEmail.includes('@')) {
      setUserEmail(authEmail);
    }
    setCurrentScreen('dashboard');
  };

  const triggerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authName) {
      setAuthError('All provisioning setup properties must be populated.');
      return;
    }
    setAuthError('');
    setUserEmail(authEmail);
    setUserRole('Gate Group Supervisor');
    setCurrentScreen('dashboard');
  };

  // Add Worker Function
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
      lastSeen: 'Just Swiped'
    };

    setWorkers(prev => [created, ...prev]);
    setNewWorkerName('');
    setNewWorkerDesignation('');
    setNewWorkerUid('0x3B:D2:C1:' + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0'));
    setWorkerAddSuccess(true);
    setTimeout(() => setWorkerAddSuccess(false), 3000);
  };

  // Shift activation toggle
  const toggleShiftActiveState = (id: string) => {
    setShifts(prev => prev.map(sh => {
      if (sh.id === id) {
        return { ...sh, active: !sh.active };
      }
      return sh;
    }));
  };

  // Quick Hardware Simulating Event
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
      payload: `[Simulated Hot-Inject] Passed token signature ${generatedUid} for ${selectedName}. Validation status: TRUE`
    };

    setTelemetry(prev => [injectedLog, ...prev]);
  };

  // Heavy AI Report Generator
  const executeStatisticalInference = () => {
    setAiLoadingState('fetching');
    setGeneratedReportText(null);

    setTimeout(() => {
      setAiLoadingState('matching');
    }, 800);

    setTimeout(() => {
      setAiLoadingState('finalizing');
    }, 1600);

    setTimeout(() => {
      setAiLoadingState('done');
      const cap = simulatedStaffVolume;
      const calculatedPresence = Math.round(cap * 0.934);
      const calculatedSuspicious = Math.round(cap * 0.015 + 2);

      let text = '';
      if (diagnosticFocus === 'bottlenecks') {
        text = `### 🌐 AttendOS AI Systemic Throughput Report
*Target Dataset Capacity: ${cap} Active RF Transponders*

#### 1. CRITICAL TELEMETRY SUMMARY
- **Active Real-Time Node Connection Status:** Operational (All 12 ESP32 modules validated)
- **Calculated Ingress Efficiency Score:** 98.4% within nominal shift bounds
- **Peak Arrival Congestion Slot:** 08:48 AM - 09:12 AM (Accounts for 72.4% of total daily traffic load)

#### 2. INFERENCE DIAGNOSES
- Reconciled ${calculatedPresence} unique hardware signatures against the central catalog.
- Identified heavy physical processing delays at **ES32 Edge Node 03 (East Corridor)**. High-capacity queue buildup observed on shift-overtures. Packet synchronization delays average **14ms per validation check** due to localized RSSI signal distortion.

#### 3. TACTICAL MITIGATION RECOMMENDATIONS
- **Calibrate Antenna Cooldown:** Adjust the physical chip-polling cooldown parameter in the ESP32-S3 driver down to exactly 250ms.
- **Stagger Team Entry Windows:** Shift the 'Global Production Alpha' team schedule by an offset of 15 minutes to fully decouple loading bay arrival peaks from Main Gate A.`;
      } else if (diagnosticFocus === 'security') {
        text = `### 🛡️ AttendOS Cryptographic Security & Anti-Clone Audit
*Target Dataset Capacity: ${cap} Active RF Transponders*

#### 1. HEURISTIC THREAT EVALUATION
- **Verified Token Authenticators:** High Cryptographic Confidence (99.85%)
- **Anomalous Signature Spikes:** Detected ${calculatedSuspicious} credential discrepancies
- **Spatial Impossible Movement flags:** 1 Active Isolation Loop triggered

#### 2. THREAT MATRIX LOGS
- Tag signature **0x4A:BE:91:2C (Marcus Chen)** triggered parallel telemetry events at Node-ESP32-01 and Node-ESP32-03 with an interval of less than 11 seconds. The geographical distance between these gateways exceeds physical speed limits, indicating potential card duplication.
- System automatically broadcasted a silent lockout packet to Edge Nodes to restrict access pending security override.

#### 3. PREVENTATIVE COUNTERMEASURES
- **Hardware Protocol Security:** Upgrade Node communication parameters from raw UID reading to fully encrypted 3DES sector blocks.
- **Automated Anti-Passback Constraints:** De-authorize any token that does not log a corresponding exit transit before registering secondary entries.`;
      } else {
        text = `### 🕒 AttendOS Workforce Fatigue & Shift Allocation Index
*Target Dataset Capacity: ${cap} Active RF Transponders*

#### 1. SHIFT DENSITY FORECAST
- **Optimal Daily Staff Allocation:** ${Math.round(cap * 0.85)} registered slots active
- **Overtime Fatigue Risk Indicators:** Heavy clustering in Operations Group (14 personnel logged >48 hours in a 5-day window)
- **Predicted Sick Leave Absences:** ~6.8% risk factor index next Monday

#### 2. BEHAVIORAL INTERPOLATION
- **Shift Slippage Rates:** Morning Shift registers high lateness index (**14.2m average**). Engineering teams compensate with late-night exit streams post 08:30 PM. Product units display highly regularized, compact 8-hour access trends.
- **Node Traffic Volume Density:** ESP32-NODE-03 coordinates the highest single concentration of concurrent validations during peak rotation hours.

#### 3. STRATEGIC RESOURCE ADVISORY
- Deploy additional localized temporary badges at loading docks to speed up manual subcontractor authentication.
- Institute auto-dimming building protocols and send push reminders to engineers working past 09:00 PM to protect employee wellness.`;
      }
      setGeneratedReportText(text);
    }, 2400);
  };

  const copyReportText = () => {
    if (!generatedReportText) return;
    navigator.clipboard.writeText(generatedReportText);
    setClipboardFeedback(true);
    setTimeout(() => setClipboardFeedback(false), 2000);
  };

  // Filter Worker Directory
  const filteredWorkersList = useMemo(() => {
    return workers.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDeptFilter === 'All' ? true : emp.department === selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }, [workers, searchQuery, selectedDeptFilter]);

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 font-sans relative selection:bg-emerald-500/20 overflow-x-hidden">
      
      {/* Dynamic Hex / Grid Decorative Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-25" />
      
      {/* Master Glow Elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* ========================================================================= */}
        {/* 1. LANDING SCREEN (ULTRA-PREMIUM BENTO PRESENTATION)                      */}
        {/* ========================================================================= */}
        {currentScreen === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen flex flex-col justify-between"
          >
            {/* Top Branding Navigation */}
            <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-900 z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)]">
                  <Radio className="h-5 w-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">Enterprise Core</span>
                  <h1 className="text-xl font-bold tracking-tight text-white leading-none">AttendOS</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="px-5 py-2 text-xs font-mono font-bold tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  DECRYPT SESSION
                </button>
                <button 
                  onClick={() => setCurrentScreen('signup')}
                  className="px-5 py-2.5 text-xs font-mono font-bold tracking-wider bg-slate-900 border border-slate-800 text-emerald-400 rounded-lg hover:border-emerald-500/40 hover:bg-slate-850 transition-all cursor-pointer"
                >
                  PROVISION NEW NODE
                </button>
              </div>
            </header>

            {/* Bento Grid Presentation */}
            <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Executive Callout Block (Span 7) */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-8 bg-[#0c1224]/40 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                  
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                      <Wifi className="h-3 w-3 animate-pulse" />
                      <span>MQTT Stream • QoS Level 1 • KeepAlive 60s</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] font-display">
                      Industrial <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">RFID Telemetry</span> & Edge-Sync Architecture
                    </h2>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                      A pristine hardware coordination workspace designed specifically for physical access tracking. Synchronize local ESP32-S3 controllers, monitor real-world MQTT validation topics, audit token signatures, and execute instant statistical AI reports.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={() => setCurrentScreen('login')}
                      className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>Launch Sandbox Interface</span>
                      <ArrowRight className="h-4.5 w-4.5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('Executive Director');
                        setUserEmail('director@attendos.com');
                        setCurrentScreen('dashboard');
                      }}
                      className="px-8 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold uppercase text-xs tracking-wider rounded-xl transition-all hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Quick Bypass Demo</span>
                    </button>
                  </div>
                </div>

                {/* System Specs Bento Panels (Span 5) */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Card 1: Live Hardware Specs */}
                  <div className="bg-[#0d1527] border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all">
                    <div className="p-2.5 w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div className="mt-8">
                      <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">EDGE HARDWARE</h4>
                      <p className="text-lg font-bold text-slate-100 mt-1">ESP32-S3 Array</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Dual-core Xtensa MCU with integrated hardware encryption modules.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Broker Configuration */}
                  <div className="bg-[#0d1527] border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] transition-all">
                    <div className="p-2.5 w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
                      <Server className="h-5 w-5" />
                    </div>
                    <div className="mt-8">
                      <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">MQTT BROKER</h4>
                      <p className="text-lg font-bold text-slate-100 mt-1">QoS Level 1</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Strict validation packets with immediate token receipt handshakes.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: System Latency */}
                  <div className="bg-[#0d1527] border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all">
                    <div className="p-2.5 w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-all">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="mt-8">
                      <h4 className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">LATENCY INDEX</h4>
                      <p className="text-lg font-bold text-slate-100 mt-1">~14ms Response</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Near-zero verification propagation delay across local corporate subnets.
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Access Security */}
                  <div className="bg-[#0d1527] border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)] transition-all">
                    <div className="p-2.5 w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-black transition-all">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="mt-8">
                      <h4 className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">SECURITY POLICY</h4>
                      <p className="text-lg font-bold text-slate-100 mt-1">Anti-Passback</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Heuristic defense against card cloning and spatial transit violations.
                      </p>
                    </div>
                </div>

              </div>

            </div>

              {/* SECTION A: IIOT ACTIVE NODE TOPOLOGY (REAL-TIME SIMULATION) */}
              <div className="mt-16 border-t border-slate-900/80 pt-16">
                <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    <Fingerprint className="h-3.5 w-3.5" />
                    <span>Hardware Infrastructure Topology</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                    Simulated IIoT Edge Gateway Network
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Select a node to interrogate its local MQTT keep-alive stats, telemetry logs, and dispatch secure diagnostic pings over the sandbox subnet.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Interactive Node Map List */}
                  <div className="lg:col-span-5 space-y-4">
                    {[
                      { id: 'Node-ESP32-01', location: 'Main Reception Ingress', ip: '192.168.1.101', type: 'ESP32-S3-WROOM-1', rssi: '-42 dBm' },
                      { id: 'Node-ESP32-02', location: 'Server Core Vault Entry', ip: '192.168.1.102', type: 'ESP32-S3-WROOM-1', rssi: '-56 dBm' },
                      { id: 'Node-ESP32-03', location: 'R&D Lab Sector 4', ip: '192.168.1.103', type: 'ESP32-S3-WROOM-1', rssi: '-38 dBm' },
                      { id: 'Node-ESP32-04', location: 'Executive Suite Lounge', ip: '192.168.1.104', type: 'ESP32-S3-WROOM-2', rssi: '-68 dBm' },
                      { id: 'Node-ESP32-05', location: 'Loading Bay Gate C', ip: '192.168.1.105', type: 'ESP32-WROOM-32D', rssi: '-51 dBm' }
                    ].map(node => {
                      const isSelected = selectedTopologyNode === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => {
                            setSelectedTopologyNode(node.id);
                            setPingSuccessMessage(null);
                          }}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                            isSelected
                              ? 'bg-[#12233b] border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                              : 'bg-[#0d1527] border-slate-700/80 hover:border-emerald-500/40 hover:bg-[#13203b]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500/80'}`} />
                              <span className="text-xs font-mono font-bold text-slate-100">{node.id}</span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-black px-2 py-0.5 rounded border border-slate-700/80">
                              {node.rssi}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-300 mt-2">{node.location}</p>
                          <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500">
                            <span>IPv4: {node.ip}</span>
                            <span className="text-cyan-400">{node.type}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Dynamic Stats Terminal & Remote Diagnostic tool */}
                  <div className="lg:col-span-7 bg-[#0d1527] border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[432px] shadow-[0_0_25px_rgba(16,185,129,0.1)]">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                      <Terminal className="h-44 w-44 text-emerald-400" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">GATEWAY DIAGNOSTICS</span>
                          <h4 className="text-lg font-bold text-white mt-0.5">{selectedTopologyNode} Status</h4>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase font-bold">
                          Active State
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="p-3 bg-black border border-slate-700/80 hover:border-emerald-500/40 rounded-xl transition-all shadow-[0_0_10px_rgba(16,185,129,0.02)]">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Total RFID Swipes</span>
                          <span className="text-lg font-mono font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            {nodePingsCount[selectedTopologyNode]?.toLocaleString() || '1,200'}
                          </span>
                        </div>
                        <div className="p-3 bg-black border border-slate-700/80 hover:border-cyan-500/40 rounded-xl transition-all shadow-[0_0_10px_rgba(34,211,238,0.02)]">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">RF CARRIER FREQ</span>
                          <span className="text-lg font-mono font-bold text-cyan-400">13.56 MHz</span>
                        </div>
                        <div className="p-3 bg-black border border-slate-700/80 hover:border-emerald-500/40 rounded-xl transition-all shadow-[0_0_10px_rgba(16,185,129,0.02)]">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">MQTT Heartbeat</span>
                          <span className="text-xs font-mono text-emerald-400 mt-1 block font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-pulse">INTERVAL: 60s OK</span>
                        </div>
                        <div className="p-3 bg-black border border-slate-700/80 hover:border-amber-500/40 rounded-xl transition-all shadow-[0_0_10px_rgba(245,158,11,0.02)]">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Firmware Hash</span>
                          <span className="text-xs font-mono text-amber-400 mt-1 block truncate font-bold">
                            SHA256: 0xf5a2..91bc
                          </span>
                        </div>
                      </div>

                      {/* Mock Shell ping log */}
                      <div className="bg-black rounded-xl p-4 border border-slate-700/80 font-mono text-left text-xs text-slate-400 space-y-1.5 h-36 overflow-y-auto shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                        <p className="text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]">[INFO] Interrogating {selectedTopologyNode} micro-controller...</p>
                        <p className="text-slate-400">{"$"} mosquitto_pub -h broker.attendos.io -t telemetry/{selectedTopologyNode.toLowerCase()} -m "ping"</p>
                        <p className="text-cyan-400">[CONN] Gateway handshake successfully established.</p>
                        <p className="text-slate-300">[RECV] Keep-Alive confirmation: 0 milliseconds drift.</p>
                        {pingSuccessMessage && (
                          <p className="text-amber-400 font-bold animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]">{pingSuccessMessage}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setNodePingsCount(prev => ({
                            ...prev,
                            [selectedTopologyNode]: (prev[selectedTopologyNode] || 0) + 1
                          }));
                          setPingSuccessMessage(`[SUCCESS] Remote Ping Dispatched to ${selectedTopologyNode}. RSSI: Corrected. Tx Power: Nom.`);
                        }}
                        className="w-full py-3 bg-[#13203b] hover:bg-[#1a2c52] border border-emerald-500/30 text-emerald-400 font-bold uppercase text-xs tracking-wider rounded-xl transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-400 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                        <span>Trigger Remote Diagnostic Ping</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: SYSTEM ARCHITECTURE COMPARISON (PREMIUM GRID) */}
              <div className="mt-20 border-t border-slate-900/80 pt-16 text-left">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono text-teal-400 font-semibold uppercase tracking-wider">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Enterprise-Grade Protocol Security</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                    Secure Cryptographic Handshake Specs
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Why the AttendOS high-fidelity RFID platform is chosen by top-tier aerospace, defense, and nuclear research installations globally.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: ShieldCheck,
                      title: 'Anti-Cloning Stack',
                      metric: 'AES-128 Sector-Encrypted',
                      desc: 'Mutual-authentication protocol protects individual RFID tokens from raw signal copying, terminal spoofing, or spatial duplication attacks.'
                    },
                    {
                      icon: Wifi,
                      title: 'Live MQTT Broker',
                      metric: 'QoS 1 Deliverability',
                      desc: 'No traditional database polling bottleneck. Active connections propagate tag validations into state stores inside 14 milliseconds.'
                    },
                    {
                      icon: SlidersHorizontal,
                      title: 'Dynamic OTA Update',
                      metric: 'Over-The-Air Patching',
                      desc: 'Deploy updated cryptographic keys or firmware adjustments to hundreds of ESP32 edge antennas simultaneously via secure WiFi.'
                    },
                    {
                      icon: Sparkles,
                      title: 'AI Analytics Ingress',
                      metric: 'Heuristic Inference',
                      desc: 'Continuous threat monitoring flags impossible speed coordinates or rapid Sweep sequences, isolating compromised credentials in real-time.'
                    }
                  ].map((feat, idx) => (
                    <div key={idx} className="bg-[#0d1527] border border-slate-700/80 rounded-2xl p-6 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all group">
                      <div className="p-2.5 w-11 h-11 rounded-lg bg-black border border-slate-700/80 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <feat.icon className="h-5 w-5 stroke-[2]" />
                      </div>
                      <h4 className="text-base font-bold text-slate-100 mt-4">{feat.title}</h4>
                      <p className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider mt-1">{feat.metric}</p>
                      <p className="text-xs text-slate-400 mt-3 leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION C: FIRMWARE DEPLOYMENT TERMINAL (TABBED INTERACTIVE DEPLOYMENT CODE) */}
              <div className="mt-20 border-t border-slate-900/80 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left info */}
                  <div className="lg:col-span-5 text-left space-y-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400 font-semibold uppercase tracking-wider">
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Zero-Touch Provisioning</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                      Instant Edge Firmware Deployment
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Select your hardware architecture platform and copy the fully configured MQTT client boilerplate. Flash directly to your ESP32 boards using Espressif Tooling or VSCode PlatformIO to bind local RFID sensors to the AttendOS central stream.
                    </p>

                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-[10px] font-bold font-mono">1</div>
                        <span>Provision access credentials in the Registry</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-[10px] font-bold font-mono">2</div>
                        <span>Flash compiled firmware binary to ESP32</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-[10px] font-bold font-mono">3</div>
                        <span>Observe real-time MQTT telemetry stream connection</span>
                      </div>
                    </div>
                  </div>

                  {/* Right tabbed terminal */}
                  <div className="lg:col-span-7 bg-[#0d1527] border border-emerald-500/30 rounded-2xl overflow-hidden flex flex-col h-[380px] shadow-[0_0_25px_rgba(16,185,129,0.1)]">
                    {/* Header with tabs */}
                    <div className="bg-black/40 border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveBlueprintTab('cpp')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            activeBlueprintTab === 'cpp'
                              ? 'bg-black text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          ESP32_C++.ino
                        </button>
                        <button
                          onClick={() => setActiveBlueprintTab('python')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            activeBlueprintTab === 'python'
                              ? 'bg-black text-teal-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(20,184,166,0.15)]'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          main.py
                        </button>
                        <button
                          onClick={() => setActiveBlueprintTab('rust')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            activeBlueprintTab === 'rust'
                              ? 'bg-black text-cyan-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          lib.rs
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          let codeToCopy = '';
                          if (activeBlueprintTab === 'cpp') {
                            codeToCopy = `#include <WiFi.h>\n#include <PubSubClient.h>\nconst char* ssid = "Secure_Net";\nconst char* mqtt_broker = "mqtt.attendos.io";`;
                          } else if (activeBlueprintTab === 'python') {
                            codeToCopy = `import network\nimport usocket as socket\nimport ujson\nBROKER = "mqtt.attendos.io"`;
                          } else {
                            codeToCopy = `use esp_idf_hal::prelude::*;\nuse esp_idf_svc::mqtt::client::*;`;
                          }
                          navigator.clipboard.writeText(codeToCopy);
                          setClipboardFeedback(true);
                          setTimeout(() => setClipboardFeedback(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded bg-black border border-slate-700/80 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.15)] transition-all text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                      >
                        {clipboardFeedback ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>COPY CODE</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Syntax area */}
                    <div className="flex-1 p-5 font-mono text-xs text-left overflow-y-auto leading-relaxed bg-black/90 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                      {activeBlueprintTab === 'cpp' && (
                        <div className="space-y-1 text-slate-300">
                          <p className="text-slate-500">// ESP32-S3 Arduino C++ Active Driver</p>
                          <p><span className="text-pink-400">#include</span> <span className="text-emerald-400">&lt;WiFi.h&gt;</span></p>
                          <p><span className="text-pink-400">#include</span> <span className="text-emerald-400">&lt;PubSubClient.h&gt;</span></p>
                          <br />
                          <p><span className="text-blue-400">const char*</span> ssid = <span className="text-emerald-400">"AttendOS_Secure_Net"</span>;</p>
                          <p><span className="text-blue-400">const char*</span> mqtt_broker = <span className="text-emerald-400">"mqtt.attendos.io"</span>;</p>
                          <p><span className="text-blue-400">const int</span> mqtt_port = <span className="text-purple-400">8883</span>;</p>
                          <br />
                          <p><span className="text-yellow-400">void</span> <span className="text-blue-400">connectSecureBroker</span>() &#123;</p>
                          <p className="pl-4 text-slate-500">// Establish secure MQTT handshake with client token authorization</p>
                          <p className="pl-4">client.<span className="text-yellow-400">setCACert</span>(ROOT_CA_CERTIFICATE);</p>
                          <p className="pl-4"><span className="text-pink-400">if</span> (client.<span className="text-yellow-400">connect</span>(<span className="text-emerald-400">"ESP32-Client-NODE-03"</span>)) &#123;</p>
                          <p className="pl-8">Serial.<span className="text-yellow-400">println</span>(<span className="text-emerald-400">"[MQTT] Connection nominal. Subscribing..."</span>);</p>
                          <p className="pl-4">&#125;</p>
                          <p>&#125;</p>
                        </div>
                      )}

                      {activeBlueprintTab === 'python' && (
                        <div className="space-y-1 text-slate-300">
                          <p className="text-slate-500"># MicroPython Socket-Level Gateway Driver</p>
                          <p><span className="text-pink-400">import</span> network</p>
                          <p><span className="text-pink-400">import</span> usocket <span className="text-pink-400">as</span> socket</p>
                          <p><span className="text-pink-400">import</span> ujson</p>
                          <br />
                          <p>SSID = <span className="text-emerald-400">"AttendOS_Secure_Net"</span></p>
                          <p>BROKER_IP = <span className="text-emerald-400">"mqtt.attendos.io"</span></p>
                          <br />
                          <p><span className="text-pink-400">def</span> <span className="text-yellow-400">dispatch_rfid_payload</span>(uid, rssi):</p>
                          <p className="pl-4">payload = ujson.dumps(&#123;<span className="text-emerald-400">"token_uid"</span>: uid, <span className="text-emerald-400">"rssi_db"</span>: rssi&#125;)</p>
                          <p className="pl-4 text-slate-500"># Dispatch raw secure bytes to edge listener</p>
                          <p className="pl-4">sock = socket.socket()</p>
                          <p className="pl-4">sock.connect((BROKER_IP, <span className="text-purple-400">1883</span>))</p>
                          <p className="pl-4">sock.send(payload)</p>
                          <p className="pl-4">sock.close()</p>
                        </div>
                      )}

                      {activeBlueprintTab === 'rust' && (
                        <div className="space-y-1 text-slate-300">
                          <p className="text-slate-500">// Rust embedded-hal esp-idf-hal secure driver</p>
                          <p><span className="text-pink-400">use</span> esp_idf_hal::prelude::*;</p>
                          <p><span className="text-pink-400">use</span> esp_idf_svc::mqtt::client::*;</p>
                          <br />
                          <p><span className="text-pink-400">fn</span> <span className="text-yellow-400">main</span>() -&gt; Result&lt;()&gt; &#123;</p>
                          <p className="pl-4"><span className="text-pink-400">let</span> sysloop = EspSystemEventLoop::take()?;</p>
                          <p className="pl-4"><span className="text-pink-400">let</span> <span className="text-pink-400">mut</span> mqtt = EspMqttClient::new(</p>
                          <p className="pl-8"><span className="text-emerald-400">"mqtts://mqtt.attendos.io:8883"</span>,</p>
                          <p className="pl-8">&amp;MqttClientConfiguration::default()</p>
                          <p className="pl-4">)?;</p>
                          <p className="pl-4">mqtt.publish(<span className="text-emerald-400">"telemetry/node_03"</span>, QoS::Level1, <span className="text-purple-400">true</span>, <span className="text-emerald-400">b"0x2D:C3:54:1B"</span>)?;</p>
                          <p className="pl-4">Ok(())</p>
                          <p>&#125;</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </main>

            {/* Ultra-Sleek & Compact Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900/60 text-slate-500 text-[10px] font-mono flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                AttendOS © 2026 • Global Node System v4.8 Stable
              </span>
              <div className="flex items-center gap-4 text-slate-500">
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Status: nominal</span>
                <span>•</span>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">firmware docs</span>
                <span>•</span>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">mqtt spec</span>
                <span>•</span>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">latency: 14ms</span>
              </div>
            </footer>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 2. AUTHENTICATION GATEWAY: LOGIN                                          */}
        {/* ========================================================================= */}
        {currentScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="min-h-screen flex items-center justify-center p-6 relative"
          >
            <div className="w-full max-w-md bg-[#0d1527] border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Radio className="h-32 w-32 text-emerald-400" />
              </div>

              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <Radio className="h-6 w-6 text-slate-950 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Decrypt Node Session</h3>
                <p className="text-xs text-slate-400 mt-1">Validate your administrative profile signatures</p>
              </div>

              <form onSubmit={triggerLogin} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-mono">
                    {authError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">ADMINISTRATIVE EMAIL</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="admin@attendos.io"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">Any valid address executes instant entry.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">SECURITY KEYPHRASE</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">ADMIN ROLE DESIGNATION</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full bg-black border border-slate-700 rounded-xl py-3 px-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono"
                  >
                    <option value="Principal Administrator">Principal Administrator (Full Access)</option>
                    <option value="Executive Director">Executive Director (Read-Only)</option>
                    <option value="Lead Security Warden">Lead Security Warden (Gate Override)</option>
                    <option value="HR Operations Officer">HR Operations Officer (Schedules)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2.5 cursor-pointer mt-6 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  <span>Decrypt & Connect Hub</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-700/80 text-center text-xs text-slate-500 font-mono">
                <span>New physical gate deployment? </span>
                <button 
                  onClick={() => setCurrentScreen('signup')}
                  className="text-emerald-400 hover:underline cursor-pointer font-bold"
                >
                  Configure Hardware Node
                </button>
              </div>

              <div className="mt-4 text-center">
                <button 
                  onClick={() => setCurrentScreen('landing')}
                  className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer transition-colors"
                >
                  ← Return to Landing Specifications
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 3. AUTHENTICATION GATEWAY: CONFIGURATION / SIGNUP                         */}
        {/* ========================================================================= */}
        {currentScreen === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="min-h-screen flex items-center justify-center p-6 relative"
          >
            <div className="w-full max-w-md bg-[#0d1527] border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Radio className="h-32 w-32 text-emerald-400" />
              </div>

              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <Radio className="h-6 w-6 text-slate-950 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Provision Gate Node Array</h3>
                <p className="text-xs text-slate-400 mt-1">Bind live hardware streams to a centralized administration hub</p>
              </div>

              <form onSubmit={triggerSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">SUPERVISOR FULL NAME</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Sterling"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">ENTERPRISE HUB EMAIL</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="sterling@attendos.io"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">NEW SYSTEM ENCRYPT KEY</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">TARGET COMPATIBLE FIRMWARE</label>
                  <select className="w-full bg-black border border-slate-700 rounded-xl py-3 px-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono">
                    <option>ESP32-S3 (Xtensa Dual-Core, WiFi + BLE)</option>
                    <option>ESP32-WROOM-32E (Standard 2.4GHz WiFi)</option>
                    <option>Raspberry Pi Pico W (MicroPython Gateway)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2.5 cursor-pointer mt-6 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  <span>Execute Node Provisioning</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-700/80 text-center text-xs text-slate-500 font-mono">
                <span>Directly authorized already? </span>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="text-emerald-400 hover:underline cursor-pointer font-bold"
                >
                  Session Login
                </button>
              </div>

              <div className="mt-4 text-center">
                <button 
                  onClick={() => setCurrentScreen('landing')}
                  className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer transition-colors"
                >
                  ← Return to Landing Specifications
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 4. MAIN ENTERPRISE DASHBOARD FRAME                                       */}
        {/* ========================================================================= */}
        {currentScreen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col md:flex-row bg-black"
          >
            {/* STICKY FIXED LEFT SIDEBAR (Width w-68 / 272px) */}
            <aside className="w-full md:w-68 border-b md:border-b-0 md:border-r border-slate-700 bg-[#0d1527] flex-shrink-0 flex flex-col justify-between z-20 h-auto md:h-screen sticky top-0">
              
              <div className="flex flex-col">
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Radio className="h-5 w-5 text-slate-950 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold block">Telemetry OS</span>
                    <h1 className="text-base font-bold tracking-tight text-white leading-none">AttendOS Hub</h1>
                  </div>
                </div>

                {/* Navigation Navigation Tabs */}
                <nav className="p-4 space-y-1.5">
                  <span className="px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2.5 font-bold">SYSTEM METRICS</span>
                  
                  <button
                    onClick={() => setCurrentTab('overview')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      currentTab === 'overview'
                        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-2'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4.5 w-4.5" />
                      <span>Node Infrastructure</span>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                      Live
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('employees')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      currentTab === 'employees'
                        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-2'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="h-4.5 w-4.5" />
                      <span>Asset Registry</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {workers.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('shifts')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      currentTab === 'shifts'
                        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-2'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock3 className="h-4.5 w-4.5" />
                      <span>Operational Shifts</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {shifts.filter(s => s.active).length}/{shifts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('reports')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      currentTab === 'reports'
                        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-2'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>AI Inference Engine</span>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded">
                      HEAVY
                    </span>
                  </button>
                </nav>

                <div className="px-6 py-4 mt-2">
                  <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">NODE HEALTH</span>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Wifi className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                      <span>Broker: Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Server className="h-3.5 w-3.5 text-teal-400" />
                      <span>Client Latency: 14ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Slot at base of Sidebar */}
              <div className="p-4 border-t border-slate-800/60 bg-[#090d1a] flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9.5 h-9.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs flex-shrink-0">
                    AD
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-slate-200 block truncate leading-tight">
                      {authName || 'ahaseebmalik082'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 block truncate">
                      {userRole}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentScreen('landing')}
                  title="Revoke Session"
                  className="p-1.5 rounded-md hover:bg-slate-900 hover:text-white text-slate-500 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-rose-400/80 hover:text-rose-400" />
                </button>
              </div>
            </aside>

            {/* DASHBOARD RIGHT BODY */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#070b16] h-screen overflow-y-auto">
              
              {/* Global Header */}
              <header className="h-16 border-b border-slate-800/60 px-6 sm:px-8 flex items-center justify-between bg-[#0c1224]/80 backdrop-blur-md flex-shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-slate-400">Operational Node Hub</span>
                  <span className="h-4 w-[1px] bg-slate-850" />
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider hidden sm:inline-block">
                    {userEmail}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-900/90 rounded-full px-3 py-1 border border-slate-800 text-xs text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-teal-400" />
                    <span>UTC-7 Time: </span>
                    <span className="text-teal-300 font-semibold">{clockTime}</span>
                  </div>

                  <button 
                    onClick={() => {
                      setCurrentScreen('landing');
                      setAuthEmail('');
                      setAuthPassword('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-400 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Revoke Session</span>
                  </button>
                </div>
              </header>

              {/* TAB CONTENT DYNAMIC SWITCHER */}
              <div className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
                
                {/* ========================================================================= */}
                {/* TAB A: SYSTEM OVERVIEW                                                    */}
                {/* ========================================================================= */}
                {currentTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Page Description Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/50 pb-5">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-white font-display">MQTT Network Infrastructure</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Real-time status analysis of local ESP32-S3 edge validation transponders.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={injectSimulatedSwipe}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase rounded-lg tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
                        >
                          <Play className="h-3.5 w-3.5 fill-current stroke-none" />
                          <span>Inject Simulated Sweep</span>
                        </button>
                      </div>
                    </div>

                    {/* 4 Symmetrical Numeric Analytic Cards with Line Meters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      {/* Card 1: Online Nodes */}
                      <div className="bg-[#131b2e] border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">ONLINE SYSTEM NODES</span>
                            <p className="text-3xl font-bold tracking-tight text-white">12 / 12</p>
                          </div>
                          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <Cpu className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 left-0 bg-emerald-400 rounded-full h-full shadow-[0_0_10px_rgba(16,185,129,0.5)] w-full" />
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400 mt-1.5 block uppercase tracking-wider font-semibold">100% Physical Sync SLA</span>
                        </div>
                      </div>

                      {/* Card 2: Validated Active Today */}
                      <div className="bg-[#131b2e] border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">SWIPED IN TODAY</span>
                            <p className="text-3xl font-bold tracking-tight text-white">
                              {workers.filter(e => e.status === 'Online').length} / {workers.length}
                            </p>
                          </div>
                          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
                            <UserCheck className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 left-0 bg-teal-400 rounded-full h-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: `${(workers.filter(e => e.status === 'Online').length / workers.length) * 100}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 mt-1.5 block uppercase tracking-wider">
                            Active Transponder Matrix Reconciled
                          </span>
                        </div>
                      </div>

                      {/* Card 3: Late Clock-ins index */}
                      <div className="bg-[#131b2e] border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">LATE CLOCK-INS</span>
                            <p className="text-3xl font-bold tracking-tight text-white">02</p>
                          </div>
                          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                            <Clock className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 left-0 bg-amber-400 rounded-full h-full w-[15%]" />
                          </div>
                          <span className="text-[9px] font-mono text-amber-400 mt-1.5 block uppercase tracking-wider font-semibold">
                            Within Standard SLA Threshold
                          </span>
                        </div>
                      </div>

                      {/* Card 4: Anomalies Counter */}
                      <div className="bg-[#131b2e] border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">ACTIVE EXCEPS</span>
                            <p className="text-3xl font-bold tracking-tight text-rose-400">
                              {telemetry.filter(t => t.status === 'SUSPICIOUS' || t.status === 'WARNING').length}
                            </p>
                          </div>
                          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
                            <AlertTriangle className="h-5 w-5 animate-pulse" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 left-0 bg-rose-500 rounded-full h-full w-[40%]" />
                          </div>
                          <span className="text-[9px] font-mono text-rose-400 mt-1.5 block uppercase tracking-wider font-semibold animate-pulse">
                            Hardware Intercept Flag Active
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* MQTT Telemetry Stream Component */}
                    <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                      
                      {/* Component Header */}
                      <div className="p-5 border-b border-slate-800/80 bg-[#17213a]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Terminal className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">MQTT Telemetry Ingest Stream (Broker: Active)</h3>
                            <p className="text-[11px] font-mono text-slate-400">Protocol: MQTT over WebSockets | QoS: 1 | KeepAlive: 60s | Host: broker.attendos.io:443</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                            Telemetry Live Ingesting
                          </span>
                        </div>
                      </div>

                      {/* Streaming Logs Body */}
                      <div className="p-6 bg-slate-950 font-mono text-xs overflow-y-auto max-h-[380px] space-y-2.5">
                        <AnimatePresence initial={false}>
                          {telemetry.map((log) => (
                            <motion.div
                              key={log.id}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-3 bg-slate-900/60 border border-slate-900/80 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="flex items-start gap-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold block ${
                                  log.status === 'AUTHORIZED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  log.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  log.status === 'SUSPICIOUS' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' :
                                  'bg-slate-800 text-slate-300'
                                }`}>
                                  {log.status}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-bold text-[11px]">{log.node}</span>
                                    <span className="text-slate-600 font-bold">•</span>
                                    <span className="text-slate-400 text-[10px]">Token UID (Hex): {log.uid}</span>
                                  </div>
                                  <p className="text-slate-200 mt-1 font-sans text-xs">{log.payload}</p>
                                </div>
                              </div>

                              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 self-end md:self-center">
                                <Clock className="h-3.5 w-3.5 text-slate-600" />
                                {log.timestamp}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <div className="p-4 bg-[#10162a]/50 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Reconciling physical card validation streams against AttendOS SQL master ledger.</span>
                        <span className="hidden sm:inline">Automatic garbage collection post 50 records.</span>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* ========================================================================= */}
                {/* TAB B: EMPLOYEE ASSET DIRECTORY                                           */}
                {/* ========================================================================= */}
                {currentTab === 'employees' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-5">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-white font-display">Administrative Asset Directory</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Manage and query corporate RFID credentials bound to registered physical personnel.</p>
                      </div>

                      {/* Quick Department Pill Filters */}
                      <div className="flex bg-[#10162a] p-1 rounded-lg border border-slate-800/80 self-start md:self-auto">
                        {(['All', 'Engineering', 'Operations', 'Product', 'Security'] as const).map(dept => (
                          <button
                            key={dept}
                            onClick={() => setSelectedDeptFilter(dept)}
                            className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
                              selectedDeptFilter === dept
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Directory Grid & Add Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Table List Directory (Span 8) */}
                      <div className="lg:col-span-8 space-y-4">
                        
                        {/* Interactive local search bar */}
                        <div className="relative">
                          <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Query by asset name, assigned designation, or RFID transponder hardware UID (Hex)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#131b2e] border border-slate-800/60 rounded-xl py-3.5 pl-12 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                          />
                        </div>

                        {/* Telemetry Asset Table */}
                        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800/80 bg-[#17213a]/30 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                <th className="p-4 font-bold">Asset Employee</th>
                                <th className="p-4 font-bold">Assigned Department</th>
                                <th className="p-4 font-bold">RFID Token Hardware UID (Hex)</th>
                                <th className="p-4 font-bold">Live Status</th>
                                <th className="p-4 font-bold text-right">Synchronization</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                              {filteredWorkersList.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                                    <Users className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                                    <span>No active personnel matched the filter constraints.</span>
                                  </td>
                                </tr>
                              ) : (
                                filteredWorkersList.map(worker => (
                                  <tr key={worker.id} className="hover:bg-slate-900/40 transition-colors">
                                    <td className="p-4 font-sans">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8.5 h-8.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                                          {worker.name.charAt(0)}
                                        </div>
                                        <div>
                                          <span className="font-bold text-slate-200 block text-xs">{worker.name}</span>
                                          <span className="text-[10px] text-slate-500 block mt-0.5">{worker.designation}</span>
                                        </div>
                                      </div>
                                    </td>
                                    
                                    <td className="p-4">
                                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#17213a] text-slate-300 border border-slate-800 uppercase">
                                        {worker.department}
                                      </span>
                                    </td>

                                    <td className="p-4 text-emerald-400 font-mono">
                                      {worker.uid}
                                    </td>

                                    <td className="p-4">
                                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                                        worker.status === 'Online'
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                          : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${worker.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                        {worker.status}
                                      </span>
                                    </td>

                                    <td className="p-4 text-right text-slate-400 font-sans text-[11px]">
                                      {worker.lastSeen}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                      </div>

                      {/* Right: Add Personnel Module (Span 4) */}
                      <div className="lg:col-span-4 bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
                          <Users className="h-4.5 w-4.5 text-emerald-400" />
                          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Deploy RFID Token</h3>
                        </div>

                        {workerAddSuccess && (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-mono flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            <span>Token provisioned and matched successfully!</span>
                          </div>
                        )}

                        <form onSubmit={addNewWorkerAction} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase block">ASSET FULL NAME</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dr. Arthur Pendelton"
                              value={newWorkerName}
                              onChange={(e) => setNewWorkerName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase block">ASSIGNED CORPORATE DESIGNATION</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Lead Logistics Engineer"
                              value={newWorkerDesignation}
                              onChange={(e) => setNewWorkerDesignation(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase block">CORE SEGMENT / DEPARTMENT</label>
                            <select
                              value={newWorkerDept}
                              onChange={(e) => setNewWorkerDept(e.target.value as any)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                            >
                              <option value="Engineering">Engineering & Firmware</option>
                              <option value="Operations">Operations & Logistics</option>
                              <option value="Product">Product Development</option>
                              <option value="Security">Security & Facilities</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase block">RFID Token Hardware UID (Hex)</label>
                            <div className="relative">
                              <input
                                type="text"
                                readOnly
                                value={newWorkerUid}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3.5 text-xs text-emerald-400 font-mono focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => setNewWorkerUid('0x3B:D2:C1:' + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0'))}
                                className="absolute right-2 top-2 px-2.5 py-1 bg-[#17213a] hover:bg-slate-800 rounded text-[9px] font-mono text-slate-300 border border-slate-800 uppercase"
                              >
                                Re-Gen
                              </button>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono block">Unique 13.56MHz chip signature generator</span>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer mt-4"
                          >
                            <Plus className="h-4 w-4 stroke-[2.5]" />
                            <span>Provision Token Signature</span>
                          </button>
                        </form>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* ========================================================================= */}
                {/* TAB C: OPERATIONAL SHIFTS                                                 */}
                {/* ========================================================================= */}
                {currentTab === 'shifts' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Header bar */}
                    <div className="border-b border-slate-800/50 pb-5">
                      <h2 className="text-xl font-bold tracking-tight text-white font-display">Corporate Scheduling Profiles</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Toggle and optimize shifts to balance RFID reader antenna reception profiles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {shifts.map(sh => (
                        <div
                          key={sh.id}
                          className="bg-[#131b2e] border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#17213a]/30 rounded-bl-3xl pointer-events-none" />
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                                {sh.nodeId}
                              </span>
                              
                              {/* Styled Custom Toggle Slider */}
                              <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-mono font-bold uppercase ${sh.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {sh.active ? 'ACTIVE' : 'DEACTIVATED'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleShiftActiveState(sh.id)}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    sh.active ? 'bg-emerald-500' : 'bg-slate-800'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                                      sh.active ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>

                            </div>

                            <div>
                              <h3 className="text-base font-bold text-slate-100 font-display">{sh.name}</h3>
                              <p className="text-xs font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                                {sh.time}
                              </p>
                            </div>
                          </div>

                          <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                            <div className="text-xs text-slate-400 font-sans">
                              <span>Allocated Headcount: </span>
                              <span className="font-mono text-white font-bold">{sh.active ? sh.headcount : 0} Personnel</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                              <span className={`w-2 h-2 rounded-full ${sh.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                              <span>{sh.active ? 'Receiving Packets' : 'Offline'}</span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Operational Shift Information Notice */}
                    <div className="p-6 bg-slate-950/40 border border-slate-800/80 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                      <div className="p-2 w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0 mt-1">
                        <Info className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">Antenna Allocation Advice</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Deactivating shifts will dynamically re-route local MQTT validation signals to nearby adjacent gate nodes. This minimizes antenna collision indices on dual-band 2.4GHz WiFi spectrum, protecting corporate hub packet integrity.
                        </p>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* ========================================================================= */}
                {/* TAB D: AI INSIGHTS                                                       */}
                {/* ========================================================================= */}
                {currentTab === 'reports' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Header bar */}
                    <div className="border-b border-slate-800/50 pb-5">
                      <h2 className="text-xl font-bold tracking-tight text-white font-display">Automated AI Insights Control</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Perform advanced statistical inference modeling over local transponder transaction sets.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Input Selection Parameters (Span 5) */}
                      <div className="lg:col-span-5 bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
                          <SlidersHorizontal className="h-4.5 w-4.5 text-emerald-400" />
                          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider font-display">Simulation Parameters</h3>
                        </div>

                        {/* Parameter 1: Simulated Staff Volume Range Optimizer Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-mono">
                            <span className="text-slate-400 uppercase tracking-wider font-bold">Simulated Staff Volume</span>
                            <span className="text-emerald-400 font-bold">{simulatedStaffVolume} Active Cards</span>
                          </div>
                          
                          <div className="py-2.5 flex items-center gap-3">
                            <span className="text-[10px] font-mono text-slate-600 font-bold">50</span>
                            <div className="relative flex-1 flex items-center">
                              <input
                                type="range"
                                min="50"
                                max="1000"
                                value={simulatedStaffVolume}
                                onChange={(e) => setSimulatedStaffVolume(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-950 rounded-full appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                              />
                            </div>
                            <span className="text-[10px] font-mono text-slate-600 font-bold">1000</span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono block">Simulate physical transponder population density.</span>
                        </div>

                        {/* Parameter 2: Diagnostic Selection Focus */}
                        <div className="space-y-3 pt-2">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">DIAGNOSTIC ALGORITHM FOCUS</label>
                          
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => setDiagnosticFocus('bottlenecks')}
                              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                diagnosticFocus === 'bottlenecks'
                                  ? 'bg-[#17213a] border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                  : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Activity className="h-4 w-4" />
                                <span className="text-xs font-bold font-sans">Facility Ingress Bottlenecks</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1 font-mono pl-6 leading-relaxed">
                                Audits morning shift delays and local RSSI antenna collision metrics.
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDiagnosticFocus('security')}
                              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                diagnosticFocus === 'security'
                                  ? 'bg-[#17213a] border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                  : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Shield className="h-4 w-4" />
                                <span className="text-xs font-bold font-sans">Credential Threat Matrix</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1 font-mono pl-6 leading-relaxed">
                                Evaluates transponder velocity flags and isolates clone hazards.
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDiagnosticFocus('shifts')}
                              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                diagnosticFocus === 'shifts'
                                  ? 'bg-[#17213a] border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                  : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs font-bold font-sans">Fatigue & Attendance Forecasts</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1 font-mono pl-6 leading-relaxed">
                                Interpolates overtime records to forecast absenteeism percentages.
                              </p>
                            </button>
                          </div>
                        </div>

                        {/* Execute Inference Button */}
                        <button
                          type="button"
                          onClick={executeStatisticalInference}
                          disabled={aiLoadingState !== 'idle' && aiLoadingState !== 'done'}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer pt-4 active:scale-[0.99]"
                        >
                          {aiLoadingState === 'idle' || aiLoadingState === 'done' ? (
                            <>
                              <Sparkles className="h-4 w-4 stroke-[2.5]" />
                              <span>Execute Statistical Inference</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                              <span>Inferring...</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Right: Automated Strategic Output Terminal (Span 7) */}
                      <div className="lg:col-span-7 bg-[#131b2e] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl min-h-[460px] flex flex-col justify-between">
                        
                        {/* Terminal Header */}
                        <div className="p-5 border-b border-slate-800/80 bg-[#17213a]/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">Inference Output Segment</span>
                          </div>

                          {generatedReportText && (
                            <button
                              type="button"
                              onClick={copyReportText}
                              className="px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              {clipboardFeedback ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied Output!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy Synthesis Text</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Terminal Content Body */}
                        <div className="flex-1 p-6 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                          {aiLoadingState === 'idle' && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3.5 py-12">
                              <Sparkles className="h-10 w-10 text-slate-700" />
                              <div className="max-w-xs space-y-1">
                                <p className="font-sans font-bold text-slate-400">Statistical Inference Idle</p>
                                <p className="text-[11px] leading-relaxed">
                                  Configure simulated population bounds and click the engine trigger to synthesize business insights.
                                </p>
                              </div>
                            </div>
                          )}

                          {aiLoadingState === 'fetching' && (
                            <div className="py-12 flex flex-col items-center justify-center gap-3.5">
                              <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin" />
                              <div className="text-center space-y-1">
                                <p className="text-emerald-400 font-bold font-mono text-xs">STAGE 1 / 3: Telemetry package ingest stream...</p>
                                <p className="text-[11px] text-slate-500">Querying active RFID validation matrices across SQLite replica tables.</p>
                              </div>
                            </div>
                          )}

                          {aiLoadingState === 'matching' && (
                            <div className="py-12 flex flex-col items-center justify-center gap-3.5">
                              <RefreshCw className="h-7 w-7 text-teal-400 animate-spin" />
                              <div className="text-center space-y-1">
                                <p className="text-teal-400 font-bold font-mono text-xs">STAGE 2 / 3: Matching node validation hashes...</p>
                                <p className="text-[11px] text-slate-500">Evaluating ESP32 packet intervals and spatial impossible transit models.</p>
                              </div>
                            </div>
                          )}

                          {aiLoadingState === 'finalizing' && (
                            <div className="py-12 flex flex-col items-center justify-center gap-3.5">
                              <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin" />
                              <div className="text-center space-y-1">
                                <p className="text-emerald-400 font-bold font-mono text-xs">STAGE 3 / 3: Synthesizing executive directives...</p>
                                <p className="text-[11px] text-slate-500">Formulating tactical advice segments matching system constraints.</p>
                              </div>
                            </div>
                          )}

                          {aiLoadingState === 'done' && generatedReportText && (
                            <div className="space-y-4">
                              {generatedReportText.split('\n\n').map((block, idx) => {
                                if (block.startsWith('###')) {
                                  return (
                                    <h4 key={idx} className="text-emerald-400 font-sans font-bold text-sm border-b border-slate-800/80 pb-1 mt-4 first:mt-0">
                                      {block.replace('###', '').trim()}
                                    </h4>
                                  );
                                }
                                if (block.startsWith('####')) {
                                  return (
                                    <h5 key={idx} className="text-slate-200 font-sans font-bold text-xs mt-3">
                                      {block.replace('####', '').trim()}
                                    </h5>
                                  );
                                }
                                return (
                                  <p key={idx} className="text-[11px] leading-relaxed text-slate-300">
                                    {block}
                                  </p>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Terminal Footer Info */}
                        <div className="p-4 bg-[#10162a]/50 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                          <span>Computed instantly based on simulated transponder signatures inside this browser tab session.</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

              </div>
            </main>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
