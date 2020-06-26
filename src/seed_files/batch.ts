import { ApiPromise } from '@polkadot/api';
import { Keys } from '@polkadot/types/interfaces';

import { MICRO, UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

// https://polkadot.js.org/api/substrate/extrinsics.html#staking
export async function batch(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	const keys: Accounts = await createAccounts();

	// const newKeys = await api.rpc.author.rotateKeys();

	const doubleNestBatchTx = api.tx.utility.batch([
		api.tx.balances.transfer(keys.bob.address, 510),
	]);

	const nestedBatchTx = api.tx.utility.batch([
		api.tx.balances.transfer(keys.dave.address, 415),
		doubleNestBatchTx,
	]);

	const batchTx = [
		api.tx.balances.transfer(keys.bob.address, 1_000_000_000),
		// nestedBatchTx,
	];

	const batch = api.tx.utility.batch(batchTx);

	info.push(await signAndSendInfo(api, batch, keys.alice));

	return info;
}
