import React, { Component } from "react";
import { Row, Col, Tabs } from "antd";
import "../Ebook/Ebook.scss";
/* eslint-disable no-unused-vars */
// The tableau library needs to be imported even though it will be used
// via window.tableau.Viz and not tableau.Viz
// noinspection ES6UnusedImports
import tableau from "tableau-api";
import TableauViz from "../../components/TableauViz";
/* eslint-enable no-unused-vars */

const TabPane = Tabs.TabPane;

export default class EbookPremiumTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industry: "InvestmentBanking",
      industryConfig: {
        "Tech": {
          name: "Tech",
          label: "Google, Amazon, Facebook, and more",
          vizUrl: "https://public.tableau.com/views/EntryLevelGoogleSoftwareEngineerBaseSalaryinWaterloovsMountainViewCAD/Sheet5?:display_count=y&:origin=viz_share_link",
        },
        "Biomedical": {
          name: "Biomedical",
          label: "Pfizer, GSK, and more",
          vizUrl: "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPosition/Sheet4?:display_count=y&:origin=viz_share_link",
        },
        "InvestmentBanking": {
          name: "InvestmentBanking",
          label: "Goldman Sachs, RBC Capital Markets and more",
          vizUrl: "https://public.tableau.com/views/EntryLevelGoogleProductManagervsGoldmanSachsAnalystinNYCUSD/Sheet4?:display_count=y&:origin=viz_share_link",
        },
        "Consulting": {
          name: "Consulting",
          label: "McKinsey, Bain, BCG, and more",
          vizUrl: "https://public.tableau.com/views/WhatSchoolsDoCompaniesHireFromOrganizedbyCompanySchoolsNumbers/Sheet2?:display_count=y&:origin=viz_share_link",
        },
      }
    };
  }

  changeTab = (industry) => {
    this.setState({
      industry,
    });
  };

  render() {

    const { industryConfig } = this.state;
    return (
      <Row>
        <Col>
          <div className='text-center'>
            <Tabs
              defaultActiveKey='InvestmentBanking'
              id='UserProfileViewTabs'
              onChange={(e) => this.changeTab(e)}
            >
              {Object.keys(industryConfig).map( industry => (
                  <TabPane tab={industry} key={industry}>
                    <React.Fragment>
                      <TableauViz url={industryConfig[industry].vizUrl} />
                    </React.Fragment>
                  </TabPane>
              ))}
            </Tabs>

          </div>
        </Col>
      </Row>
    );
  }
}
