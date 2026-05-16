# Midnight ZK Credit Score App

A privacy-preserving credit score application built on the **Midnight Network** using Zero-Knowledge proofs.

## Features

- **ZK Proof Generation**: Prove your credit score is above a threshold without revealing underlying financial data.
- **1am-wallet Integration**: Seamlessly connect to the Midnight network using the browser wallet.
- **PDF Bill Parsing**: Upload utility bills in PDF form for local evidence verification.
- **AI-Enhanced Analysis**: Optional server-side analysis of credit data (using GROQ) for improved scoring models.
- **Privacy First**: Raw data stays on your machine. Only succinct proofs are transmitted to the blockchain.

## Technical Stack

- **Frontend**: React, Tailwind CSS, Motion
- **Blockchain**: Midnight Network (Compact Runtime)
- **Wallet**: 1am-wallet
- **AI**: GROQ-compatible inference (Server-side)

## Development Mode

If the **1am-wallet** extension is not detected, the app automatically falls back to **Demo Mode**.
- Proof generation is simulated.
- Transaction submission is mocked with realistic network delays.
- Visualizations show the difference between "Local View" and "Blockchain View".

## Setup

1. Install dependencies: `npm install`
2. Configure environmental variables (see `.env.example`)
3. Start the dev server: `npm run dev`

---

*Note: This is a prototype showcasing the integration flow between Midnight and 1am-wallet.*
