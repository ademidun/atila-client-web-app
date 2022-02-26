import React from 'react'
import { Tabs } from 'antd'
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import CryptoIntro from './CryptoIntro';
import { RouteComponentProps } from 'react-router';
import "./Crypto.scss";
import AddBlockChains from './AddBlockChains';

const { TabPane } = Tabs;

interface RouteParams {action: string};

function Crypto(props: RouteComponentProps<RouteParams>) {

    const { action } = props.match.params;

    const title = "Start and get scholarships using cryptocurrencies";
    const seoContent = {
        ...defaultSeoContent,
        title,
    }
  return (
    <div className="Crypto container card shadow mt-5 pt-5">
        <HelmetSeo content={seoContent} />
        <h1>{title}</h1>
        <hr />
        <Tabs defaultActiveKey={action}>
            <TabPane tab="Start Here" key="start">
                <CryptoIntro />
            </TabPane>
            <TabPane tab="Add Blockchains" key="add-blockchain">
                <div className="section card shadow">
                    <AddBlockChains />
                </div>
            </TabPane>
        </Tabs>
    </div>
  )
}

export default Crypto