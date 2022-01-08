import React, { useState } from 'react';
import { Select, Tag, Input } from 'antd';
import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form'
import TextUtils from '../../services/utils/TextUtils';
import PaymentAPI from '../../services/PaymentAPI';

import {connect} from "react-redux";
import { UserProfile } from '../../models/UserProfile.class';

const { Option } = Select;
const { TextArea } = Input;

export interface ContentPaymentFormPropTypes {
    contentType: string,
    contentId: string | number,
    userProfileLoggedIn: UserProfile,
}

function ContentPaymentForm(props: ContentPaymentFormPropTypes){
    
    const { contentType, contentId, userProfileLoggedIn} = props;

    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentNote, setPaymentNote] = useState("")

    const currencyExchangeRates = {
     ETH: 3808.87,
    }

    const selectedCurrency = "ETH";

    const handleChange = (value: any) => {
      console.log(`selected ${value}`);
      setPaymentAmount(value);
    }

    const handlePaymentNoteChange = (event: any) => {
      console.log({event});
      setPaymentNote(event.target.value);
    }

    const handlePaymentSuccess = (transaction: TransactionResponsePayment) => {
        console.log({transaction});
        const transactionPostData = {
            user: userProfileLoggedIn?.user,
            [contentType]: contentId,
            hash: transaction.hash,
            source_address: transaction.from,
            currency_code: selectedCurrency,
            network_chain_id: 3,
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



    const paymentAmountOptions = [
        0.10,
        1,
        5,
        10,
        25,
        100,
    ]

    const selectAmount = (
      <>
      <Select value={paymentAmount} onChange={handleChange} style={{width: "250px"}}>
          <Option value={0} disabled={true}>{"Select Amount"}</Option>
          {paymentAmountOptions.map(paymentAmountOption => (
              <Option value={paymentAmountOption}>{TextUtils.formatCurrency(paymentAmountOption)} ({TextUtils.formatCurrency(paymentAmountOption/currencyExchangeRates[selectedCurrency], selectedCurrency)})</Option>
          ))}
      </Select>
    </>
    )
        return (<div className="container my-3">
            <h5>
            Enjoyed this article? Tip the Author in ETH or BNB: <Tag color="green">New</Tag>
            </h5>
            {selectAmount}
            {paymentAmount > 0 && 
            <>  
                <TextArea rows={4} onChange={handlePaymentNoteChange} placeholder="Optional: leave a note for the author" />
                <CryptoPaymentForm amount={paymentAmount/currencyExchangeRates[selectedCurrency]} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
            </>}
    </div>);
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ContentPaymentForm);
