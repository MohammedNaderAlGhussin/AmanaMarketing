"use client";
import { useState, useEffect } from 'react';
import { fetchMarketingData } from '../src/lib/api';
import { MarketingData } from '../src/types/marketing';
import { Navbar } from '../src/components/ui/navbar';
import { CardMetric } from '../src/components/ui/card-metric';
import { Footer } from '../src/components/ui/footer';
import { Target, DollarSign, TrendingUp, Users, Calendar, Clock, ShoppingBag, MapPin } from 'lucide-react';

export default function Home() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading marketing data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-6">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              {error ? (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
                  Error loading data: {error}
                </div>
              ) : loading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-white/20 rounded mb-4 max-w-md mx-auto"></div>
                  <div className="h-6 bg-white/20 rounded mb-4 max-w-sm mx-auto"></div>
                  <div className="h-4 bg-white/20 rounded max-w-3xl mx-auto"></div>
                </div>
              ) : marketingData ? (
                <>
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {marketingData.company_info.name}
                  </h1>
                  <p className="text-lg md:text-xl mb-4 opacity-90">
                    {marketingData.company_info.industry} • Founded{" "}
                    {marketingData.company_info.founded}
                  </p>
                  <p className="text-base max-w-3xl mx-auto leading-relaxed opacity-80">
                    {marketingData.company_info.description}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-full">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading...</div>
            </div>
          ) : (
            marketingData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Key Metrics Cards */}
                <CardMetric
                  title="Total Campaigns"
                  value={marketingData.marketing_stats.total_campaigns}
                  icon={<Target className="h-5 w-5" />}
                />

                <CardMetric
                  title="Total Revenue"
                  value={`$${marketingData.marketing_stats.total_revenue.toLocaleString()}`}
                  icon={<DollarSign className="h-5 w-5" />}
                  className="text-green-400"
                />

                <CardMetric
                  title="Average ROAS"
                  value={`${marketingData.marketing_stats.average_roas}x`}
                  icon={<TrendingUp className="h-5 w-5" />}
                  className="text-blue-400"
                />

                <CardMetric
                  title="Total Conversions"
                  value={marketingData.marketing_stats.total_conversions}
                  icon={<Users className="h-5 w-5" />}
                  className="text-purple-400"
                />
              </div>
            )
          )}

          {/* Performance Highlights */}
          {marketingData && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Performance Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <CardMetric
                  title="Top Performing Medium"
                  value={marketingData.marketing_stats.top_performing_medium}
                  icon={<Target className="h-5 w-5" />}
                />

                <CardMetric
                  title="Top Performing Region"
                  value={marketingData.marketing_stats.top_performing_region}
                  icon={<MapPin className="h-5 w-5" />}
                />
              </div>
            </div>
          )}

          {/* Market Insights */}
          {marketingData && marketingData.market_insights && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Market Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CardMetric
                  title="Peak Performance Day"
                  value={marketingData.market_insights.peak_performance_day}
                  icon={<Calendar className="h-5 w-5" />}
                />

                <CardMetric
                  title="Peak Performance Time"
                  value={marketingData.market_insights.peak_performance_time}
                  icon={<Clock className="h-5 w-5" />}
                />

                <CardMetric
                  title="Top Converting Product"
                  value={marketingData.market_insights.top_converting_product}
                  icon={<ShoppingBag className="h-5 w-5" />}
                />

                <CardMetric
                  title="Fastest Growing Region"
                  value={marketingData.market_insights.fastest_growing_region}
                  icon={<MapPin className="h-5 w-5" />}
                />
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
