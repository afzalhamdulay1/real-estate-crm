import React from 'react';
import { 
  Home, 
  Users, 
  Building2, 
  Clock, 
  ShieldCheck, 
  Trophy, 
  Target, 
  ArrowRight,
  Sparkles,
  History,
  LayoutGrid
} from 'lucide-react';

const Guide = () => {
  const sections = [
    {
      title: "Main Dashboard",
      icon: LayoutGrid,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Get a high-level view of your entire sales machine. Monitor key metrics and catch up on the most recent administrative changes.",
      steps: ["Monitor total lead volume", "Check available inventory count", "Review the latest audit activities"]
    },
    {
      title: "Leads Mastery",
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Manage your client pipeline with high precision. Move leads through the lifecycle and dive deep into their individual profiles.",
      steps: ["Add new property seekers", "Execute in-line profile edits", "Link clients to target assets"]
    },
    {
      title: "Property Inventory",
      icon: Building2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "Maintain a clinical record of your available units. From flats and villas to plots, track every asset's unique status.",
      steps: ["Categorize assets by type", "Monitor 'Available' vs 'Sold'", "Search inventory by title or city"]
    },
    {
      title: "Activities Timeline",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Log every interaction. From phone calls to site visits, keep a chronological record of how you're moving deals forward.",
      steps: ["Filter logs by type/date", "Track agent follow-ups", "Maintain historical touchpoints"]
    },
    {
      title: "User Directory",
      icon: ShieldCheck,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      description: "Admin workspace for team management. Control access levels and oversee the agents responsible for your leads.",
      steps: ["Manage agent credentials", "Assign administrative roles", "Oversee staff participation"]
    },
    {
      title: "Live Audit Logs",
      icon: History,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      description: "Complete transparency. Track every single data change, profile update, and deal closure across the platform.",
      steps: ["Track 'Who changed What'", "Filter logs by action type", "Audit finalized sales data"]
    }
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-10 space-y-12 max-w-[1400px] mx-auto bg-[#0a0a0a]">
      {/* Header Section */}
      <header className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary uppercase tracking-widest">
           <Sparkles className="w-4 h-4" /> Platform Mastery Guide
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white leading-tight">Master your real estate <span className="text-primary italic">workstream.</span></h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to the next generation of property management. This guide will walk you through the core features designed to accelerate your closure rate and secure your inventory.
        </p>
      </header>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="group relative bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all duration-500 overflow-hidden shadow-2xl">
             {/* Abstract Background Glow */}
             <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[100px] opacity-20 transition-all duration-700 group-hover:scale-150 ${section.bg}`} />
             
             <div className="relative z-10 space-y-6">
                <div className={`w-14 h-14 rounded-2xl ${section.bg} flex items-center justify-center border border-white/5 shadow-xl`}>
                   <section.icon className={`w-7 h-7 ${section.color}`} />
                </div>
                
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-white tracking-tight">{section.title}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed font-medium">{section.description}</p>
                </div>

                <ul className="space-y-3 pt-2">
                   {section.steps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-3 text-xs font-bold text-white/40 group-hover:text-white/70 transition-colors">
                         <div className={`w-1 h-1 rounded-full ${section.color}`} />
                         {step}
                      </li>
                   ))}
                </ul>
             </div>
          </div>
        ))}
        

      </div>

      {/* Bottom Footer Info */}
      <div className="pb-12" />
    </div>
  );
};

export default Guide;
