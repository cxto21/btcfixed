
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { ShieldCheck, Lock, BarChart3, Cpu, Activity, TrendingUp } from 'lucide-react';

const data = [
  { name: '1', v: 40 }, { name: '2', v: 42 }, { name: '3', v: 41 }, 
  { name: '4', v: 45 }, { name: '5', v: 44 }, { name: '6', v: 48 }, { name: '7', v: 52 },
];

interface DashboardProps {
  isPrivacyMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isPrivacyMode }) => {
  const formatValue = (val: string) => isPrivacyMode ? '******' : val;

  return (
    <div className="space-y-12 animate-modern">
      {/* Saldo Principal */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <TrendingUp size={12} strokeWidth={3} className="text-green-600" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/30">CURRENT WEALTH</p>
          </div>
          <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 tracking-tighter uppercase italic">Institutional Tier</span>
        </div>
        <h2 className="text-[52px] font-bold tracking-tighter leading-none relative">
          {formatValue('142.50')}
          <span className="text-[12px] absolute -top-2 ml-1 text-black/20 font-black">BTC</span>
        </h2>
        <div className="flex gap-2">
          <button className="flex-1 h-14 btn-black font-bold text-xs tracking-widest">START EARNING</button>
          <button className="flex-1 h-14 btn-outline font-bold text-xs tracking-widest">CASH OUT</button>
        </div>
      </section>

      {/* Terminal de Estado L2 */}
      <div className="border-2 border-black p-0 bg-white">
        <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
            <span className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                <ShieldCheck size={12} />
                Live Protection
            </span>
            <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-bold uppercase">Synced on Starknet</span>
            </span>
        </div>
        <div className="p-4 space-y-3 font-mono">
            <div className="flex justify-between text-[10px]">
                <span className="opacity-40 uppercase">Verified Block:</span>
                <span className="font-bold">#884,122</span>
            </div>
            <div className="flex justify-between text-[10px]">
                <span className="opacity-40 uppercase">System Health:</span>
                <span className="font-bold text-green-600">100% SECURE</span>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase">Yield Trajectory</h3>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Target: +5.25% APR</span>
        </div>
        <div className="h-32 w-full border-b-2 border-black">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="name" hide />
              <Tooltip hide />
              <Area 
                type="stepAfter" 
                dataKey="v" 
                stroke="#000000" 
                strokeWidth={4} 
                fillOpacity={0.05} 
                fill="#000000" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de Activos Refinada */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest uppercase">My Strategy</h3>
          <Lock size={16} strokeWidth={3} />
        </div>
        <div className="space-y-3">
          {[
            { n: 'Pure Bitcoin', s: 'BTC', v: '85.20', u: '$5.4M', badge: 'Idle' },
            { n: 'Smart Yield BTC', s: 'fyBTC', v: '57.30', u: '$3.6M', badge: 'Earning 5.25%' },
            { n: 'Available Credit', s: 'USD', v: '245.0K', u: '$245.0K', badge: '1.5% Cost' },
          ].map((asset, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-2 border-black hover:bg-black hover:text-white transition-all cursor-pointer group relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center font-bold text-lg border-2 border-black group-hover:bg-white group-hover:text-black">
                  {asset.s[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm tracking-tight uppercase">{asset.n}</p>
                    <span className={`text-[8px] px-1 font-black uppercase ${i === 1 ? 'bg-green-500 text-white' : 'bg-black text-white group-hover:bg-white group-hover:text-black'}`}>
                        {asset.badge}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{asset.s}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{formatValue(asset.v)}</p>
                <p className="text-[10px] font-bold opacity-40">{formatValue(asset.u)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
