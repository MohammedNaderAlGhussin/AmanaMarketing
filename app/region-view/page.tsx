"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, Campaign } from "../../src/types/marketing";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BubbleMap } from "../../src/components/ui/bubble-map";
import { BarChart } from "../../src/components/ui/bar-chart";
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Sparkles,
  Globe,
} from "lucide-react";

export default function RegionView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error loading marketing data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Process regional performance data
  const regionalData = useMemo(() => {
    if (!marketingData?.campaigns)
      return { revenue: [], spend: [], combined: [] };

    const regionalRevenue: { [key: string]: number } = {};
    const regionalSpend: { [key: string]: number } = {};
    const regionalCombined: {
      [key: string]: { revenue: number; spend: number; country: string };
    } = {};

    // Aggregate data from all campaigns
    marketingData.campaigns.forEach((campaign) => {
      campaign.regional_performance?.forEach((region) => {
        const regionKey = region.region;

        if (!regionalRevenue[regionKey]) regionalRevenue[regionKey] = 0;
        if (!regionalSpend[regionKey]) regionalSpend[regionKey] = 0;
        if (!regionalCombined[regionKey]) {
          regionalCombined[regionKey] = {
            revenue: 0,
            spend: 0,
            country: region.country,
          };
        }

        regionalRevenue[regionKey] += region.revenue;
        regionalSpend[regionKey] += region.spend;
        regionalCombined[regionKey].revenue += region.revenue;
        regionalCombined[regionKey].spend += region.spend;
      });
    });

    // Convert to arrays for different visualizations
    const revenueData = Object.entries(regionalRevenue).map(
      ([region, revenue]) => ({
        region,
        country: regionalCombined[region]?.country || "",
        value: revenue,
        revenue,
        spend: regionalSpend[region] || 0,
      })
    );

    const spendData = Object.entries(regionalSpend).map(([region, spend]) => ({
      region,
      country: regionalCombined[region]?.country || "",
      value: spend,
      revenue: regionalRevenue[region] || 0,
      spend,
    }));

    const combinedData = Object.entries(regionalCombined).map(
      ([region, data]) => ({
        region,
        country: data.country,
        value: data.revenue,
        revenue: data.revenue,
        spend: data.spend,
      })
    );

    return { revenue: revenueData, spend: spendData, combined: combinedData };
  }, [marketingData?.campaigns]);

  // Calculate regional metrics
  const regionalMetrics = useMemo(() => {
    if (!regionalData.combined.length) return null;

    const totalRevenue = regionalData.combined.reduce(
      (sum, region) => sum + region.revenue,
      0
    );
    const totalSpend = regionalData.combined.reduce(
      (sum, region) => sum + region.spend,
      0
    );
    const averageROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const regionCount = regionalData.combined.length;

    const topRegion = regionalData.combined.reduce(
      (top, region) => (region.revenue > top.revenue ? region : top),
      regionalData.combined[0]
    );

    return {
      totalRevenue,
      totalSpend,
      averageROAS,
      regionCount,
      topRegion: topRegion.region,
      topRegionRevenue: topRegion.revenue,
    };
  }, [regionalData]);

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
              {error ? (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-6 py-3 rounded-xl mb-4 max-w-2xl mx-auto shadow-xl">
                  <div className="flex items-center justify-center gap-2">
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
                    <span className="font-medium">Error: {error}</span>
                  </div>
                </div>
              ) : loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-white/20 rounded-lg mb-4 max-w-md mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-2">
                    <Globe className="w-4 h-4" />
                    Regional Analytics
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Regional Performance
                  </h1>

                  <p className="text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed opacity-95 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    Explore performance metrics across different geographical
                    regions
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="bg-gradient-to-b from-gray-900/50 to-gray-950">
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-lg">
                  Loading regional data...
                </p>
              </div>
            ) : (
              marketingData &&
              regionalMetrics && (
                <div className="max-w-7xl mx-auto space-y-8">
                  {/* Regional Overview Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Regional Overview
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <CardMetric
                        title="Total Regions"
                        value={regionalMetrics.regionCount}
                        icon={<MapPin className="h-6 w-6" />}
                        gradient="from-blue-500 to-cyan-500"
                      />

                      <CardMetric
                        title="Total Revenue"
                        value={`$${Math.round(
                          regionalMetrics.totalRevenue
                        ).toLocaleString()}`}
                        icon={<DollarSign className="h-6 w-6" />}
                        gradient="from-green-500 to-emerald-500"
                      />

                      <CardMetric
                        title="Total Spend"
                        value={`$${Math.round(
                          regionalMetrics.totalSpend
                        ).toLocaleString()}`}
                        icon={<TrendingUp className="h-6 w-6" />}
                        gradient="from-red-500 to-orange-500"
                      />

                      <CardMetric
                        title="Top Region"
                        value={regionalMetrics.topRegion}
                        icon={<Target className="h-6 w-6" />}
                        gradient="from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>

                  {/* Regional Performance Maps */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Geographic Distribution
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                      <BubbleMap
                        title="Revenue by Region"
                        data={regionalData.revenue}
                        valueType="revenue"
                        formatValue={(value) =>
                          Math.round(value).toLocaleString()
                        }
                        height={400}
                      />

                      <BubbleMap
                        title="Spend by Region"
                        data={regionalData.spend}
                        valueType="spend"
                        formatValue={(value) =>
                          Math.round(value).toLocaleString()
                        }
                        height={400}
                      />
                    </div>
                  </div>

                  {/* Regional Performance Charts */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Top Performing Regions
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                      <BarChart
                        title="Top Regions by Revenue"
                        data={regionalData.revenue
                          .sort((a, b) => b.revenue - a.revenue)
                          .slice(0, 6)
                          .map((region) => ({
                            label: region.region,
                            value: region.revenue,
                            color: "#10B981",
                          }))}
                        formatValue={(value) =>
                          `$${Math.round(value).toLocaleString()}`
                        }
                        height={300}
                      />

                      <BarChart
                        title="Top Regions by Spend"
                        data={regionalData.spend
                          .sort((a, b) => b.spend - a.spend)
                          .slice(0, 6)
                          .map((region) => ({
                            label: region.region,
                            value: region.spend,
                            color: "#EF4444",
                          }))}
                        formatValue={(value) =>
                          `$${Math.round(value).toLocaleString()}`
                        }
                        height={300}
                      />
                    </div>
                  </div>

                  {/* Regional Performance Summary */}
                  <div className="space-y-4 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Performance Summary
                      </h2>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-purple-400" />
                        Regional Leaders
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-semibold text-green-400 mb-3">
                            Revenue Leaders
                          </h4>
                          <div className="space-y-2">
                            {regionalData.revenue
                              .sort((a, b) => b.revenue - a.revenue)
                              .slice(0, 3)
                              .map((region, index) => (
                                <div
                                  key={region.region}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-gray-300">
                                    {index + 1}. {region.region}
                                  </span>
                                  <span className="text-green-400 font-semibold">
                                    $
                                    {Math.round(
                                      region.revenue
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-md font-semibold text-blue-400 mb-3">
                            Spend Leaders
                          </h4>
                          <div className="space-y-2">
                            {regionalData.spend
                              .sort((a, b) => b.spend - a.spend)
                              .slice(0, 3)
                              .map((region, index) => (
                                <div
                                  key={region.region}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-gray-300">
                                    {index + 1}. {region.region}
                                  </span>
                                  <span className="text-blue-400 font-semibold">
                                    ${Math.round(region.spend).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
