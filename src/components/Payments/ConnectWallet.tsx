import { Alert, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { UserProfile } from '../../models/UserProfile.class';
import { Wallet } from '../../models/Wallet.class';
import PaymentAPI from '../../services/PaymentAPI';
import UserProfileAPI from '../../services/UserProfileAPI';
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
     * Instead, we only want to rerender when the userProfileLoggedIn.user reference inside the getWallet() function is changed
     * see: https://stackoverflow.com/a/62601621
     */
    const getWallet = useCallback(
        () => {
    
        setLoadingWallet("Loading user wallet");
        UserProfileAPI.getUserContent(userProfileLoggedIn.user, "wallets")
        .then(res => {
            console.log({res});
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
        getWallet();
      }, [getWallet]);

    const saveWallet = (walletAddress: string) => {
            const postData = {
                user: userProfileLoggedIn?.user,
                address: walletAddress,
            }
    
            PaymentAPI.saveWallet(postData)
            .then(res => {
                console.log({res});
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

              let walletAddress;
              if (walletAddresses.length > 0) {
                console.log({walletAddresses});
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
            <Button onClick={connectWallet} disabled={!!loadingWallet}>
                Connect Wallet
            </Button>
            {error && <Alert type="error" message={error} className="my-3" />}
            <h5 className="my-3">Connected wallets</h5>
            {wallets.length > 0 &&
                <ol>
                {wallets.map(wallet => (
                    <li>
                        Wallet Address: {wallet.address}
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
