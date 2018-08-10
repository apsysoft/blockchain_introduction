# Creando un Blockchain con Javascript | Apsys HandOnLab #

>_Basado en _Creating a blockchain with Javascript_, **Simply Explained** https://www.youtube.com/watch?v=zVqczFZr124

Esta práctica pretende explicar los conceptos básicos relacionados con la tecnología blockchain, a través de la generación de un HandOnLab que simplifica la implementación real y completa de frameworks como _Bitcoin_, _Ethereum_ o _HyperLedger_

El repositorio con el código de este ejercicio está disponible en la github en la siguiente dirección 
>https://github.com/apsysoft/blockchain_introduction.git

## Crear el block ##

1. Crear un nuevo folder en la carpeta de desarrollo con el nombre `blockchain_handsonlab`. En mi caso será `d:\devel\blockchain_handsonlab`
2. Abrir la carpeta con un editor de código que facilite el trabajo con JavaScript y agregar un archivo con nombre `blockchain.js`.

>Para este HandsOnLab usaremos _Visual Studio Code_ como editor

3. Definir la clase Block como se muestra a continuaciòn

```javascript
class Block {

    constructor (index, timeStamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
    }
}
```

## Calcular el hash del Block ##

En terminos simples, realizar _hashing_ significa tomar una cadena de caracteres de cualquier tamaño y convertirlo en una cadena con una longitud preestablecida. Uno de los algoritmos usados comunmente es **SHA-256** que produce una salida de una cadena de 256 caracteres, sin importar el tamaño de la cadena original.

Codifiquemos una funcion que calcule el hash de nuestro _block_

4. Instalar SHA256 `npm install crypto-js --save`

```javascript
const SHA256 = require('crypto-js/sha256')

class Block {

    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash()
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}
```

## Crear el Blockchain ##

5. Instalar momentjs `npm install moment --save`

6. Crear la clase que represente a la cadena de _blocks_ como se muestra a continuación

```javascript
...
const moment = require('moment')
...

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, moment(), "Genesis block", "0" );
    }
}
```

El metodo `createGenesisBlock()` es el encargado de crear el primer _block_ de información del _blockchain_. Este _block_ inicial tiene la característica única de no tener un _block_ predecesor.
>Nota que el timestamp es proporcionado por la función `moment()`

7. Ejecutemos el programa para visualizar nuestro _blockchain_ con el _block_ génesis. Agregar las siguientes líneas de código al final del archivo

```javascript
let myBlockchain  = new Blockchain();
console.log("My blockchain: ", JSON.stringify(myBlockchain, null, 2))
```

8. Ejecuta `node blockchain.js` en la terminal y vea la salida en la consola

```json
My blockchain:  {
  "chain": [
    {
      "index": 0,
      "timestamp": "2018-08-09T22:47:57.229Z",
      "data": "Genesis block",
      "previousHash": "0",
      "hash": "7a8577c33bb4f5c544e9496c9f5b500db8fbef8ec3e070085ed786f5a73d00d4"
    }
  ]
}
```

9. Agreguemos nuevos _blocks_ a nuestro _blockchain_. Modifiquemos nuestra clase _blockchain_ de la siguiente manera

```javascript
class BlockChain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, moment(), "Genesis block", "0" );
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    getLatestBlock () {
        return this.chain[this.chain.length -1];
    }

}
```

El método `addBlock(newBlock)` concatena un nuevo _block_ de información a nuestro _blockchain_. Nota que la línea `newBlock.previousHash = this.getLatestBlock().hash` vincula al _block_ nuevo con el útimo _block_ de la cadena.

La linea `newBlock.hash = newBlock.calculateHash()` establece el hash del nuevo _block_ antes de insertar al final del _blockchain_

10. Modifiquemos las líneas al final de nuestro archivo para verificar la inserción de nuevos _blocks_

```javascript
let myBlockchain  = new Blockchain();
myBlockchain.addBlock(new Block(1, moment().add(1, 'minute'), { ammount: 4 }));
myBlockchain.addBlock(new Block(2, moment().add(2, 'minute'), { ammount: 10 }));
console.log("My blockchain: ", JSON.stringify(myBlockchain, null, 2))

```

