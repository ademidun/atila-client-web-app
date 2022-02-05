import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Radio } from 'antd';
import { connect } from 'react-redux'
import { Blog } from '../../models/Blog'
import { UserProfile } from '../../models/UserProfile.class';
import { Wallet } from '../../models/Wallet.class';
import UserProfileAPI from '../../services/UserProfileAPI';
import Loading from '../Loading';
import { getErrorMessage } from '../../services/utils';
import BlogsApi from '../../services/BlogsAPI';
import { Application } from '../../models/Application.class';
import ApplicationsAPI from '../../services/ApplicationsAPI';
import ConnectWallet from './ConnectWallet';

export interface LinkContentToWalletPropTypes {
    content: Blog | Application | undefined, //TODO: add support for Application, Essay and other content types
    contentType: "Blog" | "Application",
    userProfileLoggedIn: UserProfile,

}

const LinkContentToWallet = (props: LinkContentToWalletPropTypes) => {


    const { userProfileLoggedIn, content, contentType } = props;
    // TODO add class for Wallet
    const [wallets, setWallets] = useState<Array<Wallet>>([]);
    const [error, setError] = useState("");
    const [loadingWallet, setLoadingWallet] = useState("");
    const [contentWallet, setContentWallet] = useState(content?.wallet);
    
    /**
     * If we weant to pass a function to useEffect we must memoize the function to prevent an infinite loop re-render.
     * This is because functions change their reference each time a component is re-rendered.
     * Instead, we only want to rerender when the userProfileLoggedIn.user reference inside the getWallets() function is changed
     * see: https://stackoverflow.com/a/62601621
     */
    const getWallets = useCallback(
        () => {
    
        setLoadingWallet("Loading user wallets");
        setError("");
        UserProfileAPI.getUserContent(userProfileLoggedIn?.user, "wallets")
        .then(res => {
            const { data: { wallets } } = res;
            if (wallets) {
                setWallets(wallets);
            }
        })
        .catch(error => {
            console.log({error});
            setError(getErrorMessage(error));
        })
        .finally(()=> {
            setLoadingWallet("");
        })
          return ;// code that references a prop
        },
        [userProfileLoggedIn,]
      );

    const handleSelectWallet = (event: any) => {
        if(!content) {
            return
        }
        const walletId = event.target.value;
        let ContentApi = contentType === "Blog" ? BlogsApi : ApplicationsAPI;

        ContentApi.patch(content.id, {wallet:  walletId})
        .then(res => {
            setContentWallet(res.data.wallet);
        })
        .catch(error => {
            console.log({error});
            setError(getErrorMessage(error));
        })
        .finally(()=> {
            setLoadingWallet("");
        })
    }

    const handleUnlinkWallet = () => {
        const event = {
            target: {
                value: null
            }
        }
        handleSelectWallet(event);
    }

    useEffect(() => {
        getWallets();
      }, [getWallets]);
    return (
        <div className="my-3">
            Select Wallet to Link:
            {loadingWallet && <Loading isLoading={loadingWallet} title={loadingWallet} />}
            {error && <Alert type="error" message={error} className="my-3" />}
            {!loadingWallet && 
            <div>
                <Radio.Group value={contentWallet || "Select a wallet"} onChange={handleSelectWallet} optionType="button" buttonStyle="solid">
                    {wallets.map(wallet => (
                        <Radio.Button value={wallet.id} key={wallet.id} className="mb-1">
                            {wallet.label && <>{wallet.label}: </>} {`${wallet.address.substr(0,4)}...${wallet.address.substr(-4)}`}
                        </Radio.Button>
                    ))}
                    <p className="text-muted">Wallet changes are automatically saved</p>
                </Radio.Group>
                <hr/>
                <div>
                    <h5>Connect a new Wallet</h5>
                    <ConnectWallet onSaveWallets={(wallets: Array<Wallet>) => setWallets(wallets)} />
                </div>
            </div>
            }
            {contentWallet && 
                <Button onClick={handleUnlinkWallet} disabled={!!loadingWallet} >
                    Unlink Wallet
                </Button>
        }
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(LinkContentToWallet)
