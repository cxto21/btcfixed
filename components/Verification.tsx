
import React from 'react';
import { ShieldCheck, Search, Activity, Database, CheckCircle2 } from 'lucide-react';

const Verification: React.FC = () => {
  return (
    <div className="space-y-12 animate-modern">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter uppercase">SPV PROOF</h2>
        <p className="text-black/40 text-sm font-medium uppercase tracking-widest">On-chain Bitcoin Verification</p>
      </div>

      <div className="p-8 border-2 border-black space-y-8 bg-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 opacity-[0.03]">
            <ShieldCheck size={200} />
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-center border-b-2 border-black pb-4">
            <div>
              <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">STARKNET VERIFIER</p>
              <p className="font-mono text-xs font-bold">0x72a...f910</p>
            </div>
            <div className="px-2 py-1 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest">Active</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <Search size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Verify Tx Hash</p>
                <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Verify any BTC Tx trustlessly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t-2 border-black">
          <h4 className="text-[10px] font-black opacity-30 uppercase tracking-widest">Live SDK Stream</h4>
          <div className="bg-black text-white p-4 font-mono text-[9px] space-y-2">
            <p className="flex justify-between">
              <span className="opacity-50">[12:44:01]</span>
              <span>FETCHING BLOCK HEADER #884122</span>
            </p>
            <p className="flex justify-between text-green-400">
              <span className="opacity-50 text-white">[12:44:02]</span>
              <span>VERIFIED VIA ZK-STARK</span>
            </p>
            <p className="flex justify-between">
              <span className="opacity-50">[12:44:05]</span>
              <span>SYNCING STARKNET STATE...</span>
            </p>
          </div>
        </div>

        <button className="w-full h-16 btn-black font-bold text-lg tracking-[0.2em] flex items-center justify-center gap-3">
          <Activity size={20} />
          RUN VERIFIER
        </button>
      </div>

      <div className="grid grid-cols-2 gap-[2px] bg-black border-2 border-black">
        <div className="bg-white p-6">
          <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1">Block Proofs</p>
          <p className="text-2xl font-bold tracking-tighter">14,209</p>
        </div>
        <div className="bg-white p-6 text-right">
          <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1">SDK Status</p>
          <p className="text-2xl font-bold tracking-tighter text-green-600">CONNECTED</p>
        </div>
      </div>
    </div>
  );
};

export default Verification;
