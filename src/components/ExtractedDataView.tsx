import { useState } from 'react';
import { User, Calendar, Activity, CheckCircle2, Eye, EyeOff, Lock, FileText, AlertTriangle } from 'lucide-react';
import type { MedicalData } from '../types';

interface ExtractedDataViewProps {
  medicalData: MedicalData;
}

export function ExtractedDataView({ medicalData: d }: ExtractedDataViewProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="border-t border-zinc-800/60 mx-6 mb-10">
      {/* Header with toggle */}
      <div className="flex items-center gap-4 py-6">
        <div className="h-px bg-zinc-800 flex-1" />
        <div className="flex items-center gap-3">
          <Lock className="w-3 h-3 text-zinc-600" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Private Medical Data</span>
          <button
            onClick={() => setVisible(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-700 hover:border-teal-500 hover:bg-teal-500/10 transition-all text-[10px] font-semibold text-zinc-400 hover:text-teal-400"
          >
            {visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {visible ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>

      {/* Privacy notice */}
      {!visible && (
        <div className="flex flex-col items-center justify-center py-8 gap-3 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 mb-6">
          <Lock className="w-6 h-6 text-zinc-600" />
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-zinc-400">Only you can see this data</p>
            <p className="text-[10px] text-zinc-600 max-w-xs">
              Your extracted medical history stays strictly on this device. Nothing is sent to the network — only the ZK eligibility proof is.
            </p>
          </div>
          <button
            onClick={() => setVisible(true)}
            className="mt-1 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3 h-3" /> View extracted data
          </button>
        </div>
      )}

      {visible && (<>

      {/* Patient info row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: <User className="w-3.5 h-3.5" />,      label: 'Patient ID', value: d.patient_id },
          { icon: <FileText className="w-3.5 h-3.5" />,  label: 'Provider',   value: d.provider },
          { icon: <Calendar className="w-3.5 h-3.5" />,  label: 'Date',       value: d.date },
          { icon: <Activity className="w-3.5 h-3.5" />,  label: 'AI Confidence', value: `${(d.confidence * 100).toFixed(0)}%` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500">{icon}<span className="text-[9px] uppercase tracking-widest">{label}</span></div>
            <p className="text-xs text-white font-mono truncate" title={value}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Lab Results */}
        {d.lab_results && d.lab_results.length > 0 && (
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lab Results</p>
            </div>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="px-4 py-2 text-left text-zinc-500 font-normal">Test</th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-normal">Value</th>
                  <th className="px-4 py-2 text-right text-zinc-500 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {d.lab_results.map((lab, i) => (
                  <tr key={i} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-2.5 text-zinc-300">{lab.test}</td>
                    <td className="px-4 py-2.5 text-right text-white font-bold">{lab.value}</td>
                    <td className={`px-4 py-2.5 text-right font-bold ${lab.flag === 'NORMAL' ? 'text-green-500' : 'text-red-400'}`}>
                      {lab.flag}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Right column: Diagnosed Conditions & Trial Match */}
        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Diagnosed Conditions</p>
            </div>
            <div className="p-4 space-y-2.5 font-mono text-[11px]">
              {d.diagnosed_conditions.map((condition, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-zinc-300">{condition}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">AI Clinical Summary</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-zinc-400 leading-relaxed italic">
                "{d.summary}"
              </p>
            </div>
          </div>
        </div>
      </div>
      </>)}
    </div>
  );
}
