import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form';
import CurrencyDisplay from '@atila/web-components-library.ui.currency-display';
import { Radio, Spin } from 'antd';
import React, { useState } from 'react'
import Loading from '../../components/Loading';
import { Award } from '../../models/Award'
import ApplicationsAPI from '../../services/ApplicationsAPI';
import Environment from '../../services/Environment';

export interface SendApplicationAwardsProps {
    awards: Award[],
};

function SendApplicationAwards(props: SendApplicationAwardsProps) {

    const { awards } = props;

    const [activeAward, setActiveAward] = useState(awards[0]);
    const [loadingMessage, setLoadingMessage] = useState("");

    const saveSentAward = (transaction: TransactionResponsePayment) => {

        console.log({transaction});
        const transactionData = {
            destination_amount_number: transaction.destinationAmount,
            source_address: transaction.from,
            destination_address: transaction.to,
            network_chain_id: transaction.chainId,
            hash: transaction.hash,
            transaction_fee_hex: transaction.gasPrice?._hex
        };

        setLoadingMessage("Saving transaction and sending confirmation email");
        // TODO: This current implementation will cause errors if the Active award is changed after a payment award has been sent.
        ApplicationsAPI
        .sendScholarshipAwardPaymentConfirmation(activeAward.recipient?.id, activeAward.id, transactionData)
        .then(res => {
            console.log({res});
        })
        .catch(err=> {
            console.log({err});
        })
        .finally(() => {
            setLoadingMessage("");
        })
    }

    return (
    <div>
        <h3>
            Send Application Award
        </h3>

        {loadingMessage &&
        <Loading title={loadingMessage} />
        }

        <Spin spinning={!!loadingMessage} tip={loadingMessage}>

            <Radio.Group defaultValue={activeAward} buttonStyle="solid" onChange={(e) => setActiveAward(e.target.value)} 
            className="mb-3">
                {awards.map(award => (
                    <Radio.Button value={award} key={award.id}>
                        {award.id}{' '}{award.recipient_wallet?.address && `Wallet: ${award.recipient_wallet?.address}`}
                    </Radio.Button>
                ))}
            </Radio.Group>

        <div>
            {activeAward.recipient_wallet?.address ? 
            <>
                <CurrencyDisplay amount={Number.parseFloat(activeAward.funding_amount as string)} inputCurrency={activeAward.currency} />
                <CryptoPaymentForm 
                        className="mt-3"
                        amount={Number.parseFloat(activeAward.funding_amount as string)}
                        currency={activeAward.currency}
                        isTestNet={Environment.name !== "prod"}
                        destinationAddress={activeAward.recipient_wallet?.address}
                        onSuccess={saveSentAward} /> 
            </>
            :
                <p>
                    No recipient wallet found for this award recipient
                </p>
            }
        </div>

        </Spin>




    </div>
    )
}

export default SendApplicationAwards