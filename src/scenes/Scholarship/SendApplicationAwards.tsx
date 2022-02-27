import CryptoPaymentForm from '@atila/web-components-library.ui.crypto-payment-form';
import { Radio } from 'antd';
import React, { useState } from 'react'
import { Award } from '../../models/Award'

export interface SendApplicationAwardsProps {
    awards: Award[],
};

function SendApplicationAwards(props: SendApplicationAwardsProps) {

    const { awards } = props;

    const [activeAward, setActiveAward] = useState(awards[0])

    return (
    <div>
        <h3>
            Send Application Award
        </h3>

        <Radio.Group defaultValue={activeAward} buttonStyle="solid" onChange={(e) => setActiveAward(e.target.value)}>
            {awards.map(award => (
                <Radio.Button value={award} key={award.id}>
                    {award.id}{' '}{award.recipient?.wallet_address && `Wallet: ${award.recipient?.wallet_address}`}
                    </Radio.Button>
            ))}
        </Radio.Group>

        {activeAward.recipient?.wallet_address && 
            <CryptoPaymentForm 
                amount={Number.parseFloat(activeAward.funding_amount as string)}
                className="mt-1"
                currency={activeAward.currency} 
                destinationAddress={activeAward.recipient?.wallet_address} />
        }



    </div>
    )
}

export default SendApplicationAwards