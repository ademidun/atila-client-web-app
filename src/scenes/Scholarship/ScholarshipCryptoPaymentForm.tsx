import CryptoPaymentForm from '@atila/web-components-library.ui.crypto-payment-form';
import React from 'react'
import { Award } from '../../models/Award.class'
import { ATILA_EVM_WALLET_ADDRESS } from '../../models/ConstantsPayments';
import { Scholarship } from '../../models/Scholarship.class'
interface ScholarshipCryptoPaymentFormProps {
    scholarship: Scholarship,
    awards: Award[]
}
function ScholarshipCryptoPaymentForm(props: ScholarshipCryptoPaymentFormProps) {

  const { scholarship, awards } = props;

  // The funding_amount should be the sum of created awards in the frontend until the award has been saved after which it should use the funding_amount from the backend 
  // as the source of truth returning an object with a funding_amount property with the sum of the funding_amount properties of the parameters:
  // https://stackoverflow.com/a/5732087/5405197
  const totalAwardsAmount = awards.reduce((prevAward, currentAward) => 
  ({funding_amount: Number.parseFloat(prevAward.funding_amount as string) + Number.parseFloat(currentAward.funding_amount as string), currency: currentAward.currency})).funding_amount;

  console.log({ scholarship, awards, totalAwardsAmount });
  return (
    <div>
        ScholarshipCryptoPaymentForm
        <CryptoPaymentForm amount={Number.parseFloat(totalAwardsAmount as string)} destinationAddress={ATILA_EVM_WALLET_ADDRESS} />
    </div>

  )
}

export default ScholarshipCryptoPaymentForm