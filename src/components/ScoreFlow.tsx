import React, { useState } from 'react';
import { ShieldCheck, FileText, Send, Loader2, RefreshCcw, Search, CheckCircle2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_FINANCIAL_DATA } from '../dummyData';
import { useMidnight } from '../hooks/useMidnight';
import { FileUpload } from './FileUpload';

export function ScoreFlow() {
  const { isConnected, isDemo, generateProof, error: midnightError } = useMidnight();
  const [step, setStep] = useState<'idle' | 'generating' | 'ready' | 'submitting' | 'success'>('idle');
  const [proofData, setProofData] = useState<any>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [analyzingPDF, setAnalyzingPDF] = useState(false);
  const [customData, setCustomData] = useState(DUMMY_FINANCIAL_DATA);

  const handleGenerateProof = async () => {
    setStep('generating');
    try {
      const result = await generateProof(customData);
      setProofData(result);
      setStep('ready');
    } catch (err) {
      console.error(err);
      setStep('idle');
    }
  };

  const submitProof = async () => {
    setStep('submitting');
    // Simulate block inclusion time
    await new Promise(r => setTimeout(r, 2000));
    setTxHash('0x' + Math.random().toString(16).substring(2, 66));
    setStep('success');
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setAnalyzingPDF(true);
    const formData = new FormData();
    formData.append('bill', files[0]);

    try {
      const response = await fetch('/api/upload-bill', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.analysis) {
        // Try to parse JSON from AI response if possible, simplified for now
        console.log('AI Analysis:', data.analysis);
        // Mocking an update based on AI extraction
        setCustomData(prev => ({
          ...prev,
          totalScore: prev.totalScore + 5 // Boost score for showing evidence
        }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setAnalyzingPDF(false);
      setShowUpload(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {midnightError && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs text-center">
          {midnightError}
        </div>
      )}
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">ZK Proof Generation</h2>
        <p className="text-zinc-500 text-sm max-w-lg italic">
          Verify your creditworthiness without sharing your bank statements. 
          Your raw data never leaves this machine.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Data Card */}
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Local Evidence</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowUpload(!showUpload)}
                className={`p-1 rounded-md transition-colors ${showUpload ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-800 text-zinc-500'}`}
                title="Upload PDF Bill"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-px h-3 bg-zinc-800 mx-1" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase">AI Parsing</span>
                <button 
                  onClick={() => setUseAI(!useAI)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${useAI ? 'bg-indigo-600' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${useAI ? 'left-4.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex-1">
            {showUpload ? (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <FileUpload onUpload={handleFileUpload} />
                {analyzingPDF && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-indigo-400 italic">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    GROQ is analyzing bill contents...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 font-mono text-[11px]">
                {customData.bills.map(bill => (
                  <div key={bill.id} className="flex justify-between items-center text-zinc-400">
                    <span>{bill.provider}</span>
                    <span className="text-zinc-500">........................</span>
                    <span className="text-white">${bill.amount}</span>
                    <span className="text-green-500 ml-2">✓ PAID</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-dashed border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-300">TOTAL CREDIT SCORE</span>
                  <span className="text-xl text-indigo-400 font-bold">{customData.totalScore}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Card */}
        <div className="border border-zinc-800 rounded-2xl bg-zinc-950 flex flex-col justify-center items-center p-8 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {step === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-4"
              >
                <ShieldCheck className="w-12 h-12 text-zinc-700 mx-auto" />
                <button 
                  onClick={handleGenerateProof}
                  disabled={!isConnected && !isDemo}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] shadow-indigo-600/30"
                >
                  Generate Private Proof
                </button>
                {(!isConnected && !isDemo) && <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Connect Wallet to Begin</p>}
              </motion.div>
            )}

            {step === 'generating' && (
              <motion.div 
                key="generating"
                className="text-center space-y-4"
              >
                <div className="relative">
                   <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto opacity-20" />
                   <RefreshCcw className="w-8 h-8 text-indigo-400 animate-spin absolute inset-0 m-auto" />
                </div>
                <p className="text-sm font-mono text-zinc-400">
                  {isDemo ? 'ZK Circuits: Demo' : 'ZK Circuits: Midnight'}
                </p>
                <div className="w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-full bg-indigo-500" 
                   />
                </div>
              </motion.div>
            )}

            {step === 'ready' && (
              <motion.div 
                key="ready"
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                   <ShieldCheck className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-semibold text-white">Proof Generated</p>
                    {isDemo && <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">DEMO</span>}
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">HASH: {proofData?.proof.slice(0, 16)}...</p>
                </div>
                <button 
                  onClick={submitProof}
                  className="w-full px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit to Midnight
                </button>
              </motion.div>
            )}

            {step === 'submitting' && (
               <motion.div key="submitting" className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
                  <p className="text-sm font-mono text-zinc-400">Waiting for Block Inclusion...</p>
               </motion.div>
            )}

            {step === 'success' && (
               <motion.div key="success" className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.4)] shadow-green-500/40">
                     <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-white">Transaction Successful</p>
                    {isDemo && <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">Verified via Demo Protocol</p>}
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-left">
                      <p className="text-[10px] text-zinc-500 mb-1 truncate text-left font-mono">TX HASH</p>
                      <p className="text-[11px] text-zinc-300 font-mono truncate">{txHash}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep('idle')}
                    className="text-xs text-zinc-500 hover:text-white underline transition-colors"
                  >
                    Start New Verification
                  </button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
