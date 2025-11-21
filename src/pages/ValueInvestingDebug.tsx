import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingDown, 
  Calculator, 
  Shield, 
  BarChart3,
  Star,
  Search,
  Target
} from "lucide-react";

export default function ValueInvestingDebug() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (value: string) => {
    console.log("Tab clicked:", value);
    setActiveTab(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Value Investing Dashboard - DEBUG
            </h1>
            <p className="text-muted-foreground mt-2">
              Versione debug per testare navigazione tabs
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <Card className="border-blue-500 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-600">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div>Active Tab: {activeTab}</div>
              <div>Component loaded successfully</div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="graham" className="text-xs sm:text-sm">Graham</TabsTrigger>
            <TabsTrigger value="moat" className="text-xs sm:text-sm">Moat</TabsTrigger>
            <TabsTrigger value="intrinsic" className="text-xs sm:text-sm">Intrinsic</TabsTrigger>
            <TabsTrigger value="quality" className="text-xs sm:text-sm">Quality</TabsTrigger>
            <TabsTrigger value="screener" className="text-xs sm:text-sm">Screener</TabsTrigger>
            <TabsTrigger value="opportunities" className="text-xs sm:text-sm">Opportunities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Overview Tab - Funziona!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-green-600 font-semibold">✅ Tab Overview caricata correttamente</div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">Total Stocks</div>
                        <div className="text-sm text-muted-foreground">20 value stocks</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">Avg Margin</div>
                        <div className="text-sm text-muted-foreground">25.4% safety</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">Graham Value</div>
                        <div className="text-sm text-muted-foreground">12 stocks</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Graham Analysis Tab */}
          <TabsContent value="graham" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Graham Analysis Tab - Funziona!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Tab Graham Analysis caricata correttamente</div>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold">Benjamin Graham Criteria</h4>
                      <ul className="text-sm space-y-1 mt-2">
                        <li>• P/E Ratio ≤ 15</li>
                        <li>• P/B Ratio ≤ 1.5</li>
                        <li>• ROE ≥ 15%</li>
                        <li>• Debt-to-Equity ≤ 2.0</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Results</h4>
                      <div className="text-sm space-y-1 mt-2">
                        <div>Stocks qualifying: 12/20</div>
                        <div>Average P/E: 18.5</div>
                        <div>Average ROE: 32.4%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moat Analysis Tab */}
          <TabsContent value="moat" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Moat Analysis Tab - Funziona!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Tab Moat Analysis caricata correttamente</div>
                <div className="mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
                      <div>
                        <div className="font-medium">Apple (AAPL)</div>
                        <div className="text-sm text-muted-foreground">Wide Moat - 7.8/10</div>
                      </div>
                      <Badge className="bg-green-500">Strong</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
                      <div>
                        <div className="font-medium">Microsoft (MSFT)</div>
                        <div className="text-sm text-muted-foreground">Wide Moat - 8.0/10</div>
                      </div>
                      <Badge className="bg-green-500">Strong</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
                      <div>
                        <div className="font-medium">Berkshire (BRK.B)</div>
                        <div className="text-sm text-muted-foreground">Narrow Moat - 7.2/10</div>
                      </div>
                      <Badge className="bg-yellow-500">Moderate</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intrinsic Value Tab */}
          <TabsContent value="intrinsic" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Intrinsic Value Tab - Funziona!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Tab Intrinsic Value caricata correttamente</div>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">DCF Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Growth Rate:</span>
                            <span>8.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Discount Rate:</span>
                            <span>10.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Terminal Growth:</span>
                            <span>2.5%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Valuation Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>• DCF Model</div>
                          <div>• Dividend Discount</div>
                          <div>• Book Value Approach</div>
                          <div>• Earnings Power Value</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Score Tab */}
          <TabsContent value="quality" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Quality Score Tab - Funziona!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Tab Quality Score caricata correttamente</div>
                <div className="mt-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-card rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Apple (AAPL)</div>
                        <Badge className="bg-blue-500">Score: 87</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Financial Health</div>
                          <div>92/100</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Management</div>
                          <div>85/100</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Economic Moat</div>
                          <div>85/100</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Value Screener Tab */}
          <TabsContent value="screener" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Value Screener Tab - Funziona!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Tab Value Screener caricata correttamente</div>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <label className="text-sm font-medium">Max P/E</label>
                      <div className="text-lg font-bold">25.0</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max P/B</label>
                      <div className="text-lg font-bold">3.0</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Min ROE</label>
                      <div className="text-lg font-bold">15%</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Matches Found</label>
                      <div className="text-lg font-bold text-green-600">12</div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-green-600 font-semibold">Screening Results</div>
                    <div className="text-sm mt-1">12 stocks meet your criteria</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Opportunities Tab - Funziona!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Tab Opportunities caricata correttamente</div>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Berkshire Hathaway</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Current Price:</span>
                            <span className="font-medium">$335.50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Target Price:</span>
                            <span className="font-medium text-green-600">$425.80</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Upside:</span>
                            <span className="font-bold text-green-600">+26.9%</span>
                          </div>
                          <Badge className="bg-green-600">STRONG_BUY</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">AT&T Inc.</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Current Price:</span>
                            <span className="font-medium">$18.25</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Target Price:</span>
                            <span className="font-medium text-green-600">$28.50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Upside:</span>
                            <span className="font-bold text-green-600">+56.1%</span>
                          </div>
                          <Badge className="bg-green-600">STRONG_BUY</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}