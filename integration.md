# Midnight ZK Credit Score Integration

This application demonstrates a privacy-preserving credit score check using Midnight's Zero-Knowledge proofs.

## Technical Details

- **Contract Address:** `0x0000000000000000000000000000000000000000` (Local Node / Testnet)
- **ABI Location:** `/src/contracts/credit_score.compact`
- **Backend API:** `/api/analyze-credit` (Proxies to GROQ-compatible inference for optional data analysis)
- **Wallet Connection:** Uses the **1am-wallet** browser extension. Supports a **Demo Mode** fallback if the extension is not detected.
- **Data Ingestion:** Supports manual bill entry and **PDF Upload** (AI-assisted parsing).

## Wallet Connect Flow

1. Detect `window.OneAM` provider.
2. Request accounts using `eth_requestAccounts`.
3. Initialize `MidnightSDK` with the 1am provider.
4. If `window.OneAM` is missing, the app enters **Demo Mode** using a mock provider.

## PDF Upload & Private Data

Users can upload PDF utility bills. In a production environment, these are parsed locally (using a library like `pdf.js`) or via a privacy-preserving API route. The parsed data is then used as private input for the ZK circuit.

## Dummy Data

Dummy financial data is stored in `src/dummyData.ts`. You can modify the values there to test different credit score scenarios.

## Proof Flow

1. **Local Data:** Financial records are kept locally.
2. **ZK Proof:** Midnight SDK generates a proof that the score is above a threshold without revealing the underlying data.
3. **Submission:** The proof is submitted to the Midnight network.
