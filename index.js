import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";

document.getElementById("connectBtn").onclick = connect;
document.getElementById("fundBtn").onclick = fund;
document.getElementById("getBalBtn").onclick = getBalance;
document.getElementById("withdrawBtn").onclick = withdraw;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log("err1: " + error);
    }
    document.getElementById("connectBtn").innerHTML = "Connected";
  } else {
    document.getElementById("connectBtn").innerHTML = "No Metamask";
  }
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const response = await contract.getOwner();
      console.log("Owner", response)
    } catch (err) {
      console.log("err3:", err);
    }
  }
}

async function fund() {
  const ethAmt = document.getElementById("fundInput").value;
  console.log("Funding with", { ethAmt }, "...");
  // provider - blockchain connection
  // signer - wallet - someone with some gas
  // ABI and address - contract
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const response = await contract.fund({
        value: ethers.utils.parseEther(ethAmt),
      });
      await listenForTransactionMine(response, provider);
    } catch (err) {
      console.log("err2:", err);
    }
  }
}

function listenForTransactionMine(response, provider) {
  console.log(`Mining ${response.hash}...`);
  //listen for transactions to finish
  return new Promise((resolve, reject) => {
    provider.once(response.hash, (receipt) => {
      // listener function
      console.log(`Completed with ${receipt.confirmations}.`);
      resolve();
    });
  });
}

async function withdraw(){
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log( `Provider: ${provider}`)

        const signer = provider.getSigner();
        console.log( `Signer: ${signer}`)

        const contract = new ethers.Contract(contractAddress, abi, signer);

        try{
            const response = await contract.withdraw()
            await listenForTransactionMine(response, provider)
        }catch(err){
            console.log(e)
        }
    }
}