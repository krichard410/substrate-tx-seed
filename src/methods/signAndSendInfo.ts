import ApiPromise from '@polkadot/api/promise';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';

import { AccountAndBlock } from '../constants_and_types/types';

// Maybe this could be added to an interface of SubmittableExtrinsic in the future?
export async function signAndSendInfo(
	api: ApiPromise,
	submittable: SubmittableExtrinsic<'promise'>,
	sender: KeyringPair
): Promise<AccountAndBlock> {
	return new Promise((resolve): void => {
		void submittable.signAndSend(sender, async ({ status }) => {
			if (status.isInBlock) {
				const { block } = await api.rpc.chain.getBlock(
					status.asInBlock
				);
				resolve({
					block: block.header.number.toNumber(),
					account: sender.address,
				});
			}
		});
	});
}
