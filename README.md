# 🧬 Midnight Clinical Trial Matcher
**Privacy-Preserving Healthcare Verification via Zero-Knowledge Proofs**

Built for the **MLH AI Track**, this project leverages the **Midnight Blockchain** to solve one of the most legally complex issues in software: HIPAA-compliant data matching.

## 🚨 The Problem: Clinical Trial Matching
Pharmaceutical companies spend billions trying to find eligible patients for clinical trials. However, patients refuse to upload their entire raw medical history to centralized matching databases. Doing so risks exposing pre-existing conditions (like Cardiovascular Disease or Kidney issues) to insurance companies, employers, or bad actors.

## 🛡️ The Midnight Solution
The Midnight Clinical Trial Matcher completely flips this paradigm by bringing the computation to the data, rather than the data to the computation.

1. **Local AI Screening**: The user uploads their highly sensitive medical lab results locally. A local HIPAA-compliant AI instance extracts the necessary biological markers (e.g., Hemoglobin A1C). *The raw PDF never leaves the local machine.*
2. **Zero-Knowledge Proofs**: The application utilizes a `Compact` smart contract to mathematically verify the patient meets the strict trial requirements (e.g., A1C > 7.0, no history of CVD).
3. **Immutable Verification**: The application generates a Zero-Knowledge Proof and anchors it to the Midnight Blockchain. The blockchain only sees `{"Eligible": PASS}`, allowing the patient to claim their spot and compensation securely without ever revealing their underlying medical history.

---

## 🏗️ Architecture & Tech Stack

- **Smart Contract**: `Compact` (Midnight's native ZK language).
- **Backend Infrastructure**: Node.js & `@midnight-ntwrk/wallet-sdk-hd`.
- **AI Extraction**: GROQ API (`llama-3.3-70b-versatile`) for ultra-fast, local-like document parsing.
- **Frontend**: React + Vite + Tailwind CSS with a dynamic "Privacy Split-View" architecture.

---

## 📂 Key Project Files (Code Review Guide)

If you are a judge reviewing the codebase, please refer to the following files:

- `src/contracts/clinical_trial.compact`: The actual Zero-Knowledge circuit asserting the clinical trial conditions.
- `src/utils/midnight-wallet.ts`: The Headless Wallet integration, demonstrating how we securely derive keys and connect to the local Midnight Docker node (`http://127.0.0.1:9944`) and Proof Server (`http://127.0.0.1:6300`).
- `server.ts`: The backend logic handling the AI medical extraction and the simulated ZK transaction lifecycle.
- `src/components/PrivacyView.tsx`: The UI component that visually demonstrates the "What You See vs. What the Blockchain Sees" paradigm.

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- Node.js (v18 or higher)
- A GROQ API Key (for the medical document OCR)

### 2. Environment Setup
Create a `.env` file in the root directory and add your GROQ API key:
```env
GROQ_API_KEY=gsk_your_api_key_here
```

### 3. Install & Run
```bash
npm install
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Running the Demo
1. Click **Start Verification Flow**.
2. Click **Load Flawless Demo Data** (or upload your own PDF with A1C and cardiovascular markers).
3. Watch the local AI extract the biological markers in real-time.
4. Click **Generate ZK Eligibility Proof** to witness the Midnight transaction simulation and view the cryptographic privacy split.

---

## 🔮 Future Roadmap
- **Midnight Mainnet**: Transitioning from the local dev-node to the live Midnight Network once deployed.
- **ZK Token Compensation**: Automatically distributing `NIGHT` tokens to verified trial participants via the smart contract.
- **On-Device LLMs**: Replacing the Groq API with an entirely offline WebGPU-based LLM (like Llama-3 8B) for absolute zero-network-access medical parsing.

---
*Built with ❤️ for privacy-first healthcare.*
