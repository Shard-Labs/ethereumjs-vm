import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { BN, toBuffer, bufferToInt } from 'ethereumjs-util'
import { encode } from 'rlp'
import VM from './index'
import Bloom from './bloom'
import { RunTxResult } from './runTx'
import { StateManager } from './state/index'
import Account from '@ethereumjs/account'

/* DAO account list */

const DAOAccountList = [
"d4fe7bc31cedb7bfb8a345f31e668033056b2728",
"b3fb0e5aba0e20e5c49d252dfd30e102b171a425",
"2c19c7f9ae8b751e37aeb2d93a699722395ae18f",
"ecd135fa4f61a655311e86238c92adcd779555d2",
"1975bd06d486162d5dc297798dfc41edd5d160a7",
"a3acf3a1e16b1d7c315e23510fdd7847b48234f6",
"319f70bab6845585f412ec7724b744fec6095c85",
"06706dd3f2c9abf0a21ddcc6941d9b86f0596936",
"5c8536898fbb74fc7445814902fd08422eac56d0",
"6966ab0d485353095148a2155858910e0965b6f9",
"779543a0491a837ca36ce8c635d6154e3c4911a6",
"2a5ed960395e2a49b1c758cef4aa15213cfd874c",
"5c6e67ccd5849c0d29219c4f95f1a7a93b3f5dc5",
"9c50426be05db97f5d64fc54bf89eff947f0a321",
"200450f06520bdd6c527622a273333384d870efb",
"be8539bfe837b67d1282b2b1d61c3f723966f049",
"6b0c4d41ba9ab8d8cfb5d379c69a612f2ced8ecb",
"f1385fb24aad0cd7432824085e42aff90886fef5",
"d1ac8b1ef1b69ff51d1d401a476e7e612414f091",
"8163e7fb499e90f8544ea62bbf80d21cd26d9efd",
"51e0ddd9998364a2eb38588679f0d2c42653e4a6",
"627a0a960c079c21c34f7612d5d230e01b4ad4c7",
"f0b1aa0eb660754448a7937c022e30aa692fe0c5",
"24c4d950dfd4dd1902bbed3508144a54542bba94",
"9f27daea7aca0aa0446220b98d028715e3bc803d",
"a5dc5acd6a7968a4554d89d65e59b7fd3bff0f90",
"d9aef3a1e38a39c16b31d1ace71bca8ef58d315b",
"63ed5a272de2f6d968408b4acb9024f4cc208ebf",
"6f6704e5a10332af6672e50b3d9754dc460dfa4d",
"77ca7b50b6cd7e2f3fa008e24ab793fd56cb15f6",
"492ea3bb0f3315521c31f273e565b868fc090f17",
"0ff30d6de14a8224aa97b78aea5388d1c51c1f00",
"9ea779f907f0b315b364b0cfc39a0fde5b02a416",
"ceaeb481747ca6c540a000c1f3641f8cef161fa7",
"cc34673c6c40e791051898567a1222daf90be287",
"579a80d909f346fbfb1189493f521d7f48d52238",
"e308bd1ac5fda103967359b2712dd89deffb7973",
"4cb31628079fb14e4bc3cd5e30c2f7489b00960c",
"ac1ecab32727358dba8962a0f3b261731aad9723",
"4fd6ace747f06ece9c49699c7cabc62d02211f75",
"440c59b325d2997a134c2c7c60a8c61611212bad",
"4486a3d68fac6967006d7a517b889fd3f98c102b",
"9c15b54878ba618f494b38f0ae7443db6af648ba",
"27b137a85656544b1ccb5a0f2e561a5703c6a68f",
"21c7fdb9ed8d291d79ffd82eb2c4356ec0d81241",
"23b75c2f6791eef49c69684db4c6c1f93bf49a50",
"1ca6abd14d30affe533b24d7a21bff4c2d5e1f3b",
"b9637156d330c0d605a791f1c31ba5890582fe1c",
"6131c42fa982e56929107413a9d526fd99405560",
"1591fc0f688c81fbeb17f5426a162a7024d430c2",
"542a9515200d14b68e934e9830d91645a980dd7a",
"c4bbd073882dd2add2424cf47d35213405b01324",
"782495b7b3355efb2833d56ecb34dc22ad7dfcc4",
"58b95c9a9d5d26825e70a82b6adb139d3fd829eb",
"3ba4d81db016dc2890c81f3acec2454bff5aada5",
"b52042c8ca3f8aa246fa79c3feaa3d959347c0ab",
"e4ae1efdfc53b73893af49113d8694a057b9c0d1",
"3c02a7bc0391e86d91b7d144e61c2c01a25a79c5",
"0737a6b837f97f46ebade41b9bc3e1c509c85c53",
"97f43a37f595ab5dd318fb46e7a155eae057317a",
"52c5317c848ba20c7504cb2c8052abd1fde29d03",
"4863226780fe7c0356454236d3b1c8792785748d",
"5d2b2e6fcbe3b11d26b525e085ff818dae332479",
"5f9f3392e9f62f63b8eac0beb55541fc8627f42c",
"057b56736d32b86616a10f619859c6cd6f59092a",
"9aa008f65de0b923a2a4f02012ad034a5e2e2192",
"304a554a310c7e546dfe434669c62820b7d83490",
"914d1b8b43e92723e64fd0a06f5bdb8dd9b10c79",
"4deb0033bb26bc534b197e61d19e0733e5679784",
"07f5c1e1bc2c93e0402f23341973a0e043f7bf8a",
"35a051a0010aba705c9008d7a7eff6fb88f6ea7b",
"4fa802324e929786dbda3b8820dc7834e9134a2a",
"9da397b9e80755301a3b32173283a91c0ef6c87e",
"8d9edb3054ce5c5774a420ac37ebae0ac02343c6",
"0101f3be8ebb4bbd39a2e3b9a3639d4259832fd9",
"5dc28b15dffed94048d73806ce4b7a4612a1d48f",
"bcf899e6c7d9d5a215ab1e3444c86806fa854c76",
"12e626b0eebfe86a56d633b9864e389b45dcb260",
"a2f1ccba9395d7fcb155bba8bc92db9bafaeade7",
"ec8e57756626fdc07c63ad2eafbd28d08e7b0ca5",
"d164b088bd9108b60d0ca3751da4bceb207b0782",
"6231b6d0d5e77fe001c2a460bd9584fee60d409b",
"1cba23d343a983e9b5cfd19496b9a9701ada385f",
"a82f360a8d3455c5c41366975bde739c37bfeb8a",
"9fcd2deaff372a39cc679d5c5e4de7bafb0b1339",
"005f5cee7a43331d5a3d3eec71305925a62f34b6",
"0e0da70933f4c7849fc0d203f5d1d43b9ae4532d",
"d131637d5275fd1a68a3200f4ad25c71a2a9522e",
"bc07118b9ac290e4622f5e77a0853539789effbe",
"47e7aa56d6bdf3f36be34619660de61275420af8",
"acd87e28b0c9d1254e868b81cba4cc20d9a32225",
"adf80daec7ba8dcf15392f1ac611fff65d94f880",
"5524c55fb03cf21f549444ccbecb664d0acad706",
"40b803a9abce16f50f36a77ba41180eb90023925",
"fe24cdd8648121a43a7c86d289be4dd2951ed49f",
"17802f43a0137c506ba92291391a8a8f207f487d",
"253488078a4edf4d6f42f113d1e62836a942cf1a",
"86af3e9626fce1957c82e88cbf04ddf3a2ed7915",
"b136707642a4ea12fb4bae820f03d2562ebff487",
"dbe9b615a3ae8709af8b93336ce9b477e4ac0940",
"f14c14075d6c4ed84b86798af0956deef67365b5",
"ca544e5c4687d109611d0f8f928b53a25af72448",
"aeeb8ff27288bdabc0fa5ebb731b6f409507516c",
"cbb9d3703e651b0d496cdefb8b92c25aeb2171f7",
"6d87578288b6cb5549d5076a207456a1f6a63dc0",
"b2c6f0dfbb716ac562e2d85d6cb2f8d5ee87603e",
"accc230e8a6e5be9160b8cdf2864dd2a001c28b6",
"2b3455ec7fedf16e646268bf88846bd7a2319bb2",
"4613f3bca5c44ea06337a9e439fbc6d42e501d0a",
"d343b217de44030afaa275f54d31a9317c7f441e",
"84ef4b2357079cd7a7c69fd7a37cd0609a679106",
"da2fef9e4a3230988ff17df2165440f37e8b1708",
"f4c64518ea10f995918a454158c6b61407ea345c",
"7602b46df5390e432ef1c307d4f2c9ff6d65cc97",
"bb9bc244d798123fde783fcc1c72d3bb8c189413",
"807640a13483f8ac783c557fcdf27be11ea4ac7a",
]

