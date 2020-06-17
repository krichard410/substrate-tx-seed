import Compact from '@polkadot/types/codec/Compact';
import { BlockNumber } from '@polkadot/types/interfaces';

export type AccountAndBlockCompact = {
	block: Compact<BlockNumber>;
	account: string;
};

export type AccountAndBlock = {
	block: number;
	account: string; // check if this can be changed
};
