"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchMarketingData } from "../../src/lib/api";
import {
  MarketingData,
  Campaign,
  DemographicBreakdown,
} from "../../src/types/marketing";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BarChart } from "../../src/components/ui/bar-chart";
import { Table } from "../../src/components/ui/table";
// Keep icons for the card metrics
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Target,
  Heart,
} from "lucide-react";

// Adjusted Helper function to process demographic data from all campaigns
const processDemographicData = (campaigns: Campaign[]) => {
  // Flatten all demographic breakdowns from all campaigns into a single array
  const allDemographics: (DemographicBreakdown & {
    spend: number;
    revenue: number;
  })[] = [];

  campaigns.forEach((campaign) => {
    // To correctly aggregate spend and revenue per demographic,
    // we must distribute the campaign's spend/revenue proportionally
    // based on the performance (or simply use the total data if the API provides it,
    // but based on your structure, we'll aggregate Impressions/Clicks/Conversions and calculate Spend/Revenue estimates).

    // A simpler and more robust approach is to aggregate the performance metrics
    // (Impressions, Clicks, Conversions) and then apply a proportional share of the Campaign's
    // total Spend/Revenue based on Impressions/Clicks.
    // However, since the DemographicBreakdown only gives us Impressions/Clicks/Conversions (nested under 'performance'),
    // and your request requires Total Spend/Revenue by demographic, we must use a **simplified aggregation method** // based on the performance metrics *if we assume* that the breakdown data is consistent across campaigns.

    // Given the lack of spend/revenue in DemographicBreakdown, we will only aggregate
    // Clicks/Impressions/Conversions first, and skip the Spend/Revenue aggregation for the cards,
    // but we will prepare the age/gender table based on the available performance data.

    // Let's create an aggregate map for Age/Gender groups
    const aggregateMap: {
      [key: string]: {
        impressions: number;
        clicks: number;
        conversions: number;
        gender: string;
        age_group: string;
        total_spend: number; // Estimated
        total_revenue: number; // Estimated
      };
    } = {};

    campaign.demographic_breakdown.forEach((demo) => {
      const key = `${demo.gender}-${demo.age_group}`;

      if (!aggregateMap[key]) {
        aggregateMap[key] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          gender: demo.gender,
          age_group: demo.age_group,
          total_spend: 0,
          total_revenue: 0,
        };
      }

      aggregateMap[key].impressions += demo.performance.impressions;
      aggregateMap[key].clicks += demo.performance.clicks;
      aggregateMap[key].conversions += demo.performance.conversions;
    });

    // Now, let's distribute campaign spend/revenue based on aggregated clicks for better precision
    const campaignTotalClicks = campaign.clicks;

    Object.keys(aggregateMap).forEach((key) => {
      const clicksShare = aggregateMap[key].clicks / (campaignTotalClicks || 1);
      aggregateMap[key].total_spend += clicksShare * campaign.spend;
      aggregateMap[key].total_revenue += clicksShare * campaign.revenue;
    });
  });

  // Combine aggregated data from all campaigns
  const finalAggregate: {
    [key: string]: {
      impressions: number;
      clicks: number;
      conversions: number;
      gender: string;
      age_group: string;
      total_spend: number;
      total_revenue: number;
    };
  } = {};

  // This nested loop structure is not ideal for final aggregation,
  // but it's required given the campaign-nested structure.
  // For simplicity and direct metric calculation, we will re-run the aggregation across all campaigns
  // one final time outside the campaign loop to get combined data.

  campaigns.forEach((campaign) => {
    const campaignTotalClicks = campaign.clicks;
    campaign.demographic_breakdown.forEach((demo) => {
      const key = `${demo.gender}-${demo.age_group}`;

      if (!finalAggregate[key]) {
        finalAggregate[key] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          gender: demo.gender,
          age_group: demo.age_group,
          total_spend: 0,
          total_revenue: 0,
        };
      }

      finalAggregate[key].impressions += demo.performance.impressions;
      finalAggregate[key].clicks += demo.performance.clicks;
      finalAggregate[key].conversions += demo.performance.conversions;

      // Estimate spend/revenue share
      const clicksShare = demo.performance.clicks / (campaignTotalClicks || 1);
      finalAggregate[key].total_spend += clicksShare * campaign.spend;
      finalAggregate[key].total_revenue += clicksShare * campaign.revenue;
    });
  });

  const stats: { [key: string]: number } = {
    totalClicksMale: 0,
    totalSpendMale: 0,
    totalRevenueMale: 0,
    totalClicksFemale: 0,
    totalSpendFemale: 0,
    totalRevenueFemale: 0,
  };

  const tableData: any[] = [];
  const ageGroupSpendMap: { [key: string]: number } = {};
  const ageGroupRevenueMap: { [key: string]: number } = {};

  Object.values(finalAggregate).forEach((data) => {
    // 1. Calculate Gender Metrics (for Cards)
    if (data.gender === "Male") {
      stats.totalClicksMale += data.clicks;
      stats.totalSpendMale += data.total_spend;
      stats.totalRevenueMale += data.total_revenue;
    } else if (data.gender === "Female") {
      stats.totalClicksFemale += data.clicks;
      stats.totalSpendFemale += data.total_spend;
      stats.totalRevenueFemale += data.total_revenue;
    }

    // 2. Prepare Age Group Maps (for Charts)
    const age = data.age_group;
    ageGroupSpendMap[age] = (ageGroupSpendMap[age] || 0) + data.total_spend;
    ageGroupRevenueMap[age] =
      (ageGroupRevenueMap[age] || 0) + data.total_revenue;

    // 3. Prepare Table Data (for Table)
    const ctr =
      data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
    const conversion_rate =
      data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;
    const roas =
      data.total_spend > 0 ? data.total_revenue / data.total_spend : 0;

    tableData.push({
      gender: data.gender,
      age_group: data.age_group,
      impressions: data.impressions,
      clicks: data.clicks,
      conversions: data.conversions,
      ctr: parseFloat(ctr.toFixed(2)),
      conversion_rate: parseFloat(conversion_rate.toFixed(2)),
      roas: parseFloat(roas.toFixed(1)),
      spend: data.total_spend,
      revenue: data.total_revenue,
    });
  });

  // Prepare data for age group bar charts
  const ageGroups = [...new Set(tableData.map((d) => d.age_group))].sort(); // Get unique and sort
  const totalSpendByAge = ageGroups
    .map((group) => ({
      label: group,
      value: ageGroupSpendMap[group],
      color: "#F59E0B",
    }))
    .filter((d) => d.value > 0);

  const totalRevenueByAge = ageGroups
    .map((group) => ({
      label: group,
      value: ageGroupRevenueMap[group],
      color: "#10B981",
    }))
    .filter((d) => d.value > 0);

  // Sort table data: Male groups first, then Female groups
  const sortedTableData = tableData.sort((a, b) => {
    if (a.gender === "Male" && b.gender === "Female") return -1;
    if (a.gender === "Female" && b.gender === "Male") return 1;
    return a.age_group.localeCompare(b.age_group);
  });

  return {
    stats,
    tableData: sortedTableData,
    totalSpendByAge,
    totalRevenueByAge,
  };
};

