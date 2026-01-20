import { TrendingUp, TrendingDown, AlertTriangle, Shield, Users } from "lucide-react";
import {
  MigrationData,
  PeriUrbanData,
  DigitalExclusionData,
  formatValueWithLoading,
  formatPercentWithLoading,
  formatSignedPercentWithLoading,
  formatIndexWithLoading,
} from "@/mock/dashboardData";
import { useFilters } from "@/store/filters";
import { LOADING_MESSAGES } from "@/config/demoDefaults";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface MigrationCardProps {
  data: MigrationData;
  isLoading?: boolean;
  isError?: boolean;
  isEmphasized?: boolean;
  isFocused?: boolean;
}

interface PeriUrbanCardProps {
  data: PeriUrbanData;
  isLoading?: boolean;
  isError?: boolean;
  isEmphasized?: boolean;
  isFocused?: boolean;
}

interface DigitalExclusionCardProps {
  data: DigitalExclusionData;
  isLoading?: boolean;
  isError?: boolean;
  isEmphasized?: boolean;
  isFocused?: boolean;
}

export interface InsightsPanelProps {
  migrationData: MigrationData;
  periUrbanData: PeriUrbanData;
  digitalExclusionData: DigitalExclusionData;
  isLoading?: boolean;
  migrationLoading?: boolean;
  periUrbanLoading?: boolean;
  digitalRiskLoading?: boolean;
  migrationError?: boolean;
  periUrbanError?: boolean;
  digitalRiskError?: boolean;
}

// ============================================================
// LOADING & ERROR COMPONENTS
// ============================================================

