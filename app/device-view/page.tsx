"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData } from "../../src/types/marketing";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BarChart } from "../../src/components/ui/bar-chart";
import {
  Smartphone,
  Monitor,
  DollarSign,
  TrendingUp,
  Users,
  Sparkles,
  Tablet,
} from "lucide-react";

interface DeviceSummary {
  device: string;
  revenue: number;
  spend: number;
  impressions: number;
}

export default function DeviceView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const deviceData = useMemo(() => {
    if (!marketingData?.campaigns) return [];

    const deviceMap: { [key: string]: DeviceSummary } = {};

    marketingData.campaigns.forEach((campaign) => {
      campaign.device_performance?.forEach((perf) => {
        const deviceKey = perf.device;

        if (!deviceMap[deviceKey]) {
          deviceMap[deviceKey] = {
            device: deviceKey,
            revenue: 0,
            spend: 0,
            impressions: 0,
          };
        }

        deviceMap[deviceKey].revenue += perf.revenue;
        deviceMap[deviceKey].spend += perf.spend;
        deviceMap[deviceKey].impressions += perf.impressions;
      });
    });

    return Object.values(deviceMap);
  }, [marketingData?.campaigns]);

  const totalMetrics = useMemo(() => {
    const totalRevenue = deviceData.reduce((sum, d) => sum + d.revenue, 0);
    const totalSpend = deviceData.reduce((sum, d) => sum + d.spend, 0);
    const totalImpressions = deviceData.reduce(
      (sum, d) => sum + d.impressions,
      0
    );
    const averageROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    const bestDevice = deviceData.reduce((best, current) => {
      const currentROAS =
        current.spend > 0 ? current.revenue / current.spend : 0;
      const bestROAS = best.spend > 0 ? best.revenue / best.spend : 0;
      return currentROAS > bestROAS ? current : best;
    }, deviceData[0] || { device: "N/A", spend: 1, revenue: 0 });

    return {
      totalRevenue,
      totalSpend,
      totalImpressions,
      averageROAS,
      bestDevice: bestDevice.device,
    };
  }, [deviceData]);

  const formatValue = (value: number) =>
    `$${Math.round(value).toLocaleString()}`;
  const formatRatio = (value: number) => value.toFixed(2);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-10 md:py-14 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-white/20 rounded-lg mb-4 max-w-md mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-2">
                    <Tablet className="w-4 h-4" />
                    Device Analytics
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Device Performance Analysis
                  </h1>

                  <p className="text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed opacity-95 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    Compare campaign performance across mobile and desktop
                    devices
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="bg-gradient-to-b from-gray-900/50 to-gray-950">
          <div className="p-4 sm:p-6 lg:p-8">
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-6 py-4 rounded-xl mb-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-lg">Loading device data...</p>
              </div>
            ) : deviceData.length > 0 && totalMetrics ? (
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Overview Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">
                      Device Overview
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <CardMetric
                      title="Total Revenue"
                      value={formatValue(totalMetrics.totalRevenue)}
                      icon={<DollarSign className="h-6 w-6" />}
                      gradient="from-green-500 to-emerald-500"
                    />

                    <CardMetric
                      title="Total Impressions"
                      value={totalMetrics.totalImpressions.toLocaleString()}
                      icon={<Users className="h-6 w-6" />}
                      gradient="from-indigo-500 to-blue-500"
                    />

                    <CardMetric
                      title="Avg. ROAS"
                      value={formatRatio(totalMetrics.averageROAS)}
                      icon={<TrendingUp className="h-6 w-6" />}
                      gradient="from-yellow-500 to-amber-500"
                    />

                    <CardMetric
                      title="Best Performing Device"
                      value={totalMetrics.bestDevice}
                      icon={
                        totalMetrics.bestDevice.includes("Mobile") ? (
                          <Smartphone className="h-6 w-6" />
                        ) : (
                          <Monitor className="h-6 w-6" />
                        )
                      }
                      gradient="from-purple-500 to-pink-500"
                    />
                  </div>
                </div>

                {/* Charts for Comparison */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">
                      Performance Comparison
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                    <BarChart
                      title="Revenue by Device"
                      data={deviceData.map((d) => ({
                        label: d.device,
                        value: d.revenue,
                        color: d.device.includes("Mobile")
                          ? "#3B82F6"
                          : "#10B981",
                      }))}
                      formatValue={formatValue}
                      height={300}
                    />

                    <BarChart
                      title="Spend by Device"
                      data={deviceData.map((d) => ({
                        label: d.device,
                        value: d.spend,
                        color: d.device.includes("Mobile")
                          ? "#F59E0B"
                          : "#EF4444",
                      }))}
                      formatValue={formatValue}
                      height={300}
                    />
                  </div>
                </div>

                {/* Detailed Metrics Table */}
                <div className="space-y-4 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">
                      Detailed Metrics
                    </h2>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-purple-400" />
                      Device Performance Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-400 font-medium border-b border-gray-700 pb-2 mb-3">
                      <div>Device</div>
                      <div className="text-right">Revenue</div>
                      <div className="text-right">ROAS (Revenue/Spend)</div>
                    </div>
                    <div className="space-y-4">
                      {deviceData.map((d) => (
                        <div
                          key={d.device}
                          className="grid grid-cols-1 md:grid-cols-3 items-center text-sm"
                        >
                          <div className="text-white font-semibold flex items-center">
                            {d.device.includes("Mobile") ? (
                              <Smartphone className="h-4 w-4 mr-2 text-blue-400" />
                            ) : (
                              <Monitor className="h-4 w-4 mr-2 text-green-400" />
                            )}
                            {d.device}
                          </div>
                          <div className="text-green-400 text-right font-semibold">
                            {formatValue(d.revenue)}
                          </div>
                          <div className="text-yellow-400 text-right">
                            {formatRatio(d.spend > 0 ? d.revenue / d.spend : 0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[500px] text-gray-500">
                No device performance data found for the loaded campaigns.
              </div>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
