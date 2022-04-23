import React from 'react'
import DePayWidgets from '@depay/widgets';
import { Button } from 'antd';
import TextUtils from '../../services/utils/TextUtils';

interface CryptoPaymentWidgetProps {

  /** Amount that wallet will receive in USD */
  amount: number;
  onTransactionSent?: (transaction: any) => void
}

function CryptoPaymentWidget(props: CryptoPaymentWidgetProps) {

  const ETH_BLOCKCHAIN_USDC_TOKEN_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const ATILATECH_PAYMENTS_ADDRESS = '0xd60271b10861145D2b26d27cb1E59Dd6d367959C';
  const BSC_BLOCKCHAIN_BUSD_TOKEN_ADDRESS = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';

  const { amount, onTransactionSent } = props;

  const startPayment = async () => {
    
    await DePayWidgets.Payment({
      accept:[
        {
          blockchain: 'ethereum',
          amount,
          token: ETH_BLOCKCHAIN_USDC_TOKEN_ADDRESS,
          receiver: ATILATECH_PAYMENTS_ADDRESS
        },
        {
          blockchain: 'bsc',
          amount,
          token: BSC_BLOCKCHAIN_BUSD_TOKEN_ADDRESS,
          receiver: ATILATECH_PAYMENTS_ADDRESS
        }
      ],
      critical: (criticalError: any)=> {
        console.log({criticalError});
      },
      error: (error: any)=> {
        console.log({error});
      },
      sent: (transaction: any)=> {
        if (onTransactionSent) {
          onTransactionSent(transaction);
        }
        
      },
    });
  }
  
  return (
    <div>
      <Button onClick={()=> {startPayment()}} size="large" type="primary">
         Pay with Crypto{' '}({TextUtils.formatCurrency(amount)} USD)
      </Button>
    </div>
  )
}

export default CryptoPaymentWidget