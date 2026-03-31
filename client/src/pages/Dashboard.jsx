import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../features/dashboard/dashboardSlice';
import {
  Users,
  Building2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Loader2,
  Calendar,
  ChevronRight,
  Info,
  PieChart as PieIcon,
  Filter,
  Zap,
  Package
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatCard = ({ label, value, change, icon: Icon, color, isPositive, isLoading }) => (
  <div className="glass-card p-6 flex items-center justify-between group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden h-32">
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform ${color}`} />
    <div className="flex flex-col gap-2 relative z-10 w-full">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
      {isLoading ? <div className="h-9 w-24 bg-white/5 animate-pulse rounded-lg mt-1" /> : <h3 className="text-3xl font-black tracking-tighter text-white">{value}</h3>}
      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-xl transition-all group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] ${color} relative z-10 shrink-0`}><Icon className="text-white w-7 h-7" /></div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f0f]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
        {payload.map((pld, index) => (
          <p key={index} className="text-sm font-black italic" style={{ color: pld.color || pld.fill }}>
            {pld.name}: {typeof pld.value === 'number' && pld.name.toLowerCase().includes('revenue') ? `$${pld.value.toLocaleString()}` : pld.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    stats = {},
    recentActivities = [],
    topProperty,
    trajectoryData = [],
    inventoryTrajectory = [],
    leadStatusData = [],
    propertyTypeData = [],
    isLoading
  } = useSelector((state) => state.dashboard || {});

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const formatActivityText = (log) => {
    const userName = `${log.user?.firstName || 'Agent'} ${log.user?.lastName || ''}`;
    switch (log.action) {
      case 'CREATE': return `${userName} initialized a new ${log.module.toLowerCase()}`;
      case 'UPDATE': return `${userName} recalibrated ${log.module.toLowerCase()} details`;
      case 'DELETE': return `${userName} archived a ${log.module.toLowerCase()} record`;
      default: return `${userName} performed an action on ${log.module}`;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-4xl font-black tracking-tight text-white italic">Executive <span className="text-primary not-italic">Dashboard</span></h1>
        <p className="text-muted-foreground font-medium text-sm tracking-wide">Advanced CRM Intelligence Hub • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Pipeline Volume" value={stats?.totalLeads || '0'} change="Total active leads" icon={Users} color="bg-primary shadow-primary/20" isPositive={true} isLoading={isLoading && !stats?.totalLeads} />
        <StatCard label="Market Inventory" value={stats?.activeProperties || '0'} change="Available listings" icon={Building2} color="bg-indigo-600 shadow-indigo-500/20" isPositive={true} isLoading={isLoading && !stats?.activeProperties} />
        <StatCard label="Closing Efficiency" value={stats?.closingRate || '0%'} change="Conversion success" icon={TrendingUp} color="bg-emerald-600 shadow-emerald-500/20" isPositive={parseFloat(stats?.closingRate) > 10} isLoading={isLoading && !stats?.closingRate} />
        <StatCard label="Gross Revenue" value={stats?.totalRevenue || '$0'} change="Closed deal value" icon={DollarSign} color="bg-amber-600 shadow-amber-500/20" isPositive={true} isLoading={isLoading && !stats?.totalRevenue} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Revenue Performance Trajectory */}
          <div className="glass-card p-10 flex flex-col h-[550px] relative overflow-hidden group/chart">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover/chart:bg-primary/10" />
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl font-black tracking-tight text-white italic">Revenue <span className="text-primary not-italic">Trajectory</span></h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">6-Month Growth Velocity</p>
              </div>
              <div className="flex items-center gap-3"><div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-time</div></div>
            </div>
            <div className="flex-1 min-h-[450px] w-full mt-4">
              {isLoading && trajectoryData.length === 0 ? <div className="h-full w-full flex flex-col items-center justify-center opacity-20"><Loader2 className="w-10 h-10 animate-spin" /></div> : (
                <ResponsiveContainer width="100%" height={400} minWidth={0}>
                  <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Lead Revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* New Trends Row: Operational Velocity & Inventory Movement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Operational Velocity Area Chart */}
            <div className="glass-card p-10 h-full flex flex-col relative group/velocity overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -mr-16 -mt-16 group-hover/velocity:bg-primary/10 transition-all" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                    Operational <span className="text-primary not-italic">Velocity</span>
                    <div className="relative group/tooltip inline-block">
                      <Info className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-primary transition-colors cursor-help" />
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-48 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl">
                        <p className="text-[10px] font-bold text-white leading-relaxed">Tracks the efficiency gap between new lead intake and actual closed deals.</p>
                      </div>
                    </div>
                  </h3>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Captured vs Closed Leads</p>
                </div>
                <Zap className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="flex-1 min-h-0 w-full relative z-10">
                {isLoading && trajectoryData.length === 0 ? <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-10" /></div> : (
                  <ResponsiveContainer width="100%" height={300} minWidth={0}>
                    <AreaChart data={trajectoryData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                        <linearGradient id="colorClo" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 8 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">{value}</span>} />
                      <Area type="monotone" dataKey="captured" name="Captured" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCap)" />
                      <Area type="monotone" dataKey="closed" name="Closed" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorClo)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Inventory Movement Area Chart */}
            <div className="glass-card p-10 h-full flex flex-col relative group/inv overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] -mr-16 -mt-16 group-hover/inv:bg-emerald-500/10 transition-all" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                    Inventory <span className="text-emerald-500 not-italic">Movement</span>
                    <div className="relative group/tooltip inline-block">
                      <Info className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-primary transition-colors cursor-help" />
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-48 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl">
                        <p className="text-[10px] font-bold text-white leading-relaxed">Compares new listing volume against successful sales and rentals (conversions).</p>
                      </div>
                    </div>
                  </h3>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">New listings vs Conversions</p>
                </div>
                <Package className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex-1 min-h-0 w-full relative z-10">
                {isLoading && inventoryTrajectory.length === 0 ? <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-10" /></div> : (
                  <ResponsiveContainer width="100%" height={300} minWidth={0}>
                    <AreaChart data={inventoryTrajectory} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAdd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                        <linearGradient id="colorMov" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 8 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">{value}</span>} />
                      <Area type="monotone" dataKey="added" name="New Listings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdd)" />
                      <Area type="monotone" dataKey="moved" name="Conversions" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorMov)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-10 h-[450px] flex flex-col relative group/pie overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex flex-col gap-1.5"><h3 className="text-xl font-black text-white italic">Pipeline Status</h3><p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Lead Distribution</p></div>
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-h-0 w-full relative z-10 pb-4">
                {isLoading && leadStatusData.length === 0 ? <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-10" /></div> : (
                  <ResponsiveContainer width="100%" height={300} minWidth={0}>
                    <PieChart>
                      <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">{leadStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" align="center" iconType="circle" formatter={(value) => <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="glass-card p-10 h-[450px] flex flex-col relative group/donut overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-600/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex flex-col gap-1.5"><h3 className="text-xl font-black text-white italic">Portfolio Asset Mix</h3><p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Inventory Segmentation</p></div>
                <PieIcon className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex-1 min-h-0 w-full relative z-10 pb-4">
                {isLoading && propertyTypeData.length === 0 ? <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-10" /></div> : (
                  <ResponsiveContainer width="100%" height={300} minWidth={0}>
                    <PieChart>
                      <Pie data={propertyTypeData} cx="50%" cy="50%" innerRadius={0} outerRadius={85} paddingAngle={0} dataKey="value" stroke="none">{propertyTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />))}</Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" align="center" iconType="rect" formatter={(value) => <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-10 min-h-[400px]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col gap-1.5"><h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-3"><Clock className="w-6 h-6 text-primary" /> Live Audit Stream</h3><p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Latest system-wide interactions</p></div>
              <Link to="/audit-logs" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-all bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">Full History <ChevronRight className="w-3 h-3" /></Link>
            </div>
            {isLoading && recentActivities.length === 0 ? <div className="flex flex-col items-center justify-center py-10 space-y-4"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" /><p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Synchronizing stream...</p></div> : (
              <div className="space-y-4">
                {recentActivities?.map((log, idx) => (
                  <div key={log._id || idx} className="flex items-center gap-6 p-5 rounded-[1.5rem] bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-white/5 hover:border-white/10 group animate-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-xs text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">{log.user ? `${log.user.firstName?.[0] || ''}${log.user.lastName?.[0] || log.user.firstName?.[1] || 'A'}`.toUpperCase() : 'ST'}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform duration-300">{formatActivityText(log)}</p><div className="flex items-center gap-3 mt-1.5 opacity-60"><span className="text-[9px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10">{log.module}</span><span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div></div>
                    <Link to={log.module === 'LEAD' ? `/leads/${log.documentId}` : log.module === 'PROPERTY' ? '/properties' : '#'} className="text-[9px] font-black uppercase tracking-widest py-2 px-4 bg-white/5 rounded-xl border border-white/5 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">Trace</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden group/top">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-2xl relative z-10 rotate-6 group-hover:rotate-0 transition-all duration-700"><Building2 className="text-white w-12 h-12" /></div>
            <div className="mt-8 relative z-10 space-y-2"><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Asset</h4><h3 className="text-2xl font-black text-white tracking-tight leading-none px-4">{topProperty ? topProperty.title : 'Luxury Portfolio'}</h3><p className="text-xs text-muted-foreground mt-4 leading-relaxed font-semibold px-6">{topProperty ? `Our highest performing ${topProperty.type.toLowerCase()} in ${topProperty.location?.city || 'the area'}.` : 'Aggregating highest performing listings.'}</p></div>
            {topProperty && <Link to={`/properties?search=${topProperty.title}`} className="mt-10 w-full bg-white/5 hover:bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all border border-white/5">Analyze Property Detail</Link>}
          </div>

          <div className="glass-card p-10 relative overflow-hidden">
            <div className="flex flex-col gap-1.5 mb-10"><h3 className="text-xl font-black text-white tracking-tight text-primary italic">Market Pulse</h3><p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Real-time Engagement Monitor</p></div>
            <div className="space-y-8 relative z-10">
              {[
                { label: 'Listing Velocity', value: stats?.listingVelocity || 0, color: 'bg-indigo-500', hint: 'Ratio of Sold/Rented properties to total inventory.' },
                { label: 'Closing Probability', value: stats?.closingProbability || 0, color: 'bg-emerald-500', hint: 'Lead-to-Close conversion rate based on historical data.' }
              ].map((trend) => (
                <div key={trend.label} className="space-y-3 group/indicator relative">
                  <div className="flex justify-between items-center px-1"><div className="flex items-center gap-2"><span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{trend.label}</span><div className="relative group/tooltip"><Info className="w-3 h-3 text-muted-foreground/30 hover:text-primary transition-colors cursor-help" /><div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-48 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl"><p className="text-[10px] font-bold text-white leading-relaxed">{trend.hint}</p></div></div></div><span className="text-xs font-black text-white">{trend.value}%</span></div>
                  <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]"><div className={`h-full ${trend.color} rounded-full transition-all duration-[2000ms] shadow-[0_0_10px_rgba(var(--primary),0.5)]`} style={{ width: `${trend.value}%` }} /></div>
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
