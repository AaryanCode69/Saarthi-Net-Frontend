import { TrendingUp, TrendingDown, AlertTriangle, Shield, Users } from "lucide-react";

// Mock data for insights - clearly marked as placeholder
const mockMigrationData = {
  netMigration: "+12.4%",
  trend: "up" as const,
  topSourceDistrict: "Gaya",
  totalMovement: "24,580",
};

const mockPeriUrbanData = {
  alertStatus: "Detected" as const,
  growthIndex: 0.73,
  explanation: "Elevated growth pattern identified in peripheral zones of Patna district.",
};

const mockDigitalExclusionData = {
  aadhaarCoverage: 87,
  digitalUsability: 62,
  riskLevel: "Medium" as "Low" | "Medium" | "High",
};

export function InsightsPanel() {
  return (
    <aside className="w-full h-full p-4 flex flex-col gap-4 overflow-y-auto bg-background">
      {/* Migration Insight Card */}
      <div className="insight-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="insight-card-header flex items-center gap-2">
          <Users className="w-4 h-4 text-migration transition-transform duration-200 group-hover:scale-110" />
          <span>Migration Overview</span>
        </div>
        
        <div className="space-y-3">
          {/* Net Migration */}
          <div className="flex items-center justify-between group">
            <span className="data-label group-hover:text-foreground">Net Migration</span>
            <div className="flex items-center gap-1">
              <span className="data-value group-hover:text-migration">{mockMigrationData.netMigration}</span>
              {mockMigrationData.trend === "up" ? (
                <TrendingUp className="w-4 h-4 trend-up animate-pulse-subtle" />
              ) : (
                <TrendingDown className="w-4 h-4 trend-down" />
              )}
            </div>
          </div>

          {/* Top Source District */}
          <div className="flex items-center justify-between group">
            <span className="data-label group-hover:text-foreground">Top Source District</span>
            <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration">
              {mockMigrationData.topSourceDistrict}
            </span>
          </div>

          {/* Total Movement */}
          <div className="flex items-center justify-between group">
            <span className="data-label group-hover:text-foreground">Total Movement</span>
            <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration">
              {mockMigrationData.totalMovement}
            </span>
          </div>
        </div>
      </div>

      {/* Peri-Urban Alert Card */}
      <div className="insight-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="insight-card-header flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-periurban" />
          <span>Peri-Urban Growth Alert</span>
        </div>
        
        <div className="space-y-3">
          {/* Alert Status */}
          <div className="flex items-center justify-between group">
            <span className="data-label group-hover:text-foreground">Alert Status</span>
            <span className={`text-sm font-semibold transition-all duration-200 ${
              mockPeriUrbanData.alertStatus === "Detected" 
                ? "text-periurban animate-pulse-subtle" 
                : "text-muted-foreground"
            }`}>
              {mockPeriUrbanData.alertStatus}
            </span>
          </div>

          {/* Growth Index */}
          <div className="flex items-center justify-between group">
            <span className="data-label group-hover:text-foreground">Growth Index</span>
            <span className="data-value group-hover:text-periurban">{mockPeriUrbanData.growthIndex.toFixed(2)}</span>
          </div>

          {/* Explanation */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-200 hover:text-foreground">
              {mockPeriUrbanData.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Digital Exclusion Risk Card */}
      <div className="insight-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="insight-card-header flex items-center gap-2">
          <Shield className="w-4 h-4 text-exclusion" />
          <span>Digital Exclusion Risk</span>
        </div>
        
        <div className="space-y-3">
          {/* Aadhaar Coverage */}
          <div className="space-y-1 group">
            <div className="flex items-center justify-between">
              <span className="data-label group-hover:text-foreground">Aadhaar Coverage</span>
              <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration">
                {mockDigitalExclusionData.aadhaarCoverage}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-migration rounded-full transition-all duration-500 ease-out"
                style={{ width: `${mockDigitalExclusionData.aadhaarCoverage}%` }}
              />
            </div>
          </div>

          {/* Digital Usability */}
          <div className="space-y-1 group">
            <div className="flex items-center justify-between">
              <span className="data-label group-hover:text-foreground">Digital Usability</span>
              <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-periurban">
                {mockDigitalExclusionData.digitalUsability}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-periurban rounded-full transition-all duration-500 ease-out"
                style={{ width: `${mockDigitalExclusionData.digitalUsability}%` }}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="data-label">Risk Level</span>
            {(() => {
              const level = mockDigitalExclusionData.riskLevel;
              const styles = 
                level === "Low" 
                  ? "bg-status-low/10 status-low"
                  : level === "Medium"
                  ? "bg-status-medium/10 status-medium"
                  : "bg-status-high/10 status-high";
              return (
                <span className={`text-sm font-semibold px-2 py-0.5 rounded transition-transform duration-200 hover:scale-105 ${styles}`}>
                  {level}
                </span>
              );
            })()}
          </div>
        </div>
      </div>
    </aside>
  );
}
