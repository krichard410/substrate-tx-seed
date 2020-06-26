import { ApiPromise } from '@polkadot/api';
import { Keys } from '@polkadot/types/interfaces';

// import { MICRO, UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
// import { Accounts, createAccounts } from '../methods/createAccounts';
// import { signAndSendInfo } from '../methods/signAndSendInfo';

// https://polkadot.js.org/api/substrate/extrinsics.html#staking
export async function session(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	// const keys: Accounts = await createAccounts();
	const unappliedSlash = api.createType('UnappliedSlash', {
		validator: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
		own: 1_000_000_000,
		others: [],
		payout: 1_000_000_000,
	});

	const slashVec = api.createType('Vec<UnappliedSlash>', [unappliedSlash]);

	const slashMap = api.createType('MapTypeLatest', {
		hasher: api.createType('StorageHasherV11', 'Twox64Concat'),
		key: api.createType('EraIndex', 1),
		linked: true,
		value: slashVec,
	});

	console.log(slashMap.toString());
	// api.tx.system.setStorage();

	// const newKeys = await api.rpc.author.rotateKeys();

	// const set = api.tx.session.setKeys(newKeys, keys.alice);

	// api.tx.session.setKeys(keys :Keys, proof: String)

	return info;
}
