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
