import { Alert, Button, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { UserProfile } from '../../models/UserProfile.class';
import { Wallet } from '../../models/Wallet.class';
import PaymentAPI from '../../services/PaymentAPI';
import UserProfileAPI from '../../services/UserProfileAPI';
import { getErrorMessage } from '../../services/utils';
import Loading from '../Loading';

export interface ConmectWalletPropTypes {
    userProfileLoggedIn?: UserProfile,
}

function ConnectWallet(props: any) {

    const { userProfileLoggedIn } = props;
    // TODO add class for Wallet
    const [wallets, setWallets] = useState<Array<Wallet>>([]);
    const [error, setError] = useState("");
    const [loadingWallet, setLoadingWallet] = useState("");
    
    /**
     * If we weant to pass a function to useEffect we must memoize the function to prevent an infinite loop re-render.
     * This is because functions change their reference each time a component is re-rendered.
     * Instead, we only want to rerender when the userProfileLoggedIn.user reference inside the getWallets() function is changed
     * see: https://stackoverflow.com/a/62601621
     */
    const getWallets = useCallback(
        () => {
    
        setLoadingWallet("Loading user wallet");
        UserProfileAPI.getUserContent(userProfileLoggedIn.user, "wallets")
        .then(res => {
            const { data: { wallets } } = res;
            if (wallets) {
                setWallets(wallets);
            }
        })
        .catch(error => {
            console.log({error});
        })
        .finally(()=> {
            setLoadingWallet("");
        })
          return ;// code that references a prop
        },
        [userProfileLoggedIn,]
      );

    useEffect(() => {
        getWallets();
      }, [getWallets]);

    const saveWallet = (walletAddress: string) => {
            const postData = {
                user: userProfileLoggedIn?.user,
                address: walletAddress,
            }
    
            PaymentAPI.saveWallet(postData)
            .then(res => {
                setWallets([res.data, ...wallets]);
                
            })
            .catch(error => {
                console.log({error});
            })
    }
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
              const walletAddresses = await window.ethereum.request({ method: 'eth_requestAccounts' }) as Array<string>;
              setError("");

              let walletAddress;
              if (walletAddresses.length > 0) {
                walletAddress = walletAddresses[0];

                if (wallets.map(wallet => wallet.address).includes(walletAddress)) {
                    setError("This wallet has already been connected");
                    return;
                } else {
                    saveWallet(walletAddresses[0]);
                }
                
              }
            } catch (error: any) {
                console.log({error});
              setError(getErrorMessage(error));
            }
          } else {
            setError("Crypto wallet not found. Install Metamask, Trust Wallet or a similar tool.");
          }
    }

    /**
     * TODO: This code isn't working. Please fix in a future commit or PR.
     * @param event 
     * @param wallet 
     */
    const handleWalletLabelChange = (event: any, wallet: Wallet) => {
        const postData = {
            label: event.target.value,
        }

        PaymentAPI.patchWallet(wallet.id, postData)
        .then(res => {})
        .catch(error => {
            console.log({error});
        })
    }

    return (
        <div>
            <Button onClick={connectWallet} disabled={!!loadingWallet} type="primary">
                Connect Wallet
            </Button>
            {error && <Alert type="error" message={error} className="my-3" />}
            <h5 className="my-3">Connected wallets</h5>
            {wallets.length > 0 &&
                <ol>
                {wallets.map(wallet => (
                    <li>
                        Wallet Address: {wallet.address}
                        <Input value={wallet.label} placeholder="Add a label to help you remember this wallet. TEMP DEBUG. COPY PASTE THE LABEL, typing it might not work." 
                        onChange={event => handleWalletLabelChange(event, wallet)} />
                    </li>
                ))}
                </ol>
            }
            {loadingWallet && <Loading isLoading={loadingWallet} title={loadingWallet} />}
        </div>
    )
}


const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ConnectWallet);
