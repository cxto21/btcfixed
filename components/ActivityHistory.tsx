
import React, { useState } from 'react';
import { ArrowLeft, Zap, Repeat, ArrowUpRight, CheckCircle2, Search, Filter, X, Shield, ExternalLink, Copy } from 'lucide-react';
import { Activity } from '../types';

const allActivities: Activity[] = [
  { id: 'tx-001', type: 'Stake', amount: '1.25 BTC', status: 'Completed', timestamp: '2h ago' },
  { id: 'tx-002', type: 'Bridge', amount: '0.85 BTC', status: 'Pending', timestamp: '15m ago' },
  { id: 'tx-003', type: 'Borrow', amount: '25,000 fUSD', status: 'Completed', timestamp: '1d ago' },
  { id: 'tx-004', type: 'Mint', amount: '5,000 fUSD', status: 'Completed', timestamp: '3d ago' },
  { id: 'tx-005', type: 'Repay', amount: '10,000 fUSD', status: 'Completed', timestamp: '5d ago' },
  { id: 'tx-006', type: 'Stake', amount: '10.00 BTC', status: 'Completed', timestamp: '1w ago' },
  { id: 'tx-007', type: 'Bridge', amount: '2.50 BTC', status: 'Completed', timestamp: '2w ago' },
  { id: 'tx-008', type: 'Mint', amount: '1,000 fUSD', status: 'Failed', timestamp: '1m ago' },
];

interface ActivityHistoryProps {
  isPrivacyMode: boolean;
  onBack: () => void;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ isPrivacyMode, onBack }) => {
  const [selectedTx, setSelectedTx] = useState<Activity | null>(null);
  const formatValue = (val: string) => isPrivacyMode ? "******" : val;

  const getActivityIcon = (type: string, size = 16) => {
    switch (type) {
      case 'Stake': return <Zap size={size} />;
      case 'Bridge': return <Repeat size={size} />;
      case 'Borrow': return <ArrowUpRight size={size} />;
      case 'Repay': return <ArrowLeft size={size} />;
      default: return <CheckCircle2 size={size} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-[#F7931A]';
      case 'Failed': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div className="space-y-10 animate-modern relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft size={20} className="dark:text-white" />
        </button>
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase dark:text-white">HISTORY</h2>
          <p className="text-black/40 dark:text-white/70 text-[10px] font-black uppercase tracking-widest">Global Activity Ledger</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 border-2 border-black dark:border-white bg-white dark:bg-black flex items-center px-4 h-12">
            <Search size={16} className="text-black/20 dark:text-white/50" />
            <input 
                type="text" 
                placeholder="SEARCH TX HASH..." 
                className="bg-transparent outline-none w-full ml-3 text-[10px] font-black uppercase tracking-widest placeholder:text-black/10 dark:placeholder:text-white/30 dark:text-white"
            />
        </div>
        <button className="w-12 h-12 border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            <Filter size={18} className="dark:text-white" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-20 dark:opacity-60 dark:text-white">Transaction Flow</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-20 dark:opacity-60 dark:text-white">Status/Value</span>
        </div>
        
        <div className="border-2 border-black dark:border-white divide-y-2 divide-black dark:divide-white bg-white dark:bg-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
          {allActivities.map((activity) => (
            <div 
              key={activity.id} 
              onClick={() => setSelectedTx(activity)}
              className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white transition-transform group-active:scale-95 ${
                    activity.status === 'Pending' ? 'bg-[#F7931A]/10 text-[#F7931A]' : 
                    activity.status === 'Failed' ? 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900/50' : 'bg-black dark:bg-white text-white dark:text-black'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-black uppercase tracking-tight dark:text-white">{activity.type}</p>
                    <span className="text-[8px] px-1.5 py-0.5 border border-black/10 dark:border-white/30 font-mono opacity-40 dark:opacity-70 dark:text-white">{activity.id}</span>
                  </div>
                  <p className="text-[10px] font-bold text-black/30 dark:text-white/60 uppercase tracking-widest">{activity.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black tracking-tight dark:text-white">
                  {formatValue(activity.amount)}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  {activity.status === 'Pending' ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-[#F7931A] rounded-full animate-pulse"></span>
                      <span className="text-[9px] font-black text-[#F7931A] uppercase tracking-widest">In Progress</span>
                    </>
                  ) : activity.status === 'Failed' ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                      <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Rejected</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={10} className="text-green-600" />
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Confirmed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div 
            className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-md" 
            onClick={() => setSelectedTx(null)} 
          />
          <div className="w-full max-w-sm bg-white dark:bg-black border-4 border-black dark:border-white neo-shadow relative z-10 animate-modern overflow-hidden">
            {/* Modal Header */}
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-[0.2em]">Transaction Audit</h3>
              <button onClick={() => setSelectedTx(null)} className="hover:scale-110 transition-transform">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Main Info */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 flex items-center justify-center border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] ${
                  selectedTx.status === 'Pending' ? 'bg-[#F7931A]/10 text-[#F7931A]' : 
                  selectedTx.status === 'Failed' ? 'bg-red-50 text-red-600' : 'bg-black dark:bg-white text-white dark:text-black'
                }`}>
                  {getActivityIcon(selectedTx.type, 28)}
                </div>
                <div>
                  <h4 className="text-3xl font-black tracking-tighter dark:text-white uppercase">{selectedTx.type}</h4>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedTx.status)}`}>
                    {selectedTx.status}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-4 border-y-2 border-black/10 dark:border-white/30 py-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:opacity-70 dark:text-white">Amount</span>
                  <span className="text-sm font-black dark:text-white">{formatValue(selectedTx.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:opacity-70 dark:text-white">Timestamp</span>
                  <span className="text-sm font-bold dark:text-white">{selectedTx.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:opacity-70 dark:text-white">Protocol Fee</span>
                  <span className="text-sm font-bold dark:text-white">0.0001 BTC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:opacity-70 dark:text-white">Network</span>
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-[#F7931A]" />
                    <span className="text-[10px] font-black uppercase dark:text-white">Starknet L2</span>
                  </div>
                </div>
              </div>

              {/* TX Hash Section */}
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-30 dark:opacity-70 dark:text-white">Transaction Hash</p>
                 <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-white font-mono text-[10px] font-bold dark:text-white">
                   <span className="truncate mr-4">0x4a92...e91b</span>
                   <div className="flex gap-2">
                     <Copy size={12} className="cursor-pointer hover:text-[#F7931A]" />
                     <ExternalLink size={12} className="cursor-pointer hover:text-[#F7931A]" />
                   </div>
                 </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => setSelectedTx(null)}
                className="w-full h-14 bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.2em] neo-shadow-orange"
              >
                DISMISS AUDIT
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-black/10 dark:border-white/30">
        <p className="text-[10px] text-black/30 dark:text-white/60 font-bold uppercase text-center leading-relaxed">
            All transactions are verified using SPV clients running on Starknet. <br/>
            Finality is reached after 2 Bitcoin Mainnet confirmations.
        </p>
      </div>
    </div>
  );
};

export default ActivityHistory;