## Integridad del blockchain ##

Uno de los principios fundamentales del _blockchain_ es su **_trustless_**, es decir que la habilidad de confiar en la información almacenada no depende de una tercera parte, asi como tampoco de las intenciones o intereses de una de las partes involucradas. Implementemos un mecanismo de verificación en nuestro _blockchain_

11. Ajustemos el código de la siguiente manera

```javascript
let myBlockchain  = new Blockchain();
myBlockchain.addBlock(new Block(1, moment().add(1, 'minute'), { ammount: 4 }));
myBlockchain.addBlock(new Block(2, moment().add(2, 'minute'), { ammount: 10 }));
console.log("My blockchain: ", JSON.stringify(myBlockchain, null, 2));

// Alter the second block of our blockchain
myBlockchain.chain[1].data = { ammount: 400 };
console.log("My blockchain: ", JSON.stringify(myBlockchain, null, 2))
```

12. Ejecutemos nuevamente nuestro programa. El resultado deberá mostrar que hemos alterado nuestro segundo _block_ de nuestro _blockchain_, por lo que debemos implementar mecanismos para detectar estas alteraciones. Modifiquemos nuestra clase `Blockchain` de la siguiente manera

```javascript
class BlockChain {

constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, moment(), "Genesis block", "0" );
    }

    getLatestBlock () {
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isValid() {
        for(let i = 1; i < this.chain.length; i++) {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i-1];
            let currentBlockHash = currentBlock.calculateHash();
            if (currentBlock.hash !== currentBlockHash) {
                return false;
            }
        }
        return true;
    }
}
```

13. Modifique las líneas finales de nuestro código de la siguiente manera

```javascript
let myBlockchain  = new Blockchain();
myBlockchain.addBlock(new Block(1, moment().add(1, 'minute'), { ammount: 4 }));
myBlockchain.addBlock(new Block(2, moment().add(2, 'minute'), { ammount: 10 }));
console.log("Is my blockchain valid?: ", myBlockchain.isValid());

// Alter the second block of our blockchain
myBlockchain.chain[1].data = { ammount: 400 };
console.log("Is my blockchain valid?: ", myBlockchain.isValid());
```

14. Ejecute el programa y vea el resultado en la consola

``` javascript
Is my blockchain valid?:  true
Is my blockchain valid?:  false
```

Como podrás observar, la primera línea de la salida en consola indica la validez del _blockchain_. La segunda línea sin embargo advierte que el contenido del _block_ ha sido alterado en este punto 

>`if (currentBlock.hash !== currentBlockHash) { return false }`

15. Esta validación nos ayuda a saber si contenido ha sido modificado, pero qué pasa si recalculamos el hash del _block_ modificado? Modifica las lineas siguientes y verifica la salida en la consola

```javascript
let myBlockchain  = new Blockchain();
myBlockchain.addBlock(new Block(1, moment().add(1, 'minute'), { ammount: 4 }));
myBlockchain.addBlock(new Block(2, moment().add(2, 'minute'), { ammount: 10 }));
console.log("Is my blockchain valid?: ", myBlockchain.isValid());

// Alter the second block of our blockchain
myBlockchain.chain[1].data = { ammount: 400 };
myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash();
console.log("Is my blockchain valid?: ", myBlockchain.isValid());
```

16. Como podrás observar en la consola, nuestro algoritmo de validación falla por que el _hash_ del _block_ cumple con la validación establecida. Modifiquemos nuestra validación de la siguiente manera

```javascript
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
```

Si consultas la información de la consola confirmarás que se ha detectado correctamente la alteración en nuestro _blockchain_ comprobando que la vinculación entre los bloques ha sido rota
>`if (currentBlock.previousHash !== previousBlock.hash) { return false; }`

## Siguientes pasos ##

* Implementar mecanismos para impedir que se puedan recalcular todos los hashes de nuestro blockchain a traves de un _ProofOfWork_.