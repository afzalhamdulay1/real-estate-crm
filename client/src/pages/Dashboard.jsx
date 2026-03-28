import React from 'react';
import { 
  Users, 
  Building2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  DollarSign
} from 'lucide-react';

const StatCard = ({ label, value, change, icon: Icon, color, isPositive }) => (
  <div className="glass-card p-6 flex items-center justify-between group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden h-32">
    {/* Background Decorative Element */}
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform ${color}`} />
    
    <div className="flex flex-col gap-2 relative z-10">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      <div className={`flex items-center gap-1.5 text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>

    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-xl transition-all group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] ${color} relative z-10`}>
      <Icon className="text-white w-7 h-7" />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-4xl font-extrabold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground font-medium">Real-time business intelligence for your real estate operations.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Leads" 
          value="1,284" 
          change="+12.5% this month" 
          icon={Users} 
          color="bg-primary shadow-primary/20" 
          isPositive={true} 
        />
        <StatCard 
          label="Active Listings" 
          value="452" 
          change="+4.2% since last week" 
          icon={Building2} 
          color="bg-indigo-600 shadow-indigo-500/20" 
          isPositive={true} 
        />
        <StatCard 
          label="Closing Rate" 
          value="24.8%" 
          change="-1.2% this quarter" 
          icon={TrendingUp} 
          color="bg-emerald-600 shadow-emerald-500/20" 
          isPositive={false} 
        />
        <StatCard 
          label="Estimated Revenue" 
          value="$12.4M" 
          change="+18.3% projected" 
          icon={DollarSign} 
          color="bg-amber-600 shadow-amber-500/20" 
          isPositive={true} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Analytics Chart Area */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card p-8 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Revenue Growth</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Historical performance metrics</p>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:bg-white/10 transition-colors">
                <option>Last 12 Months</option>
                <option>Last 30 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div className="flex-1 bg-white/[0.02] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center group">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Activity className="text-primary w-8 h-8 animate-pulse" />
               </div>
               <p className="text-muted-foreground font-semibold">Interactive Data Visualizations</p>
               <p className="text-xs text-muted-foreground/60 mt-1">Ready for Recharts integration</p>
            </div>
          </div>

          <div className="glass-card p-8 min-h-[300px]">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   <Clock className="w-5 h-5 text-primary" /> Recent Activities
                </h3>
                <button className="text-xs font-bold text-primary hover:underline">View All</button>
             </div>
             <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      A{i}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate leading-tight">Agent {i} contacted Lead #{342 + i}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Property Insight • 4 mins ago</p>
                   </div>
                   <span className="text-[10px] font-bold py-1 px-3 bg-white/5 rounded-full border border-white/5">Details</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar/Right Column */}
        <div className="space-y-8">
           <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                 <Building2 className="text-white w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold mt-6">Top Property Module</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed px-4">
                 Our highest performing listing this week with 12 new serious leads.
              </p>
              <button className="mt-8 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10 active:scale-[0.98]">
                 Analyze Luxury Villa
              </button>
           </div>

           <div className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6">Market Trends</h3>
              <div className="space-y-6">
                 {[
                    { label: 'Demand', value: 85, color: 'bg-primary' },
                    { label: 'Availability', value: 34, color: 'bg-indigo-500' },
                    { label: 'Pricing', value: 92, color: 'bg-emerald-500' }
                 ].map((trend) => (
                    <div key={trend.label} className="space-y-2">
                       <div className="flex justify-between items-center px-1">
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{trend.label}</span>
                          <span className="text-xs font-black text-white">{trend.value}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <div className={`h-full ${trend.color} rounded-full transition-all duration-1000`} style={{ width: `${trend.value}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
