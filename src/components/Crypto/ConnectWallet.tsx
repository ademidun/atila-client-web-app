import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Input } from 'antd';
import { connect } from 'react-redux';
import { UserProfile } from '../../models/UserProfile.class';
import { Wallet } from '../../models/Wallet.class';
import PaymentAPI from '../../services/PaymentAPI';
import UserProfileAPI from '../../services/UserProfileAPI';
import { getErrorMessage } from '../../services/utils';
import Loading from '../Loading';
import WalletDisplay from './WalletDisplay';
import { ConnectWalletHelperText } from '../../models/ConstantsPayments';

export interface ConmectWalletPropTypes {
    userProfileLoggedIn?: UserProfile,
    onSaveWallets: (wallets: Array<Wallet>) => void,
}

let autoSaveTimeoutId: NodeJS.Timeout;

function ConnectWallet(props: any) {

    const { userProfileLoggedIn, onSaveWallets } = props;
    // TODO add class for Wallet
    const [wallets, setWallets] = useState<Array<Wallet>>([]);
    const [error, setError] = useState("");
    const [loadingWallet, setLoadingWallet] = useState("");
    const [isPerformingWalletAction, setIsPerformingWalletAction] = useState(false);
    
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

    const createWallet = (walletAddress: string) => {
            const postData = {
                user: userProfileLoggedIn?.user,
                address: walletAddress,
            }
    
            PaymentAPI.createWallet(postData)
            .then(res => {
                const updatedWallets = [res.data, ...wallets];
                setWallets(updatedWallets);
                onSaveWallets?.(updatedWallets);
                
            })
            .catch(error => {
                setError(getErrorMessage(error));
            })
    }
    const connectWallet = async () => {

        setError("");
        setIsPerformingWalletAction(true);
        if (!window.ethereum) {
            setError("Crypto wallet not found. Install Metamask, Trust Wallet or a similar wallet.");
            setIsPerformingWalletAction(false);
            return;
        }
        
        try {
            const walletAddresses = await window.ethereum.request({ method: 'eth_requestAccounts' }) as Array<string>;

            let walletAddress;
            if (walletAddresses.length > 0) {
              walletAddress = walletAddresses[0];

              if (wallets.map(wallet => wallet.address).includes(walletAddress)) {
                  setError("This wallet has already been connected");
                  setIsPerformingWalletAction(false);
                  return;
              } else {
                  createWallet(walletAddress);
              }
              
            }
          } catch (error: any) {
              console.log({error});
            setError(getErrorMessage(error));
        }

        setIsPerformingWalletAction(false);
    }

    /**
     * TODO: This code isn't working. Please fix in a future commit or PR.
     * @param event 
     * @param wallet 
     */
    const handleWalletLabelChange = (event: any, updatedWallet: Wallet) => {
        const label = event.target.value;

        const updatedWallets = wallets.map(wallet => wallet.id === updatedWallet.id ? {...wallet, label} : wallet);
        setWallets(updatedWallets);
        onSaveWallets?.(updatedWallets);
        setError("");

        if (autoSaveTimeoutId) {
            clearTimeout(autoSaveTimeoutId);
        }
        autoSaveTimeoutId = setTimeout(() => {
            // Runs a half second (500 ms) after the last change
            PaymentAPI.patchWallet(updatedWallet.id, {label})
            .then()
            .catch(error => {
                console.log({error});
                setError(getErrorMessage(error));
            })
        }, 500);

        
    }

    return (
        <div>
            <Button onClick={connectWallet} disabled={!!loadingWallet || isPerformingWalletAction} type="primary">
                Connect Wallet
            </Button>
            {error && <Alert type="error" message={error} className="my-3" />}
            {wallets.length > 0 &&
                <div>
                    <h5 className="my-3">Connected wallets</h5>
                    <ol>
                        {wallets.map(wallet => (
                            <li key={wallet.id}>
                                <WalletDisplay wallet={wallet} />
                                <Input value={wallet.label} placeholder="Add a label to help you remember this wallet." 
                                onChange={event => handleWalletLabelChange(event, wallet)} />
                            </li>
                        ))}
                    </ol>
                </div>
            }
            {wallets.length === 0 && <ConnectWalletHelperText />}
            {loadingWallet && <Loading isLoading={loadingWallet} title={loadingWallet} />}
        </div>
    )
}


const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ConnectWallet);
