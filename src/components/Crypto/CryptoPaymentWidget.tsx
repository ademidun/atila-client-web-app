import React from 'react'
import DePayWidgets from '@depay/widgets';
import { Button } from 'antd';

function CryptoPaymentWidget() {

  const ETH_BLOCKCHAIN_USDC_TOKEN_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const ATILATECH_PAYMENTS_ADDRESS = '0x96a5e54a47521e76dd46b8ecf0fef2d23140fbf2';
  const BSC_BLOCKCHAIN_BUSD_TOKEN_ADDRESS = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';

  const startPayment = async () => {
    
    await DePayWidgets.Payment({
      accept:[
        {
          blockchain: 'ethereum',
          amount: 10,
          token: ETH_BLOCKCHAIN_USDC_TOKEN_ADDRESS,
          receiver: ATILATECH_PAYMENTS_ADDRESS
        },
        {
          blockchain: 'bsc',
          amount: 10,
          token: BSC_BLOCKCHAIN_BUSD_TOKEN_ADDRESS,
          receiver: ATILATECH_PAYMENTS_ADDRESS
        }
      ],
      critical: (criticalError: any)=> {
        console.log({criticalError});
      },
      error: (error: any)=> {
        console.log({error});
      }
    });
  }

  console.log({startPayment});
  
  return (
    <div>
      <Button onClick={()=> {startPayment()}}>
         Pay
      </Button>
    </div>
  )
}

export default CryptoPaymentWidget