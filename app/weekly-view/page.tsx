"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, Campaign } from "../../src/types/marketing";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { LineChart } from "../../src/components/ui/line-chart";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Sparkles,
  BarChart3,
} from "lucide-react";

export default function WeeklyView() {
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

  // Process weekly performance data
  const weeklyData = useMemo(() => {
    if (!marketingData?.campaigns) return { revenue: [], spend: [] };

    const weeklyRevenue: { [key: string]: number } = {};
    const weeklySpend: { [key: string]: number } = {};

    // Aggregate data from all campaigns
    marketingData.campaigns.forEach((campaign) => {
      campaign.weekly_performance?.forEach((week) => {
        const weekKey = week.week_start;

        if (!weeklyRevenue[weekKey]) weeklyRevenue[weekKey] = 0;
        if (!weeklySpend[weekKey]) weeklySpend[weekKey] = 0;

        weeklyRevenue[weekKey] += week.revenue;
        weeklySpend[weekKey] += week.spend;
      });
    });

    // Convert to arrays and sort by date
    const sortedWeeks = Object.keys(weeklyRevenue).sort();

    const revenueData = sortedWeeks.map((week) => ({
      label: new Date(week).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: weeklyRevenue[week],
      color: "#10B981",
    }));

    const spendData = sortedWeeks.map((week) => ({
      label: new Date(week).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: weeklySpend[week],
      color: "#EF4444",
    }));

    return { revenue: revenueData, spend: spendData };
  }, [marketingData?.campaigns]);

  // Calculate weekly metrics
  const weeklyMetrics = useMemo(() => {
    if (!weeklyData.revenue.length) return null;

    const totalRevenue = weeklyData.revenue.reduce(
      (sum, week) => sum + week.value,
      0
    );
    const totalSpend = weeklyData.spend.reduce(
      (sum, week) => sum + week.value,
      0
    );
    const averageROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const weekCount = weeklyData.revenue.length;

    return {
      totalRevenue,
      totalSpend,
      averageROAS,
      weekCount,
      averageWeeklyRevenue: totalRevenue / weekCount,
      averageWeeklySpend: totalSpend / weekCount,
    };
  }, [weeklyData]);

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
                    <Calendar className="w-4 h-4" />
                    Weekly Analytics
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Weekly Performance
                  </h1>

                  <p className="text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed opacity-95 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    Track your weekly trends and identify performance patterns
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
                <p className="text-gray-400 text-lg">Loading weekly data...</p>
              </div>
            ) : (
              marketingData &&
              weeklyMetrics && (
                <div className="max-w-7xl mx-auto space-y-8">
                  {/* Weekly Overview Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Weekly Overview
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <CardMetric
                        title="Total Revenue"
                        value={`$${Math.round(
                          weeklyMetrics.totalRevenue
                        ).toLocaleString()}`}
                        icon={<DollarSign className="h-6 w-6" />}
                        gradient="from-green-500 to-emerald-500"
                      />

                      <CardMetric
                        title="Total Spend"
                        value={`$${Math.round(
                          weeklyMetrics.totalSpend
                        ).toLocaleString()}`}
                        icon={<TrendingUp className="h-6 w-6" />}
                        gradient="from-red-500 to-orange-500"
                      />

                      <CardMetric
                        title="Average ROAS"
                        value={`${weeklyMetrics.averageROAS.toFixed(1)}x`}
                        icon={<Target className="h-6 w-6" />}
                        gradient="from-purple-500 to-pink-500"
                      />

                      <CardMetric
                        title="Weeks Tracked"
                        value={weeklyMetrics.weekCount}
                        icon={<Calendar className="h-6 w-6" />}
                        gradient="from-yellow-500 to-amber-500"
                      />
                    </div>
                  </div>

                  {/* Weekly Performance Charts */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Weekly Trends
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                      <LineChart
                        title="Weekly Revenue Trend"
                        data={weeklyData.revenue}
                        formatValue={(value) =>
                          `$${Math.round(value).toLocaleString()}`
                        }
                        height={350}
                      />

                      <LineChart
                        title="Weekly Spend Trend"
                        data={weeklyData.spend}
                        formatValue={(value) =>
                          `$${Math.round(value).toLocaleString()}`
                        }
                        height={350}
                      />
                    </div>
                  </div>

                  {/* Additional Weekly Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Average Performance
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <CardMetric
                        title="Average Weekly Revenue"
                        value={`$${Math.round(
                          weeklyMetrics.averageWeeklyRevenue
                        ).toLocaleString()}`}
                        icon={<DollarSign className="h-6 w-6" />}
                        gradient="from-green-500 to-teal-500"
                      />

                      <CardMetric
                        title="Average Weekly Spend"
                        value={`$${Math.round(
                          weeklyMetrics.averageWeeklySpend
                        ).toLocaleString()}`}
                        icon={<TrendingUp className="h-6 w-6" />}
                        gradient="from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div className="space-y-4 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Performance Summary
                      </h2>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                        Weekly Performance Insights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-green-400">
                              Revenue Peak:
                            </span>{" "}
                            {weeklyData.revenue.length > 0
                              ? `$${Math.round(
                                  Math.max(
                                    ...weeklyData.revenue.map((w) => w.value)
                                  )
                                ).toLocaleString()}`
                              : "N/A"}
                          </p>
                          <p className="mb-2">
                            <span className="font-semibold text-red-400">
                              Spend Peak:
                            </span>{" "}
                            {weeklyData.spend.length > 0
                              ? `$${Math.round(
                                  Math.max(
                                    ...weeklyData.spend.map((w) => w.value)
                                  )
                                ).toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2">
                            <span className="font-semibold text-purple-400">
                              Data Period:
                            </span>{" "}
                            {weeklyData.revenue.length > 0
                              ? `${weeklyData.revenue.length} weeks`
                              : "N/A"}
                          </p>
                          <p className="mb-2">
                            <span className="font-semibold text-yellow-400">
                              Efficiency:
                            </span>{" "}
                            {weeklyMetrics.averageROAS > 10
                              ? "Excellent"
                              : weeklyMetrics.averageROAS > 5
                              ? "Good"
                              : weeklyMetrics.averageROAS > 2
                              ? "Average"
                              : "Needs Improvement"}
                          </p>
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
