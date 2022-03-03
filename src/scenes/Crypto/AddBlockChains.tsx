import React from 'react'
import {AddOrSwitchBlockChain} from '@atila/web-components-library.ui.add-or-switch-blockchain'
import { BINANCE_SMART_CHAIN_MAINNET_CHAIN_ID, BINANCE_SMART_CHAIN_TESTNET_CHAIN_ID } from '../../models/ConstantsPayments';

function AddBlockChains() {
  return (
    <div>
        
        <h2>
                Add Blockchains
            </h2>

            <AddOrSwitchBlockChain chainId={BINANCE_SMART_CHAIN_MAINNET_CHAIN_ID} />

            <hr/>

            <h5>Use Testnets to practice with test money</h5>

            <AddOrSwitchBlockChain chainId={BINANCE_SMART_CHAIN_TESTNET_CHAIN_ID} />
    </div>
  )
}

export default AddBlockChains