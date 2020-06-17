import { ApiPromise } from '@polkadot/api';

import { MICRO, UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

// https://polkadot.js.org/api/substrate/extrinsics.html#staking
export async function sudo(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	const keys: Accounts = await createAccounts();

	const setEve = api.tx.balances.setBalance(
		keys.eve.address,
		4_321 * UNIT,
		555
	);
	const sudoSetEve = api.tx.sudo.sudo(setEve);

	info.push(await signAndSendInfo(api, sudoSetEve, keys.alice));

	const forceEve = api.tx.balances.forceTransfer(
		keys.eve.address,
		keys.dave.address,
		42 * UNIT
	);
	const sudoForceEve = api.tx.sudo.sudo(forceEve);
	info.push(await signAndSendInfo(api, sudoForceEve, keys.alice));

	return info;
}
