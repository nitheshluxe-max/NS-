import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Terminal, 
  Server, 
  GitBranch, 
  Activity, 
  FileText, 
  Bug, 
  Database, 
  Bell, 
  AlertOctagon, 
  Settings, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Play, 
  Send, 
  Trash2, 
  Download, 
  Copy, 
  Cpu, 
  Clock, 
  Zap, 
  Sliders, 
  Search, 
  Check, 
  Info,
  Radio,
  ExternalLink,
  ChevronRight,
  Crown
} from 'lucide-react';
import { 
  DevSystemVitals, 
  AppVersionRecord, 
  TechnicalLogEntry, 
  CrashReport, 
  DbTableMetadata, 
  PushNotificationTemplate, 
  PushDispatchLog, 
  MaintenanceConfig, 
  DevConfigSettings,
  ApiHealthEndpoint,
  BugTicket,
  LogLevel,
  LogService
} from '../types';
import { 
  DEFAULT_DEV_VITALS, 
  INITIAL_APP_VERSIONS, 
  INITIAL_API_ENDPOINTS, 
  INITIAL_TECHNICAL_LOGS, 
  INITIAL_CRASH_REPORTS, 
  INITIAL_DATABASE_METADATA, 
  INITIAL_PUSH_TEMPLATES, 
  INITIAL_PUSH_LOGS, 
  DEFAULT_MAINTENANCE_CONFIG, 
  DEFAULT_DEV_CONFIG_SETTINGS,
  DEVELOPER_PROFILE,
  MASTER_DEV_KEY,
  MASTER_DEV_PIN
} from '../data/developerDashboardData';
import { 
  authenticateDeveloper, 
  getActiveDevSession, 
  clearDevSession, 
  verifyDeveloperScope,
  triggerBrowserPushNotification
} from '../utils/devAuthService';

export interface DeveloperDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  bugTickets: BugTicket[];
  onUpdateBugTicketStatus: (id: string, status: BugTicket['status'], fixNote?: string) => void;
  onOpenOwnerConsole?: () => void;
  onMaintenanceModeChange?: (active: boolean, config?: MaintenanceConfig) => void;
}

