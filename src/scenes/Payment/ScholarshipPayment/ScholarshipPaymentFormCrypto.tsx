import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form';
import { Alert, Col, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { ATILA_EVM_WALLET_ADDRESS, ATILA_SCHOLARSHIP_FEE } from '../../../models/ConstantsPayments';
import { Scholarship } from '../../../models/Scholarship.class'
import { Contributor } from "../../../models/Contributor";
import Invoice from './Invoice';
import ScholarshipsAPI from '../../../services/ScholarshipsAPI';
import { getErrorMessage } from '../../../services/utils';
import Environment from '../../../services/Environment';

interface ScholarshipPaymentFormCryptoProps {
    scholarship: Scholarship,
    contributorFundingAmount: number,
    contributor: Contributor,
    onFundingComplete?: (fundingData: {contribution: Contributor, scholarship: Scholarship}) => void;
}

function ScholarshipPaymentFormCrypto(props: ScholarshipPaymentFormCryptoProps) {

  const { scholarship, contributorFundingAmount, contributor, onFundingComplete } = props;
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
          onFundingComplete?.(res.data)
      })
      .catch(err => {
        console.log({err});
        setErrorMessage(getErrorMessage(err));
      })
      .finally(() => {
        setIsResponseLoading("");
      })
  }

  // totalPaymentAmount = contributorFundingAmount + (Atila 9% fee)
  const totalPaymentAmount = contributorFundingAmount  + (ATILA_SCHOLARSHIP_FEE * contributorFundingAmount);

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col sm={24} md={12}>
          <Spin spinning={!!isResponseLoading} tip={isResponseLoading}>
          <CryptoPaymentForm  className="card" 
          amount={totalPaymentAmount} 
          currency={contributor.currency}
          isTestNet={Environment.name !== "prod"}
          destinationAddress={ATILA_EVM_WALLET_ADDRESS} onSuccess={saveTransaction} />
          {errorMessage && <Alert message={errorMessage} type="error" /> }
          </Spin>
        </Col>
        <Col sm={24} md={12}> 
          <Invoice scholarship={scholarship} contributorFundingAmount={contributorFundingAmount} contributor={contributor} />
        </Col>
      </Row>
        
    </div>

  )
}

export default ScholarshipPaymentFormCrypto