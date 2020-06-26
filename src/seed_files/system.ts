import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import * as util from '@polkadot/util';
import { xxhashAsU8a } from '@polkadot/util-crypto';

import { AccountAndBlock } from '../constants_and_types/types';
import { Accounts, createAccounts } from '../methods/createAccounts';
import { signAndSendInfo } from '../methods/signAndSendInfo';

export async function system(api: ApiPromise): Promise<AccountAndBlock[]> {
	const info: AccountAndBlock[] = [];
	const keys: Accounts = await createAccounts();

	// To see this unapplied slash using sidecar, access the `/staking` endpoint
	// at or after the block this unapplied slash it put into storage
	const unappliedSlash = api.createType('UnappliedSlash', {
		validator: keys.aliceStash.publicKey,
		own: api.createType('Balance', 1_415_510_610),
		others: [],
		reporters: api.createType('Vec<AccountId>', [keys.eve.publicKey]),
		payout: api.createType('Balance', 1_400_669_408),
	});

	console.log('\n unappliedSlash: ', unappliedSlash.toHuman());

	const slashVec = api.createType('Vec<UnappliedSlash>', [unappliedSlash]);
	console.log('\n slashVec: ', slashVec.toHuman());
	const era = api.createType('EraIndex', 0);

	// For our reference, this is the storage key for UnappliedSlashes
	// Lifted from https://github.com/shawntabrizi/substrate-graph-benchmarks/blob/master/js/extensions/known-keys.js#L280
	// {
	// 	"name": "staking unappliedSlashes",
	// 	"key": "0x5f3e4907f716ac89b6347d15ececedca042824170a5db4381fe3395039cabd24"
	// },

	// Create our key subparts
	const stakingModule = xxhashAsU8a('Staking', 128);
	const unappliedSlashesFunction = xxhashAsU8a('UnappliedSlashes', 128);
	const eraKey = xxhashAsU8a(era.toHex(), 64);
	const suffix = era.toU8a();

	// Concat our sub parts together
	const finalKey = new Uint8Array([
		...stakingModule,
		...unappliedSlashesFunction,
		...eraKey,
		...suffix,
	]);

	// Turn our U8Array to hex string so it plays a little more friendly
	const hexFinalKey = util.u8aToHex(finalKey);
	console.log('hexFinalKey', hexFinalKey);

	// Create the KeyValue pair that setStorage accepts
	// N.B. when I tried to use u8a values this didn't complain but the storage items did not encode
	// correctly. However passing a hex string seems to work fine
	const keyValue = api.createType('KeyValue', [
		hexFinalKey,
		slashVec.toHex(),
	]);

	console.log('\n keyValue: ', keyValue.toHuman());

	// We need origin::ROOT, so lets play gav and use sudo
	const setStorage = api.tx.system.setStorage([keyValue]);
	const sudoSetStorage = api.tx.sudo.sudo(setStorage);

	// Normal substrate-tx-seed stuff
	info.push(await signAndSendInfo(api, sudoSetStorage, keys.alice));

	// Now lets pull it back out of storage so we can decode and view it
	const extractedStorageValue = await api.rpc.state.getStorage(hexFinalKey);

	const recreateExtractedStorageValue = api.createType(
		'Vec<UnappliedSlash>',
		(extractedStorageValue as Option<Codec>).unwrap().toString()
	);
	console.log(
		'\n Our storage item decoded!: \n ',
		recreateExtractedStorageValue.toHuman()
	);

	console.log('\n Anything logged after this is not from system.ts \n');

	return info;
}
