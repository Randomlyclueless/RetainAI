import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  LogOut
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

const API_BASE = 'http://localhost:5000';

const Dashboard = () => {
  const { token, logout, user } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get(`${API_BASE}/model-health`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setHealth(res.data);
      } catch (err) {
        console.error("Failed to fetch health", err);
      }
    };
    fetchHealth();
  }, [token]);

  const chartData = [
    { name: 'Mon', churn: 42, active: 400 },
    { name: 'Tue', churn: 38, active: 420 },
    { name: 'Wed', churn: 55, active: 390 },
    { name: 'Thu', churn: 24, active: 450 },
    { name: 'Fri', churn: 31, active: 460 },
    { name: 'Sat', churn: 12, active: 480 },
    { name: 'Sun', churn: 15, active: 490 },
  ];

  const MetricCard = ({ icon: Icon, label, value, trend, trendUp }) => (
    <div className="glass-card">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gold">
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald' : 'text-danger'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif mb-1 text-white">Executive Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Executive'}. Monitoring active prediction streams.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:text-danger hover:border-danger/30 transition-all text-sm">
            <LogOut size={16} /> Logout
          </button>
          <button className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/5 transition-colors text-sm text-gray-400">
            <Filter size={16} /> Filter Window
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-bold text-sm hover:scale-105 transition-transform">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Average Risk" value="42.8%" trend="4.2%" trendUp={false} icon={AlertTriangle} />
        <MetricCard label="Active Users" value="18,482" trend="12%" trendUp icon={Users} />
        <MetricCard label="Model AUC" value={health?.auc || '0.89'} trend="0.01" trendUp icon={TrendingUp} />
        <MetricCard label="Daily Queries" value={health?.predictions_today || '482'} trend="18%" trendUp icon={Zap} />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card h-[450px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Churn Risk Trends</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 bg-gold rounded-full"></div> High Risk
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 bg-white/10 rounded-full"></div> Control
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Area type="monotone" dataKey="churn" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorChurn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card flex flex-col">
          <h3 className="text-xl font-bold mb-8 text-white">Model Health Status</h3>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Production Version</span>
                <span className="font-mono text-gold">{health?.model_version || 'v2.1-Baseline'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Data Drift Status</span>
                <span className={`font-bold transition-colors ${health?.drift_status ? 'text-danger' : 'text-emerald'}`}>
                  {health?.drift_status ? 'DRIFT DETECTED' : 'STABLE'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Loaded</span>
                <span className="text-gray-300">{health?.last_retrain || '12h ago'}</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Deployment Confidence</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald bg-emerald/10">
                      High Reliability
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-emerald">
                      98.2%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/5">
                  <div style={{ width: "98.2%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald"></div>
                </div>
              </div>
            </div>

            <div className="mt-auto glass-panel p-4 bg-gold/5 border-gold/20">
              <div className="flex items-start gap-3">
                <Zap size={18} className="text-gold mt-1" />
                <p className="text-xs leading-relaxed text-gray-300">
                  <span className="font-bold text-gold">Pro-Tip:</span> High tenure users are showing increased sensitivity to pricing changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;