function CardSkeleton({ title, icon: Icon }: { title: string; icon: typeof Users }) {
  return (
    <div className="insight-card">
      <div className="insight-card-header flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span>{title}</span>
      </div>
      <div className="space-y-3 pt-2">
        <p className="text-sm text-muted-foreground">{LOADING_MESSAGES.initial}</p>
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

function CardError({ title, icon: Icon }: { title: string; icon: typeof Users }) {
  return (
    <div className="insight-card">
      <div className="insight-card-header flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span>{title}</span>
      </div>
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">{LOADING_MESSAGES.error}</p>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

/**
 * Get card emphasis class based on layer state
 */
function getCardEmphasisClass(isEmphasized?: boolean, isFocused?: boolean): string {
  const base = "insight-card animate-fade-in-up transition-all duration-150";
  if (isFocused) return `${base} ring-2 ring-primary/50 shadow-md`;
  if (isEmphasized === false) return `${base} opacity-50`;
  if (isEmphasized === true) return `${base} ring-1 ring-primary/30`;
  return base;
}

/**
 * Migration Overview Card
 * Story flow: What → Where → Why it matters
 */
function MigrationCard({ data, isLoading, isError, isEmphasized, isFocused }: MigrationCardProps) {
  if (isLoading) {
    return <CardSkeleton title="Migration Pressure" icon={Users} />;
  }

  if (isError) {
    return <CardError title="Migration Pressure" icon={Users} />;
  }

  const hasTrend = data.trend !== null;
  const hasNetMigration = data.netMigrationPercent !== null;

  return (
    <div className={getCardEmphasisClass(isEmphasized, isFocused)} style={{ animationDelay: "0.1s" }}>
      <div className="insight-card-header flex items-center gap-2">
        <Users className="w-4 h-4 text-migration transition-transform duration-200 group-hover:scale-110" />
        <div className="flex flex-col">
          <span>Migration Pressure</span>
          <span className="text-[10px] font-normal text-muted-foreground">Population movement intensity</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* WHAT: Net Movement */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Net Movement</span>
          <div className="flex items-center gap-1">
            <span className={`data-value group-hover:text-migration ${isFocused ? "font-bold" : ""}`}>
              {formatSignedPercentWithLoading(data.netMigrationPercent, isLoading)}
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

        {/* WHERE: Top Source District */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Primary Source</span>
          <span className={`text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration ${isFocused ? "font-bold" : ""}`}>
            {formatValueWithLoading(data.topSourceDistrict, isLoading)}
          </span>
        </div>

        {/* Total Movement */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Total Volume</span>
          <span className={`text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration ${isFocused ? "font-bold" : ""}`}>
            {formatValueWithLoading(data.totalMovement, isLoading)}
          </span>
        </div>

        {/* WHY IT MATTERS: Policy relevance hint */}
        <div className="pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground leading-relaxed italic">
            High migration pressure often precedes infrastructure strain.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Peri-Urban Growth Alert Card
 * Story flow: What → Where → Why it matters
 */
function PeriUrbanCard({ data, isLoading, isError, isEmphasized, isFocused }: PeriUrbanCardProps) {
  if (isLoading) {
    return <CardSkeleton title="Peri-Urban Growth" icon={AlertTriangle} />;
  }

  if (isError) {
    return <CardError title="Peri-Urban Growth" icon={AlertTriangle} />;
  }

  const hasAlert = data.alertStatus !== null;
  const hasExplanation = data.explanation !== null;

  return (
    <div className={getCardEmphasisClass(isEmphasized, isFocused)} style={{ animationDelay: "0.2s" }}>
      <div className="insight-card-header flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-periurban" />
        <div className="flex flex-col">
          <span>Peri-Urban Growth</span>
          <span className="text-[10px] font-normal text-muted-foreground">Villages showing urban patterns</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* WHAT: Alert Status */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Pattern Status</span>
          <span className={`text-sm font-semibold transition-all duration-200 ${
            hasAlert && data.alertStatus === "Detected"
              ? "text-periurban animate-pulse-subtle"
              : "text-muted-foreground"
          } ${isFocused ? "font-bold" : ""}`}>
            {formatValueWithLoading(data.alertStatus, isLoading)}
          </span>
        </div>

        {/* WHERE: Growth Index */}
        <div className="flex items-center justify-between group">
          <span className="data-label group-hover:text-foreground">Growth Index</span>
          <span className={`data-value group-hover:text-periurban ${isFocused ? "font-bold" : ""}`}>
            {formatIndexWithLoading(data.growthIndex, isLoading)}
          </span>
        </div>

        {/* Explanation with policy relevance */}
        {hasExplanation ? (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-200 hover:text-foreground">
              {data.explanation}
            </p>
          </div>
        ) : (
          <div className="pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Peri-urban zones often require updated land-use planning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Digital Access Risk Card
 * Story flow: What → Where → Why it matters
 */
function DigitalExclusionCard({ data, isLoading, isError, isEmphasized, isFocused }: DigitalExclusionCardProps) {
  if (isLoading) {
    return <CardSkeleton title="Digital Access Risk" icon={Shield} />;
  }

  if (isError) {
    return <CardError title="Digital Access Risk" icon={Shield} />;
  }

  const hasAadhaar = data.aadhaarCoverage !== null;
  const hasUsability = data.digitalUsability !== null;

  const getRiskStyles = (level: string | null) => {
    if (level === "Low") return "bg-status-low/10 status-low";
    if (level === "Medium") return "bg-status-medium/10 status-medium";
    if (level === "High") return "bg-status-high/10 status-high";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className={getCardEmphasisClass(isEmphasized, isFocused)} style={{ animationDelay: "0.3s" }}>
      <div className="insight-card-header flex items-center gap-2">
        <Shield className="w-4 h-4 text-exclusion" />
        <div className="flex flex-col">
          <span>Digital Access Risk</span>
          <span className="text-[10px] font-normal text-muted-foreground">Service delivery gap indicators</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* WHAT: Identity Coverage */}
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <span className="data-label group-hover:text-foreground">Identity Coverage</span>
            <span className={`text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-migration ${isFocused ? "font-bold" : ""}`}>
              {formatPercentWithLoading(data.aadhaarCoverage, isLoading)}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-migration rounded-full transition-all duration-500 ease-out"
              style={{ width: hasAadhaar ? `${data.aadhaarCoverage}%` : "0%" }}
            />
          </div>
        </div>

        {/* WHERE: Digital Usability */}
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <span className="data-label group-hover:text-foreground">Service Usability</span>
            <span className={`text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-periurban ${isFocused ? "font-bold" : ""}`}>
              {formatPercentWithLoading(data.digitalUsability, isLoading)}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-periurban rounded-full transition-all duration-500 ease-out"
              style={{ width: hasUsability ? `${data.digitalUsability}%` : "0%" }}
            />
          </div>
        </div>

        {/* WHY IT MATTERS: Overall Risk */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="data-label">Overall Risk</span>
          <span className={`text-sm font-semibold px-2 py-0.5 rounded transition-transform duration-200 hover:scale-105 ${getRiskStyles(data.riskLevel)} ${isFocused ? "scale-105" : ""}`}>
            {formatValueWithLoading(data.riskLevel, isLoading)}
          </span>
        </div>

        {/* Policy relevance hint */}
        <div className="pt-1">
          <p className="text-[10px] text-muted-foreground leading-relaxed italic">
            Digital access gaps indicate service delivery challenges.
          </p>
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
  migrationLoading = false,
  periUrbanLoading = false,
  digitalRiskLoading = false,
  migrationError = false,
  periUrbanError = false,
  digitalRiskError = false,
}: InsightsPanelProps) {
  // Get global filter state for layer emphasis and focused district
  const { state } = useFilters();
  const { layers, focusedDistrict } = state;

  // Determine if each card should be emphasized based on active layers
  // Only de-emphasize if other layers are active and this one is not
  const anyLayerActive = layers.migration || layers.periUrban || layers.digitalRisk;
  
  const getMigrationEmphasis = () => {
    if (!anyLayerActive) return undefined; // No emphasis when no layers active
    return layers.migration;
  };

  const getPeriUrbanEmphasis = () => {
    if (!anyLayerActive) return undefined;
    return layers.periUrban;
  };

  const getDigitalRiskEmphasis = () => {
    if (!anyLayerActive) return undefined;
    return layers.digitalRisk;
  };

  // Determine if cards should be focused (when district is hovered on map)
  const hasFocus = focusedDistrict !== null;

  // Show walkthrough helper when migration layer is the only active layer (default state)
  const showWalkthroughHelper = layers.migration && !layers.periUrban && !layers.digitalRisk;

  return (
    <aside className="w-full h-full p-4 flex flex-col gap-4 overflow-y-auto bg-background">
      {/* Section Header */}
      <div className="border-b border-border pb-2">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">District Insights</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">Key patterns for the selected region</p>
      </div>

      {/* Walkthrough Helper - Only shown in default state */}
      {showWalkthroughHelper && (
        <div className="text-[11px] text-muted-foreground bg-primary/5 px-3 py-2 rounded-md border border-primary/10">
          <span className="font-medium text-primary/80">Start here:</span> Observe migration pressure in the selected district, then explore other layers.
        </div>
      )}

      <MigrationCard 
        data={migrationData} 
        isLoading={migrationLoading} 
        isError={migrationError}
        isEmphasized={getMigrationEmphasis()}
        isFocused={hasFocus && layers.migration}
      />
      <PeriUrbanCard 
        data={periUrbanData} 
        isLoading={periUrbanLoading} 
        isError={periUrbanError}
        isEmphasized={getPeriUrbanEmphasis()}
        isFocused={hasFocus && layers.periUrban}
      />
      <DigitalExclusionCard 
        data={digitalExclusionData} 
        isLoading={digitalRiskLoading} 
        isError={digitalRiskError}
        isEmphasized={getDigitalRiskEmphasis()}
        isFocused={hasFocus && layers.digitalRisk}
      />
    </aside>
  );
}
