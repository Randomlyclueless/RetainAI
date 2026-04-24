import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView 
} from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  ArrowRight, 
  Database, 
  Zap, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const AnimatedCounter = ({ value, duration = 1.2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;
      
      const totalMiliseconds = duration * 1000;
      const steps = 60; 
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

const RiskGauge = ({ value = 92 }) => {
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (value / 100) * circumference;
  
  const getColor = (v) => {
    if (v < 30) return "#00FF94"; 
    if (v < 70) return "#FFB800"; 
    return "#FF4444"; 
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

const KPIPill = ({ label, value, color = "gold", delay = 0 }) => (
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

const SectionHeading = ({ children, subtitle, align = "left" }) => (
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

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const headlineY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden">
      
      <motion.div 
        style={{ y: gridY }}
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        id="bg-grid"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:32px_32px]" />
      </motion.div>

      <nav className="fixed top-0 w-full z-50 px-12 py-10 flex justify-between items-center bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <Activity size={24} className="text-gold" />
          <span className="text-3xl font-serif tracking-tighter text-white">RetainAI</span>
        </div>
        <div className="flex gap-8 items-center text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
          <a href="#" className="hover:text-gold transition-colors">Compare</a>
          <a href="#" className="hover:text-gold transition-colors">Stats</a>
          <a href="/dashboard" className="bg-gold text-black px-6 py-2 rounded-full hover:scale-105 transition-transform">Dashboard</a>
        </div>
      </nav>

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
            <h1 className="text-7xl lg:text-[120px] font-serif leading-[0.85] mb-12 text-white">
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
              <button className="px-10 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-[10px] uppercase tracking-[.4em] font-bold text-gray-400">
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

      <section className="relative z-10 py-32 px-12 max-w-[1400px] mx-auto">
        <SectionHeading subtitle="Active Monitoring">Real-Time Risk Intelligence</SectionHeading>
        <TimelineChart />
      </section>

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