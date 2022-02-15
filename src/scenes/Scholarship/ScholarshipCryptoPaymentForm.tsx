import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form';
import { Alert, Col, Row, Spin } from 'antd';
import React, { useState } from 'react'
import { Award } from '../../models/Award.class'
import { ATILA_EVM_WALLET_ADDRESS, ATILA_SCHOLARSHIP_FEE } from '../../models/ConstantsPayments';
import { Scholarship } from '../../models/Scholarship.class'
import { Contributor } from "../../models/Contributor";
import Invoice from '../Payment/ScholarshipPayment/Invoice';
import ScholarshipsAPI from '../../services/ScholarshipsAPI';
import { getErrorMessage } from '../../services/utils';
interface ScholarshipCryptoPaymentFormProps {
    scholarship: Scholarship,
    awards: Award[],
    contributor: Contributor,
    onFundingComplete: (fundingData: {contribution: Contributor, scholarship: Scholarship}) => void;
}
function ScholarshipCryptoPaymentForm(props: ScholarshipCryptoPaymentFormProps) {

  const { scholarship, awards, contributor, onFundingComplete } = props;
  const [isResponseLoading, setIsResponseLoading] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  const saveTransaction = (transaction: TransactionResponsePayment) => {

    console.log({transaction});
    const { scholarship } = props;
    setIsResponseLoading("Saving contribution");
    const contribution: Contributor = {
      ...contributor,
      wallet_address: transaction.sourceAddress,
      chain_id: transaction.network?.chainId,
      transaction_hash: transaction.hash,
    }
    ScholarshipsAPI
      .saveScholarshipContribution(scholarship.id, {contribution})
      .then(res => {
          console.log({res});
          onFundingComplete(res.data)
      })
      .catch(err => {
        console.log({err});
        setErrorMessage(getErrorMessage(err));
      })
      .finally(() => {
        setIsResponseLoading("");
      })
  }

  // The funding_amount should be the sum of created awards in the frontend until the award has been saved after which it should use the funding_amount from the backend 
  // as the source of truth returning an object with a funding_amount property with the sum of the funding_amount properties of the parameters:
  // https://stackoverflow.com/a/5732087/5405197
  let totalAwardsAmount = awards.reduce((prevAward, currentAward) => 
  ({funding_amount: Number.parseFloat(prevAward.funding_amount as string) + Number.parseFloat(currentAward.funding_amount as string), currency: currentAward.currency})).funding_amount;

  totalAwardsAmount = Number.parseFloat(totalAwardsAmount as string);
  // totalPaymentAmount = contributorFundingAmount + (Atila 9% fee)
  const totalPaymentAmount = totalAwardsAmount  + (ATILA_SCHOLARSHIP_FEE * totalAwardsAmount);

  console.log({ scholarship, awards, totalAwardsAmount });
  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col sm={24} md={12}>
          <Spin spinning={!!isResponseLoading} tip={isResponseLoading}>
          <CryptoPaymentForm  className="card" amount={totalPaymentAmount} currency={contributor.currency} destinationAddress={ATILA_EVM_WALLET_ADDRESS} onSuccess={saveTransaction} />
          {errorMessage && <Alert message={errorMessage} type="error" /> }
          </Spin>
        </Col>
        <Col sm={24} md={12}> 
          <Invoice scholarship={scholarship} contributorFundingAmount={totalAwardsAmount} contributor={contributor} />
        </Col>
      </Row>
        
    </div>

  )
}

export default ScholarshipCryptoPaymentForm