const DAORefundContract = "bf4ed7b27f1d666546e30d74d50d173d20bca754"

/**
 * Options for running a block.
 */
export interface RunBlockOpts {
  /**
   * The [`Block`](https://github.com/ethereumjs/ethereumjs-block) to process
   */
  block: any
  /**
   * Root of the state trie
   */
  root?: Buffer
  /**
   * Whether to generate the stateRoot. If false `runBlock` will check the
   * stateRoot of the block against the Trie
   */
  generate?: boolean
  /**
   * If true, will skip block validation
   */
  skipBlockValidation?: boolean
  /**
   * If true, skips the nonce check
   */
  skipNonce?: boolean
  /**
   * If true, skips the balance check
   */
  skipBalance?: boolean
}

/**
 * Result of [[runBlock]]
 */
export interface RunBlockResult {
  /**
   * Receipts generated for transactions in the block
   */
  receipts: (PreByzantiumTxReceipt | PostByzantiumTxReceipt)[]
  /**
   * Results of executing the transactions in the block
   */
  results: RunTxResult[]
}

/**
 * Abstract interface with common transaction receipt fields
 */
interface TxReceipt {
  /**
   * Gas used
   */
  gasUsed: Buffer
  /**
   * Bloom bitvector
   */
  bitvector: Buffer
  /**
   * Logs emitted
   */
  logs: any[]
}

