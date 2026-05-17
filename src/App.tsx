import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { ScoreFlow } from './components/ScoreFlow';
import { PrivacyView } from './components/PrivacyView';
import { ExtractedDataView } from './components/ExtractedDataView';
import { Shield, Lock, Fingerprint, Database, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import type { MedicalData } from './types';

export default function App() {
  const wallet = useWallet();
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 text-white">
        <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Shield className="w-4 h-4" />
            Powered by Midnight ZK Protocol
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Match Clinical Trials.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Keep Your Medical History Private.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mb-12 leading-relaxed">
            Upload your lab results locally. Our AI screens your eligibility. <br className="hidden md:block"/>
            Midnight's Zero-Knowledge proofs verify you on-chain—<strong className="text-white">without ever exposing your raw health data.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button 
              onClick={() => setHasStarted(true)}
              className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)]"
            >
              Start Verification Flow <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-zinc-800/50 pt-16">
            <div className="flex items-start gap-4 text-left">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 text-teal-400"><Lock className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-lg mb-2">100% Local AI</h3>
                <p className="text-zinc-500 text-sm">Your raw medical PDF never leaves the local environment. Only your trial eligibility is exported.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 text-teal-400"><CheckCircle2 className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-lg mb-2">HIPAA Compliant ZK</h3>
                <p className="text-zinc-500 text-sm">You prove you meet the trial requirements without revealing your underlying medical history or pre-existing conditions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 text-teal-400"><Fingerprint className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-lg mb-2">Immutable Verification</h3>
                <p className="text-zinc-500 text-sm">Eligibility proofs are anchored on Midnight for secure, trustless compensation and matching.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <main className="flex-1 max-w-5xl mx-auto w-full pt-12 pb-24">
        <div className="px-6 mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-widest mx-auto">
            <Shield className="w-3 h-3" />
            Midnight ZK Protocol (Backend Verifier)
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Privacy-Preserving <br />
            <span className="text-zinc-500">Clinical Trial Matcher</span>
          </h1>
        </div>

        <section className="bg-zinc-900/10 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-600/5">
          <ScoreFlow medicalData={medicalData} onDataLoaded={setMedicalData} wallet={wallet} />
          {medicalData && <ExtractedDataView medicalData={medicalData} />}
          <PrivacyView medicalData={medicalData} />
        </section>
      </main>

      <footer className="p-8 border-t border-zinc-900 text-center">
        <p className="text-xs text-zinc-600 font-mono">MIDNIGHT NETWORK // ZERO KNOWLEDGE CREDIT SCORE // HEADLESS MODE</p>
      </footer>
    </div>
  );
}


function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-zinc-500">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
