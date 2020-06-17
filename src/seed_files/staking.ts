import { ApiPromise } from '@polkadot/api';

import { MICRO, UNIT } from '../constants_and_types/constants';
import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

// https://polkadot.js.org/api/substrate/extrinsics.html#staking
export async function staking(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	const keys: Accounts = await createAccounts();

	// Let eve bond with controller
	const bond = api.tx.staking.bond(keys.eve.address, 1 * UNIT, 'Controller');

	// TODO change this to ALICE_STASH
	info.push(await signAndSendInfo(api, bond, keys.alice));

	const nominate = api.tx.staking.nominate([keys.aliceStash.address]);
	info.push(await signAndSendInfo(api, nominate, keys.eve));

	// This doesn't work how I think it should, suggestions?
	const validate = api.tx.staking.validate({ commission: 0.1 });
	info.push(await signAndSendInfo(api, validate, keys.eve));

	return info;
}
