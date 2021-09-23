var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8507'));

var pollContractAddress = "0xBeB9CD5E95Df0081445c19A6F3ccB81fbF732Edc";
var fromAddress = "0x69cb58db6Fc66cf2dBfCb1167173A95112390A09";

var unlockAccount = function(pass) {
    web3.eth.personal.unlockAccount(fromAddress, pass, 300)
    .then(console.log("Account unlocked!"));
}

var pollingContractABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "selection",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getPoll",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "votes",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "checkPoll",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_voter",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "Voted",
        "type": "event"
    }
];

var deployContract = function() {
    var pollingContract = new web3.eth.Contract(pollingContractABI);
    pollingContract
        .deploy({
            data: "0x606060405260c060405190810160405280608481526020016104e56084913960019080519060200190610033929190610044565b50341561003f57600080fd5b6100e9565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008557805160ff19168380011785556100b3565b828001600101855582156100b3579182015b828111156100b2578251825591602001919060010190610097565b5b5090506100c091906100c4565b5090565b6100e691905b808211156100e25760008160009055506001016100ca565b5090565b90565b6103ed806100f86000396000f300606060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630121b93f1461006757806303c322781461008a578063d8bff5a514610118578063e8d7083314610165575b600080fd5b341561007257600080fd5b610088600480803590602001909190505061018e565b005b341561009557600080fd5b61009d6102a7565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100dd5780820151818401526020810190506100c2565b50505050905090810190601f16801561010a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561012357600080fd5b61014f600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061034f565b6040518082815260200191505060405180910390f35b341561017057600080fd5b610178610367565b6040518082815260200191505060405180910390f35b7f4d99b957a2bc29a30ebd96a7be8e68fe50a3c701db28a91436490b7d53870ca43382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a160008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151561024657600080fd5b6000811180156102565750600381105b151561026157600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b6102af6103ad565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103455780601f1061031a57610100808354040283529160200191610345565b820191906000526020600020905b81548152906001019060200180831161032857829003601f168201915b5050505050905090565b60006020528060005260406000206000915090505481565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b6020604051908101604052806000815250905600a165627a7a72305820c5bc6ab4f7eb93a6e27414d9d1858ab1ab6f76e637189661d26d4a70d0bebbf60029e382b3e383bce38392e383bce381afe99d9ee8aab2e7a88ee381abe38199e3828be381b9e3818de381a0e381a8e6809de38184e381bee38199e3818befbc9fe8b39be68890e381aae3828931e38292e38081e58f8de5afbee381aae3828932e38292766f7465e996a2e695b0e996a2e695b0e381abe6b8a1e38197e381bee38199e38082",
        })
        .send(
            {
                from: fromAddress,
                gas: 470000,
                gasPrice: '20000000',
            },
            function(error, transactionHash) {
                console.log(error);
                console.log(transactionHash);
            })
        .then(function(contract) {
            console.log(contract);
        });
}

var getPoll = function() {
    var pollingContract = new web3.eth.Contract(pollingContractABI, pollContractAddress);
    pollingContract.methods.getPoll().call().then(function(value) {
        console.log("subject: " + String(value));
    })
}

var checkPoll = function() {
    var pollingContract = new web3.eth.Contract(pollingContractABI, pollContractAddress);
    pollingContract.methods.checkPoll().call({
        from: fromAddress,
    }).then(function(value) {
        console.log("voted to:" + String(value));
    })
}

var submitVote = function(value) {
    var pollingContract = new web3.eth.Contract(pollingContractABI, pollContractAddress);
    pollingContract.methods.vote(value).send({
        from: fromAddress,
    }).then(function(value) {
        console.log("vote result:" + value);
    })
}

module.exports = {
    unlockAccount: unlockAccount,
    deployContract: deployContract,
    getPoll: getPoll,
    checkPoll: checkPoll,
    submitVote: submitVote,
};
