import React, { ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import { Input, Radio } from 'antd';
import CryptoPaymentWidget from '../../../components/Crypto/CryptoPaymentWidget'
import { RadioChangeEvent } from 'antd/lib/radio';
import TextUtils from '../../../services/utils/TextUtils';
import { APIKeyCredit } from '../../../models/APIKeyCredit';
import PaymentAPI from '../../../services/PaymentAPI';
import { BINANCE_SMART_CHAIN_MAINNET_CHAIN_ID } from '../../../models/ConstantsPayments';

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
  const [apiKeyCredit, setApiKeyCredit] = useState<APIKeyCredit>({public_key: localStorage.getItem("atlasAPIKeyCredit") || ""});


  const onChangePaymentAmount = (event: RadioChangeEvent) => {

     const updatedPaymentAmount = event.target.value
     setPaymentAmount(updatedPaymentAmount);
     setApiCredits(paymentAmountToAPICredits(updatedPaymentAmount as number));
  }

  const updateApiKeyCredit: ChangeEventHandler<HTMLInputElement> = (event) => {

        event.preventDefault();
        const value = event!.target!.value;
        const name = event.target.name;
        if (name === "public_key") {
            const updatedApiKeyCredit = {
                ...apiKeyCredit,
                [name]: value,
            }
            setApiKeyCredit(updatedApiKeyCredit);
            localStorage.setItem("atlasAPIKeyCredit", value);
        }
  };

  const loadApiKeyCredit = useCallback(
    () => {
      if (apiKeyCredit.public_key?.length >= 32) {
        PaymentAPI.getAPIKeyCreditByPublicKey(apiKeyCredit.public_key)
        .then((res: any)=> {
           const { data: { results } } = res;
           if (results.length > 0) {
               setApiKeyCredit(results[0]);
           }
       })
       .catch((err: any) => {
           console.log({err});
       })
      }
    },
    [apiKeyCredit.public_key]
  );

  const handlePaymentConfirmed = (transaction: any) => {
    console.log({transaction});
    let chainId = 1;
    if (transaction.blockchain === "bsc") {
      chainId = BINANCE_SMART_CHAIN_MAINNET_CHAIN_ID;
    }
    PaymentAPI.buyCredits(apiKeyCredit.public_key, apiCredits, transaction.id, chainId)
      .then(res => {
        console.log({res});
        const { data: { api_key_credit } } = res;
        setApiKeyCredit(api_key_credit);
      })
      .catch(err => {
        console.log({err});
      })
  }

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if(event.currentTarget.name === "public_key" && event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      loadApiKeyCredit();
    }
}

    useEffect(() => {
        loadApiKeyCredit();
    }, [loadApiKeyCredit])
        
  return (
    <div>
        <Radio.Group name="radiogroup" value={paymentAmount} buttonStyle="solid" onChange={onChangePaymentAmount}>
            <Radio.Button value={PRICING_TIER_1}>{TextUtils.formatCurrency(PRICING_TIER_1)} for {DOLLARS_TO_API_CREDITS[PRICING_TIER_1].toLocaleString()}  credits</Radio.Button>
            <Radio.Button value={PRICING_TIER_2}>{TextUtils.formatCurrency(PRICING_TIER_2)} for {DOLLARS_TO_API_CREDITS[PRICING_TIER_2].toLocaleString()} credits</Radio.Button>
        </Radio.Group>
        <div style={{width: "500px"}} className="text-center center-block mt-3">
          <p className="text-left">
            Enter your API key here:
          </p>
          <Input name="public_key"
                        value={apiKeyCredit.public_key} 
                        onChange={updateApiKeyCredit}
                        onKeyDown={keyDownHandler}
                        className="mb-2" 
                        placeholder={"Enter your API key here"}/>
          { !Number.isNaN(apiKeyCredit.search_credits_available) && 
              <div>
                  <p>
                      Search credits available: {apiKeyCredit.search_credits_available} {'->'} Available credits after purchase: {(apiKeyCredit.search_credits_available! + apiCredits).toLocaleString()}
                  </p>
              </div>
          }
        </div>
      <div className="text-center">
        <CryptoPaymentWidget amount={paymentAmount} onTransactionConfirmed={handlePaymentConfirmed} />
      </div>
        
    </div>
  )
}

export default AtlasPayment;