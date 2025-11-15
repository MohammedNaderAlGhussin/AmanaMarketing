"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, Campaign } from "../../src/types/marketing";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BarChart } from "../../src/components/ui/bar-chart";
import { Table } from "../../src/components/ui/table";
import { SearchFilter } from "../../src/components/ui/search-filter";
import { DropdownFilter } from "../../src/components/ui/dropdown-filter";
import {
  Target,
  DollarSign,
  TrendingUp,
  Users,
  Filter,
  Sparkles,
  BarChart3,
} from "lucide-react";

export default function CampaignView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

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

  // Filter campaigns based on current filter values
  const filteredCampaigns = useMemo(() => {
    if (!marketingData?.campaigns) return [];

    return marketingData.campaigns.filter((campaign: Campaign) => {
      const matchesName = campaign.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesType =
        typeFilter.length === 0 || typeFilter.includes(campaign.objective);

      return matchesName && matchesType;
    });
  }, [marketingData?.campaigns, nameFilter, typeFilter]);

  // Get unique campaign types for the dropdown
  const campaignTypes = useMemo(() => {
    if (!marketingData?.campaigns) return [];
    return [
      ...new Set(
        marketingData.campaigns.map((campaign: Campaign) => campaign.objective)
      ),
    ];
  }, [marketingData?.campaigns]);

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
                    <BarChart3 className="w-4 h-4" />
                    Campaign Analytics
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Campaign Performance
                  </h1>

                  <p className="text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed opacity-95 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    Track, analyze, and optimize your marketing campaigns in
                    real-time
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
                <p className="text-gray-400 text-lg">Loading campaigns...</p>
              </div>
            ) : (
              marketingData && (
                <div className="max-w-7xl mx-auto space-y-8">
                  {/* Filters Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Filter className="h-6 w-6 text-blue-400" />
                        Filters
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <SearchFilter
                        title="Campaign Name"
                        placeholder="Search campaigns..."
                        value={nameFilter}
                        onChange={setNameFilter}
                      />

                      <DropdownFilter
                        title="Campaign Type"
                        options={campaignTypes}
                        selectedValues={typeFilter}
                        onChange={setTypeFilter}
                        placeholder="Select campaign types..."
                      />
                    </div>

                    {/* Results Summary */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3">
                      <p className="text-gray-300 text-sm sm:text-base">
                        Showing{" "}
                        <span className="font-bold text-blue-400">
                          {filteredCampaigns.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-white">
                          {marketingData.campaigns.length}
                        </span>{" "}
                        campaigns
                      </p>
                    </div>
                  </div>

                  {/* Campaign Overview Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Overview Metrics
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <CardMetric
                        title="Filtered Campaigns"
                        value={filteredCampaigns.length}
                        icon={<Target className="h-6 w-6" />}
                        gradient="from-blue-500 to-cyan-500"
                      />

                      <CardMetric
                        title="Total Spend"
                        value={`$${filteredCampaigns
                          .reduce((sum, c) => sum + c.spend, 0)
                          .toLocaleString()}`}
                        icon={<DollarSign className="h-6 w-6" />}
                        gradient="from-red-500 to-orange-500"
                      />

                      <CardMetric
                        title="Total Revenue"
                        value={`$${filteredCampaigns
                          .reduce((sum, c) => sum + c.revenue, 0)
                          .toLocaleString()}`}
                        icon={<TrendingUp className="h-6 w-6" />}
                        gradient="from-green-500 to-emerald-500"
                      />

                      <CardMetric
                        title="Total Conversions"
                        value={filteredCampaigns.reduce(
                          (sum, c) => sum + c.conversions,
                          0
                        )}
                        icon={<Users className="h-6 w-6" />}
                        gradient="from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>

                  {/* Campaign Performance Charts */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Performance Analytics
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {/* Top Campaigns by Revenue */}
                      <BarChart
                        title="Top Campaigns by Revenue"
                        data={filteredCampaigns.slice(0, 6).map((campaign) => ({
                          label: campaign.name.split(" - ")[0],
                          value: campaign.revenue,
                          color: "#10B981",
                        }))}
                        formatValue={(value) => `$${value.toLocaleString()}`}
                      />

                      {/* Campaign ROAS Comparison */}
                      <BarChart
                        title="Campaign ROAS Comparison"
                        data={filteredCampaigns.slice(0, 6).map((campaign) => ({
                          label: campaign.name.split(" - ")[0],
                          value: campaign.roas,
                          color: "#3B82F6",
                        }))}
                        formatValue={(value) => `${value.toFixed(1)}x`}
                      />
                    </div>
                  </div>

                  {/* Campaign Medium & Device Performance */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Performance by Medium */}
                    <BarChart
                      title="Performance by Medium"
                      data={(() => {
                        const mediumData: {
                          [key: string]: {
                            revenue: number;
                            conversions: number;
                          };
                        } = {};
                        filteredCampaigns.forEach((campaign) => {
                          if (!mediumData[campaign.medium]) {
                            mediumData[campaign.medium] = {
                              revenue: 0,
                              conversions: 0,
                            };
                          }
                          mediumData[campaign.medium].revenue +=
                            campaign.revenue;
                          mediumData[campaign.medium].conversions +=
                            campaign.conversions;
                        });

                        return Object.entries(mediumData).map(
                          ([medium, data]) => ({
                            label: medium,
                            value: data.revenue,
                            color:
                              medium === "Instagram"
                                ? "#E1306C"
                                : medium === "Facebook"
                                ? "#1877F2"
                                : medium === "Google Ads"
                                ? "#4285F4"
                                : "#8B5CF6",
                          })
                        );
                      })()}
                      formatValue={(value) => `$${value.toLocaleString()}`}
                    />

                    {/* Campaign Conversion Rates */}
                    <BarChart
                      title="Campaign Conversion Rates"
                      data={filteredCampaigns.slice(0, 6).map((campaign) => ({
                        label: campaign.name.split(" - ")[0],
                        value: campaign.conversion_rate,
                        color: "#F59E0B",
                      }))}
                      formatValue={(value) => `${value.toFixed(2)}%`}
                    />
                  </div>

                  {/* Campaign Details Table */}
                  <div className="space-y-4 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white">
                        Campaign Details
                      </h2>
                    </div>

                    <div className="overflow-x-auto w-full">
                      <Table
                        title={`All Campaigns (${filteredCampaigns.length})`}
                        showIndex={true}
                        maxHeight="400px"
                        columns={[
                          {
                            key: "name",
                            header: "Campaign Name",
                            width: "20%",
                            sortable: true,
                            sortType: "string",
                            render: (value) => (
                              <div className="font-medium text-white text-sm sm:text-base">
                                <span className="hidden sm:inline">
                                  {value.length > 30
                                    ? `${value.substring(0, 30)}...`
                                    : value}
                                </span>
                                <span className="sm:hidden">
                                  {value.length > 20
                                    ? `${value.substring(0, 20)}...`
                                    : value}
                                </span>
                              </div>
                            ),
                          },
                          {
                            key: "objective",
                            header: "Type",
                            width: "12%",
                            align: "center",
                            sortable: true,
                            sortType: "string",
                            render: (value) => (
                              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                                <span className="hidden sm:inline">
                                  {value}
                                </span>
                                <span className="sm:hidden">
                                  {value.substring(0, 4)}
                                </span>
                              </span>
                            ),
                          },
                          {
                            key: "status",
                            header: "Status",
                            width: "10%",
                            align: "center",
                            sortable: true,
                            sortType: "string",
                            render: (value) => (
                              <span
                                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                                  value === "Active"
                                    ? "bg-green-900 text-green-300"
                                    : value === "Paused"
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-gray-700 text-gray-300"
                                }`}
                              >
                                <span className="hidden sm:inline">
                                  {value}
                                </span>
                                <span className="sm:hidden">
                                  {value.substring(0, 3)}
                                </span>
                              </span>
                            ),
                          },
                          {
                            key: "medium",
                            header: "Medium",
                            width: "10%",
                            align: "center",
                            sortable: true,
                            sortType: "string",
                          },
                          {
                            key: "budget",
                            header: "Budget",
                            width: "12%",
                            align: "right",
                            sortable: true,
                            sortType: "number",
                            render: (value) => (
                              <span className="text-xs sm:text-sm">
                                ${value.toLocaleString()}
                              </span>
                            ),
                          },
                          {
                            key: "spend",
                            header: "Spend",
                            width: "12%",
                            align: "right",
                            sortable: true,
                            sortType: "number",
                            render: (value) => (
                              <span className="text-xs sm:text-sm">
                                ${value.toLocaleString()}
                              </span>
                            ),
                          },
                          {
                            key: "revenue",
                            header: "Revenue",
                            width: "12%",
                            align: "right",
                            sortable: true,
                            sortType: "number",
                            render: (value) => (
                              <span className="text-green-400 font-medium text-xs sm:text-sm">
                                ${value.toLocaleString()}
                              </span>
                            ),
                          },
                          {
                            key: "conversions",
                            header: "Conversions",
                            width: "10%",
                            align: "right",
                            sortable: true,
                            sortType: "number",
                          },
                          {
                            key: "roas",
                            header: "ROAS",
                            width: "9%",
                            align: "right",
                            sortable: true,
                            sortType: "number",
                            render: (value) => (
                              <span className="text-blue-400 font-medium text-xs sm:text-sm">
                                {value.toFixed(1)}x
                              </span>
                            ),
                          },
                        ]}
                        defaultSort={{ key: "revenue", direction: "desc" }}
                        data={filteredCampaigns}
                        emptyMessage="No campaigns match the current filters"
                      />
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
