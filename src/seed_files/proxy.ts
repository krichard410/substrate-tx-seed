import { ApiPromise } from '@polkadot/api';

// import { MICRO, UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

// https://polkadot.js.org/api/substrate/extrinsics.html#staking
export async function proxy(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	const keys: Accounts = await createAccounts();

	const addProxy = api.tx.proxy.addProxy(keys.bob.address, 'Any');

	info.push(await signAndSendInfo(api, addProxy, keys.alice));
	return info;
}
