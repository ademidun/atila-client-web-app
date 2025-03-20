import { Col, Row, Spin } from 'antd';
import { Scholarship } from '../../../models/Scholarship.class'
import { Contributor } from "../../../models/Contributor";

interface ScholarshipPaymentFormCryptoProps {
    scholarship: Scholarship,
    contributorFundingAmount: number,
    contributor: Contributor,
    onFundingComplete?: (fundingData: {contribution: Contributor, scholarship: Scholarship}) => void;
}

function ScholarshipPaymentFormCrypto(props: ScholarshipPaymentFormCryptoProps) {
  // totalPaymentAmount = contributorFundingAmount + (Atila 9% fee)

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col sm={24} md={12}>
          <Spin spinning={false} tip="" {...({} as any)}>
          {/* <CryptoPaymentForm  className="card" 
          amount={totalPaymentAmount} 
          currency={contributor.currency}
          isTestNet={Environment.name !== "prod"}
          destinationAddress={ATILA_EVM_WALLET_ADDRESS} onSuccess={saveTransaction} /> */}
          </Spin>
        </Col>
        <Col sm={24} md={12}> 
          {/* <Invoice cardHolderName={contributor.first_name} scholarship={scholarship} contributorFundingAmount={contributorFundingAmount} contributor={contributor} /> */}
        </Col>
      </Row>
    </div>
  )
}

export default ScholarshipPaymentFormCrypto