"use client";
import { useState, useEffect, useMemo } from 'react';
import { fetchMarketingData } from '../../src/lib/api';
import { MarketingData } from '../../src/types/marketing';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { CardMetric } from '../../src/components/ui/card-metric';
import { BarChart } from '../../src/components/ui/bar-chart';
import { Smartphone, Monitor, DollarSign, TrendingUp, Users } from 'lucide-react';

// Define a structured type for the aggregated device data
interface DeviceSummary {
  device: string;
  revenue: number;
  spend: number;
  impressions: number;
}

export default function DeviceView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on component mount (reuse existing logic)
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Aggregate data by Device Type
  const deviceData = useMemo(() => {
    if (!marketingData?.campaigns) return [];

    const deviceMap: { [key: string]: DeviceSummary } = {};

    marketingData.campaigns.forEach(campaign => {
      campaign.device_performance?.forEach(perf => {
        const deviceKey = perf.device;
        
        if (!deviceMap[deviceKey]) {
          deviceMap[deviceKey] = { 
            device: deviceKey, 
            revenue: 0, 
            spend: 0, 
            impressions: 0 
          };
        }
        
        deviceMap[deviceKey].revenue += perf.revenue;
        deviceMap[deviceKey].spend += perf.spend;
        deviceMap[deviceKey].impressions += perf.impressions;
      });
    });

    return Object.values(deviceMap);
  }, [marketingData?.campaigns]);

  // Calculate high-level metrics
  const totalMetrics = useMemo(() => {
    const totalRevenue = deviceData.reduce((sum, d) => sum + d.revenue, 0);
    const totalSpend = deviceData.reduce((sum, d) => sum + d.spend, 0);
    const totalImpressions = deviceData.reduce((sum, d) => sum + d.impressions, 0);
    const averageROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    
    // Find the device with the highest ROAS
    const bestDevice = deviceData.reduce((best, current) => {
      const currentROAS = current.spend > 0 ? current.revenue / current.spend : 0;
      const bestROAS = best.spend > 0 ? best.revenue / best.spend : 0;
      return currentROAS > bestROAS ? current : best;
    }, deviceData[0] || { device: 'N/A', spend: 1, revenue: 0 }); // Default for empty array
    
    return {
      totalRevenue,
      totalSpend,
      totalImpressions,
      averageROAS,
      bestDevice: bestDevice.device,
    };
  }, [deviceData]);

  const formatValue = (value: number) => `$${Math.round(value).toLocaleString()}`;
  const formatRatio = (value: number) => value.toFixed(2);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading device performance data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-8 sm:py-12">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
              Device Performance Analysis
            </h1>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-full">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded mb-6">{error}</div>
          )}

          {deviceData.length > 0 && totalMetrics ? (
            <>
              {/* Overview Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <CardMetric
                  title="Total Revenue"
                  value={formatValue(totalMetrics.totalRevenue)}
                  icon={<DollarSign className="h-5 w-5" />}
                  className="text-green-400"
                />
                
                <CardMetric
                  title="Total Impressions"
                  value={totalMetrics.totalImpressions.toLocaleString()}
                  icon={<Users className="h-5 w-5" />}
                  className="text-indigo-400"
                />
                
                <CardMetric
                  title="Avg. ROAS"
                  value={formatRatio(totalMetrics.averageROAS)}
                  icon={<TrendingUp className="h-5 w-5" />}
                  className="text-yellow-400"
                />
                
                <CardMetric
                  title="Best Performing Device"
                  value={totalMetrics.bestDevice}
                  icon={totalMetrics.bestDevice.includes('Mobile') ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                  className="text-purple-400"
                />
              </div>

              {/* Charts for Comparison */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                
                {/* Revenue Comparison */}
                <BarChart
                  title="Revenue by Device"
                  data={deviceData.map(d => ({
                    label: d.device,
                    value: d.revenue,
                    color: d.device.includes('Mobile') ? '#3B82F6' : '#10B981', // Blue for Mobile, Green for Desktop
                  }))}
                  formatValue={formatValue}
                  height={300}
                />

                {/* Spend Comparison */}
                <BarChart
                  title="Spend by Device"
                  data={deviceData.map(d => ({
                    label: d.device,
                    value: d.spend,
                    color: d.device.includes('Mobile') ? '#F59E0B' : '#EF4444', // Amber for Mobile, Red for Desktop
                  }))}
                  formatValue={formatValue}
                  height={300}
                />
              </div>

              {/* Detailed Metrics Table/List */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Detailed Device Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-400 font-medium border-b border-gray-700 pb-2 mb-3">
                  <div>Device</div>
                  <div className='text-right'>Revenue</div>
                  <div className='text-right'>ROAS (Revenue/Spend)</div>
                </div>
                <div className="space-y-4">
                  {deviceData.map(d => (
                    <div key={d.device} className="grid grid-cols-1 md:grid-cols-3 items-center text-sm">
                      <div className="text-white font-semibold flex items-center">
                        {d.device.includes('Mobile') ? <Smartphone className="h-4 w-4 mr-2 text-blue-400" /> : <Monitor className="h-4 w-4 mr-2 text-green-400" />}
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
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[500px] text-gray-500">
              No device performance data found for the loaded campaigns.
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}