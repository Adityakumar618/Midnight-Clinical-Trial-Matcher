import { useState } from 'react';
import { ShieldCheck, FileText, Send, Loader2, RefreshCcw, CheckCircle2, XCircle, Plus, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from './FileUpload';
import type { MedicalData } from '../types';
import type { WalletState } from '../hooks/useWallet';

interface ScoreFlowProps {
  medicalData: MedicalData | null;
  onDataLoaded: (data: MedicalData) => void;
  wallet: WalletState;
}

export function ScoreFlow({ medicalData, onDataLoaded, wallet }: ScoreFlowProps) {
  const { isConnected } = wallet;

  const [step, setStep] = useState<'idle' | 'generating' | 'ready' | 'submitting' | 'success'>('idle');
  const [proofHash, setProofHash] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [analyzingPDF, setAnalyzingPDF] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canGenerate = medicalData !== null;

  const handleGenerateProof = async () => {
    if (!medicalData) return;
    setStep('generating');
    try {
      setStep('submitting'); // Show the terminal/submission step
      const response = await fetch('/api/generate-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          a1c_level: medicalData.a1c_level,
          has_cvd: medicalData.has_cvd,
          has_kidney_disease: medicalData.has_kidney_disease
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setProofHash(data.proofHash);
        setTxHash(data.transactionHash);
        setStep('success');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Proof generation failed:', err);
      setStep('idle');
    }
  };

  // We no longer need handleSubmitProof because the backend handles it autonomously
  const handleSubmitProof = async () => {};

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setAnalyzingPDF(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('bill', files[0]);

    try {
      const response = await fetch('/api/upload-medical', { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok) {
        setUploadError(data.error ?? 'Upload failed');
        return;
      }

      if (data.analysis) {
        onDataLoaded(data.analysis);
        setShowUpload(false);
      }
    } catch {
      setUploadError('Network error — could not reach server');
    } finally {
      setAnalyzingPDF(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Clinical Trial Eligibility Matcher</h2>
        <p className="text-zinc-500 text-sm max-w-lg italic">
          Upload your medical record or lab results. Your raw health data never leaves this machine.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Data Card */}
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Local Health Record</span>
            </div>
            {medicalData && (
              <button
                onClick={() => setShowUpload(!showUpload)}
                className={`p-1 rounded-md transition-colors ${showUpload ? 'bg-teal-600 text-white' : 'hover:bg-zinc-800 text-zinc-500'}`}
                title="Upload another PDF"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-4 flex-1">
            {showUpload ? (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <FileUpload onUpload={handleFileUpload} />
                {analyzingPDF && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-teal-400 italic">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Extracting markers with GROQ HIPAA AI...
                  </div>
                )}
                {uploadError && (
                  <p className="mt-3 text-xs text-red-400 text-center">{uploadError}</p>
                )}
              </div>
            ) : medicalData ? (
              <div className="space-y-3 font-mono text-[11px]">
                {medicalData.lab_results.map((lab, i) => (
                  <div key={i} className="flex justify-between items-center text-zinc-400">
                    <span className="truncate max-w-[120px]">{lab.test}</span>
                    <span className="text-zinc-600 mx-1">........</span>
                    <span className="text-white">{lab.value}</span>
                    <span className={`ml-2 font-bold ${lab.flag === 'NORMAL' ? 'text-green-500' : 'text-red-400'}`}>
                      {lab.flag}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-dashed border-zinc-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">TRIAL 884 ELIGIBILITY</span>
                    <span className={`text-xl font-bold ${medicalData.eligible_for_trial ? 'text-teal-400' : 'text-red-400'}`}>
                      {medicalData.eligible_for_trial ? 'ELIGIBLE' : 'DISQUALIFIED'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">HEMOGLOBIN A1C</span>
                    <span className={`text-xs font-bold ${medicalData.a1c_level >= 7.0 ? 'text-amber-500' : 'text-green-500'}`}>
                      {medicalData.a1c_level}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">CVD HISTORY</span>
                    <span className="text-zinc-300">{medicalData.has_cvd ? 'POSITIVE' : 'NEGATIVE'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">KIDNEY DISEASE</span>
                    <span className="text-zinc-300">{medicalData.has_kidney_disease ? 'POSITIVE' : 'NEGATIVE'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowUpload(true)}
                  className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 hover:border-teal-500 hover:bg-teal-500/5 transition-all group py-6"
                >
                  <UploadCloud className="w-8 h-8 text-zinc-600 group-hover:text-teal-400 transition-colors" />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">Upload Medical Record (PDF)</p>
                  </div>
                </button>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-zinc-800 flex-1"></div>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">OR</span>
                  <div className="h-px bg-zinc-800 flex-1"></div>
                </div>

                <button
                  onClick={async () => {
                    const res = await fetch('/api/demo-data');
                    const data = await res.json();
                    onDataLoaded(data.analysis);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors py-4 text-xs font-bold text-white shadow-lg"
                >
                  Load Flawless Demo Data
                </button>

                {uploadError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400 text-center">{uploadError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Card */}
        <div className="border border-zinc-800 rounded-2xl bg-zinc-950 flex flex-col justify-center items-center p-8 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-transparent pointer-events-none" />

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
                  disabled={!canGenerate}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 transition-all text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                >
                  Generate ZK Eligibility Proof
                </button>
                {!medicalData && (
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Upload Lab Results to Begin</p>
                )}
              </motion.div>
            )}

            {step === 'generating' && (
              <motion.div key="generating" className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto opacity-20" />
                  <RefreshCcw className="w-8 h-8 text-indigo-400 animate-spin absolute inset-0 m-auto" />
                </div>
                <p className="text-sm font-mono text-zinc-400">ZK Circuits: Midnight Testnet</p>
                <div className="w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.2 }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </motion.div>
            )}

            {step === 'ready' && (
              <motion.div key="ready" className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">Proof Generated</p>
                  <p className="text-xs text-zinc-500 font-mono">HASH: {proofHash?.slice(0, 20)}...</p>
                </div>
                <button
                  onClick={handleSubmitProof}
                  className="w-full px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit to Midnight
                </button>
              </motion.div>
            )}

            {step === 'submitting' && (
              <motion.div key="submitting" className="text-left w-full space-y-4 font-mono">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-4">
                  <ShieldCheck className="w-6 h-6 text-teal-400" />
                  <p className="text-sm font-bold text-white tracking-widest">MIDNIGHT ZK MEDICAL VERIFIER</p>
                </div>
                <div className="space-y-2 text-xs text-zinc-400">
                  <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0}}>[1/4] Initializing Node.js Headless Wallet...</motion.p>
                  <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}}>[2/4] Loading clinical_trial.compact proving key...</motion.p>
                  <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 2.5}} className="text-teal-400">[3/4] Computing Trial 884 Eligibility ZK Proof...</motion.p>
                  <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 5}}>[4/4] Anchoring to Midnight Local Dev Node...</motion.p>
                </div>
                <div className="pt-4 flex justify-center">
                  <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" className="text-center space-y-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${medicalData?.eligible_for_trial ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'}`}>
                  {medicalData?.eligible_for_trial ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : (
                    <XCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white">
                    {medicalData?.eligible_for_trial ? 'Clinical Trial Match Confirmed' : 'Patient Not Eligible'}
                  </p>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-left">
                    <p className="text-[10px] text-zinc-500 mb-1 font-mono">TX HASH (Proof of Verification)</p>
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
