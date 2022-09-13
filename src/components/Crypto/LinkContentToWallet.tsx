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
import { RouteComponentProps, withRouter } from 'react-router';
import WalletDisplay from './WalletDisplay';

export interface LinkContentToWalletPropTypes extends RouteComponentProps  {
    content: Blog | Application,
    contentType: "Blog" | "Application",
    userProfileLoggedIn: UserProfile,
    onContentLinked?: (content: Blog | Application) => void, 
}

const LinkContentToWallet = (props: LinkContentToWalletPropTypes) => {


    const { userProfileLoggedIn, content, contentType, onContentLinked } = props;
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
        if (contentType === "Blog") {
            linkWalletToBlog(walletId)
        } else if (contentType === "Application") {
            linkWalletToApplication(walletId)
        }
    }

    const linkWalletToBlog = (walletId: string) => {
        setLoadingWallet("Linking wallet to your blog");
        BlogsApi.patch(content.id, {wallet:  walletId})
        .then(res => {
            setContentWallet(res.data.wallet);
            onContentLinked?.(res.data);
        })
        .catch(error => {
            console.log({error});
            setError(getErrorMessage(error));
        })
        .finally(() => {
            setLoadingWallet("");
        })
    }


    const linkWalletToApplication = (walletId: string) => {

        setLoadingWallet("Creating your application and linking the wallet to your application");
        ApplicationsAPI.getOrCreate({ scholarship: (content as Application).scholarship, user: content.user, wallet: walletId })
            .then((res: any) => {
                const { data: { application: newApplication } } = res;
                setContentWallet(newApplication.wallet);
                onContentLinked?.(newApplication);
            })
            .catch((err: any) => {
                console.log({ err });
            })
            .finally(() => {
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
            Select a wallet to link to your {contentType.toLowerCase()}:
            {loadingWallet && <Loading isLoading={loadingWallet} title={loadingWallet} />}
            {error && <Alert type="error" message={error} className="my-3" />}
            <div>
                <Radio.Group value={contentWallet || "Select a wallet"} onChange={handleSelectWallet} optionType="button" buttonStyle="solid" disabled={!!loadingWallet}>
                    {wallets.map(wallet => (
                        <Radio.Button value={wallet.id} key={wallet.id} className="mb-1">
                            <WalletDisplay wallet={wallet} />
                        </Radio.Button>
                    ))}
                    <p className="text-muted">Wallet changes are automatically saved</p>
                </Radio.Group>
                {wallets?.length === 0 &&
                <>No wallets found. Connect a wallet below.</>
                }
                <hr/>
                <div>
                    <h5>Connect a new Wallet</h5>
                    <ConnectWallet onSaveWallets={(wallets: Array<Wallet>) => setWallets(wallets)} />
                </div>
            </div>
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

export default withRouter(connect(mapStateToProps)(LinkContentToWallet))
