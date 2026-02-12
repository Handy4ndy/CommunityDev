// NFT Mint test script

require('dotenv').config();
const xrpl = require('xrpl');

async function main() {
    // Connect to the XRPL testnet
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    // Load wallet from seed
    const wallet = xrpl.Wallet.fromSeed(process.env.SEED);

    // Define the transaction
    const transaction = {
        "TransactionType": "NFTokenMint",
        "Account": wallet.address,
        "TransferFee": 5000,
        "NFTokenTaxon": 0,
        "Flags": 25,
        "URI": "OLD_URI_LINK_INSERTED_HERE",
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