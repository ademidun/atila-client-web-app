import React, { useState } from 'react';
import { Radio } from 'antd';
import CryptoPaymentWidget from '../../../components/Crypto/CryptoPaymentWidget'
import { RadioChangeEvent } from 'antd/lib/radio';
import TextUtils from '../../../services/utils/TextUtils';

const PRICING_TIER_1 = 1;
const PRICING_TIER_2 = 10;

export const DOLLARS_TO_API_CREDITS: {[k: number]: number} = {
    [PRICING_TIER_1]: 100,
    [PRICING_TIER_2]: 2000,
}

/**
 * Calculate how many API credits to create based on the payment amount.
 * TODO make this dynamic to work in a tiered model for any arbitrary payment amount
 * 2 dollars would return 200 credits and 20 dollars would return 4,000 credits
 * @param paymentAmount 
 * @returns {number}
 */
export const paymentAmountToAPICredits = (paymentAmount: number) => {
    
    if (paymentAmount <= PRICING_TIER_1) {
        return Math.ceil(paymentAmount/PRICING_TIER_1 * DOLLARS_TO_API_CREDITS[PRICING_TIER_1])
    } else {
        return Math.ceil(paymentAmount/PRICING_TIER_2 * DOLLARS_TO_API_CREDITS[PRICING_TIER_2])
    }

}

function AtlasPayment() {

  const [apiCredits, setApiCredits] = useState(100);
  const [paymentAmount, setPaymentAmount] = useState(1);


  const onChangePaymentAmount = (event: RadioChangeEvent) => {

     const updatedPaymentAmount = event.target.value
     setPaymentAmount(updatedPaymentAmount);
     setApiCredits(paymentAmountToAPICredits(updatedPaymentAmount as number));
  }
        
  return (
    <div>
        <Radio.Group name="radiogroup" value={paymentAmount} buttonStyle="solid" onChange={onChangePaymentAmount}>
            <Radio.Button value={PRICING_TIER_1}>{TextUtils.formatCurrency(PRICING_TIER_1)} for {DOLLARS_TO_API_CREDITS[PRICING_TIER_1].toLocaleString()}  credits</Radio.Button>
            <Radio.Button value={PRICING_TIER_2}>{TextUtils.formatCurrency(PRICING_TIER_2)} for {DOLLARS_TO_API_CREDITS[PRICING_TIER_2].toLocaleString()} credits</Radio.Button>
        </Radio.Group>
        <br/>
        <p className="my-3">
        Api Credits Received: {apiCredits.toLocaleString()} <br/>
        </p>
      <div className="text-center">
        <CryptoPaymentWidget amount={paymentAmount} />
      </div>
        
    </div>
  )
}

export default AtlasPayment;