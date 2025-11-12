"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, Campaign } from "../../src/types/marketing";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { LineChart } from "../../src/components/ui/line-chart";
import { Calendar, TrendingUp, DollarSign, Target, Users } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading weekly performance data...</div>
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
                  Weekly Performance
                </h1>
              )}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-full">
          {marketingData && weeklyMetrics && (
            <>
              {/* Weekly Overview Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <CardMetric
                  title="Total Revenue"
                  value={`$${Math.round(
                    weeklyMetrics.totalRevenue
                  ).toLocaleString()}`}
                  icon={<DollarSign className="h-5 w-5" />}
                  className="text-green-400"
                />

                <CardMetric
                  title="Total Spend"
                  value={`$${Math.round(
                    weeklyMetrics.totalSpend
                  ).toLocaleString()}`}
                  icon={<TrendingUp className="h-5 w-5" />}
                  className="text-blue-400"
                />

                <CardMetric
                  title="Average ROAS"
                  value={`${weeklyMetrics.averageROAS.toFixed(1)}x`}
                  icon={<Target className="h-5 w-5" />}
                  className="text-purple-400"
                />

                <CardMetric
                  title="Weeks Tracked"
                  value={weeklyMetrics.weekCount}
                  icon={<Calendar className="h-5 w-5" />}
                  className="text-yellow-400"
                />
              </div>

              {/* Weekly Performance Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

              {/* Additional Weekly Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <CardMetric
                  title="Average Weekly Revenue"
                  value={`$${Math.round(
                    weeklyMetrics.averageWeeklyRevenue
                  ).toLocaleString()}`}
                  icon={<DollarSign className="h-5 w-5" />}
                  className="text-green-400"
                />

                <CardMetric
                  title="Average Weekly Spend"
                  value={`$${Math.round(
                    weeklyMetrics.averageWeeklySpend
                  ).toLocaleString()}`}
                  icon={<TrendingUp className="h-5 w-5" />}
                  className="text-blue-400"
                />
              </div>

              {/* Performance Summary */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Weekly Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="mb-2">
                      <span className="font-semibold text-green-400">
                        Revenue Peak:
                      </span>{" "}
                      {weeklyData.revenue.length > 0
                        ? `$${Math.round(
                            Math.max(...weeklyData.revenue.map((w) => w.value))
                          ).toLocaleString()}`
                        : "N/A"}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold text-blue-400">
                        Spend Peak:
                      </span>{" "}
                      {weeklyData.spend.length > 0
                        ? `$${Math.round(
                            Math.max(...weeklyData.spend.map((w) => w.value))
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
            </>
          )}
        </div>

        {/* <Footer /> */}
      </div>
    </div>
  );
}
