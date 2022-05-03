import React, { ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import Loading from '../../components/Loading';
import { APIKeyCredit } from '../../models/APIKeyCredit';
import UserProfileAPI from '../../services/UserProfileAPI';
import { connect } from 'react-redux';
import { UserProfile } from '../../models/UserProfile.class';


export interface UserProfileAPIKeyCreditsProps {
    userProfileLoggedIn: UserProfile,
}

function UserProfileAPIKeyCredits(props: UserProfileAPIKeyCreditsProps) {


  const [apiKeyCredit, setApiKeyCredit] = useState<APIKeyCredit>({public_key: localStorage.getItem("atlasAPIKeyCredit") || "", search_credits_available: 0});
  const [existingApiKeyCredits, setExistingApiKeyCredits] = useState<Array<APIKeyCredit>>([]);
  const [loadingApiKeyCredits, setLoadingApiKeyCredits] = useState("");

  const updateApiKeyCredit: ChangeEventHandler<HTMLInputElement> = (event) => {

    event.preventDefault();
    const value = event!.target!.value;
    const name = event.target.name;
    if (name === "public_key") {
        const updatedApiKeyCredit = {
            ...apiKeyCredit,
            [name]: value,
        }
        setApiKeyCredit(updatedApiKeyCredit);
        localStorage.setItem("atlasAPIKeyCredit", value);
    }
};

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if(event.currentTarget.name === "public_key" && event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      linkApiKeyToProfile();
    }
  }

  const linkApiKeyToProfile = () => {

    const postData = {
      api_key_credit_public_key: apiKeyCredit.public_key,
      user: props.userProfileLoggedIn.user,
  }
    UserProfileAPI.performAction('', 'link-api-key-to-profile', postData)
      .then((res: any)=> {
          console.log({res});
          setExistingApiKeyCredits(res.data.api_key_credits);
      })
      .catch((err: any) => {
          console.log({err});
      })
      .then(()=> {
        setLoadingApiKeyCredits("");
      })
  }

  const loadApiKeyCredits = useCallback(
    () => {
      
      setLoadingApiKeyCredits("Loading API Key details");
      UserProfileAPI.getUserContent(props.userProfileLoggedIn.user, 'api-key-credits')
      .then((res: any)=> {
          setExistingApiKeyCredits(res.data.api_key_credits);
      })
      .catch((err: any) => {
          console.log({err});
      })
      .then(()=> {
        setLoadingApiKeyCredits("");
      })
    },
    [props.userProfileLoggedIn.user]
  );

  useEffect(() => {
    loadApiKeyCredits();
}, [loadApiKeyCredits])

  return (
    <div>
        {loadingApiKeyCredits && <Loading title={loadingApiKeyCredits} />}
        <div style={{width: "500px"}} className="text-center center-block mt-3">
          <p className="text-left">
            Link an API Key Credit to your account:
          </p>
          <Input name="public_key"
                        value={apiKeyCredit.public_key} 
                        onChange={updateApiKeyCredit}
                        onKeyDown={keyDownHandler}
                        className="mb-2" 
                        placeholder={"Enter your API key here"}/>
                        <br/>
            
          <hr/>
          <h4>
              API Keys linked to your account
          </h4>
          {existingApiKeyCredits.map (existingApiKeyCredit => (
              <div>
                <p>
                    Public Key: {existingApiKeyCredit.public_key}
                </p>
                <p>
                    Search credits available: {existingApiKeyCredit.search_credits_available}
                </p>
          </div>
          ))}
        </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileAPIKeyCredits);