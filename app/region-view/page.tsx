"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, Campaign } from "../../src/types/marketing";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BubbleMap } from "../../src/components/ui/bubble-map";
import { BarChart } from "../../src/components/ui/bar-chart";
import { MapPin, DollarSign, TrendingUp, Target, Users } from "lucide-react";

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
        value: data.revenue, // Use revenue as primary value for sizing
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

    // Find top performing region
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading regional performance data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900">
      {/*
      - Old styling, // reason why content overflow wasnt working
        flex flex-col lg:flex-row min-h-screen bg-gray-900
      */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-8 sm:py-12 border-b-1 border-[#6b7280]">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {error ? (
                <div className="bg-red-900 border border-red-700 text-red-200 px-3 sm:px-4 py-3 rounded mb-4 max-w-2xl mx-auto text-sm sm:text-base">
                  Error loading data: {error}
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                  Regional Performance
                </h1>
              )}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-full">
          {marketingData && regionalMetrics && (
            <>
              {/* Regional Overview Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <CardMetric
                  title="Total Regions"
                  value={regionalMetrics.regionCount}
                  icon={<MapPin className="h-5 w-5" />}
                />

                <CardMetric
                  title="Total Revenue"
                  value={`$${Math.round(
                    regionalMetrics.totalRevenue
                  ).toLocaleString()}`}
                  icon={<DollarSign className="h-5 w-5" />}
                  className="text-green-400"
                />

                <CardMetric
                  title="Total Spend"
                  value={`$${Math.round(
                    regionalMetrics.totalSpend
                  ).toLocaleString()}`}
                  icon={<TrendingUp className="h-5 w-5" />}
                  className="text-blue-400"
                />

                <CardMetric
                  title="Top Region"
                  value={regionalMetrics.topRegion}
                  icon={<Target className="h-5 w-5" />}
                  className="text-purple-400"
                />
              </div>

              {/* Regional Performance Maps */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <BubbleMap
                  title="Revenue by Region"
                  data={regionalData.revenue}
                  valueType="revenue"
                  formatValue={(value) => Math.round(value).toLocaleString()}
                  height={400}
                />

                <BubbleMap
                  title="Spend by Region"
                  data={regionalData.spend}
                  valueType="spend"
                  formatValue={(value) => Math.round(value).toLocaleString()}
                  height={400}
                />
              </div>

              {/* Regional Performance Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

              {/* Regional Performance Summary */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Regional Performance Summary
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
                              ${Math.round(region.revenue).toLocaleString()}
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
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
