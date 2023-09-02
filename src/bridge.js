import {ethers} from "ethers"


export async function approve(rootChainTokenContract, rootErc20PredicateContractAddress, signer) {
    try {

        let txHash;
        let transaction;

        const amount = ethers.utils.parseEther(0xfffffffffffffff.toString())
        // approve
        let approveSignature = rootChainTokenContract.interface.encodeFunctionData("approve", [rootErc20PredicateContractAddress, amount])

        transaction = {
            from: signer.address,
            to: rootChainTokenContract.address,
            data: approveSignature,
            gasLimit: 250000
        }

        txHash = await signer.sendTransaction(transaction)
            .then(txDetails => {
                console.log()
                console.log(txDetails)
                return txDetails.hash
            })
            .catch((err) => {
                throw new Error(`Error in sendTransaction : ${JSON.stringify(err)}`)
            })

        await rootChainTokenContract.provider.getTransaction(txHash)
            .then(console.log)

        return txHash

    } catch (error) {
        console.log("🚀 ~ file: index.js:34 ~ approve ~ error:", error)
        return error
    }
}


export async function deposit(userAddress, amount, rootChainTokenContractAddress, rootErc20PredicateContract, signer) {
    try {

        let txHash;
        let transaction;

        amount = ethers.utils.parseEther(String(amount))

        // deposit
        let depositSignature = rootErc20PredicateContract.interface.encodeFunctionData("depositTo", [rootChainTokenContractAddress, userAddress, amount])

        transaction = {
            from: signer.address,
            to: rootErc20PredicateContract.address,
            data: depositSignature,
            gasLimit: 250000
        }

        txHash = await signer.sendTransaction(transaction)
            .then(txDetails => {
                console.log()
                console.log(txDetails)
                return txDetails.hash
            })
            .catch((err) => {
                throw new Error(`Error in sendTransaction : ${JSON.stringify(err)}`)
            })

        await rootErc20PredicateContract.provider.getTransaction(txHash)
            .then(console.log)

        return txHash

    } catch (error) {
        console.log("🚀 ~ file: bridge.js:75 ~ deposit ~ error:", error)
        return error
    }

}