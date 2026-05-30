'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Watch,
  RefreshCw,
  Check,
  X,
  Loader2,
  Zap,
  Activity,
  Heart,
} from 'lucide-react';

interface IntegrationData {
  id: string;
  provider: 'apple_health' | 'health_connect';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  last_synced_at: string | null;
  records_synced: number;
}

const PROVIDERS = {
  apple_health: {
    name: 'Apple Health',
    description: 'Sync workouts, heart rate, sleep & more from your iPhone and Apple Watch',
    icon: Watch,
    color: '#ff3b5c',
    gradient: 'linear-gradient(135deg, #ff3b5c, #ff6b8a)',
    capabilities: ['Heart Rate', 'Sleep', 'Steps', 'Workouts', 'HRV'],
  },
  health_connect: {
    name: 'Health Connect',
    description: 'Import health data from Android devices via Google Health Connect',
    icon: Smartphone,
    color: '#4285f4',
    gradient: 'linear-gradient(135deg, #4285f4, #34a853)',
    capabilities: ['Heart Rate', 'Sleep', 'Steps', 'Workouts', 'Weight'],
  },
} as const;

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function IntegrationsCard() {
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [nativeBridgeAvailable, setNativeBridgeAvailable] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('elysian-token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  // Detect native Android bridge
  useEffect(() => {
    const bridge = (window as any).ElysianBridge;
    if (bridge && typeof bridge.isAvailable === 'function') {
      try {
        setNativeBridgeAvailable(bridge.isAvailable());
      } catch {
        setNativeBridgeAvailable(false);
      }
    }

    // Listen for sync completion from native bridge
    const onSynced = () => {
      fetchIntegrations();
      setActionLoading(null);
    };
    const onError = () => {
      setActionLoading(null);
    };
    window.addEventListener('healthconnect-synced', onSynced);
    window.addEventListener('healthconnect-error', onError);
    return () => {
      window.removeEventListener('healthconnect-synced', onSynced);
      window.removeEventListener('healthconnect-error', onError);
    };
  }, []);

  const fetchIntegrations = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/integrations`, {
        headers: getHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data);
      }
    } catch {
      // Silent fail — integrations are optional
    } finally {
      setLoading(false);
    }
  }, [API_BASE, getHeaders]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const handleConnect = async (provider: 'apple_health' | 'health_connect') => {
    setActionLoading(provider);
    try {
      // If native Health Connect bridge is available, use it
      if (provider === 'health_connect' && nativeBridgeAvailable) {
        // First mark as connected on backend
        await fetch(`${API_BASE}/integrations/connect`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ provider }),
        });
        // Then trigger native sync (reads Health Connect → pushes to backend)
        const bridge = (window as any).ElysianBridge;
        bridge.requestSync();
        // actionLoading will be cleared by the healthconnect-synced event
        await fetchIntegrations();
        return;
      }

      const res = await fetch(`${API_BASE}/integrations/connect`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ provider }),
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } catch {
      // Silent fail
    } finally {
      if (!(provider === 'health_connect' && nativeBridgeAvailable)) {
        setActionLoading(null);
      }
    }
  };

  const handleDisconnect = async (provider: 'apple_health' | 'health_connect') => {
    setActionLoading(provider);
    try {
      const res = await fetch(`${API_BASE}/integrations/${provider}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } catch {
      // Silent fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleSync = async (provider: 'apple_health' | 'health_connect') => {
    setActionLoading(`sync-${provider}`);
    try {
      // Use native bridge for Health Connect if available
      if (provider === 'health_connect' && nativeBridgeAvailable) {
        const bridge = (window as any).ElysianBridge;
        bridge.requestSync();
        // actionLoading cleared by healthconnect-synced event
        return;
      }

      await fetch(`${API_BASE}/integrations/${provider}/sync`, {
        method: 'POST',
        headers: getHeaders(),
      });
      await fetchIntegrations();
    } catch {
      // Silent fail
    } finally {
      if (!(provider === 'health_connect' && nativeBridgeAvailable)) {
        setActionLoading(null);
      }
    }
  };

  const getIntegration = (provider: string) =>
    integrations.find((i) => i.provider === provider);

  if (loading) {
    // Still show provider cards while loading, just disable actions
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <Zap size={13} style={{ color: 'var(--accent-primary)' }} />
        <span
          className="text-xs font-bold tracking-wide uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          Data Sources
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {(Object.entries(PROVIDERS) as [keyof typeof PROVIDERS, typeof PROVIDERS[keyof typeof PROVIDERS]][]).map(
          ([key, provider]) => {
            const integration = getIntegration(key);
            const isConnected = integration?.status === 'connected';
            const isSyncing = actionLoading === `sync-${key}`;
            const isActing = actionLoading === key || loading;
            const Icon = provider.icon;

            return (
              <motion.div
                key={key}
                className="relative overflow-hidden rounded-md border"
                style={{
                  background: 'rgba(12, 12, 20, 0.6)',
                  borderColor: isConnected
                    ? `${provider.color}25`
                    : 'rgba(255, 255, 255, 0.04)',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ borderColor: `${provider.color}40` }}
                transition={{ duration: 0.2 }}
              >
                {/* Status indicator line */}
                <AnimatePresence>
                  {isConnected && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{ background: provider.gradient }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Provider icon */}
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background: isConnected
                          ? `${provider.color}15`
                          : 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <Icon
                        size={18}
                        style={{
                          color: isConnected ? provider.color : 'var(--text-tertiary)',
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {provider.name}
                        </h3>
                        {isConnected && (
                          <span
                            className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              background: `${provider.color}15`,
                              color: provider.color,
                            }}
                          >
                            <Check size={9} />
                            Active
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[11px] mt-0.5 leading-relaxed"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {provider.description}
                      </p>

                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {provider.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                            style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              color: 'var(--text-tertiary)',
                              border: '1px solid rgba(255, 255, 255, 0.04)',
                            }}
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      {/* Sync info */}
                      {isConnected && integration && (
                        <div className="flex items-center gap-3 mt-2.5">
                          <span
                            className="text-[10px] flex items-center gap-1"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            <Activity size={9} />
                            {integration.records_synced.toLocaleString()} records
                          </span>
                          <span
                            className="text-[10px] flex items-center gap-1"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            <Heart size={9} />
                            Synced {timeAgo(integration.last_synced_at)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isConnected && (
                        <motion.button
                          className="p-1.5 rounded hover:bg-white/[0.04] transition-colors cursor-pointer"
                          onClick={() => handleSync(key)}
                          disabled={isSyncing}
                          whileTap={{ scale: 0.9 }}
                          title="Sync now"
                        >
                          <RefreshCw
                            size={13}
                            className={isSyncing ? 'animate-spin' : ''}
                            style={{ color: 'var(--text-tertiary)' }}
                          />
                        </motion.button>
                      )}

                      <motion.button
                        className="px-3 py-1.5 rounded text-[11px] font-semibold transition-all cursor-pointer"
                        style={{
                          background: isConnected
                            ? 'rgba(255, 255, 255, 0.03)'
                            : provider.gradient,
                          color: isConnected ? 'var(--text-secondary)' : '#fff',
                          border: isConnected
                            ? '1px solid rgba(255, 255, 255, 0.06)'
                            : 'none',
                        }}
                        onClick={() =>
                          isConnected ? handleDisconnect(key) : handleConnect(key)
                        }
                        disabled={isActing}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isActing ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isConnected ? (
                          <span className="flex items-center gap-1">
                            <X size={10} />
                            Remove
                          </span>
                        ) : (
                          'Connect'
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          },
        )}
      </div>
    </div>
  );
}
