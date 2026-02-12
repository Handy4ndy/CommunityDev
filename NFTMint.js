/*
  =====================================================================
                         NFTokenMint Script
  =====================================================================
  
  DESCRIPTION:
    Create a non-fungible token (NFT) on the XRP Ledger testnet.
    This is the only opportunity for the minter to specify immutable
    token fields and flags.
  
  TRANSACTION TYPE:
    NFTokenMint
    - Creates a new NFToken object in the minter's NFTokenPage
    - Can be sent by the token issuer or authorized minter
    - Part of the NonFungibleTokensV1_1 amendment (Enabled: 2022-10-31)
  
  KEY FIELDS:
    - Account: Minter's wallet address
    - TransferFee: Secondary sales fee (0-50000 = 0.00%-50.00%)
    - NFTokenTaxon: Arbitrary ID for series/collection of related NFTs
    - Flags: Transaction behavior modifiers (Burnable, Transferable, etc.)
    - URI: Up to 256 bytes pointing to token data/metadata (must be in hex format)
  
  AVAILABLE FLAGS (Decimal Values):
    - tfBurnable (1): Allow issuer to destroy the NFToken
    - tfOnlyXRP (2): NFToken only bought/sold for XRP (not other currencies)
    - tfTrustLine (4): DEPRECATED - creates trust lines for transfer fees
    - tfTransferable (8): Allow token transfers to non-issuer accounts
    - tfMutable (16): Allow URI updates via NFTokenModify transaction
  
  FLAG COMBINATIONS:
    Flag 25 = tfBurnable (1) + tfTransferable (8) + tfMutable (16)
             Allows burning, transferring, and URI modifications
  
  NETWORK:
    XRP Ledger Testnet (Altnet)
    Endpoint: wss://s.altnet.rippletest.net:51233
  
  USAGE:
    1. Set SEED to your testnet seed (replace placeholder)
    2. Provide URI in hexadecimal format (e.g., from xrpl.convertStringToHex())
    3. Run script to mint and submit transaction
  
  RETURNS:
    Transaction result with confirmation and ledger index

  RESOURCES:
    - NFTokenMint : https://xrpl.org/docs/references/protocol/transactions/types/nftokenmint
    - Testing Faucet : https://xrpl.org/resources/dev-tools/xrp-faucets
  
  =====================================================================
*/

const xrpl = require('xrpl');

async function main() {
   
    // Testnet seed - replace with your own for actual use
    const SEED = 'sEdTjynt4jzeM89fckjF14iENDmEoMy';

    // Connect to the XRPL testnet
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    // Load wallet from seed
    const wallet = xrpl.Wallet.fromSeed(SEED);

    // Define the transaction
    const transaction = {
        "TransactionType": "NFTokenMint",
        "Account": wallet.address,
        "TransferFee": 5000,
        "NFTokenTaxon": 0,
        "Flags": 25, 
        "URI": "OLD_URI_HEX_INSERTED_HERE",
        "Memos": [
            {
                "Memo": {
                    "MemoType": "4E46546F6B656E54657374696E67",
                    "MemoData": "587370656E6365"
                }
            }
        ]
    };

    // Auto-fill fields
    const prepared = await client.autofill(transaction);

    // Sign the transaction
    const signed = wallet.sign(prepared);

    // Submit the transaction
    const result = await client.submitAndWait(signed.tx_blob);

    console.log('Transaction result:', result);

    // Disconnect
    await client.disconnect();
}

main().catch(console.error);