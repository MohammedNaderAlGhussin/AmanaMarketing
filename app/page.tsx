"use client";
import { useState, useEffect } from "react";
import { fetchMarketingData } from "../src/lib/api";
import { MarketingData } from "../src/types/marketing";
import { Navbar } from "../src/components/ui/navbar";
import { CardMetric } from "../src/components/ui/card-metric";
import { Footer } from "../src/components/ui/footer";
import {
  Target,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  ShoppingBag,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function Home() {
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
        console.error("Error loading marketing data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar />

      {/* Main Content Area - Now scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section - Scrolls with content */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-10 md:py-16 overflow-hidden">
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
                  <div className="h-10 bg-white/20 rounded-lg mb-4 max-w-md mx-auto"></div>
                  <div className="h-6 bg-white/20 rounded-lg mb-3 max-w-sm mx-auto"></div>
                  <div className="h-20 bg-white/20 rounded-lg max-w-3xl mx-auto"></div>
                </div>
              ) : marketingData ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-2">
                    <Sparkles className="w-4 h-4" />
                    Marketing Analytics Dashboard
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {marketingData.company_info?.name || "Company Name"}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base mb-5">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      {marketingData.company_info?.industry || "Industry"}
                    </span>
                    <span className="opacity-60">•</span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      Founded {marketingData.company_info?.founded || "N/A"}
                    </span>
                  </div>

                  <p className="text-sm md:text-base lg:text-lg max-w-4xl mx-auto leading-relaxed opacity-95 bg-black/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                    {marketingData.company_info?.description ||
                      "No description available"}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="bg-gradient-to-b from-gray-900/50 to-gray-950">
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-lg">Loading your data...</p>
              </div>
            ) : (
              marketingData && (
                <div className="max-w-7xl mx-auto space-y-8">
                  {/* Key Metrics Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Key Metrics
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <CardMetric
                        title="Total Campaigns"
                        value={
                          marketingData.marketing_stats?.total_campaigns || 0
                        }
                        icon={<Target className="h-6 w-6" />}
                        gradient="from-blue-500 to-cyan-500"
                      />

                      <CardMetric
                        title="Total Revenue"
                        value={`$${(
                          marketingData.marketing_stats?.total_revenue || 0
                        ).toLocaleString()}`}
                        icon={<DollarSign className="h-6 w-6" />}
                        gradient="from-green-500 to-emerald-500"
                      />

                      <CardMetric
                        title="Average ROAS"
                        value={`${
                          marketingData.marketing_stats?.average_roas || 0
                        }x`}
                        icon={<TrendingUp className="h-6 w-6" />}
                        gradient="from-purple-500 to-pink-500"
                      />

                      <CardMetric
                        title="Total Conversions"
                        value={
                          marketingData.marketing_stats?.total_conversions || 0
                        }
                        icon={<Users className="h-6 w-6" />}
                        gradient="from-orange-500 to-red-500"
                      />
                    </div>
                  </div>

                  {/* Performance Highlights */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Performance Highlights
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <CardMetric
                        title="Top Performing Medium"
                        value={
                          marketingData.marketing_stats
                            ?.top_performing_medium || "N/A"
                        }
                        icon={<Target className="h-6 w-6" />}
                        gradient="from-indigo-500 to-blue-500"
                      />

                      <CardMetric
                        title="Top Performing Region"
                        value={
                          marketingData.marketing_stats
                            ?.top_performing_region || "N/A"
                        }
                        icon={<MapPin className="h-6 w-6" />}
                        gradient="from-teal-500 to-green-500"
                      />
                    </div>
                  </div>

                  {/* Market Insights */}
                  {marketingData.market_insights && (
                    <div className="space-y-4 pb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-white">
                          Market Insights
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <CardMetric
                          title="Peak Performance Day"
                          value={
                            marketingData.market_insights
                              ?.peak_performance_day || "N/A"
                          }
                          icon={<Calendar className="h-6 w-6" />}
                          gradient="from-violet-500 to-purple-500"
                        />

                        <CardMetric
                          title="Peak Performance Time"
                          value={
                            marketingData.market_insights
                              ?.peak_performance_time || "N/A"
                          }
                          icon={<Clock className="h-6 w-6" />}
                          gradient="from-amber-500 to-orange-500"
                        />

                        <CardMetric
                          title="Top Converting Product"
                          value={
                            marketingData.market_insights
                              ?.top_converting_product || "N/A"
                          }
                          icon={<ShoppingBag className="h-6 w-6" />}
                          gradient="from-cyan-500 to-blue-500"
                        />

                        <CardMetric
                          title="Fastest Growing Region"
                          value={
                            marketingData.market_insights
                              ?.fastest_growing_region || "N/A"
                          }
                          icon={<MapPin className="h-6 w-6" />}
                          gradient="from-rose-500 to-pink-500"
                        />
                      </div>
                    </div>
                  )}
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