export default function DemographicView() {
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

  // Process data for components
  const { stats, tableData, totalSpendByAge, totalRevenueByAge } =
    useMemo(() => {
      if (!marketingData?.campaigns) {
        return {
          stats: {},
          tableData: [],
          totalSpendByAge: [],
          totalRevenueByAge: [],
        };
      }
      return processDemographicData(marketingData.campaigns);
    }, [marketingData?.campaigns]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-900">
        {/*
      - Old styling, // reason why content overflow wasnt working
        flex flex-col lg:flex-row min-h-screen bg-gray-900
      */}
        <Navbar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
          {/* Hero Section */}
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
                      <Users className="w-4 h-4" />
                      Demographic Analytics
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      Demographic Performance
                    </h1>

                    <p className="text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed opacity-95 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                      Analyze campaign performance across age groups and gender
                      demographics
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Content Area */}
          <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-full">
            {marketingData && (
              <>
                {/* Gender Performance Metrics */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Heart className="h-5 w-5 text-pink-400 mr-2" />
                    Gender Performance Summary (Estimated Spend/Revenue)
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
                    <CardMetric
                      title="Male Clicks"
                      value={stats.totalClicksMale?.toLocaleString() || 0}
                      icon={<Users className="h-5 w-5" />}
                    />
                    <CardMetric
                      title="Male Spend"
                      value={`$${
                        stats.totalSpendMale?.toFixed(0).toLocaleString() || 0
                      }`}
                      icon={<DollarSign className="h-5 w-5" />}
                    />
                    <CardMetric
                      title="Male Revenue"
                      value={`$${
                        stats.totalRevenueMale?.toFixed(0).toLocaleString() || 0
                      }`}
                      icon={<TrendingUp className="h-5 w-5" />}
                      className="text-green-400"
                    />
                    <CardMetric
                      title="Female Clicks"
                      value={stats.totalClicksFemale?.toLocaleString() || 0}
                      icon={<UserCheck className="h-5 w-5" />}
                    />
                    <CardMetric
                      title="Female Spend"
                      value={`$${
                        stats.totalSpendFemale?.toFixed(0).toLocaleString() || 0
                      }`}
                      icon={<DollarSign className="h-5 w-5" />}
                    />
                    <CardMetric
                      title="Female Revenue"
                      value={`$${
                        stats.totalRevenueFemale?.toFixed(0).toLocaleString() ||
                        0
                      }`}
                      icon={<TrendingUp className="h-5 w-5" />}
                      className="text-green-400"
                    />
                  </div>
                </div>

                {/* Age Group Performance Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Total Spend by Age Group */}
                  <BarChart
                    title="Total Spend by Age Group (Estimated)"
                    data={totalSpendByAge}
                    formatValue={(value) => `$${value.toLocaleString()}`}
                  />

                  {/* Total Revenue by Age Group */}
                  <BarChart
                    title="Total Revenue by Age Group (Estimated)"
                    data={totalRevenueByAge}
                    formatValue={(value) => `$${value.toLocaleString()}`}
                  />
                </div>

                {/* Demographic Details Table */}
                <div className="overflow-x-auto w-full max-w-full">
                  <Table
                    title={`Demographic Performance Details (${tableData.length} groups)`}
                    showIndex={true}
                    maxHeight="500px"
                    columns={[
                      {
                        key: "gender",
                        header: "Gender",
                        width: "10%",
                        sortable: true,
                        sortType: "string",
                        render: (value) => (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              value === "Male"
                                ? "bg-blue-900 text-blue-300"
                                : "bg-pink-900 text-pink-300"
                            }`}
                          >
                            {value}
                          </span>
                        ),
                      },
                      {
                        key: "age_group",
                        header: "Age Group",
                        width: "10%",
                        align: "center",
                        sortable: true,
                        sortType: "string",
                      },
                      {
                        key: "impressions",
                        header: "Impressions",
                        width: "12%",
                        align: "right",
                        sortable: true,
                        sortType: "number",
                        render: (value) => value.toLocaleString(),
                      },
                      {
                        key: "clicks",
                        header: "Clicks",
                        width: "12%",
                        align: "right",
                        sortable: true,
                        sortType: "number",
                        render: (value) => value.toLocaleString(),
                      },
                      {
                        key: "conversions",
                        header: "Conversions",
                        width: "12%",
                        align: "right",
                        sortable: true,
                        sortType: "number",
                        render: (value) => value.toLocaleString(),
                      },
                      {
                        key: "ctr",
                        header: "CTR",
                        width: "10%",
                        align: "right",
                        sortable: true,
                        sortType: "number",
                        render: (value) => `${value}%`,
                      },
                      {
                        key: "conversion_rate",
                        header: "Conv. Rate",
                        width: "12%",
                        align: "right",
                        sortable: true,
                        sortType: "number",
                        render: (value) => `${value}%`,
                      },
                      {
                        key: "roas",
                        header: "ROAS",
                        width: "9%",
                        align: "right",
                        sortable: true,
                        sortType: "number",
                        render: (value) => (
                          <span className="text-green-400 font-medium text-xs sm:text-sm">
                            {value.toFixed(1)}x
                          </span>
                        ),
                      },
                    ]}
                    defaultSort={{ key: "revenue", direction: "desc" }}
                    data={tableData}
                    emptyMessage="No demographic data available"
                  />
                </div>
              </>
            )}
          </div>

          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
}
