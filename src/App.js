import './App.css';
import { useState, useEffect } from 'react';
import {ethers} from "ethers";
import { approve, deposit } from './bridge';
import rootChainTokenAbi from './abi/ChainTokenMatic.json';
import rootErc20PredicateAbi from './abi/rootErc20Predicate.json';

const rootErc20PredicateContractAddress = "0xdf3C0375CD3dfb3Df6EaE5794f70C5D2Be0B13C7"
const rootChainTokenContractAddress = "0x783288fb03079238dd917794ec16F812eB25B390"


function App() {

  const [address, setAddress] = useState("")
  const [signer, setSigner] = useState({})
  const [approveTxHash, setApproveTxHash] = useState("")
  const [depositTxHash, setDepositTxHash] = useState("")
  const [provider, setProvider] = useState({})
  const [rootChainTokenContract, setRootChainTokenContract] = useState();
  const [rootErc20PredicateContract, setRootErc20PredicateContract] = useState();
  const [depositAmount, setDepositAmount] = useState(0);

  const getSigner = async ()=>{

    if(window.ethereum){
      try {

        const accounts = await window.ethereum.request({
          method : "eth_requestAccounts"
        })
        
        setProvider(new ethers.providers.Web3Provider(window.ethereum))
        console.log("🚀 ~ file: App.js:21 ~ getSigner ~ provider:", provider)
        setAddress(accounts[0])
        
      } catch (error) {
        console.log("🚀 ~ file: App.js:14 ~ getSigner ~ error:", error)
      }
    }
  }
  
  const getApproval = async ()=>{
    let txHash = await approve(rootChainTokenContract, rootErc20PredicateContractAddress, signer)
    console.log("🚀 ~ file: App.js:40 ~ getApproval ~ txHash:", txHash)
    setApproveTxHash(txHash)
  }

  const makeDeposit = async ()=>{
    let txHash = await deposit(address, depositAmount, rootChainTokenContractAddress, rootErc20PredicateContract, signer)
    console.log("🚀 ~ file: App.js:40 ~ getApproval ~ txHash:", txHash)
    setDepositTxHash(txHash)
  }
  
  useEffect(()=>{
    console.log(depositAmount, typeof depositAmount)
    if (address) {
      console.log("🚀 ~ file: App.js:24 ~ getSigner ~ address:",address)
      setSigner(provider.getSigner(address))
      setRootChainTokenContract(new ethers.Contract(rootChainTokenContractAddress, rootChainTokenAbi, provider))
      setRootErc20PredicateContract(new ethers.Contract(rootErc20PredicateContractAddress, rootErc20PredicateAbi, provider))
    }
  }, [address, approveTxHash, depositTxHash, depositAmount])

  return (
    <div className="App">
      <header className="App-header">
        <h3>Supernet Bridge Deposit</h3>

        <hr />

        <button onClick={getSigner}>1 - Connect Wallet</button>
        <h4>Wallet Address = <a href={`https://mumbai.polygonscan.com/address/${address}`} target="_blank">{address}</a></h4>
        <hr />

        <button onClick={getApproval}>2 - Approve</button>
        <h4>Approve Tx = <a href={`https://mumbai.polygonscan.com/tx/${approveTxHash}`} target="_blank">{approveTxHash}</a></h4>

        <hr />

        <h4>Enter Amount to Deposit : </h4> 
        
        <div>
        <input type="number" onChange={(event)=>{setDepositAmount(Number(event.target.value))}} />
        </div>
        
        <br />
        <hr />
        <br />

        <button onClick={makeDeposit}>4 - Deposit</button>
        <h4>Deposit Tx = <a href={`https://mumbai.polygonscan.com/tx/${depositTxHash}`} target="_blank">{depositTxHash}</a></h4>

      </header>
    </div>
  );
}

export default App;
