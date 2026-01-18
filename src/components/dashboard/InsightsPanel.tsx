import { TrendingUp, TrendingDown, AlertTriangle, Shield, Users } from "lucide-react";
import {
  MigrationData,
  PeriUrbanData,
  DigitalExclusionData,
  formatValue,
  formatPercent,
  formatSignedPercent,
  formatIndex,
} from "@/mock/dashboardData";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface MigrationCardProps {
  data: MigrationData;
}

interface PeriUrbanCardProps {
  data: PeriUrbanData;
}

interface DigitalExclusionCardProps {
  data: DigitalExclusionData;
}

export interface InsightsPanelProps {
  migrationData: MigrationData;
  periUrbanData: PeriUrbanData;
  digitalExclusionData: DigitalExclusionData;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

/**
 * Migration Overview Card
 * TODO: Replace with backend API response
 */
function MigrationCard({ data }: MigrationCardProps) {
  const hasTrend = data.trend !== null;
  const hasNetMigration = data.netMigrationPercent !== null;

  return (
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
            <span className="data-value group-hover:text-migration">
              {formatSignedPercent(data.netMigrationPercent)}
            </span>
            {hasTrend && hasNetMigration && (
              data.trend === "up" ? (
                <TrendingUp className="w-4 h-4 trend-up animate-pulse-subtle" />
              ) : (
                <TrendingDown className="w-4 h-4 trend-down" />
              )
            )}
          </div>
        </div>

        {/* Top Source District */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Top Source District</span>
          <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration">
            {formatValue(data.topSourceDistrict)}
          </span>
        </div>

        {/* Total Movement */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Total Movement</span>
          <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration">
            {formatValue(data.totalMovement)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Peri-Urban Growth Alert Card
 * TODO: Replace with backend API response
 */
function PeriUrbanCard({ data }: PeriUrbanCardProps) {
  const hasAlert = data.alertStatus !== null;
  const hasExplanation = data.explanation !== null;

  return (
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
            hasAlert && data.alertStatus === "Detected"
              ? "text-periurban animate-pulse-subtle"
              : "text-muted-foreground"
          }`}>
            {formatValue(data.alertStatus)}
          </span>
        </div>

        {/* Growth Index */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Growth Index</span>
          <span className="data-value group-hover:text-periurban">
            {formatIndex(data.growthIndex)}
          </span>
        </div>

        {/* Explanation */}
        {hasExplanation && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-200 hover:text-foreground">
              {data.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Digital Exclusion Risk Card
 * TODO: Replace with backend API response
 */
function DigitalExclusionCard({ data }: DigitalExclusionCardProps) {
  const hasAadhaar = data.aadhaarCoverage !== null;
  const hasUsability = data.digitalUsability !== null;
  const hasRiskLevel = data.riskLevel !== null;

  const getRiskStyles = (level: string | null) => {
    if (level === "Low") return "bg-status-low/10 status-low";
    if (level === "Medium") return "bg-status-medium/10 status-medium";
    if (level === "High") return "bg-status-high/10 status-high";
    return "bg-muted text-muted-foreground";
  };

  return (
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
              {formatPercent(data.aadhaarCoverage)}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-migration rounded-full transition-all duration-500 ease-out"
              style={{ width: hasAadhaar ? `${data.aadhaarCoverage}%` : "0%" }}
            />
          </div>
        </div>

        {/* Digital Usability */}
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <span className="data-label group-hover:text-foreground">Digital Usability</span>
            <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-periurban">
              {formatPercent(data.digitalUsability)}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-periurban rounded-full transition-all duration-500 ease-out"
              style={{ width: hasUsability ? `${data.digitalUsability}%` : "0%" }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="data-label">Risk Level</span>
          <span className={`text-sm font-semibold px-2 py-0.5 rounded transition-transform duration-200 hover:scale-105 ${getRiskStyles(data.riskLevel)}`}>
            {formatValue(data.riskLevel)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function InsightsPanel({
  migrationData,
  periUrbanData,
  digitalExclusionData,
}: InsightsPanelProps) {
  return (
    <aside className="w-full h-full p-4 flex flex-col gap-4 overflow-y-auto bg-background">
      {/* TODO: Replace with backend API response */}
      <MigrationCard data={migrationData} />
      <PeriUrbanCard data={periUrbanData} />
      <DigitalExclusionCard data={digitalExclusionData} />
    </aside>
  );
}
