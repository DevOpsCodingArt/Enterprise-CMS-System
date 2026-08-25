export interface MockSystemMetrics {
  uptimePercentage: number;
  apiGatewayLatencyMs: number;
  activeWebsocketsCount: number;
  redis: {
    status: 'Healthy' | 'Degraded' | 'Down';
    memoryUsedMb: number;
    memoryTotalMb: number;
    activeChannels: number;
    clusterNodes: number;
  };
  postgres: {
    status: 'Healthy' | 'Degraded' | 'Down';
    activeConnections: number;
    maxConnections: number;
    rlsQueryAverageMs: number;
    walReplicationLagMs: number;
    totalSchemasCount: number;
  };
  storage: {
    provider: 'Cloudflare R2 Object Storage';
    usedGb: number;
    filesCount: number;
    monthlyBandwidthGb: number;
  };
}

export const mockSystemMetrics: MockSystemMetrics = {
  uptimePercentage: 99.99,
  apiGatewayLatencyMs: 0.32,
  activeWebsocketsCount: 1840,
  redis: {
    status: 'Healthy',
    memoryUsedMb: 142.6,
    memoryTotalMb: 2048,
    activeChannels: 28,
    clusterNodes: 3,
  },
  postgres: {
    status: 'Healthy',
    activeConnections: 28,
    maxConnections: 100,
    rlsQueryAverageMs: 0.18,
    walReplicationLagMs: 0.05,
    totalSchemasCount: 14,
  },
  storage: {
    provider: 'Cloudflare R2 Object Storage',
    usedGb: 18.42,
    filesCount: 12450,
    monthlyBandwidthGb: 142.8,
  },
};
