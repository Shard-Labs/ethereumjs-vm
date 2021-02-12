import { ExecResult } from '../evm'
import { Address } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { PrecompileInput, PrecompileFunc } from './types'
import { default as p1 } from './01-ecrecover'
import { default as p2 } from './02-sha256'
import { default as p3 } from './03-ripemd160'
import { default as p4 } from './04-identity'
import { default as p5 } from './05-modexp'
import { default as p6 } from './06-ecadd'
import { default as p7 } from './07-ecmul'
import { default as p8 } from './08-ecpairing'
import { default as p9 } from './09-blake2f'
import { default as pf8 } from './f8-epochsize'
import { default as pfc } from './fc-fractionmulexp'
import { default as pfd } from './fd-transfer'
import { default as pa } from './0a-bls12-g1add'
import { default as pb } from './0b-bls12-g1mul'
import { default as pc } from './0c-bls12-g1multiexp'
import { default as pd } from './0d-bls12-g2add'
import { default as pe } from './0e-bls12-g2mul'
import { default as pf } from './0f-bls12-g2multiexp'
import { default as p10 } from './10-bls12-pairing'
import { default as p11 } from './11-bls12-map-fp-to-g1'
import { default as p12 } from './12-bls12-map-fp2-to-g2'

interface Precompiles {
  [key: string]: PrecompileFunc
}

export interface Func {
  (opts: PrecompileInput): ExecResult
}

function toAsync(a: Func): PrecompileFunc {
  return async function(opts: PrecompileInput) {
    return a(opts)
  }
}

interface PrecompileAvailability {
  [key: string]: PrecompileAvailabilityCheckType
}

type PrecompileAvailabilityCheckType =
  | PrecompileAvailabilityCheckTypeHardfork
  | PrecompileAvailabilityCheckTypeEIP

enum PrecompileAvailabilityCheck {
  EIP,
  Hardfork,
}

interface PrecompileAvailabilityCheckTypeHardfork {
  type: PrecompileAvailabilityCheck.Hardfork
  param: string
}

interface PrecompileAvailabilityCheckTypeEIP {
  type: PrecompileAvailabilityCheck.EIP
  param: number
}

const ripemdPrecompileAddress = '0000000000000000000000000000000000000003'
// TODO: Add toAsync() to precompiles?
const precompiles: Precompiles = {
  '0000000000000000000000000000000000000001': toAsync(p1),
  '0000000000000000000000000000000000000002': toAsync(p2),
  [ripemdPrecompileAddress]: toAsync(p3),
  '0000000000000000000000000000000000000004': toAsync(p4),
  '0000000000000000000000000000000000000005': toAsync(p5),
  '0000000000000000000000000000000000000006': toAsync(p6),
  '0000000000000000000000000000000000000007': toAsync(p7),
  '0000000000000000000000000000000000000008': toAsync(p8),
  '0000000000000000000000000000000000000009': toAsync(p9),
  '00000000000000000000000000000000000000f8': toAsync(pf8),
  '00000000000000000000000000000000000000fc': toAsync(pfc),
  '00000000000000000000000000000000000000fd': pfd,
  '000000000000000000000000000000000000000a': pa,
  '000000000000000000000000000000000000000b': pb,
  '000000000000000000000000000000000000000c': pc,
  '000000000000000000000000000000000000000d': pd,
  '000000000000000000000000000000000000000e': pe,
  '000000000000000000000000000000000000000f': pf,
  '0000000000000000000000000000000000000010': p10,
  '0000000000000000000000000000000000000011': p11,
  '0000000000000000000000000000000000000012': p12,
}

// TODO: Add pf8, pfc and pfd?
const precompileAvailability: PrecompileAvailability = {
  '0000000000000000000000000000000000000001': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'chainstart',
  },
  '0000000000000000000000000000000000000002': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'chainstart',
  },
  [ripemdPrecompileAddress]: {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'chainstart',
  },
  '0000000000000000000000000000000000000004': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'chainstart',
  },
  '0000000000000000000000000000000000000005': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'byzantium',
  },
  '0000000000000000000000000000000000000006': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'byzantium',
  },
  '0000000000000000000000000000000000000007': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'byzantium',
  },
  '0000000000000000000000000000000000000008': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'byzantium',
  },
  '0000000000000000000000000000000000000009': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: 'istanbul',
  },
  '000000000000000000000000000000000000000a': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000b': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000c': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000d': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000f': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000e': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '0000000000000000000000000000000000000010': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '0000000000000000000000000000000000000011': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '0000000000000000000000000000000000000012': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
}

function getPrecompile(address: Address, common: Common): PrecompileFunc {
  const addr = address.buf.toString('hex')
  if (precompiles[addr]) {
    const availability = precompileAvailability[addr]
    if (
      (availability.type == PrecompileAvailabilityCheck.Hardfork &&
        common.gteHardfork(availability.param)) ||
      (availability.type == PrecompileAvailabilityCheck.EIP &&
        common.eips().includes(availability.param))
    ) {
      return precompiles[addr]
    }
  }
  return precompiles['']
}

export { precompiles, getPrecompile, PrecompileFunc, PrecompileInput, ripemdPrecompileAddress }
