import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form';
import CurrencyDisplay from '@atila/web-components-library.ui.currency-display';
import { Radio, Spin } from 'antd';
import React, { useState } from 'react'
import Loading from '../../components/Loading';
import { Award } from '../../models/Award';
import { Transaction } from '../../models/Transaction';
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

        const transactionData: Transaction = {
            hash: transaction.hash,
            destination_amount_number: Number.parseFloat(transaction.destinationAmount as string).toFixed(8),
            source_address: transaction.from,
            destination_address: transaction.to,
            network_chain_id: transaction.network?.chainId,
            network_name: transaction.network?.name,
            transaction_fee_hex: transaction.gasPrice?._hex,
            withdrawn_amount_hex: transaction.value._hex,
        };

        setLoadingMessage("Saving transaction and sending confirmation email");
        // TODO: This current implementation will cause errors if the Active award is changed after a payment award has been sent.
        ApplicationsAPI
        .sendScholarshipAwardPaymentConfirmation(activeAward.recipient?.id, activeAward.id, transactionData)
        .then(res => {
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
            <CurrencyDisplay amount={Number.parseFloat(activeAward.funding_amount as string)} inputCurrency={activeAward.currency} />
            {activeAward.recipient_wallet?.address ? 
            <>
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