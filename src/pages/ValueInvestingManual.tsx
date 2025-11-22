import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  Calculator, 
  Shield, 
  BarChart3,
  Star,
  Search,
  Target
} from "lucide-react";

export default function ValueInvestingManual() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Value Investing Dashboard - MANUAL TABS
            </h1>
            <p className="text-muted-foreground mt-2">
              Versione con tabs implementati manualmente per debug
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <Card className="border-purple-500 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-purple-600">Manual Tabs Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div>Active Tab: {activeTab}</div>
              <div>Implementation: Manual button + useState</div>
              <div>Component loaded successfully</div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Tab Navigation */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                console.log('Clicking tab: overview');
                setActiveTab('overview');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Ov</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: graham');
                setActiveTab('graham');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'graham'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Graham</span>
              <span className="sm:hidden">Gr</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: moat');
                setActiveTab('moat');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'moat'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Moat</span>
              <span className="sm:hidden">Mt</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: intrinsic');
                setActiveTab('intrinsic');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'intrinsic'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Intrinsic</span>
              <span className="sm:hidden">Iv</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: quality');
                setActiveTab('quality');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'quality'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Quality</span>
              <span className="sm:hidden">Q</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: screener');
                setActiveTab('screener');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'screener'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Screener</span>
              <span className="sm:hidden">S</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Clicking tab: opportunities');
                setActiveTab('opportunities');
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'opportunities'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Opportunities</span>
              <span className="sm:hidden">O</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Overview Tab - Manual Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-green-600 font-semibold">✅ Manual Overview tab funziona!</div>
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
          )}

          {activeTab === "graham" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Graham Analysis - Manual Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Manual Graham Analysis tab funziona!</div>
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
          )}

          {activeTab === "moat" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Moat Analysis - Manual Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Manual Moat Analysis tab funziona!</div>
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
          )}

          {activeTab === "intrinsic" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Intrinsic Value - Manual Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Manual Intrinsic Value tab funziona!</div>
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
          )}

          {activeTab === "quality" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Quality Score - Manual Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Manual Quality Score tab funziona!</div>
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
          )}

          {activeTab === "screener" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Value Screener - Manual Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Manual Value Screener tab funziona!</div>
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
          )}

          {activeTab === "opportunities" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Opportunities - Manual Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 font-semibold">✅ Manual Opportunities tab funziona!</div>
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}