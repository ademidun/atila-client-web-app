import { Alert, Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { UserProfile } from '../../models/UserProfile.class';
import PaymentAPI from '../../services/PaymentAPI';
import UserProfileAPI from '../../services/UserProfileAPI';

export interface ConmectWalletPropTypes {
    userProfileLoggedIn?: UserProfile,
}

function ConnectWallet(props: any) {

    const { userProfileLoggedIn } = props;
    // TODO add class for Wallet
    const [wallet, setWallet] = useState({} as any);
    const [error, setError] = useState("");
    
    useEffect(() => {
        getWallet();
      }, []);

    const getWallet = () => {
    
            UserProfileAPI.getUserContent(userProfileLoggedIn.user, "wallets")
            .then(res => {
                console.log({res});
                const { data: { wallets } } = res;
                if (wallets?.length > 0) {
                    setWallet(wallets[0]);
                }
            })
            .catch(error => {
                console.log({error});
            })
    }

    const saveWallet = (walletAddress: string) => {
            const postData = {
                user: userProfileLoggedIn?.user,
                address: walletAddress,
            }
    
            PaymentAPI.saveWallet(postData)
            .then(res => {
                console.log({res});
                setWallet(res.data);
                
            })
            .catch(error => {
                console.log({error});
            })
    }
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
              const walletAddresses = await window.ethereum.request({ method: 'eth_requestAccounts' }) as Array<string>;
              console.log({walletAddresses});
              saveWallet(walletAddresses[0])
            } catch (error: any) {
              if (error.code === 4001) {
                // User rejected request
              }
              setError(error);
            }
          } else {
            setError("Crypto wallet not found. Install the metamask or similar extension.");
          }
    }
    return (
        <div>
            <Button onClick={connectWallet}>
                Connect Wallet
            </Button>
            {wallet && 
            <div>
                Wallet Address: {wallet.address}
            </div>
            }
            {error && <Alert type="error" message={error} className="mb-3" />}
        </div>
    )
}


const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ConnectWallet);
