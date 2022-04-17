# cosmwasm-typescript-gen

A Transpiler for CosmWasm Smart Contracts

<p align="center">
  <img width="120" src="https://user-images.githubusercontent.com/545047/163705368-bc899f6d-a2de-43ee-889b-dbf44e17f288.png">
</p>


```
npm install -g cosmwasm-typescript-gen
```

## usage

```
 cosmwasm-typescript-gen generate \
    --schema ./schema \
    --out ./src \
    --name MyContractName
 ```

### example 

```
git clone git@github.com:public-awesome/stargaze-contracts.git
cd stargaze-contracts/contracts/sg721/
cosmwasm-typescript-gen generate --schema ./schema --out ./ts --name SG721
```

### JSON Schema Generation

Currently you have to have the JSON Schema output. Here is an example to start:

```
## get the Rust contracts
git clone git@github.com:public-awesome/stargaze-contracts.git
cd stargaze-contracts
cargo build

## now build the schema
cd contracts/sg721/
cargo schema
```