/**
 * Pre-Byzantium receipt type with a field
 * for the intermediary state root
 */
export interface PreByzantiumTxReceipt extends TxReceipt {
  /**
   * Intermediary state root
   */
  stateRoot: Buffer
}

/**
 * Receipt type for Byzantium and beyond replacing the intermediary
 * state root field with a status code field (EIP-658)
 */
export interface PostByzantiumTxReceipt extends TxReceipt {
  /**
   * Status of transaction, `1` if successful, `0` if an exception occured
   */
  status: 0 | 1
}

/**
 * @ignore
 */
export default async function runBlock(this: VM, opts: RunBlockOpts): Promise<RunBlockResult> {
  if (opts === undefined) {
    throw new Error('invalid input, opts must be provided')
  }
  if (!opts.block) {
    throw new Error('invalid input, block must be provided')
  }

  const state = this.stateManager
  const block = opts.block
  const generateStateRoot = !!opts.generate

  /**
   * The `beforeBlock` event.
   *
   * @event Event: beforeBlock
   * @type {Object}
   * @property {Block} block emits the block that is about to be processed
   */
  await this._emit('beforeBlock', opts.block)

  // Set state root if provided
  if (opts.root) {
    await state.setStateRoot(opts.root)
  }

  // check for DAO support and if we should apply the DAO fork
  if (this.DAOSupport) {
    if ((new BN(opts.block.header.number)).eq(new BN(this.DAOActivationBlock || "1920000"))) {
      const DAORefundContractAddress = Buffer.from(DAORefundContract, 'hex')
      if (!this.stateManager.accountExists(DAORefundContractAddress)) {
        await this.stateManager.putAccount(DAORefundContractAddress, new Account())
      }
      const DAORefundAccount = await this.stateManager.getAccount(DAORefundContractAddress)
      let DAOBalance = new BN(DAORefundAccount.balance)

      for (let address of DAOAccountList) {
        // retrieve the account and add it to the DAO's Refund accounts' balance.
        let account = await this.stateManager.getAccount(Buffer.from(address, 'hex'))
        DAOBalance.iadd(new BN(account.balance))
        // clear the accounts' balance
        account.balance = Buffer.alloc(0)
        await this.stateManager.putAccount(Buffer.from(address, 'hex'), account) 
      }

      // finally, put the Refund Account
      DAORefundAccount.balance = toBuffer(DAOBalance)
      await this.stateManager.putAccount(DAORefundContractAddress, DAORefundAccount)
    }
  }

  // Checkpoint state
  await state.checkpoint()
  let result
  try {
    result = await applyBlock.bind(this)(block, opts)
  } catch (err) {
    await state.revert()
    throw err
  }

  // Persist state
  await state.commit()
  const stateRoot = await state.getStateRoot(false)

  // Given the generate option, either set resulting header
  // values to the current block, or validate the resulting
  // header values against the current block.
  if (generateStateRoot) {
    block.header.stateRoot = stateRoot
    block.header.bloom = result.bloom.bitvector
  } else {
    if (
      result.receiptRoot &&
      result.receiptRoot.toString('hex') !== block.header.receiptTrie.toString('hex')
    ) {
     // throw new Error('invalid receiptTrie ')
    }
    if (result.bloom.bitvector.toString('hex') !== block.header.bloom.toString('hex')) {
    //  throw new Error('invalid bloom ')
    }
    if (bufferToInt(block.header.gasUsed) !== Number(result.gasUsed)) {
     // throw new Error('invalid gasUsed ')
    }
    if (stateRoot.toString('hex') !== block.header.stateRoot.toString('hex')) {
     // throw new Error('invalid block stateRoot ')
    }
  }

  /**
   * The `afterBlock` event
   *
   * @event Event: afterBlock
   * @type {Object}
   * @property {Object} result emits the results of processing a block
   */
  await this._emit('afterBlock', {
    receipts: result.receipts,
    results: result.results,
  })

  return { receipts: result.receipts, results: result.results }
}

/**
 * Validates and applies a block, computing the results of
 * applying its transactions. This method doesn't modify the
 * block itself. It computes the block rewards and puts
 * them on state (but doesn't persist the changes).
 * @param {Block} block
 * @param {Boolean} [skipBlockValidation=false]
 */
