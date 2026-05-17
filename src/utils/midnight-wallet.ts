// @ts-nocheck
import { type Resource, type ContractAddress } from '@midnight-ntwrk/midnight-js-types';
import { type WalletProvider } from '@midnight-ntwrk/midnight-js-types';
import { WalletBuilder } from '@midnight-ntwrk/wallet-sdk-hd';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { FetchZkEnvProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-env-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { randomBytes } from 'crypto';

export class HeadlessWalletProvider implements WalletProvider {
  private walletBuilder: WalletBuilder;
  private seed: Uint8Array;

  constructor() {
    console.log("Initializing Midnight Headless Wallet for backend ZK Proof generation...");
    
    // In production, load from secure vault. For hackathon, generate a random local seed.
    this.seed = randomBytes(32);
    
    this.walletBuilder = new WalletBuilder(this.seed);
  }

  /**
   * Connects the headless wallet to the local Docker node environment.
   */
  async buildProviders(): Promise<MidnightProviders> {
    const LOCAL_NODE_URL = 'http://127.0.0.1:9944';
    const PROOF_SERVER_URL = 'http://127.0.0.1:6300';
    const INDEXER_URL = 'http://127.0.0.1:8088/api/v1/graphql';

    console.log(`Connecting to Midnight Local Node at ${LOCAL_NODE_URL}...`);

    return {
      privateStateProvider: this.walletBuilder.buildPrivateStateProvider(),
      zkConfigProvider: new NodeZkConfigProvider('dist/zk/'),
      zkEnvProvider: new FetchZkEnvProvider(LOCAL_NODE_URL),
      proofProvider: httpClientProofProvider(PROOF_SERVER_URL),
      publicDataProvider: this.walletBuilder.buildPublicDataProvider(INDEXER_URL),
      walletProvider: this
    };
  }
}
