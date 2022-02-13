import React from 'react';
import BarLoader from "react-spinners/BarLoader";

interface LoadingProps {
    isLoading: boolean|string;
    title: string;
    className: string;
    width?: string|number;
}

Loading.defaultProps = {
    isLoading: true,
    title: "Loading",
    className: "mt-3",
    width: 'auto',
};

function Loading(props: LoadingProps) {

    const { isLoading , title, className, width } = props;

    if (!isLoading) {
        return null;
    }

    return (<div className={`text-center ${className}`}>
        <h5>{title}</h5>
        <div className="center-block">
            <BarLoader color={'#0b9ef5'} height={7} width={width as number}/>
        </div>
    </div>)
}

export default Loading;