async function applyBlock(this: VM, block: any, opts: RunBlockOpts) {
  // Validate block
  if (!opts.skipBlockValidation) {
    if (new BN(block.header.gasLimit).gte(new BN('8000000000000000', 16))) {
      throw new Error('Invalid block with gas limit greater than (2^63 - 1)')
    } else {
      await block.validate(this.blockchain)
    }
  }
  // Apply transactions
  const txResults = await applyTransactions.bind(this)(block, opts)
  // Pay ommers and miners
  await assignBlockRewards.bind(this)(block)
  return txResults
}

/**
 * Applies the transactions in a block, computing the receipts
 * as well as gas usage and some relevant data. This method is
 * side-effect free (it doesn't modify the block nor the state).
 * @param {Block} block
 */
async function applyTransactions(this: VM, block: any, opts: RunBlockOpts) {
  const bloom = new Bloom()
  // the total amount of gas used processing these transactions
  let gasUsed = new BN(0)
  const receiptTrie = new Trie()
  const receipts = []
  const txResults = []

  /*
   * Process transactions
   */
  for (let txIdx = 0; txIdx < block.transactions.length; txIdx++) {
    const tx = block.transactions[txIdx]
    const gasLimitIsHigherThanBlock = new BN(block.header.gasLimit).lt(
      new BN(tx.gasLimit).add(gasUsed),
    )
    if (gasLimitIsHigherThanBlock) {
      throw new Error('tx has a higher gas limit than the block')
    }

    // Run the tx through the VM
    const txRes = await this.runTx({
      tx: tx,
      block: block,
      skipBalance: opts.skipBalance,
      skipNonce: opts.skipNonce,
    })
    txResults.push(txRes)

    // Add to total block gas usage
    gasUsed = gasUsed.add(txRes.gasUsed)
    // Combine blooms via bitwise OR
    bloom.or(txRes.bloom)

    const abstractTxReceipt: TxReceipt = {
      gasUsed: gasUsed.toArrayLike(Buffer),
      bitvector: txRes.bloom.bitvector,
      logs: txRes.execResult.logs || [],
    }
    let txReceipt
    if (this._common.gteHardfork('byzantium')) {
      txReceipt = {
        status: txRes.execResult.exceptionError ? 0 : 1, // Receipts have a 0 as status on error
        ...abstractTxReceipt,
      } as PostByzantiumTxReceipt
    } else {
      // This is just using a dummy place holder for the state root right now.
      // Giving the correct intermediary state root would need a too depp intervention
      // into the current checkpointing mechanism which hasn't been considered
      // to be worth it on a HF backport, 2020-06-26

      const stateRoot = await this.stateManager.getStateRoot(true)
      txReceipt = {
        stateRoot: stateRoot,
        ...abstractTxReceipt,
      } as PreByzantiumTxReceipt
    }

    receipts.push(txReceipt)

    // Add receipt to trie to later calculate receipt root
    await receiptTrie.put(encode(txIdx), encode(Object.values(txReceipt)))
  }

  return {
    bloom,
    gasUsed,
    receiptRoot: receiptTrie.root,
    receipts,
    results: txResults,
  }
}

/**
 * Calculates block rewards for miner and ommers and puts
 * the updated balances of their accounts to state.
 */
async function assignBlockRewards(this: VM, block: any): Promise<void> {
  const state = this.stateManager
  const minerReward = new BN(this._common.param('pow', 'minerReward'))
  const ommers = block.uncleHeaders
  // Reward ommers
  for (const ommer of ommers) {
    const reward = calculateOmmerReward(
      new BN(ommer.number),
      new BN(block.header.number),
      minerReward,
    )
    await rewardAccount(state, ommer.coinbase, reward)
  }
  // Reward miner
  const reward = calculateMinerReward(minerReward, ommers.length)
  await rewardAccount(state, block.header.coinbase, reward)
}

function calculateOmmerReward(ommerBlockNumber: BN, blockNumber: BN, minerReward: BN): BN {
  const heightDiff = blockNumber.sub(ommerBlockNumber)
  let reward = new BN(8).sub(heightDiff).mul(minerReward.divn(8))
  if (reward.ltn(0)) {
    reward = new BN(0)
  }
  return reward
}

function calculateMinerReward(minerReward: BN, ommersNum: number): BN {
  // calculate nibling reward
  const niblingReward = minerReward.divn(32)
  const totalNiblingReward = niblingReward.muln(ommersNum)
  const reward = minerReward.add(totalNiblingReward)
  return reward
}

async function rewardAccount(state: StateManager, address: Buffer, reward: BN): Promise<void> {
  const account = await state.getAccount(address)
  account.balance = toBuffer(new BN(account.balance).add(reward))
  await state.putAccount(address, account)
}
