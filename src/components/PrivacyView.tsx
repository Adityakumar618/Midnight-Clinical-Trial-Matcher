import React from 'react';
import { Eye, EyeOff, Lock, Network } from 'lucide-react';
import { DUMMY_FINANCIAL_DATA } from '../dummyData';

export function PrivacyView() {
  return (
    <div className="px-6 pb-12 space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-px bg-zinc-800 flex-1" />
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Privacy Visualization</span>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* What You See */}
        <div className="space-y-4 group">
          <div className="flex items-center gap-2 text-indigo-400">
            <Eye className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">What You See (Local)</h3>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 group-hover:bg-zinc-900/40 transition-colors space-y-4">
            <div className="flex justify-between items-end">
               <div>
                 <p className="text-[10px] text-zinc-500 uppercase mb-1">Financial Data Strength</p>
                 <div className="flex gap-1 h-3">
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} className="w-1.5 h-full bg-indigo-500/40 rounded-full" />
                   ))}
                   <div className="w-1.5 h-full bg-zinc-800 rounded-full" />
                   <div className="w-1.5 h-full bg-zinc-800 rounded-full" />
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-zinc-500 uppercase mb-1">Raw Score</p>
                 <p className="text-lg font-bold text-white tabular-nums">{DUMMY_FINANCIAL_DATA.totalScore}</p>
               </div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-zinc-500/10 space-y-2">
               <p className="text-[10px] text-zinc-500 font-mono"># USER_IDENTIFIER</p>
               <p className="text-[11px] text-zinc-300 font-mono">NAME: John Doe</p>
               <p className="text-[11px] text-zinc-300 font-mono">BILLS: {DUMMY_FINANCIAL_DATA.bills.length} Records</p>
               <p className="text-[11px] text-zinc-300 font-mono">STATUS: Fully Paid</p>
            </div>
          </div>
        </div>

        {/* What Blockchain Sees */}
        <div className="space-y-4 group">
          <div className="flex items-center gap-2 text-zinc-500">
            <EyeOff className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">What Blockchain Sees (Network)</h3>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-indigo-950/20 border-indigo-500/20 group-hover:bg-indigo-950/30 transition-colors space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
               <Lock className="w-12 h-12" />
            </div>
            
            <div className="flex justify-between items-end">
               <div>
                 <p className="text-[10px] text-zinc-500 uppercase mb-1">Encrypted Payload</p>
                 <div className="flex gap-1 h-3">
                   {[1,2,3,4,5,6,7,8,9,10].map(i => (
                     <div key={i} className="w-1.5 h-full bg-zinc-700/40 rounded-full bg-indigo-400" />
                   ))}
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-indigo-400/60 uppercase mb-1 font-bold">Score Check</p>
                 <p className="text-lg font-bold text-indigo-400 underline underline-offset-4 decoration-dotted">PASS</p>
               </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-500/10 font-mono overflow-hidden">
               <p className="text-[10px] text-indigo-500/50 mb-2"># ZK_PROOF_BLOB</p>
               <div className="grid grid-cols-4 gap-1 opacity-40">
                  {Array.from({length: 12}).map((_, i) => (
                    <div key={i} className="h-2 bg-zinc-800 rounded-sm" />
                  ))}
               </div>
               <p className="text-[10px] mt-4 text-zinc-600 truncate">SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e46...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
         <Network className="w-8 h-8 text-zinc-700 mb-4" />
         <p className="text-xs font-mono text-zinc-500 max-w-xs uppercase leading-relaxed">
           Data is processed within the <span className="text-indigo-400 font-bold">Compact Runtime</span>. 
           Zero Knowledge Proof is transmitted as a witness without exposing scalars.
         </p>
      </div>
    </div>
  );
}
