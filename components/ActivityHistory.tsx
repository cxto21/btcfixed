import React, { useState } from 'react';
import { ArrowLeft, Zap, Repeat, ArrowUpRight, CheckCircle2, Search, X, Shield, ExternalLink, Copy, ArrowDownLeft, Gift } from 'lucide-react';
import { useActivity } from '../hooks/useActivity';
import type { ActivityEntry } from '../services/activityStore';

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

function shortHash(hash: string): string {
  if (!hash || hash.length < 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

interface ActivityHistoryProps {
  isPrivacyMode: boolean;
  onBack: () => void;
}

const ICON_COLORS: Record<string, string> = {
  Stake: '#8B5CF6',
  Unstake: '#F59E0B',
  ClaimRewards: '#10B981',
  Swap: '#3B82F6',
  Supply: '#F7931A',
  Withdraw: '#EF4444',
};

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ isPrivacyMode, onBack }) => {
  const allActivities = useActivity();
  const [selectedTx, setSelectedTx] = useState<ActivityEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formatValue = (val: string) => isPrivacyMode ? '••••••' : val;

  const filtered = searchQuery.trim()
    ? allActivities.filter(
        (a) =>
          a.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allActivities;

  const getActivityIcon = (type: string, size = 16) => {
    switch (type) {
      case 'Stake':        return <Zap size={size} />;
      case 'Unstake':      return <ArrowDownLeft size={size} />;
      case 'ClaimRewards': return <Gift size={size} />;
      case 'Swap':         return <Repeat size={size} />;
      case 'Supply':       return <ArrowUpRight size={size} />;
      case 'Withdraw':     return <ArrowLeft size={size} />;
      default:             return <CheckCircle2 size={size} />;
    }
  };

  return (
    <div className="space-y-5 animate-modern relative">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="dark:text-white" />
        </button>
        <div>
          <h2 className="text-xl font-bold dark:text-white">History</h2>
          <p className="text-xs text-gray-600 dark:text-gray-300">Transaction activity</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-100 dark:bg-white/5 rounded-xl flex items-center px-4 h-11">
        <Search size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by hash or type..."
          className="bg-transparent outline-none w-full ml-3 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-white"
        />
      </div>

      {/* Transaction list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <CheckCircle2 size={32} className="mx-auto mb-3 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {allActivities.length === 0 ? 'No transactions yet' : 'No results match your search'}
            </p>
          </div>
        )}
        {filtered.map((activity) => (
          <div
            key={activity.id}
            onClick={() => setSelectedTx(activity)}
            className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: ICON_COLORS[activity.type] ?? '#6B7280' }}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="text-sm font-semibold dark:text-white">{activity.type}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{timeAgo(activity.timestamp)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold dark:text-white">
                {formatValue(activity.label)}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                {activity.status === 'Pending' ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-[#F7931A] rounded-full animate-pulse" />
                    <span className="text-[10px] font-medium text-[#F7931A]">Pending</span>
                  </>
                ) : activity.status === 'Failed' ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    <span className="text-[10px] font-medium text-red-500">Failed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={10} className="text-green-500" />
                    <span className="text-[10px] font-medium text-green-500">Confirmed</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setSelectedTx(null)}
          />
          <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-2xl relative z-10 animate-modern overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-5 py-4 flex justify-between items-center border-b border-gray-200 dark:border-white/10">
              <h3 className="font-semibold text-sm dark:text-white">Transaction Details</h3>
              <button onClick={() => setSelectedTx(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                <X size={16} className="dark:text-white" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Main Info */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: ICON_COLORS[selectedTx.type] ?? '#6B7280' }}
                >
                  {getActivityIcon(selectedTx.type, 24)}
                </div>
                <div>
                  <h4 className="text-2xl font-bold dark:text-white">{selectedTx.type}</h4>
                  <p className={`text-xs font-medium ${
                    selectedTx.status === 'Pending' ? 'text-[#F7931A]' : selectedTx.status === 'Failed' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {selectedTx.status}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-3 bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Amount</span>
                  <span className="text-sm font-semibold dark:text-white">{formatValue(selectedTx.label)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Time</span>
                  <span className="text-sm font-medium dark:text-white">{timeAgo(selectedTx.timestamp)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Network</span>
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-[#F7931A]" />
                    <span className="text-xs font-medium dark:text-white">Starknet Testnet</span>
                  </div>
                </div>
              </div>

              {/* TX Hash */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-300">Transaction Hash</p>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate mr-3">{shortHash(selectedTx.txHash)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedTx.txHash)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/20 transition-colors"
                      title="Copy hash"
                    >
                      <Copy size={12} className="dark:text-white" />
                    </button>
                    <a
                      href={`${selectedTx.explorerBase}/tx/${selectedTx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/20 transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink size={12} className="dark:text-white" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm transition-all hover:opacity-90"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
        <p className="text-xs text-gray-600 dark:text-gray-300 text-center leading-relaxed">
          All transactions are verified on Starknet. Finality after 2 Bitcoin confirmations.
        </p>
      </div>
    </div>
  );
};

export default ActivityHistory;
