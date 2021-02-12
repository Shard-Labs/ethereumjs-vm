import BN = require('bn.js')
import Common from '@ethereumjs/common'
import { ExecResult } from '../evm'
import PStateManager from '../../state/promisified'
import VM from '../../index'

export interface PrecompileFunc {
  (opts: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: BN
  _common: Common
  _state: PStateManager
  _VM: VM
}
