import React, { useState } from 'react';
import { Select, Tag, Input, Radio } from 'antd';
import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form'
import TextUtils from '../../services/utils/TextUtils';
import PaymentAPI from '../../services/PaymentAPI';

import {connect} from "react-redux";
import { UserProfile } from '../../models/UserProfile.class';
import Environment from '../../services/Environment';
import { getItemType } from '../../services/utils';
import { Blog } from '../../models/Blog';

const { Option } = Select;
const { TextArea } = Input;

export interface ContentPaymentFormPropTypes {
    content: Blog,
    userProfileLoggedIn?: UserProfile,
}

function ContentPaymentForm(props: ContentPaymentFormPropTypes){
    console.log({props});
    const { content, userProfileLoggedIn } = props;

    const { id: contentId } = content;
    const contentType = getItemType(content);
    const wallet = content.wallet_detail;

    const currencyExchangeRates: any = {
        ETH: 3808.87,
        BNB: 550.38,
    }

    const paymentAmountOptions = [
        0.10,
        1,
        5,
        10,
        25,
        100,
    ]
    const currencyOptions = [
        {
            value: "BNB",
        },
        {
            value: "ETH",
        }
    ]

    const networkOptions = [
        {
            value: "testnet",
        },
        {
            value: "mainnet",
        }
    ]

    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentNote, setPaymentNote] = useState("");
    const [currency, setCurrency] = useState(currencyOptions[0].value);
    // set the default environment to testnet in any non-prod environment or if it's not an atila_admin_user
    const [network, setNetwork] = useState(networkOptions[Environment.name === "prod" || !userProfileLoggedIn?.is_atila_admin ? 1 : 0].value)

    const handleChange = (value: any) => {
      console.log(`selected ${value}`);
      setPaymentAmount(value);
    }

    const handlePaymentSuccess = (transaction: TransactionResponsePayment) => {
        console.log({transaction});
        const transactionPostData = {
            user: userProfileLoggedIn?.user,
            [contentType]: contentId,
            hash: transaction.hash,
            source_address: transaction.from,
            currency_code: currency,
            network_chain_id: transaction.network?.chainId,
            network_name: transaction.network?.name,
            transaction_fee_hex: transaction.gasPrice?._hex,
            withdrawn_amount_hex: transaction.value._hex,
            destination_address: transaction.to,
            destination_amount_number: Number.parseFloat(transaction.destinationAmount as string).toFixed(8),
            note: paymentNote
        }

        PaymentAPI.saveTransaction(transactionPostData)
        .then(res => {
            console.log({res});
        })
        .catch(error => {
            console.log({error});
        })
    }

    const handlePaymentError = (error: any) => {
        console.log({error});
    }

    const handleCurrencyChange = (event: any) => {
        setCurrency(event.target.value);
    }


    const selectAmount = (
      <>
      <Select value={paymentAmount} onChange={handleChange} style={{width: "250px"}}>
          <Option value={0} disabled={true}>{"Select Amount"}</Option>
          {paymentAmountOptions.map(paymentAmountOption => (
                <Option value={paymentAmountOption} key={paymentAmountOption}>
                  {TextUtils.formatCurrency(paymentAmountOption)} ({TextUtils.formatCurrency(paymentAmountOption/currencyExchangeRates[currency], currency)})
                </Option>
          ))}
      </Select>
    </>
    )

    const selectCurrency = (
        <Radio.Group value={currency} onChange={handleCurrencyChange} optionType="button" buttonStyle="solid" className="mb-3">
            {currencyOptions.map(currencyOption => (<Radio.Button key={currencyOption.value} value={currencyOption.value}>{currencyOption.value}</Radio.Button>))}
      </Radio.Group>
    )
    const selectNetwork = (
        <Radio.Group value={network} onChange={event => setNetwork(event.target.value)} optionType="button" buttonStyle="solid" className="mb-3">
            {networkOptions.map(currencyOption => (<Radio.Button key={currencyOption.value} value={currencyOption.value}>{currencyOption.value}</Radio.Button>))}
      </Radio.Group>
    )
        return (
        <div className="container my-3">
            <h5>
            Enjoyed this article? Tip the Author in BNB or ETH: <Tag color="green">New</Tag>
            </h5>
            {selectCurrency}<br/>
            {userProfileLoggedIn?.is_atila_admin && <>{selectNetwork}<br/></>}
            {selectAmount}
            {paymentAmount > 0 && 
            <>  
                <TextArea className="my-3" rows={4} onChange={event => setPaymentNote(event.target.value)} placeholder="Optional: leave a note for the author" />
                {network === "testnet" && <Tag>Network: {network}</Tag>}
                <CryptoPaymentForm amount={paymentAmount/currencyExchangeRates[currency]} 
                    onSuccess={handlePaymentSuccess} 
                    onError={handlePaymentError}
                    currency={currency}
                    isTestNet={network === "testnet"}
                    isEditableDestinationAddress={userProfileLoggedIn?.is_atila_admin}
                    destinationAddress={wallet?.address}
                 />
            </>}
        </div>)
    ;
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ContentPaymentForm);
