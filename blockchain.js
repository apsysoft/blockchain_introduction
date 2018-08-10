const SHA256 = require('crypto-js/sha256')
const moment = require('moment')


/**
 * Class representing a block of information in a blockchain
 *
 * @class Block
 */
class Block {


    /**
     *Creates an instance of Block.
     * @param {*} index
     * @param {*} timestamp
     * @param {*} data
     * @param {string} [previousHash='']
     * @memberof Block
     */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash()
    }


    /**
     *Execute hash calculation for the actual block
     *
     * @returns
     * @memberof Block
     */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


/**
 * Class representing the blockchain
 *
 * @class Blockchain
 */
class Blockchain {


    /**
     *Creates an instance of Blockchain.
     * @memberof Blockchain
     */
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }


    /**
     * Create the genesis block
     *
     * @returns
     * @memberof Blockchain
     */
    createGenesisBlock() {
        return new Block(0, moment(), "Genesis block", "0" );
    }


    /**
     * Get the last inserted block
     *
     * @returns
     * @memberof Blockchain
     */
    getLatestBlock () {
        return this.chain[this.chain.length -1];
    }


    /**
     * Add a new block in the last part of the blockchain
     *
     * @param {*} newBlock
     * @memberof Blockchain
     */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }


    /**
     * Determine if the blockchain is valid
     *
     * @returns
     * @memberof Blockchain
     */
    isValid() {
        for(let i = 1; i < this.chain.length; i++) {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i-1];
            let currentBlockHash = currentBlock.calculateHash();
            if (currentBlock.hash !== currentBlockHash) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let myBlockchain  = new Blockchain();
myBlockchain.addBlock(new Block(1, moment().add(1, 'minute'), { ammount: 4 }));
myBlockchain.addBlock(new Block(2, moment().add(2, 'minute'), { ammount: 10 }));
console.log("Is my blockchain valid?: ", myBlockchain.isValid());

// Alter the second block of our blockchain
myBlockchain.chain[1].data = { ammount: 400 };
myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash();
console.log("Is my blockchain valid?: ", myBlockchain.isValid());