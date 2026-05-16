import React from 'react';
import { Wallet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useMidnight } from '../hooks/useMidnight';

export function WalletConnect() {
  const { address, isConnected, isConnecting, connect, isDemo } = useMidnight();

  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-xs text-zinc-400">MIDNIGHT NODE: <span className="text-green-500 font-bold">ONLINE</span></span>
          {isDemo && <span className="text-[9px] text-amber-500 font-bold tracking-tighter uppercase">Demo Mode Active</span>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {address ? (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <div className="flex flex-col items-center">
               <span className="text-xs font-mono text-zinc-300">
                 {address?.slice(0, 6)}...{address?.slice(-4)}
               </span>
             </div>
             {isDemo ? (
               <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">DEMO</span>
             ) : (
               <CheckCircle2 className="w-4 h-4 text-green-500" />
             )}
          </div>
        ) : (
          <button 
            onClick={connect}
            disabled={isConnecting}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            Connect 1am Wallet
          </button>
        )}
      </div>
    </div>
  );
}
