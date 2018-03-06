import angular from 'angular'

import { Lottery } from './lottery'
import { $11x5 } from './$11x5'
import { Yb } from './yb'
import { K3 } from './k3'
import { Pk10 } from './pk10'
import { Pcdd } from './pcdd'
import { Lhc } from './lhc'
import { Core } from './core'
import { Layer } from './layer'
import { Util } from './util'
import { Indexeddb } from './indexeddb'
import { CtrlUtil } from './ctrlUtil'
import { Ssc } from './ssc'
import { Sc } from './sc'
import { SKl10 } from './s_kl10'
import { S11x5 } from './s_11x5'

export default angular
	.module('main.service', [])
	.factory('Lottery', Lottery)
	.factory('$11x5', $11x5)
	.factory('Yb', Yb)
	.factory('K3', K3)
	.factory('Pk10', Pk10)
	.factory('Pcdd', Pcdd)
	.factory('Lhc', Lhc)
	.factory('Core', Core)
	.factory('Layer', Layer)
	.factory('Util', Util)
    .factory('Indexeddb', Indexeddb)
    .factory('CtrlUtil', CtrlUtil)
    .factory('Ssc', Ssc)
    .factory('Sc', Sc)
    .factory('SKl10', SKl10)
    .factory('S11x5', S11x5)
	.name