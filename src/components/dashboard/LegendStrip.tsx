export function LegendStrip() {
  return (
    <footer className="h-12 px-6 bg-card border-t border-border flex items-center justify-between animate-fade-in">
      {/* Legend Items */}
      <div className="flex items-center gap-6">
        {/* Migration Legend */}
        <div className="flex items-center gap-2 group cursor-default transition-transform duration-200 hover:scale-105">
          <span className="legend-dot-migration transition-transform duration-200 group-hover:scale-125" />
          <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            Migration
          </span>
        </div>

        {/* Peri-Urban Legend */}
        <div className="flex items-center gap-2 group cursor-default transition-transform duration-200 hover:scale-105">
          <span className="legend-dot-periurban transition-transform duration-200 group-hover:scale-125" />
          <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            Peri-Urban Zones
          </span>
        </div>

        {/* Digital Exclusion Legend */}
        <div className="flex items-center gap-2 group cursor-default transition-transform duration-200 hover:scale-105">
          <span className="legend-dot-exclusion transition-transform duration-200 group-hover:scale-125" />
          <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            Digital Exclusion
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground">
        Insights are derived from anonymized, aggregated identity metadata.
      </p>
    </footer>
  );
}
