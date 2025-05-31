
async function sendSol() {
  try {
    const recipient = "AmyBQrDYHux7Hiw1Exwqxt9Rn1AhNPpktjAYeM5tpTc3";
    const amount = prompt("Enter amount of SOL to send:");

    if (!window.solana) {
      alert("Phantom wallet not found!");
      return;
    }

    const provider = window.solana;
    await provider.connect();
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
    const fromPubkey = provider.publicKey;

    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey,
        toPubkey: new solanaWeb3.PublicKey(recipient),
        lamports: parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL
      })
    );

    transaction.feePayer = fromPubkey;
    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    alert("Transaction sent! Signature: " + signature);
  } catch (err) {
    console.error(err);
    alert("Transaction failed!");
  }
}
