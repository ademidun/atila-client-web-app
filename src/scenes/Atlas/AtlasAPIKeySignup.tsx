import { Alert, Input } from 'antd'
import React, { ChangeEventHandler, KeyboardEventHandler, useState } from 'react'
import Loading from '../../components/Loading';
import PaymentAPI from '../../services/PaymentAPI';

function AtlasAPIKeySignup() {

    const emailName = "email";
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState("");
    const [inputError, setInputError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");



  const updateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {

        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;
        if (name === emailName) {
            setEmail(value);
            if (value?.includes("+")) {
                setInputError("Email cannot include '+'")
            } else {
                setInputError("");
            }
        }
    };


    const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if(event.currentTarget.name === emailName && event.key === "Enter" && event.shiftKey === false) {
          event.preventDefault();

            if(loading) {
                setInputError("Wait for sending to finish before sending another request")
            } else {
                sendApiKeyToEmail();
            }
        }
    }

    const sendApiKeyToEmail = () => {
        setLoading("Sending API Key...")
        PaymentAPI.sendApiKeyCredit({email})
        .then(res => {
            console.log({res});
            setSuccessMessage("API Key has been sent to the provided email. Check your inbox or spam.");
        })
        .catch(err => {
            console.log({err});
        })
        .finally(()=> {
            setLoading("");
        })
    };

  return (
    <div>
        
        <p className="text-left">
            Enter your email to receive an API Key
        </p>
        <Input name={emailName}
                    value={email} 
                    onChange={updateEmail}
                    onKeyDown={keyDownHandler}
                    className="mb-2" 
                    placeholder={"Enter your email"}/>
        <br/>
        {loading && <Loading title={loading} />}
        {inputError && <Alert
                            type="error"
                            message={inputError} />
                }

        {successMessage && <Alert
                            type="success"
                            message={successMessage} />
                }
    </div>
  )
}

export default AtlasAPIKeySignup