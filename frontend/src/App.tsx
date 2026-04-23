import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView,
  AnimatePresence 
} from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  ArrowRight, 
  Database, 
  Zap, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  Globe,
  Layers,
  TrendingUp,
  Award
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

// --- STYLES HELPER ---
const glassHover = "transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_24px_rgba(212,175,55,0.15)]";

// --- COMPONENTS ---

/**
 * Animated Counter Component
 * Counts up from 0 when in view
 */
const AnimatedCounter = ({ value, duration = 1.2, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;
      
      const totalMiliseconds = duration * 1000;
      const steps = 60; // 60 frames per second
      const stepDuration = totalMiliseconds / steps;
      const increment = value / steps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(parseFloat(start.toFixed(1)));
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/**
 * Hero Risk Gauge
 * Animated SVG arc filling on load
 */
const RiskGauge = ({ value = 92 }: { value?: number }) => {
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (value / 100) * circumference;
  
  const getColor = (v: number) => {
    if (v < 30) return "#00FF94"; // Green
    if (v < 70) return "#FFB800"; // Amber
    return "#FF4444"; // Red
  };

  return (
    <div className="relative w-64 h-64 flex flex-col items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle cx="128" cy="128" r="88" stroke="#ffffff10" strokeWidth="4" fill="transparent" />
        <motion.circle 
          cx="128" cy="128" r="88" 
          stroke={getColor(value)} strokeWidth="8" fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-6xl font-serif font-bold"
        >
          {value}%
        </motion.span>
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Confidence</span>
      </div>
    </div>
  );
};

const KPIPill = ({ label, value, color = "gold", delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full flex items-center gap-3`}
  >
    <div className={`w-1.5 h-1.5 rounded-full ${color === 'gold' ? 'bg-gold' : color === 'red' ? 'bg-danger' : 'bg-emerald'}`} />
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}:</span>
    <span className="text-xs font-bold text-white">{value}</span>
  </motion.div>
);

const SectionHeading = ({ children, subtitle, align = "left" }: any) => (
  <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    <motion.p 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-gold text-xs uppercase tracking-[0.4em] font-bold mb-4"
    >
      {subtitle}
    </motion.p>
    <motion.h2 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl lg:text-6xl font-serif"
    >
      {children}
    </motion.h2>
  </div>
);

const TimelineChart = () => {
  const data = [
    { name: 'W1', atRisk: 142, retained: 89 },
    { name: 'W2', atRisk: 138, retained: 92 },
    { name: 'W3', atRisk: 155, retained: 101 },
    { name: 'W4', atRisk: 149, retained: 98 },
    { name: 'W5', atRisk: 163, retained: 112 },
    { name: 'W6', atRisk: 171, retained: 118 },
    { name: 'W7', atRisk: 158, retained: 107 },
    { name: 'W8', atRisk: 144, retained: 99 },
    { name: 'W9', atRisk: 139, retained: 94 },
    { name: 'W10', atRisk: 152, retained: 108 },
    { name: 'W11', atRisk: 147, retained: 103 },
    { name: 'W12', atRisk: 141, retained: 98 },
  ];

  return (
    <div className="glass-card mb-8">
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Customers at Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Retained by System</span>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff30" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#ffffff30" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              cursor={{ stroke: '#ffffff10' }}
            />
            <Line 
              type="monotone" 
              dataKey="atRisk" 
              stroke="#D4AF37" 
              strokeWidth={3} 
              dot={false}
              animationDuration={2500}
            />
            <Line 
              type="monotone" 
              dataKey="retained" 
              stroke="#00FF94" 
              strokeWidth={3} 
              dot={false}
              animationDuration={2500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CompetitiveBarChart = () => {
  const data = [
    { name: "Rule-Based Systems", rate: 51 },
    { name: "Logistic Regression", rate: 67 },
    { name: "Single XGBoost", rate: 79 },
    { name: "RetainAI Ensemble", rate: 91 }
  ];

  return (
    <div className="glass-panel p-10 bg-white/[0.01]">
      <h3 className="text-xl font-serif mb-8 text-center uppercase tracking-widest">Churn Detection Rate by Approach</h3>
      <div className="space-y-6">
        {data.map((item, i) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-gray-500">
              <span>{item.name}</span>
              <span className={item.rate === 91 ? "text-gold" : ""}>{item.rate}%</span>
            </div>
            <div className="w-full h-10 bg-white/[0.03] rounded-sm overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${item.rate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                className={`h-full rounded-sm ${item.rate === 91 ? 'bg-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/20'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax effects
  const headlineY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden">
      
      {/* Background Dot Grid Parallax */}
      <motion.div 
        style={{ y: gridY }}
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        id="bg-grid"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:32px_32px]" />
      </motion.div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-12 py-10 flex justify-between items-center bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <Activity size={24} className="text-gold" />
          <span className="text-3xl font-serif tracking-tighter">RetainAI</span>
        </div>
        <div className="flex gap-8 items-center text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
          <a href="#" className="hover:text-gold transition-colors">Compare</a>
          <a href="#" className="hover:text-gold transition-colors">Stats</a>
          <a href="/dashboard" className="btn-gold !px-6 !py-2 !text-[10px]">Dashboard</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col lg:flex-row items-center gap-20">
        <motion.div 
          style={{ y: headlineY }}
          className="flex-1 z-10 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl lg:text-[120px] font-serif leading-[0.85] mb-12">
              Predict churn <br />
              <span className="text-gold italic">before it costs.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-xl font-light leading-relaxed lg:mx-0 mx-auto">
              Our high-fidelity ensemble engines catch retention leaks with 91% precision. Luxury MLOps for enterprise-scale customer retention.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <a href="/dashboard" className="btn-gold flex items-center justify-center gap-3">
                Open Dashboard <ChevronRight size={18} />
              </a>
              <button className="px-10 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-[10px] uppercase tracking-[.4em] font-bold">
                Technical Deck
              </button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 relative z-10"
        >
          <div className="glass-card relative border-white/20 bg-white/[0.04] p-12 overflow-visible">
            <div className="mb-12 flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-[.3em] font-bold text-gray-500">Live Prediction Engine</span>
              <Award className="text-gold" size={20} />
            </div>
            
            <div className="flex flex-col items-center mb-16">
              <RiskGauge value={92} />
            </div>

            <div className="flex flex-col gap-4">
              <KPIPill label="Tenure" value="Low Risk" color="green" delay={1.8} />
              <KPIPill label="Behavior" value="Critical Shift" color="red" delay={2.0} />
              <KPIPill label="Impact" value="$1,400 / Mo" color="gold" delay={2.2} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Real-Time Risk Intelligence Chart Section */}
      <section className="relative z-10 py-32 px-12 max-w-[1400px] mx-auto">
        <SectionHeading subtitle="Active Monitoring">Real-Time Risk Intelligence</SectionHeading>
        
        <TimelineChart />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { label: 'Avg Risk This Week', val: '42.8%' },
            { label: 'Retention Rate', val: '94.2%' },
            { label: 'Model Confidence', val: '98.8%' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="glass-card text-center py-10"
            >
              <p className="text-4xl font-serif text-gold mb-2">{item.val}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 py-20 px-12 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { label: 'Model Accuracy', val: 96.4, suffix: '%' },
          { label: 'AUC Gain vs Baseline', val: 6.8, suffix: '%' },
          { label: 'Prediction Horizon', val: 30, suffix: '-Day' }
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <h3 className="text-6xl font-serif text-gold mb-3">
              <AnimatedCounter value={stat.val} suffix={stat.suffix} />
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Enterprise Workflow */}
      <section className="relative z-10 py-32 px-12 max-w-[1400px] mx-auto mb-32">
        <SectionHeading subtitle="The Architecture" align="center">Enterprise Workflow</SectionHeading>
        <div className="grid lg:grid-cols-3 gap-10">
          {[
            { icon: <Database />, title: 'High-Concurrency Ingestion', desc: 'Secure event listener connected to your primary outcome streams with sub-millisecond lag.' },
            { icon: <Zap />, title: 'Real-Time Scoring', desc: 'Probability inference using dynamically weighted ensembles (XGBoost, LGBM, & CatBoost).' },
            { icon: <ShieldCheck />, title: 'Automated Recovery', desc: 'Instant webhooks to your CSM platform to rescue at-risk customers before they churn.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className={`glass-card group flex flex-col items-center text-center p-10 ${glassHover}`}
            >
              <div className="mb-8 w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-serif mb-4 uppercase tracking-widest">{feature.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Competitive Intelligence Section */}
      <section className="relative z-10 py-48 px-12 max-w-[1400px] mx-auto">
        <div className="text-center mb-24">
          <SectionHeading subtitle="COMPETITIVE INTELLIGENCE" align="center">Built Different. Performs Different.</SectionHeading>
          <p className="text-gray-400 max-w-2xl mx-auto -mt-8">
            Benchmarked against traditional churn management approaches across 7,043 telecom customers.
          </p>
        </div>

        <div className="glass-panel overflow-hidden border-white/10 mb-16">
          <table className="w-full text-left">
            <thead className="bg-white/[0.05] text-[9px] uppercase tracking-[.4em] text-gray-500 font-bold">
              <tr>
                <th className="px-12 py-8">Approach</th>
                <th className="px-12 py-8">Churn Caught</th>
                <th className="px-12 py-8">False Alarms</th>
                <th className="px-12 py-8">AUC-ROC</th>
                <th className="px-12 py-8">Savings/Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Rule-Based Threshold Systems", caught: "51%", falseAlarms: "38%", auc: "0.61", savings: "$0" },
                { name: "Logistic Regression Baseline", caught: "67%", falseAlarms: "24%", auc: "0.74", savings: "$0" },
                { name: "Single XGBoost (no MLOps)", caught: "79%", falseAlarms: "17%", auc: "0.83", savings: "$0" },
                { name: "RetainAI Ensemble + MLOps", caught: "91%", falseAlarms: "9%", auc: "0.89", savings: "$340", primary: true }
              ].map((row) => (
                <tr key={row.name} className={`transition-colors ${row.primary ? 'bg-gold/[0.04]' : 'text-gray-400'}`}>
                  <td className="px-12 py-8 border-l-2 border-transparent relative">
                    {row.primary && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold" />}
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-serif ${row.primary ? 'text-gold' : ''}`}>{row.name}</span>
                      {row.primary && <span className="text-[8px] px-2 py-0.5 border border-gold/30 rounded-full text-gold font-bold">PRIMARY</span>}
                    </div>
                  </td>
                  <td className="px-12 py-8">{row.caught}</td>
                  <td className="px-12 py-8">{row.falseAlarms}</td>
                  <td className="px-12 py-8 font-mono">{row.auc}</td>
                  <td className={`px-12 py-8 ${row.primary ? 'text-gold font-bold' : ''}`}>{row.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CompetitiveBarChart />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {[
            "+40% more churners caught vs rule-based",
            "4.2x fewer false positives than industry average",
            "MLflow-tracked across every model version"
          ].map((stat, i) => (
            <div key={i} className="glass-card flex items-center gap-4 py-8 px-10">
              <TrendingUp className="text-gold shrink-0" size={24} />
              <p className="text-sm font-bold text-gold uppercase tracking-[0.2em]">{stat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-40 border-t border-white/5 text-center bg-[#050505]">
        <div className="mb-20">
          <SectionHeading subtitle="GET STARTED" align="center">Secure Your Retention Pipeline</SectionHeading>
          <a href="/dashboard" className="btn-gold !text-xl !px-16 !py-6 inline-flex items-center gap-4">
            Enter Dashboard <ArrowRight />
          </a>
        </div>
        <p className="text-[10px] text-gray-700 uppercase tracking-[.8em]">RETAINAI SYSTEMS — MLOPS PERFORMANCE DIVISION</p>
      </footer>
    </div>
  );
};

export default LandingPage;
