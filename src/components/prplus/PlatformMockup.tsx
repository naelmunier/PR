"use client";

export function PlatformMockup() {
  return (
    <div className="w-full h-full flex bg-[#fafafa] text-[#0a0a0f] overflow-hidden font-sans text-xs select-none">

      {/* Sidebar */}
      <div className="w-44 shrink-0 bg-white border-r border-[#f0e8e8] flex flex-col py-3 gap-0.5 px-2">
        <div className="px-2 py-2 mb-2">
          <img src="/brand/logo-pr-plus.png" alt="PR+" className="h-6 w-auto object-contain" />
        </div>
        {[
          { label: "Tableau de bord", active: true },
          { label: "Mes dossiers",    active: false },
          { label: "Devis",           active: false },
          { label: "Messagerie",      badge: 3, active: false },
          { label: "Mes tarifs",      active: false },
          { label: "Analytiques",     active: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-md ${
              item.active
                ? "bg-[#fff1f2] text-[#e30613] font-semibold"
                : "text-[#6b7280]"
            }`}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span className="text-[9px] font-bold bg-[#e30613] text-white rounded-full w-4 h-4 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-10 bg-white border-b border-[#f0e8e8] flex items-center justify-between px-4 shrink-0">
          <span className="font-bold text-[#0a0a0f]">Tableau de bord</span>
          <div className="w-5 h-5 rounded-full bg-[#fff1f2] flex items-center justify-center text-[9px] font-bold text-[#e30613]">ME</div>
        </div>

        <div className="flex-1 overflow-hidden p-3 flex flex-col gap-2.5">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Dossiers actifs",  val: "47", red: true },
              { label: "En préparation",   val: "12", red: false },
              { label: "Expédiés ce mois", val: "28", red: false },
            ].map((k) => (
              <div key={k.label} className="bg-white border border-[#f0e8e8] rounded-xl p-2.5">
                <div className="text-[9px] text-[#9ca3af] uppercase tracking-wide mb-1">{k.label}</div>
                <div className={`text-xl font-black tracking-tight ${k.red ? "text-[#e30613]" : "text-[#0a0a0f]"}`}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* Chart + dossiers */}
          <div className="flex gap-2 flex-1 min-h-0">
            <div className="bg-white border border-[#f0e8e8] rounded-xl p-2.5 w-40 shrink-0 flex flex-col">
              <div className="text-[9px] text-[#9ca3af] uppercase tracking-wide mb-2">Volume mensuel</div>
              <div className="flex-1 flex items-end gap-1">
                {[40, 28, 68, 50, 85, 38, 62, 48, 72, 55].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-sm ${i % 2 === 0 ? "bg-[#e30613]/70" : "bg-[#fecaca]"}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#f0e8e8] rounded-xl p-2.5 flex-1 flex flex-col">
              <div className="text-[9px] text-[#9ca3af] uppercase tracking-wide mb-2">Dossiers récents</div>
              <div className="flex flex-col gap-1.5">
                {[
                  { ref: "PR-2606-MED-047", desc: "Conteneur 40HC · Dépotage",    badge: "En stock",   color: "bg-green-100 text-green-700" },
                  { ref: "PR-2606-MED-044", desc: "Palettisation × 24",           badge: "Préparation", color: "bg-yellow-100 text-yellow-700" },
                  { ref: "PR-2606-MED-041", desc: "Cross docking Sandouville",    badge: "Transit",    color: "bg-blue-100 text-blue-700" },
                  { ref: "PR-2606-MED-038", desc: "Contrôle qualité × 180",       badge: "Livré",      color: "bg-gray-100 text-gray-600" },
                ].map((d) => (
                  <div key={d.ref} className="flex items-center justify-between py-1 px-1.5 rounded-lg">
                    <div>
                      <div className="font-semibold text-[10px] text-[#0a0a0f]">{d.ref}</div>
                      <div className="text-[9px] text-[#9ca3af]">{d.desc}</div>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${d.color}`}>{d.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex gap-2 shrink-0">
            <div className="bg-white border border-[#f0e8e8] rounded-xl p-2.5 flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-[#9ca3af] uppercase tracking-wide">Messages</span>
                <span className="text-[8px] font-bold bg-[#e30613] text-white rounded-full px-1.5 py-0.5">3 non lus</span>
              </div>
              <div className="text-[10px] text-[#374151] font-medium">Équipe PR Logistics</div>
              <div className="text-[9px] text-[#9ca3af]">Votre dossier PR-2606-044 est...</div>
            </div>
            <div className="bg-[#fff1f2] border border-[#fecaca] rounded-xl p-2.5 flex-1">
              <div className="text-[9px] text-[#e30613] uppercase tracking-wide mb-1.5 font-semibold">Devis en attente</div>
              <div className="text-[10px] text-[#0a0a0f] font-medium">Palettisation + Filmage</div>
              <div className="text-[9px] text-[#9ca3af]">À valider · 2 400 €</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
