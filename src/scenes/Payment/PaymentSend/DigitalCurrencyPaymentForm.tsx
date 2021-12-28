import { Alert, Button } from 'antd';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import Environment from '../../../services/Environment';

interface StartPaymentPropTypes {
    setError: (message?: any) => void;
    amount: string | number;
    address: string | number;
};

const startPayment = async ( { setError, amount, address }: StartPaymentPropTypes) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
  
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(address as string);
      const tx = await signer.sendTransaction({
        to: address as string,
        value: ethers.utils.parseEther(amount.toString())
      });
      console.log({ ether: amount, addr: address });
      console.log("tx", tx);
    } catch (err: any) {
      setError(err.message);
    }
  };

interface DigitalCurrencyPaymentFormPropTypes {
    amount: string | number;
    destinationAddress: string,
}

DigitalCurrencyPaymentForm.defaultProps = {
    destinationAddress: Environment.ETHEREUM_DESTINATION_ADDRESS
};

function DigitalCurrencyPaymentForm(props: DigitalCurrencyPaymentFormPropTypes) {

    const { amount, destinationAddress } = props;

    const [error, setError] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        await startPayment({
        setError,
        amount,
        address: destinationAddress
        });
    };
    
    return (
        <div>
            <div className="m-4" onSubmit={handleSubmit}>
            <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                <div className="mt-4 p-4">
                <h1 className="text-xl font-semibold text-gray-700 text-center">
                    Send ETH payment
                </h1>
                <div className="">
                    <div className="my-3">
                    <label>Payment Amount (ETH) </label>
                    <input
                        name="ether"
                        value={amount}
                        disabled={true}
                        className="form-control col-12"
                    />
                    </div>
                </div>
                </div>
                <div className="p-4">
                <Button
                    type="primary"
                    className="col-12"
                    onClick={handleSubmit}
                    style={{height: '40px'}}
                >
                    Confirm Payment of {amount} ETH
                </Button>
                {error && 
                <Alert
                    type="error"
                    message={error}
                />
                }
                </div>
            </div>
            </div>
        </div>
    )
}

export default DigitalCurrencyPaymentForm
