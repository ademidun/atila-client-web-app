import React, { useState } from "react";
import { Tooltip } from "antd";
import { Wallet } from "../../models/Wallet.class";


export default function WalletDisplay(props: {wallet: Wallet}) {

    const { wallet } = props;


    // TODO add ability to copy to clipboard on hover
    // https://stackoverflow.com/questions/63546951/react-copy-to-clipboard-using-useref-hook

    const shortenedAddress = `${wallet.address.slice(0,4)}...${wallet.address.slice(-4)}`;
    const [isShowingFullAddress, setIsShowingFullAddress] = useState(false);
    
    return (
        <>
        { wallet.label || "Unlabelled wallet"}: {' '}
        <Tooltip title={`click to see ${isShowingFullAddress ? "shortened" : "full"} address`}>
            <span  onClick={()=> {setIsShowingFullAddress(!isShowingFullAddress)}} className="text-underline">
                {isShowingFullAddress ? wallet.address : shortenedAddress}
            </span>
        </Tooltip>
        </>
    )
}