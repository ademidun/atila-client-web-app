// import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form';
// import CurrencyDisplay from '@atila/web-components-library.ui.currency-display';
import { Radio } from 'antd';
import { useState } from 'react'
import { Award } from '../../models/Award';

export interface SendApplicationAwardsProps {
    awards: Award[],
};

function SendApplicationAwards(props: SendApplicationAwardsProps) {

    const { awards } = props;

    const [activeAward, setActiveAward] = useState(awards[0]);

    return (
    <div>
        <h3>
            Send Application Award
        </h3>

        <div>
            <div>
                    <Radio.Group defaultValue={activeAward} buttonStyle="solid" onChange={(e) => setActiveAward(e.target.value)} 
                    className="mb-3">
                        {awards.map(award => (
                            <Radio.Button value={award} key={award.id}>
                                {award.id}{' '}{award.recipient_wallet?.address && `Wallet: ${award.recipient_wallet?.address}`}
                            </Radio.Button>
                        ))}
                    </Radio.Group>

                    <div>
                        {/* <CurrencyDisplay amount={Number.parseFloat(activeAward.funding_amount as string)} inputCurrency={activeAward.currency} /> */}
                        {activeAward.recipient_wallet?.address ? 
                        <>
                            {/* <CryptoPaymentForm 
                                    className="mt-3"
                                    amount={Number.parseFloat(activeAward.funding_amount as string)}
                                    currency={activeAward.currency}
                                    isTestNet={Environment.name !== "prod"}
                                    destinationAddress={activeAward.recipient_wallet?.address}
                                    onSuccess={saveSentAward} />  */}
                        </>
                        :
                            <p>
                                No recipient wallet found for this award recipient
                            </p>
                        }
                    </div>
                </div>
        </div>




    </div>
    )
}

export default SendApplicationAwards