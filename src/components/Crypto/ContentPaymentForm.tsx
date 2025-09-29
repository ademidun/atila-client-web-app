import { useState } from 'react';
import { Select, Tag, Radio } from 'antd';
// import CryptoPaymentForm, { TransactionResponsePayment } from '@atila/web-components-library.ui.crypto-payment-form'
import TextUtils from '../../services/utils/TextUtils';

import {connect} from "react-redux";
import { UserProfile } from '../../models/UserProfile.class';
import Environment from '../../services/Environment';
import { Blog } from '../../models/Blog';


const { Option } = Select;

export interface ContentPaymentFormPropTypes {
    content: Blog,
    userProfileLoggedIn?: UserProfile,
}

function ContentPaymentForm(props: ContentPaymentFormPropTypes){
    console.log({props});
    const { userProfileLoggedIn } = props;


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
    const [currency, setCurrency] = useState(currencyOptions[0].value);
    // set the default environment to testnet in any non-prod environment or if it's not an atila_admin_user
    const [network, setNetwork] = useState(networkOptions[Environment.name === "prod" ? 1 : 0].value)

    const handleChange = (value: any) => {
      console.log(`selected ${value}`);
      setPaymentAmount(value);
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
        </div>)
    ;
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ContentPaymentForm);
