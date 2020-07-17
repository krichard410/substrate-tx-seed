# Overview

The idea is to be able to make scripts of transactions that can run standalone. The basic setup I have now is to create a script by making a function that takes in `api` and returns an array of `AccountAndBlock`s. 

`signAndSendInfo` is what makes it possible to easily take a Call and get the block number and sender of the Call.

`createAccounts` creates several `KeyringPair`s that allows you to easily create transactions with one of the accounts.

If I end up using this a lot, I will probably refactor to make it class based.

I am also considering putting a reconciler in this same repo.

## Getting Started

```
yarn
```

```
yarn start
```

## Contributing

```
yarn lint
```

```
yarn lint --fix
```

## Sending Transfers and Adding in your own generated accounts

First, ensure that you have a dev chain running in another terminal: `./target/release/polkadot --dev`. 

To add in your own account generated through subkey, head over to the `createAccounts` file, and switch out the mnemonic seed in there with your own. Inside the `main.ts` file, if you `console.log(keys.account Name here.toJson());` this will return data about your account. 

To send a transfer, you need to make some changes in the `transfer.ts` file:

```
const transferTo = api.tx.balances.transfer(keys.ACCOUNT RECEIVER NAME.address, 1060 * UNIT);
const batch = api.tx.utility.batch([transferTo]);
const txInfo = await signAndSendInfo(api, batch, keys.alice); 
// above: send units from Alice to batch (you need to change the account reciever value to the account you want to transfer to
```
Then inside `main.ts`, you need to call `info = info.concat(await transfer(api));` to be able to send the transfer. When `yarn start` is running, it will return the block number and the address of that transaction, which you can see on the Polkadot.js UI.