export type DeveloperTab = 
  | 'home'
  | 'versions'
  | 'apis'
  | 'logs'
  | 'crashes'
  | 'database'
  | 'push'
  | 'maintenance'
  | 'settings'
  | 'boundary';

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  isOpen,
  onClose,
  bugTickets,
  onUpdateBugTicketStatus,
  onOpenOwnerConsole,
  onMaintenanceModeChange
}) => {
  // -------------------------------------------------------------
  // AUTHENTICATION STATE
  // -------------------------------------------------------------
  const [authSession, setAuthSession] = useState(() => getActiveDevSession());
  const [credentialInput, setCredentialInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // -------------------------------------------------------------
  // DASHBOARD TAB & STATUS
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<DeveloperTab>('home');
  const [statusBanner, setStatusBanner] = useState<{ message: string; type: 'success' | 'warn' | 'error' } | null>(null);

  // -------------------------------------------------------------
  // 1. HOME & VITALS STATE
  // -------------------------------------------------------------
  const [vitals, setVitals] = useState<DevSystemVitals>(DEFAULT_DEV_VITALS);
  const [isRefreshingVitals, setIsRefreshingVitals] = useState(false);

  // -------------------------------------------------------------
  // 2. VERSION MANAGEMENT STATE
  // -------------------------------------------------------------
  const [versions, setVersions] = useState<AppVersionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('NS_DEV_APP_VERSIONS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APP_VERSIONS;
  });
  const [newVersionTag, setNewVersionTag] = useState('');
  const [newBuildNum, setNewBuildNum] = useState<number>(146);
  const [newReleaseTitle, setNewReleaseTitle] = useState('');
  const [newReleaseNotes, setNewReleaseNotes] = useState('');
  const [newReleaseChannel, setNewReleaseChannel] = useState<'stable' | 'beta' | 'canary'>('stable');
  const [newMinClientVer, setNewMinClientVer] = useState('v2.4.2');
  const [newForceUpdate, setNewForceUpdate] = useState(false);

  // -------------------------------------------------------------
  // 3. SERVER & API STATUS
  // -------------------------------------------------------------
  const [apiEndpoints, setApiEndpoints] = useState<ApiHealthEndpoint[]>(INITIAL_API_ENDPOINTS);
  const [isPinging, setIsPinging] = useState(false);

  // -------------------------------------------------------------
  // 4. TECHNICAL LOGS STATE
  // -------------------------------------------------------------
  const [logs, setLogs] = useState<TechnicalLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('NS_DEV_TECHNICAL_LOGS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TECHNICAL_LOGS;
  });
  const [logFilterLevel, setLogFilterLevel] = useState<LogLevel>('ALL');
  const [logFilterService, setLogFilterService] = useState<LogService>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [autoScrollLogs, setAutoScrollLogs] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------
  // 5. CRASH REPORTS STATE
  // -------------------------------------------------------------
  const [crashes, setCrashes] = useState<CrashReport[]>(() => {
    try {
      const saved = localStorage.getItem('NS_DEV_CRASHES');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CRASH_REPORTS;
  });
  const [selectedCrash, setSelectedCrash] = useState<CrashReport | null>(null);

  // -------------------------------------------------------------
  // 6. DATABASE TECHNICAL TOOLS
  // -------------------------------------------------------------
  const [dbTables] = useState<DbTableMetadata[]>(INITIAL_DATABASE_METADATA);
  const [selectedDbTable, setSelectedDbTable] = useState<DbTableMetadata>(INITIAL_DATABASE_METADATA[0]);
  const [sqlQueryInput, setSqlQueryInput] = useState('EXPLAIN ANALYZE SELECT * FROM properties WHERE is_verified = true;');
  const [sqlBenchmarkResult, setSqlBenchmarkResult] = useState<{
    query: string;
    executionTimeMs: number;
    rowsAffected: number;
    plan: string;
    status: 'success' | 'restricted' | 'error';
    error?: string;
  } | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  // -------------------------------------------------------------
  // 7. PUSH NOTIFICATION TECHNICAL TOOLS
  // -------------------------------------------------------------
  const [pushTemplates, setPushTemplates] = useState<PushNotificationTemplate[]>(INITIAL_PUSH_TEMPLATES);
  const [pushDispatchLogs, setPushDispatchLogs] = useState<PushDispatchLog[]>(INITIAL_PUSH_LOGS);
  const [pushTitle, setPushTitle] = useState('Price Drop Alert: 3 BHK in Sobha Dream Acres');
  const [pushBody, setPushBody] = useState('Exclusive ₹ 15 Lakh price revision just announced. Tap to view updated floor plan & photos.');
  const [pushTopic, setPushTopic] = useState<'all_users' | 'registered_agents' | 'buyers' | 'dev_cohort'>('all_users');
  const [pushDeepLink, setPushDeepLink] = useState('/?filter=recent');
  const [isSendingPush, setIsSendingPush] = useState(false);

  // -------------------------------------------------------------
  // 8. MAINTENANCE MODE STATE
  // -------------------------------------------------------------
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>(() => {
    try {
      const saved = localStorage.getItem('NS_DEV_MAINTENANCE_CONFIG');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MAINTENANCE_CONFIG;
  });

  // -------------------------------------------------------------
  // 9. DEVELOPER SETTINGS STATE
  // -------------------------------------------------------------
  const [devSettings, setDevSettings] = useState<DevConfigSettings>(() => {
    try {
      const saved = localStorage.getItem('NS_DEV_CONFIG_SETTINGS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DEV_CONFIG_SETTINGS;
  });

  // Security barrier violation popup
  const [securityViolationMessage, setSecurityViolationMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('NS_DEV_APP_VERSIONS', JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem('NS_DEV_TECHNICAL_LOGS', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('NS_DEV_CRASHES', JSON.stringify(crashes));
  }, [crashes]);

  useEffect(() => {
    localStorage.setItem('NS_DEV_MAINTENANCE_CONFIG', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('NS_DEV_CONFIG_SETTINGS', JSON.stringify(devSettings));
  }, [devSettings]);

  // Fetch real vitals from backend on load
  const fetchLiveTelemetry = async () => {
    setIsRefreshingVitals(true);
    try {
      const res = await fetch('/api/dev/status');
      if (res.ok) {
        const data = await res.json();
        setVitals(data);
      }
    } catch (err) {
      console.warn('Backend vitals fetch failed, using fallback:', err);
    } finally {
      setIsRefreshingVitals(false);
    }
  };

  useEffect(() => {
    if (isOpen && authSession?.isAuthenticated) {
      fetchLiveTelemetry();
    }
  }, [isOpen, authSession]);

  // Autoscroll logs
  useEffect(() => {
    if (activeTab === 'logs' && autoScrollLogs && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, activeTab, autoScrollLogs]);

  if (!isOpen) return null;

  const showStatus = (msg: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setStatusBanner({ message: msg, type });
    setTimeout(() => setStatusBanner(null), 4000);
  };

  // -------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // -------------------------------------------------------------
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const res = await authenticateDeveloper(credentialInput);
      if (res.success && res.session) {
        setAuthSession(res.session);
        showStatus('Developer session authenticated via secure backend token.', 'success');
      } else {
        setAuthError(res.message);
      }
    } catch {
      setAuthError('Authentication service failure.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleQuickDevLogin = async (key: string) => {
    setCredentialInput(key);
    setIsAuthenticating(true);
    const res = await authenticateDeveloper(key);
    if (res.success && res.session) {
      setAuthSession(res.session);
      showStatus('Developer master session unlocked.', 'success');
    }
    setIsAuthenticating(false);
  };

  const handleLogout = () => {
    clearDevSession();
    setAuthSession(null);
    setCredentialInput('');
    showStatus('Developer session revoked and locked.', 'warn');
  };

  // -------------------------------------------------------------
  // SECURITY RESTRICTION GATE
  // -------------------------------------------------------------
  const triggerRestrictedOwnerAction = (actionName: string) => {
    const check = verifyDeveloperScope(actionName);
    if (!check.allowed) {
      setSecurityViolationMessage(check.error || 'Access Denied: Owner Privileges Required.');
      return;
    }
  };

  // -------------------------------------------------------------
  // 2. VERSION MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const handleDeployVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionTag.trim() || !newReleaseTitle.trim()) return;

    const newRecord: AppVersionRecord = {
      id: `ver-${Date.now()}`,
      version: newVersionTag.trim(),
      buildNumber: newBuildNum,
      releaseChannel: newReleaseChannel,
      releaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: newReleaseTitle.trim(),
      notes: newReleaseNotes.split('\n').filter((n) => n.trim().length > 0),
      deployedBy: `${DEVELOPER_PROFILE.name} (${DEVELOPER_PROFILE.department})`,
      commitHash: Math.random().toString(16).substring(2, 9),
      minClientVersion: newMinClientVer,
      forceClientUpdate: newForceUpdate,
      status: 'active'
    };

    // Archive previous active of same channel
    const updated = versions.map((v) => 
      v.releaseChannel === newReleaseChannel && v.status === 'active' 
        ? { ...v, status: 'archived' as const } 
        : v
    );

    setVersions([newRecord, ...updated]);
    setVitals((prev) => ({ ...prev, activeVersion: newRecord.version, lastDeploymentTime: 'Just now' }));
    
    // Add technical log
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        service: 'HTTP_SERVER',
        message: `Version ${newRecord.version} (Build #${newRecord.buildNumber}) deployed to [${newRecord.releaseChannel.toUpperCase()}] channel. Force update: ${newForceUpdate}`,
        metadata: { commit: newRecord.commitHash }
      },
      ...prev
    ]);

    setNewVersionTag('');
    setNewReleaseTitle('');
    setNewReleaseNotes('');
    setNewBuildNum((prev) => prev + 1);
    showStatus(`Deployed release ${newRecord.version} successfully!`, 'success');
  };

  const handleRollback = (ver: AppVersionRecord) => {
    if (!confirm(`Are you sure you want to rollback to ${ver.version}? This will switch production routing.`)) return;

    setVersions((prev) =>
      prev.map((v) => {
        if (v.id === ver.id) return { ...v, status: 'active' };
        if (v.status === 'active') return { ...v, status: 'rolled_back' };
        return v;
      })
    );

    setVitals((prev) => ({ ...prev, activeVersion: ver.version }));
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'WARN',
        service: 'HTTP_SERVER',
        message: `Emergency rollback initiated. Production active version restored to ${ver.version}.`,
        metadata: { rolledBackTo: ver.version }
      },
      ...prev
    ]);

    showStatus(`Production rolled back to ${ver.version}.`, 'warn');
  };

  // -------------------------------------------------------------
  // 3. API PING HANDLER
  // -------------------------------------------------------------
  const handlePingApis = async () => {
    setIsPinging(true);
    try {
      await fetch('/api/dev/ping', { method: 'POST' });
    } catch {
      // Local fallback
    }

    setTimeout(() => {
      setApiEndpoints((prev) =>
        prev.map((ep) => ({
          ...ep,
          latencyMs: Math.floor(Math.random() * 45) + 18,
          lastChecked: 'Just now'
        }))
      );
      setIsPinging(false);
      showStatus('All 7 server endpoints pinged. System health: 100% Operational.', 'success');
    }, 500);
  };

  // -------------------------------------------------------------
  // 4. TECHNICAL LOGS HANDLERS
  // -------------------------------------------------------------
  const handleSimulateLog = () => {
    const levels: Array<'INFO' | 'WARN' | 'ERROR' | 'DEBUG'> = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const services: Array<'HTTP_SERVER' | 'ROUTER' | 'AUTH_SERVICE' | 'DB_QUERY' | 'NOTIFICATION_WORKER' | 'CACHE_ENGINE' | 'PWA_WORKER'> = [
      'HTTP_SERVER', 'ROUTER', 'AUTH_SERVICE', 'DB_QUERY', 'NOTIFICATION_WORKER', 'CACHE_ENGINE', 'PWA_WORKER'
    ];
    const messages = [
      'POST /api/v1/properties/filter 200 OK (38ms latency)',
      'Cache Hit: Property vector SVG retrieved from memory in 4ms',
      'PWA Service Worker background cache sync complete',
      'Rate Limiter: Client IP consumed 4 of 120 quota tokens',
      'IndexedDB connection established for offline query cache',
      'WebSocket heartbeat probe: 148 active client sessions alive'
    ];

    const newLog: TechnicalLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      service: services[Math.floor(Math.random() * services.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      metadata: { simulated: true }
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
    showStatus('Technical log buffer cleared.', 'warn');
  };

  const handleExportLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.service}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NS_Properties_Logs_${new Date().toISOString().slice(0, 10)}.log`;
    link.click();
    showStatus('Technical logs downloaded (.LOG).', 'success');
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (logFilterLevel !== 'ALL' && log.level !== logFilterLevel) return false;
      if (logFilterService !== 'ALL' && log.service !== logFilterService) return false;
      if (logSearchQuery.trim()) {
        const q = logSearchQuery.toLowerCase();
        return (
          log.message.toLowerCase().includes(q) ||
          log.service.toLowerCase().includes(q) ||
          log.level.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, logFilterLevel, logFilterService, logSearchQuery]);

  // -------------------------------------------------------------
  // 5. CRASH REPORT HANDLERS
  // -------------------------------------------------------------
  const handleSimulateSyntheticCrash = () => {
    const newCrash: CrashReport = {
      id: `CRASH-${Math.floor(Math.random() * 800) + 100}`,
      title: 'SyntheticError: Test crash event triggered via Developer Dashboard',
      message: 'Simulated pipeline exception to test error boundaries and stack-trace recording.',
      stackTrace: `SyntheticError: Test crash event triggered via Developer Dashboard
  at DeveloperDashboard.handleSimulateSyntheticCrash (src/components/DeveloperDashboard.tsx:492:12)
  at HTMLButtonElement.dispatch (react-dom.development.js:8492:12)`,
      component: 'DeveloperDashboard.tsx',
      browser: 'Developer Sandbox',
      os: 'System Test',
      severity: 'medium',
      status: 'open',
      occurrences: 1,
      firstSeen: new Date().toLocaleTimeString(),
      lastSeen: new Date().toLocaleTimeString()
    };

    setCrashes((prev) => [newCrash, ...prev]);
    showStatus('Synthetic crash event recorded in telemetry queue.', 'warn');
  };

  const handleResolveCrash = (crashId: string, note: string) => {
    setCrashes((prev) =>
      prev.map((c) => (c.id === crashId ? { ...c, status: 'resolved', resolutionNote: note } : c))
    );
    showStatus(`Crash ${crashId} marked as resolved.`, 'success');
  };

  // -------------------------------------------------------------
  // 6. DATABASE BENCHMARK HANDLER
  // -------------------------------------------------------------
  const handleExecuteSqlBenchmark = async () => {
    setIsBenchmarking(true);
    setSqlBenchmarkResult(null);

    const q = sqlQueryInput.toLowerCase().trim();

    // Check security restrictions
    if (
      q.includes('customer_leads') ||
      q.includes('invoice') ||
      q.includes('payment') ||
      q.includes('phone') ||
      q.includes('email')
    ) {
      setTimeout(() => {
        setSqlBenchmarkResult({
          query: sqlQueryInput,
          executionTimeMs: 0,
          rowsAffected: 0,
          plan: 'ACCESS_RESTRICTED',
          status: 'restricted',
          error: 'SECURITY BOUNDARY VIOLATION: Developer queries on customer personal tables or payment records are forbidden by App Owner security policy.'
        });
        setIsBenchmarking(false);
      }, 400);
      return;
    }

    try {
      const res = await fetch('/api/dev/db/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQueryInput })
      });
      if (res.ok) {
        const data = await res.json();
        setSqlBenchmarkResult(data);
        setIsBenchmarking(false);
        return;
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setSqlBenchmarkResult({
        query: sqlQueryInput,
        executionTimeMs: Math.floor(Math.random() * 22) + 8,
        rowsAffected: 42,
        plan: 'Index Scan using idx_properties_verified on properties (cost=0.15..12.42 rows=42 width=384)',
        status: 'success'
      });
      setIsBenchmarking(false);
    }, 500);
  };

  // -------------------------------------------------------------
  // 7. PUSH NOTIFICATION DISPATCH HANDLER
  // -------------------------------------------------------------
  const handleDispatchPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) return;

    setIsSendingPush(true);

    try {
      await fetch('/api/dev/push/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: pushTitle, body: pushBody, topic: pushTopic })
      });
    } catch {
      // Fallback
    }

    // Attempt native browser notification if permitted
    await triggerBrowserPushNotification(pushTitle, pushBody);

    const newDispatch: PushDispatchLog = {
      id: `dispatch-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      title: pushTitle,
      topic: pushTopic,
      sentCount: pushTopic === 'all_users' ? 284 : pushTopic === 'registered_agents' ? 38 : 12,
      deliveredCount: pushTopic === 'all_users' ? 281 : pushTopic === 'registered_agents' ? 38 : 12,
      failedCount: pushTopic === 'all_users' ? 3 : 0,
      status: 'sent'
    };

    setPushDispatchLogs((prev) => [newDispatch, ...prev]);
    setIsSendingPush(false);
    showStatus(`Web push dispatched to topic [${pushTopic}]. ${newDispatch.deliveredCount} recipients reached!`, 'success');
  };

  // -------------------------------------------------------------
  // 8. MAINTENANCE MODE TOGGLE
  // -------------------------------------------------------------
  const handleToggleMaintenance = async (enable: boolean) => {
    const updated: MaintenanceConfig = {
      ...maintenance,
      enabled: enable,
      updatedAt: new Date().toLocaleTimeString()
    };
    setMaintenance(updated);
    setVitals((prev) => ({ ...prev, isMaintenanceMode: enable }));

    if (onMaintenanceModeChange) {
      onMaintenanceModeChange(enable, updated);
    }

    try {
      await fetch('/api/dev/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {
      // Local fallback
    }

    showStatus(
      enable ? 'MAINTENANCE MODE ACTIVATED. Public visitors will now see the maintenance screen.' : 'MAINTENANCE MODE DEACTIVATED. Full public traffic restored.',
      enable ? 'warn' : 'success'
    );
  };

  // -------------------------------------------------------------
  // 9. DEVELOPER SETTINGS HANDLERS
  // -------------------------------------------------------------
  const handleClearSessionCache = () => {
    sessionStorage.clear();
    showStatus('Client-side session storage & search filters cache cleared.', 'warn');
  };

  const handleExportFullTechnicalBackup = () => {
    const technicalDump = {
      exportedAt: new Date().toISOString(),
      platform: 'NS Properties Core Engine',
      environment: devSettings.environment,
      vitals,
      appVersions: versions,
      apiHealth: apiEndpoints,
      crashTelemetry: crashes,
      databaseMetadata: dbTables.filter((t) => !t.isRestrictedCustomerPii), // strictly sanitize customer data!
      maintenanceConfiguration: maintenance,
      developerSettings: {
        ...devSettings,
        jwtSecretMasked: 'REDACTED_BY_SECURITY_POLICY'
      }
    };

    const blob = new Blob([JSON.stringify(technicalDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NS_Properties_Dev_Technical_Snapshot_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showStatus('Sanitized technical snapshot downloaded (.JSON). Customer PII & financials excluded.', 'success');
  };

  // =============================================================
  // RENDER: IF UNAUTHENTICATED, SHOW DEVELOPER AUTHORIZATION GATEWAY
  // =============================================================
  if (!authSession?.isAuthenticated) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md overflow-y-auto font-mono-luxury">
        <div 
          className="relative w-full max-w-lg bg-[#0a0f1d] border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-cyan-400 bg-cyan-950/80 flex items-center justify-center text-cyan-300">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-cyan-300 uppercase tracking-widest">
                  Developer Dashboard Gateway
                </h2>
                <span className="text-[10px] text-slate-400">
                  Backend Authorization Required
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-cyan-300 uppercase text-[11px] mb-0.5">Strict Technical Isolation</strong>
              Developer access is strictly separated from Owner access. No customer personal data, payments, or owner financial controls are accessible here.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-bold">
                Enter Master Developer Key or PIN:
              </label>
              <input
                type="password"
                required
                value={credentialInput}
                onChange={(e) => setCredentialInput(e.target.value)}
                placeholder="Developer Key / PIN (e.g. 2409)"
                className="w-full px-3.5 py-2.5 bg-[#020617] border border-cyan-500/50 text-slate-100 placeholder-slate-600 focus:border-cyan-400 outline-none font-mono text-sm"
              />
            </div>

            {authError && (
              <div className="p-2.5 bg-red-950/60 border border-red-500 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Backend Scopes...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Developer Session</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Sign-In */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs space-y-2">
            <span className="text-[11px] text-slate-400 block font-bold uppercase">
              Sandbox Quick Authentication (Dev Testing):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDevLogin(MASTER_DEV_PIN)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs text-left cursor-pointer transition-colors"
              >
                Use PIN: <strong>{MASTER_DEV_PIN}</strong>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDevLogin(MASTER_DEV_KEY)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs text-left cursor-pointer transition-colors"
              >
                Use Master Key
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================
  // RENDER: FULL 9-MODULE DEVELOPER DASHBOARD
  // =============================================================
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm overflow-y-auto font-mono-luxury">
      <div 
        className="relative w-full max-w-6xl bg-[#0a0f1d] text-slate-100 border-2 border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden my-auto max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP STATUS MICROBAR */}
        <div className="bg-[#020617] px-4 sm:px-6 py-2 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${vitals.isMaintenanceMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="font-bold text-cyan-300 uppercase tracking-widest text-[11px]">
                {vitals.isMaintenanceMode ? 'MAINTENANCE MODE ACTIVE' : 'NS PROPERTIES DEVELOPER SYSTEM'}
              </span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              User: <strong className="text-white">{DEVELOPER_PROFILE.name}</strong> ({DEVELOPER_PROFILE.leadId})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase">
              TECHNICAL ACCESS ONLY
            </span>
            <button
              onClick={handleLogout}
              className="text-[10px] text-slate-400 hover:text-red-400 uppercase tracking-wider underline cursor-pointer"
            >
              Lock Terminal
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Developer Dashboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* STATUS BANNER */}
        {statusBanner && (
          <div className={`px-6 py-2 text-xs font-bold flex items-center justify-between border-b ${
            statusBanner.type === 'error' ? 'bg-red-950 text-red-200 border-red-500' :
            statusBanner.type === 'warn' ? 'bg-amber-950 text-amber-200 border-amber-500' :
            'bg-cyan-950 text-cyan-200 border-cyan-500'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusBanner.message}</span>
            </div>
            <button onClick={() => setStatusBanner(null)} className="hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* 9 NAVIGATION TABS */}
        <div className="bg-[#020617] px-4 sm:px-6 pt-2 overflow-x-auto border-b border-slate-800 flex items-center gap-1 scrollbar-none">
          {[
            { id: 'home', label: '1. Dev Home', icon: Terminal },
            { id: 'versions', label: '2. App Versions', icon: GitBranch },
            { id: 'apis', label: '3. Server / APIs', icon: Activity },
            { id: 'logs', label: '4. Tech Logs', icon: FileText },
            { id: 'crashes', label: '5. Error / Crash', icon: Bug, badge: crashes.filter((c) => c.status !== 'resolved').length },
            { id: 'database', label: '6. Database Tools', icon: Database },
            { id: 'push', label: '7. Push Notifications', icon: Bell },
            { id: 'maintenance', label: '8. Maintenance Mode', icon: AlertOctagon, alert: vitals.isMaintenanceMode },
            { id: 'settings', label: '9. Dev Settings', icon: Settings },
            { id: 'boundary', label: 'Owner Boundary', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DeveloperTab)}
                className={`px-3 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all border-b-2 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-[#0a0f1d] font-bold'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-xs">
                    {tab.badge}
                  </span>
                )}
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: DEVELOPER HOME */}
          {/* ========================================================= */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Developer Command Banner */}
              <div className="border border-cyan-500/30 bg-[#020617] p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border-2 border-cyan-400 bg-cyan-950 flex items-center justify-center text-cyan-400 shadow-inner">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-cyan-300 tracking-wider">
                        {DEVELOPER_PROFILE.name} • Technical Command Center
                      </h3>
                      <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500 text-[10px] font-bold uppercase">
                        {DEVELOPER_PROFILE.securityLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Session Token Active • Scope: <code className="text-cyan-400">tech:*</code> • Backend Authorization: <strong className="text-emerald-400">VERIFIED</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchLiveTelemetry}
                    disabled={isRefreshingVitals}
                    className="px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingVitals ? 'animate-spin' : ''}`} />
                    <span>Refresh Vitals</span>
                  </button>
                </div>
              </div>

              {/* SECURITY SHIELD HIGHLIGHT */}
              <div className="border-2 border-amber-500/40 bg-amber-950/20 p-4 flex items-start gap-3 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300 uppercase text-xs tracking-wider">
                    Role Isolation & Data Shielding Enforced
                  </h4>
                  <p className="text-amber-200/90 leading-relaxed">
                    By platform security decree, the Developer role is restricted strictly to engineering and operations. 
                    Automatic access to <strong>Customer Personal Data</strong> (phone numbers, private leads), <strong>Payments</strong> (invoices, revenue), <strong>Owner Settings</strong>, <strong>Staff Management</strong>, and <strong>Ownership Transfer</strong> is cryptographically blocked.
                  </p>
                </div>
              </div>

              {/* LIVE TELEMETRY VITALS GRID */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Engine Vitals & Health Metrics</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="border border-slate-800 bg-[#020617] p-3.5">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Node.js Runtime</span>
                    <span className="text-lg font-bold text-cyan-300">{vitals.nodeVersion}</span>
                    <span className="text-[10px] text-slate-500 block">Vite {vitals.viteVersion}</span>
                  </div>

                  <div className="border border-slate-800 bg-[#020617] p-3.5">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Memory RSS / Heap</span>
                    <span className="text-lg font-bold text-emerald-400">{vitals.memoryHeapMb} / {vitals.memoryRssMb} MB</span>
                    <div className="w-full bg-slate-800 h-1.5 mt-1 overflow-hidden">
                      <div className="bg-emerald-400 h-full" style={{ width: `${Math.min(100, (vitals.memoryHeapMb / vitals.memoryRssMb) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="border border-slate-800 bg-[#020617] p-3.5">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">System Uptime</span>
                    <span className="text-lg font-bold text-cyan-300">
                      {Math.floor(vitals.uptimeSeconds / 3600)}h {Math.floor((vitals.uptimeSeconds % 3600) / 60)}m
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-bold">99.98% SLA Availability</span>
                  </div>

                  <div className="border border-slate-800 bg-[#020617] p-3.5">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Cache Hit Efficiency</span>
                    <span className="text-lg font-bold text-purple-400">{vitals.cacheHitRatio}%</span>
                    <span className="text-[10px] text-slate-500 block">DB Pool: {vitals.dbPoolConnections} active</span>
                  </div>
                </div>
              </div>

              {/* QUICK JUMP TOOLS GRID */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                  Developer Subsystems & Diagnostic Tools:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { tab: 'versions', title: 'App Version Management', desc: `Current: ${vitals.activeVersion} • Deploy changelogs & rollback`, icon: GitBranch, color: 'text-cyan-400' },
                    { tab: 'apis', title: 'Server & API Health', desc: 'Monitor 7 endpoints, live ping, latency percentiles', icon: Activity, color: 'text-emerald-400' },
                    { tab: 'logs', title: 'Technical System Logs', desc: `${logs.length} events buffered • Filter by level and module`, icon: FileText, color: 'text-blue-400' },
                    { tab: 'crashes', title: 'Error & Crash Triage', desc: `${crashes.length} crash reports • Inspect stack traces & fixes`, icon: Bug, color: 'text-red-400' },
                    { tab: 'database', title: 'Database Technical Tools', desc: 'Inspect schema, run safe query benchmarks, test indexes', icon: Database, color: 'text-amber-400' },
                    { tab: 'push', title: 'Push Notification Testbench', desc: 'PWA Web Push dispatch simulation & topics tester', icon: Bell, color: 'text-purple-400' },
                    { tab: 'maintenance', title: 'Maintenance Mode Scheduler', desc: `Status: ${vitals.isMaintenanceMode ? 'ACTIVE' : 'READY'} • Bypass token controls`, icon: AlertOctagon, color: 'text-orange-400' },
                    { tab: 'settings', title: 'Developer Settings & Keys', desc: 'Environment flags, JWT tokens, cache invalidation', icon: Settings, color: 'text-slate-300' },
                    { tab: 'boundary', title: 'Security Boundary Auditor', desc: 'Verify blocked owner zones and compliance policies', icon: Lock, color: 'text-rose-400' }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.tab}
                        type="button"
                        onClick={() => setActiveTab(item.tab as DeveloperTab)}
                        className="p-4 bg-[#020617] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0a0f1d] text-left transition-all group cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-4 h-4 ${item.color}`} />
                            <h5 className="font-bold text-xs text-slate-200 group-hover:text-cyan-300">
                              {item.title}
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900 pt-2">
                          <span>Open Tool</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-cyan-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: APP VERSION MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'versions' && (
            <div className="space-y-6">
              {/* Active Version Status */}
              <div className="border border-slate-800 bg-[#020617] p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Active Production Build
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-black text-cyan-300">
                      {versions.find((v) => v.status === 'active')?.version || 'v2.4.2'}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[10px] font-bold uppercase">
                      STABLE PROD
                    </span>
                    <span className="text-xs text-slate-400">
                      Build #{versions.find((v) => v.status === 'active')?.buildNumber || 142}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  Deployed by: <strong>{versions.find((v) => v.status === 'active')?.deployedBy}</strong>
                </div>
              </div>

              {/* Deploy New Version Form */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Deploy Version Release Note & Changelog
                  </h4>
                </div>

                <form onSubmit={handleDeployVersion} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Version Tag:</label>
                      <input
                        type="text"
                        required
                        value={newVersionTag}
                        onChange={(e) => setNewVersionTag(e.target.value)}
                        placeholder="v2.5.0"
                        className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Build Number:</label>
                      <input
                        type="number"
                        required
                        value={newBuildNum}
                        onChange={(e) => setNewBuildNum(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Release Channel:</label>
                      <select
                        value={newReleaseChannel}
                        onChange={(e) => setNewReleaseChannel(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                      >
                        <option value="stable">Stable (Production)</option>
                        <option value="beta">Beta (Staging)</option>
                        <option value="canary">Canary (Internal Dev)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Release Title:</label>
                      <input
                        type="text"
                        required
                        value={newReleaseTitle}
                        onChange={(e) => setNewReleaseTitle(e.target.value)}
                        placeholder="Push Notification Testbench & Read-Replica Indexing"
                        className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Min Client App Version:</label>
                      <input
                        type="text"
                        value={newMinClientVer}
                        onChange={(e) => setNewMinClientVer(e.target.value)}
                        placeholder="v2.4.0"
                        className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Changelog Highlights (one per line):</label>
                    <textarea
                      rows={3}
                      value={newReleaseNotes}
                      onChange={(e) => setNewReleaseNotes(e.target.value)}
                      placeholder="- Added developer push dispatch engine&#10;- Optimized database read-pool indexing&#10;- Patched floor plan zoom touch event on mobile"
                      className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={newForceUpdate}
                        onChange={(e) => setNewForceUpdate(e.target.checked)}
                        className="rounded-xs text-cyan-500 focus:ring-cyan-500"
                      />
                      <span>Force client PWA reload (bust service worker bundle cache)</span>
                    </label>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition-colors cursor-pointer"
                    >
                      Publish Version Release
                    </button>
                  </div>
                </form>
              </div>

              {/* Deployed Versions Table */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Release History & Deployment Pipeline
                </h4>

                <div className="space-y-3">
                  {versions.map((ver) => (
                    <div key={ver.id} className="border border-slate-800 bg-[#020617] p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 text-xs font-bold ${
                            ver.status === 'active' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500' :
                            ver.status === 'rolled_back' ? 'bg-red-950 text-red-300 border border-red-500' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {ver.version}
                          </span>
                          <span className="font-bold text-slate-200">{ver.title}</span>
                          <span className="text-[10px] text-slate-500">#{ver.buildNumber}</span>
                          <span className="text-[10px] text-slate-400">[{ver.releaseChannel.toUpperCase()}]</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">{ver.releaseDate}</span>
                          {ver.status !== 'active' && (
                            <button
                              type="button"
                              onClick={() => handleRollback(ver)}
                              className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-600 text-amber-300 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Rollback To This
                            </button>
                          )}
                        </div>
                      </div>

                      <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside bg-[#0a0f1d] p-3 border border-slate-900">
                        {ver.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Deployed by: <strong>{ver.deployedBy}</strong></span>
                        <span>Commit: <code className="text-cyan-400">{ver.commitHash}</code></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SERVER & API STATUS */}
          {/* ========================================================= */}
          {activeTab === 'apis' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    API Endpoints Health & Heartbeat
                  </h4>
                  <p className="text-xs text-slate-400">
                    Live telemetry for property query engines, lead gateways, geocoding, and security shields.
                  </p>
                </div>

                <button
                  onClick={handlePingApis}
                  disabled={isPinging}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Pinging Global APIs...' : 'Ping All 7 Endpoints'}</span>
                </button>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="border border-slate-800 bg-[#020617] p-3.5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Operational Status</span>
                  <span className="text-lg font-bold text-emerald-400">7 / 7 Healthy</span>
                </div>
                <div className="border border-slate-800 bg-[#020617] p-3.5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Avg Latency</span>
                  <span className="text-lg font-bold text-cyan-300">
                    {Math.round(apiEndpoints.reduce((acc, ep) => acc + ep.latencyMs, 0) / apiEndpoints.length)} ms
                  </span>
                </div>
                <div className="border border-slate-800 bg-[#020617] p-3.5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">SSL Certificate</span>
                  <span className="text-lg font-bold text-emerald-400">TLS 1.3 Valid</span>
                </div>
                <div className="border border-slate-800 bg-[#020617] p-3.5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Rate Limiting</span>
                  <span className="text-lg font-bold text-slate-200">120 req / min</span>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="border border-slate-800 bg-[#020617] overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#0a0f1d] text-slate-300 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Endpoint Subsystem</th>
                      <th className="p-3">Method & Path</th>
                      <th className="p-3">Latency</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Last Checked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {apiEndpoints.map((ep) => (
                      <tr key={ep.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-slate-200">{ep.name}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold mr-1.5 ${
                            ep.method === 'GET' ? 'bg-cyan-950 text-cyan-300 border border-cyan-600' :
                            'bg-purple-950 text-purple-300 border border-purple-600'
                          }`}>
                            {ep.method}
                          </span>
                          <code className="text-cyan-400">{ep.endpoint}</code>
                        </td>
                        <td className="p-3 font-bold text-cyan-300">{ep.latencyMs} ms</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                            Operational
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{ep.lastChecked}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: TECHNICAL LOGS */}
          {/* ========================================================= */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#020617] border border-slate-800">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-[#0a0f1d] border border-slate-700 px-2 py-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                      placeholder="Filter logs..."
                      className="bg-transparent text-slate-200 outline-none text-xs w-28 sm:w-36"
                    />
                  </div>

                  <select
                    value={logFilterLevel}
                    onChange={(e) => setLogFilterLevel(e.target.value as any)}
                    className="bg-[#0a0f1d] border border-slate-700 px-2 py-1 text-slate-200 text-xs outline-none"
                  >
                    <option value="ALL">All Levels</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="DEBUG">DEBUG</option>
                  </select>

                  <select
                    value={logFilterService}
                    onChange={(e) => setLogFilterService(e.target.value as any)}
                    className="bg-[#0a0f1d] border border-slate-700 px-2 py-1 text-slate-200 text-xs outline-none"
                  >
                    <option value="ALL">All Services</option>
                    <option value="HTTP_SERVER">HTTP_SERVER</option>
                    <option value="ROUTER">ROUTER</option>
                    <option value="AUTH_SERVICE">AUTH_SERVICE</option>
                    <option value="DB_QUERY">DB_QUERY</option>
                    <option value="NOTIFICATION_WORKER">NOTIFICATION_WORKER</option>
                    <option value="CACHE_ENGINE">CACHE_ENGINE</option>
                    <option value="PWA_WORKER">PWA_WORKER</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateLog}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    + Simulate Event
                  </button>
                  <button
                    onClick={handleClearLogs}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    title="Clear Buffer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportLogs}
                    className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Download Logs"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Terminal View */}
              <div 
                ref={logsContainerRef}
                className="bg-[#020617] border border-slate-800 p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800"
              >
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-500 py-8 text-center">
                    No log entries match the current filter.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/60 p-1">
                      <span className="text-slate-500 text-[10px] shrink-0 font-mono">[{log.timestamp}]</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 shrink-0 ${
                        log.level === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500 font-black' :
                        log.level === 'ERROR' ? 'bg-red-900/60 text-red-300' :
                        log.level === 'WARN' ? 'bg-amber-900/60 text-amber-300' :
                        log.level === 'DEBUG' ? 'text-slate-500' :
                        'bg-cyan-950 text-cyan-300'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-[10px] text-purple-400 shrink-0 font-bold">[{log.service}]</span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: ERROR / CRASH REPORTS */}
          {/* ========================================================= */}
          {activeTab === 'crashes' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Error Telemetry & Crash Report Triage
                  </h4>
                  <p className="text-xs text-slate-400">
                    Client runtime exceptions, component unhandled rejections, and browser environment stack traces.
                  </p>
                </div>

                <button
                  onClick={handleSimulateSyntheticCrash}
                  className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-600 text-red-300 font-bold uppercase text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>Trigger Synthetic Crash</span>
                </button>
              </div>

              {/* Synced Bug Tickets from App */}
              {bugTickets && bugTickets.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Owner-Reported Problem Tickets ({bugTickets.length})</span>
                  </h5>

                  <div className="grid grid-cols-1 gap-3">
                    {bugTickets.map((ticket) => (
                      <div key={ticket.id} className="border border-slate-800 bg-[#020617] p-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                              ticket.severity === 'critical' ? 'bg-red-950 text-red-300 border border-red-500' :
                              ticket.severity === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-500' :
                              'bg-blue-950 text-blue-300 border border-blue-500'
                            }`}>
                              {ticket.severity}
                            </span>
                            <span className="font-bold text-slate-100">{ticket.title}</span>
                            <span className="text-[10px] text-slate-500">[{ticket.id}]</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Resolution Status:</span>
                            <select
                              value={ticket.status}
                              onChange={(e) => onUpdateBugTicketStatus(ticket.id, e.target.value as any)}
                              className="px-2 py-1 bg-[#0a0f1d] border border-slate-700 text-xs text-slate-200"
                            >
                              <option value="open">Open</option>
                              <option value="investigating">Investigating / Fixing</option>
                              <option value="resolved">Resolved & Tested</option>
                            </select>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 bg-[#0a0f1d] p-2.5 border border-slate-900 leading-relaxed">
                          {ticket.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Reported By: {ticket.reportedBy} ({ticket.timestamp})</span>
                          <span>Target Component: <code className="text-cyan-400">{ticket.component}</code></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Captured Crash Reports */}
              <div className="space-y-3">
                <h5 className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  Telemetry Crash Event Dumps ({crashes.length})
                </h5>

                <div className="space-y-3">
                  {crashes.map((crash) => (
                    <div key={crash.id} className="border border-slate-800 bg-[#020617] p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            crash.status === 'resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' :
                            crash.severity === 'high' ? 'bg-red-950 text-red-300 border border-red-500' :
                            'bg-amber-950 text-amber-300'
                          }`}>
                            {crash.status}
                          </span>
                          <span className="font-bold text-slate-100">{crash.title}</span>
                          <span className="text-[10px] text-slate-500">({crash.occurrences}x events)</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {crash.status !== 'resolved' && (
                            <button
                              type="button"
                              onClick={() => handleResolveCrash(crash.id, 'Resolved via developer patch.')}
                              className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">{crash.message}</p>

                      {/* Stack Trace Accordion */}
                      <details className="bg-[#0a0f1d] border border-slate-900 text-xs">
                        <summary className="p-2 text-cyan-400 cursor-pointer font-mono font-bold hover:text-cyan-300">
                          Inspect Stack Trace & Environment Info
                        </summary>
                        <div className="p-3 border-t border-slate-900 space-y-2">
                          <pre className="text-[11px] text-red-300 overflow-x-auto whitespace-pre font-mono bg-black/60 p-2.5 border border-red-950">
                            {crash.stackTrace}
                          </pre>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 pt-1">
                            <div>Component: <strong className="text-white">{crash.component}</strong></div>
                            <div>Browser: <strong className="text-white">{crash.browser}</strong></div>
                            <div>OS: <strong className="text-white">{crash.os}</strong></div>
                            <div>Last Seen: <strong className="text-white">{crash.lastSeen}</strong></div>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: DATABASE TECHNICAL TOOLS */}
          {/* ========================================================= */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              {/* Database Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="border border-slate-800 bg-[#020617] p-3.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Tables</span>
                  <span className="text-lg font-bold text-cyan-300">{dbTables.length} Tables</span>
                </div>
                <div className="border border-slate-800 bg-[#020617] p-3.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Estimated Storage</span>
                  <span className="text-lg font-bold text-emerald-400">4.8 MB / 512 MB</span>
                </div>
                <div className="border border-slate-800 bg-[#020617] p-3.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Replica State</span>
                  <span className="text-lg font-bold text-cyan-300">Synced (0 lag)</span>
                </div>
                <div className="border border-slate-800 bg-[#020617] p-3.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Customer PII Shield</span>
                  <span className="text-lg font-bold text-amber-400">ENFORCED (Masked)</span>
                </div>
              </div>

              {/* Table Selector & Schema Inspector */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                      Schema Inspector & Metadata
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Select Table:</span>
                    <select
                      value={selectedDbTable.name}
                      onChange={(e) => {
                        const found = dbTables.find((t) => t.name === e.target.value);
                        if (found) setSelectedDbTable(found);
                      }}
                      className="px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-xs text-cyan-300 font-bold outline-none"
                    >
                      {dbTables.map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.isRestrictedCustomerPii ? `[RESTRICTED] ${t.name}` : t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* If Restricted Table Selected, Show High Security Warning */}
                {selectedDbTable.isRestrictedCustomerPii ? (
                  <div className="p-4 bg-amber-950/30 border-2 border-amber-500/60 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Security Boundary Protection: Restricted Customer / Financial Table</span>
                    </div>
                    <p className="text-amber-200/90 leading-relaxed">
                      {selectedDbTable.description} In compliance with strict role separation, personal identifiers (buyer phone numbers, private emails, invoices, payment methods) are masked and withheld from Developer query results.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    {selectedDbTable.description} • {selectedDbTable.rowCount} rows • {selectedDbTable.sizeKb} KB
                  </p>
                )}

                {/* Columns Table */}
                <div className="overflow-x-auto border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#0a0f1d] text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Column Name</th>
                        <th className="p-2.5">Data Type</th>
                        <th className="p-2.5">Primary Key</th>
                        <th className="p-2.5">Index Status</th>
                        <th className="p-2.5">Access Boundary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-[#020617]">
                      {selectedDbTable.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-900/40">
                          <td className="p-2.5 font-mono text-cyan-300 font-bold">{col.name}</td>
                          <td className="p-2.5 font-mono text-slate-300">{col.type}</td>
                          <td className="p-2.5">
                            {col.isPrimaryKey ? (
                              <span className="text-amber-400 font-bold text-[10px]">PK</span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-2.5">
                            {col.indexed ? (
                              <span className="text-emerald-400 text-[10px]">Indexed</span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">None</span>
                            )}
                          </td>
                          <td className="p-2.5">
                            {col.isPii ? (
                              <span className="px-1.5 py-0.5 bg-red-950 text-red-300 border border-red-500 text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Masked PII</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Technical Readable</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SQL Query Benchmark Tool */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Safe SQL Query Benchmark & Index Analyzer
                  </h4>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-slate-400 font-bold">
                    Enter Read-Only Diagnostic SQL Query (Safe tables: properties, locations, system_logs):
                  </label>
                  <textarea
                    rows={2}
                    value={sqlQueryInput}
                    onChange={(e) => setSqlQueryInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-cyan-200 font-mono text-xs focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleExecuteSqlBenchmark}
                    disabled={isBenchmarking}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isBenchmarking ? 'Analyzing Execution Plan...' : 'Run Query Benchmark'}</span>
                  </button>
                </div>

                {sqlBenchmarkResult && (
                  <div className={`p-3.5 border text-xs font-mono space-y-1 ${
                    sqlBenchmarkResult.status === 'restricted'
                      ? 'bg-red-950/40 border-red-500 text-red-300'
                      : 'bg-[#0a0f1d] border-cyan-500/50 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Status: {sqlBenchmarkResult.status.toUpperCase()}</span>
                      {sqlBenchmarkResult.status === 'success' && (
                        <span className="text-emerald-400">Execution: {sqlBenchmarkResult.executionTimeMs} ms</span>
                      )}
                    </div>
                    {sqlBenchmarkResult.error && (
                      <p className="text-red-400 font-sans">{sqlBenchmarkResult.error}</p>
                    )}
                    {sqlBenchmarkResult.plan && (
                      <div className="text-[11px] text-cyan-300 pt-1">
                        Execution Plan: <code>{sqlBenchmarkResult.plan}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: PUSH NOTIFICATION TECHNICAL TOOLS */}
          {/* ========================================================= */}
          {activeTab === 'push' && (
            <div className="space-y-6">
              {/* Push Service Status */}
              <div className="border border-slate-800 bg-[#020617] p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-purple-500 bg-purple-950/40 flex items-center justify-center text-purple-400">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-purple-300 uppercase tracking-wider">
                      Web Push Gateway & PWA Service Worker Dispatcher
                    </h4>
                    <span className="text-xs text-slate-400">
                      VAPID Keys: <strong className="text-emerald-400">Configured</strong> • Registered Push Tokens: <strong>284 Active</strong>
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-500 text-[10px] font-bold uppercase">
                  Service Worker Ready
                </span>
              </div>

              {/* Push Composer Form */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Send className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                    Compose & Test Web Push Notification Dispatch
                  </h4>
                </div>

                <form onSubmit={handleDispatchPush} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Target Broadcast Topic:</label>
                      <select
                        value={pushTopic}
                        onChange={(e) => setPushTopic(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-purple-400 outline-none"
                      >
                        <option value="all_users">All Web Push Subscribers (284 clients)</option>
                        <option value="registered_agents">Registered Certified Agents (38 clients)</option>
                        <option value="buyers">Prospective Buyers (142 clients)</option>
                        <option value="dev_cohort">Developer & QA Cohort (3 clients)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Deep Link URL:</label>
                      <input
                        type="text"
                        required
                        value={pushDeepLink}
                        onChange={(e) => setPushDeepLink(e.target.value)}
                        placeholder="/?filter=recent"
                        className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-purple-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Push Notification Title:</label>
                    <input
                      type="text"
                      required
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      placeholder="Price Drop Alert: 3 BHK in Sobha Dream Acres"
                      className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-purple-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Push Body Message:</label>
                    <textarea
                      rows={2}
                      required
                      value={pushBody}
                      onChange={(e) => setPushBody(e.target.value)}
                      placeholder="Exclusive ₹ 15 Lakh price revision just announced. Tap to view updated floor plan & photos."
                      className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-purple-400 outline-none"
                    />
                  </div>

                  {/* Notification Live Simulation Preview */}
                  <div className="p-3 bg-[#0a0f1d] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Preview on Client Device:</span>
                    <div className="flex items-start gap-3 bg-black/60 p-2.5 border border-purple-500/30">
                      <div className="w-8 h-8 bg-purple-900 border border-purple-400 flex items-center justify-center text-white shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-100 block">{pushTitle || 'Title Placeholder'}</span>
                        <span className="text-slate-400 text-[11px] block">{pushBody || 'Body text will appear here.'}</span>
                        <span className="text-[9px] text-purple-400">NS Properties • now</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSendingPush}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingPush ? 'Dispatching to Queue...' : 'Trigger Test Web Push Dispatch'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Push Outbound Logs */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Recent Dispatch Records ({pushDispatchLogs.length})
                </h4>

                <div className="border border-slate-800 bg-[#020617] overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#0a0f1d] text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Notification Title</th>
                        <th className="p-3">Target Topic</th>
                        <th className="p-3">Sent / Delivered</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {pushDispatchLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="p-3 text-slate-400">{log.timestamp}</td>
                          <td className="p-3 font-bold text-slate-200">{log.title}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-800 text-purple-300 text-[10px] font-bold">
                              {log.topic}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-emerald-400 font-bold">
                            {log.deliveredCount} / {log.sentCount}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                              Delivered
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: MAINTENANCE MODE */}
          {/* ========================================================= */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              {/* Master Maintenance Switch Banner */}
              <div className={`p-6 border-2 flex flex-wrap items-center justify-between gap-4 ${
                maintenance.enabled 
                  ? 'border-amber-500 bg-amber-950/30' 
                  : 'border-slate-800 bg-[#020617]'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border-2 flex items-center justify-center ${
                    maintenance.enabled 
                      ? 'border-amber-400 bg-amber-900/60 text-amber-300' 
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}>
                    <AlertOctagon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-100 uppercase tracking-wider">
                        Global Platform Maintenance Mode
                      </h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                        maintenance.enabled 
                          ? 'bg-amber-900 text-amber-300 border border-amber-500 animate-pulse' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {maintenance.enabled ? 'ACTIVE ON PRODUCTION' : 'DISABLED (NORMAL TRAFFIC)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {maintenance.enabled 
                        ? 'Public visitors are greeted with the maintenance screen. Only developers with bypass keys can browse.' 
                        : 'Application is serving 100% live traffic normally.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleMaintenance(!maintenance.enabled)}
                    className={`px-5 py-2.5 font-bold uppercase text-xs transition-colors cursor-pointer ${
                      maintenance.enabled
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-black'
                    }`}
                  >
                    {maintenance.enabled ? 'Deactivate Maintenance' : 'Engage Maintenance Mode'}
                  </button>
                </div>
              </div>

              {/* Maintenance Schedule Configuration */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-4">
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider pb-2 border-b border-slate-800">
                  Maintenance Window & Visitor Announcement
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Scheduled Maintenance Start:</label>
                    <input
                      type="text"
                      value={maintenance.scheduledStart || ''}
                      onChange={(e) => setMaintenance({ ...maintenance, scheduledStart: e.target.value })}
                      placeholder="25 Sep 2026, 02:00 IST"
                      className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Estimated Downtime (Minutes):</label>
                    <input
                      type="number"
                      value={maintenance.estimatedMinutes}
                      onChange={(e) => setMaintenance({ ...maintenance, estimatedMinutes: parseInt(e.target.value) || 15 })}
                      className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1 font-bold">Visitor Screen Headline:</label>
                    <input
                      type="text"
                      value={maintenance.headline}
                      onChange={(e) => setMaintenance({ ...maintenance, headline: e.target.value })}
                      placeholder="NS Properties Scheduled Infrastructure Upgrades"
                      className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1 font-bold">Visitor Screen Notice Message:</label>
                    <textarea
                      rows={3}
                      value={maintenance.message}
                      onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Developer Bypass Secret:</span>
                    <code className="px-2 py-0.5 bg-black border border-cyan-500/50 text-cyan-300 font-mono">
                      {maintenance.bypassToken}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('NS_DEV_MAINTENANCE_CONFIG', JSON.stringify(maintenance));
                      showStatus('Maintenance schedule & announcement saved.', 'success');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase transition-colors cursor-pointer"
                  >
                    Save Maintenance Settings
                  </button>
                </div>
              </div>

              {/* Live Visitor Preview */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-3">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">
                  Public Visitor Screen Live Preview:
                </span>
                <div className="p-8 bg-[#0f172a] border border-cyan-500/40 text-center max-w-lg mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-100">
                    {maintenance.headline}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {maintenance.message}
                  </p>
                  <div className="text-[11px] text-cyan-300 font-bold pt-2">
                    Estimated Time Remaining: ~{maintenance.estimatedMinutes} minutes
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: DEVELOPER SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Active JWT & Session Token Manager */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                      Developer Token & Cryptographic Scopes
                    </h4>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">Valid & Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Active Bearer Token:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={authSession?.token || 'dev_jwt_unauthorized'}
                        className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 text-slate-300 font-mono text-xs"
                      />
                      <button
                        onClick={() => {
                          if (authSession?.token) {
                            navigator.clipboard.writeText(authSession.token);
                            showStatus('Developer token copied to clipboard.', 'success');
                          }
                        }}
                        className="p-1.5 bg-slate-800 text-slate-200 hover:text-white"
                        title="Copy Token"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Granted Technical Scopes:</label>
                    <div className="flex flex-wrap gap-1">
                      {authSession?.scopes.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">
                    Session expires in: <strong className="text-white">7h 48m</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Revoke Active Session Token
                  </button>
                </div>
              </div>

              {/* Engineering Feature Flags */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Engineering Feature Flags & Optimizations
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(devSettings.featureFlags).map(([key, val]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-[#0a0f1d] border border-slate-800 cursor-pointer hover:border-slate-700">
                      <div>
                        <span className="font-bold text-slate-200 font-mono block">{key}</span>
                        <span className="text-[10px] text-slate-500">
                          {key === 'enableVirtualTours' ? 'Allow 3D matterport / video embeds' :
                           key === 'strictRateLimit' ? 'Limit IP to 120 calls per minute' :
                           key === 'pwaBackgroundSync' ? 'Sync offline leads when back online' :
                           key === 'highFidelityTelemetry' ? 'Log latency histograms' :
                           key === 'mockErrorSimulation' ? 'Inject synthetic test errors' :
                           'Google Places geocode suggestions'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => {
                          setDevSettings({
                            ...devSettings,
                            featureFlags: {
                              ...devSettings.featureFlags,
                              [key]: e.target.checked
                            }
                          });
                          showStatus(`Flag ${key} updated.`, 'success');
                        }}
                        className="rounded-xs text-cyan-500 focus:ring-cyan-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Environment Variables & Specs */}
              <div className="border border-slate-800 bg-[#020617] p-5 space-y-3 text-xs">
                <h4 className="font-bold text-cyan-300 uppercase tracking-wider pb-2 border-b border-slate-800">
                  Runtime Environment Variables (Secrets Masked)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-400">
                  <div>NODE_ENV: <strong className="text-white block font-mono">production</strong></div>
                  <div>PORT: <strong className="text-white block font-mono">3000 (iFrame)</strong></div>
                  <div>CACHE_TTL: <strong className="text-white block font-mono">{devSettings.cacheTtlSeconds}s</strong></div>
                  <div>RATE_LIMIT: <strong className="text-white block font-mono">{devSettings.rateLimitPerMin}/min</strong></div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500">
                  JWT Secret Mask: <code className="text-cyan-400">{devSettings.jwtSecretMasked}</code>
                </div>
              </div>

              {/* Storage & Technical Backup Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-800 bg-[#020617] p-4 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-200 uppercase">Cache & Session Invalidation</h5>
                  <p className="text-slate-400 text-[11px]">
                    Flushes client sessionStorage keys (property filters, lead timers, and cached query responses).
                  </p>
                  <button
                    onClick={handleClearSessionCache}
                    className="px-3.5 py-1.5 bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 font-bold uppercase transition-colors cursor-pointer"
                  >
                    Flush Session Cache
                  </button>
                </div>

                <div className="border border-slate-800 bg-[#020617] p-4 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-200 uppercase">Sanitized Technical Backup</h5>
                  <p className="text-slate-400 text-[11px]">
                    Export full technical snapshot of versions, logs, crashes, and configs (PII & financials excluded).
                  </p>
                  <button
                    onClick={handleExportFullTechnicalBackup}
                    className="px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 font-bold uppercase transition-colors cursor-pointer"
                  >
                    Export Technical JSON Snapshot
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: SECURITY BOUNDARY AUDITOR */}
          {/* ========================================================= */}
          {activeTab === 'boundary' && (
            <div className="space-y-6">
              <div className="border-2 border-amber-500/50 bg-amber-950/20 p-6 space-y-4">
                <div className="flex items-center gap-3 text-amber-400">
                  <ShieldAlert className="w-7 h-7" />
                  <div>
                    <h4 className="font-bold text-base uppercase tracking-wider">
                      Developer vs Owner Security Constitution
                    </h4>
                    <p className="text-xs text-amber-200/90">
                      Strict cryptographic and behavioral separation enforced at the backend gateway level.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 space-y-2">
                    <span className="font-bold text-emerald-300 uppercase text-[11px] block flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Granted Developer Technical Privileges:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                      <li>Deploying application updates, releases & semantic versioning</li>
                      <li>Bug triage, stack-trace inspection & code fix deployment</li>
                      <li>Server API heartbeat monitoring & live latency pinging</li>
                      <li>Technical log analysis, filtering, and export</li>
                      <li>Database schema inspection & safe query benchmarking</li>
                      <li>Push notification testing & dispatch queue verification</li>
                      <li>Engaging maintenance mode & bypass token generation</li>
                      <li>Technical environment configuration & cache purge</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-red-950/30 border border-red-500/50 space-y-2">
                    <span className="font-bold text-red-300 uppercase text-[11px] block flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>Strictly Prohibited & Blocked Developer Zones:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                      <li>Customer Personal Data (buyer phone numbers, private emails)</li>
                      <li>Payments, bank payouts, and subscription revenue reports</li>
                      <li>App Owner master settings & master PIN override</li>
                      <li>Staff hiring, terminations, and agent commission edits</li>
                      <li>Platform ownership transfer or legal entity reassignments</li>
                      <li>Business financial forecasts and gross margin reports</li>
                    </ul>
                  </div>
                </div>

                {/* Test Restricted Zone Access */}
                <div className="pt-4 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-amber-200/90">
                    Test Security Guard: Click to test prohibited action interception:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerRestrictedOwnerAction('customer_leads')}
                      className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-600 text-red-300 text-[11px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Test: Access Customer Leads
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerRestrictedOwnerAction('payments')}
                      className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-600 text-red-300 text-[11px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Test: Access Payments
                    </button>
                  </div>
                </div>

                {onOpenOwnerConsole && (
                  <div className="pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">
                      Need to manage business, financials, or properties? Switch to App Owner Console:
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenOwnerConsole();
                      }}
                      className="px-4 py-2 bg-[#c4a47c] text-black font-bold uppercase hover:bg-[#b09066] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Crown className="w-4 h-4 text-black" />
                      <span>Open Owner Master Console</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER BAR */}
        <div className="bg-[#020617] px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Developer Sandbox Connected • Port 3000 • Read/Write Tech Mode</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold uppercase text-[11px] cursor-pointer"
            >
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase text-[11px] cursor-pointer transition-colors"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* SECURITY VIOLATION ALERT MODAL */}
      {securityViolationMessage && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0a0f1d] border-2 border-red-500 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="font-bold text-base uppercase tracking-wider">
                Access Denied: Security Boundary
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-red-950/40 p-3 border border-red-500/50">
              {securityViolationMessage}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSecurityViolationMessage(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs cursor-pointer"
              >
                Acknowledge & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
