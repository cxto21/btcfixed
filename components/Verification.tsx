/**
 * Verification / Identity — Coming Soon
 *
 * Future privacy & identity features for BTCFixed.
 */
import React from 'react';
import {
  Shield,
  Lock,
  Fingerprint,
  Eye,
  FileCheck,
  Sparkles,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Lock,
    title: 'Private Transfers',
    description: 'Send and receive tokens without linking sender and recipient on-chain.',
  },
  {
    icon: Fingerprint,
    title: 'ZK Identity',
    description: 'Prove your identity without revealing personal data using zero-knowledge proofs.',
  },
  {
    icon: Eye,
    title: 'Stealth Addresses',
    description: 'Generate one-time addresses for each transaction to enhance privacy.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Ready',
    description: 'Selective disclosure for regulatory compliance while maintaining privacy.',
  },
];

const Verification: React.FC = () => {
  return (
    <div className="space-y-6 animate-modern">
      {/* Hero */}
      <div className="text-center pt-4 pb-2">
        <div className="w-20 h-20 rounded-full bg-[#F7931A]/10 flex items-center justify-center mx-auto mb-4">
          <Shield size={36} className="text-[#F7931A]" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">Identity & Privacy</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-[280px] mx-auto leading-relaxed">
          Advanced privacy features powered by zero-knowledge proofs on Starknet.
        </p>
      </div>

      {/* Coming Soon Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7931A]/10 border border-[#F7931A]/20">
          <Sparkles size={14} className="text-[#F7931A]" />
          <span className="text-sm font-semibold text-[#F7931A]">Coming Soon</span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="space-y-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
              <feature.icon size={20} className="text-gray-900 dark:text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold dark:text-white mb-0.5">{feature.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold dark:text-white">Roadmap</h3>
        <div className="space-y-3">
          {[
            { phase: 'Phase 1', label: 'ZK Privacy Protocol Integration', status: 'In Development' },
            { phase: 'Phase 2', label: 'Stealth Address Support', status: 'Planned' },
            { phase: 'Phase 3', label: 'Compliance Framework', status: 'Planned' },
          ].map((item) => (
            <div key={item.phase} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                item.status === 'In Development' ? 'bg-[#F7931A] animate-pulse' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold dark:text-white">{item.phase}: {item.label}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                item.status === 'In Development'
                  ? 'text-[#F7931A] bg-[#F7931A]/10'
                  : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        disabled
        className="w-full h-14 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock size={16} />
        Available in Next Update
      </button>
    </div>
  );
};

export default Verification;
