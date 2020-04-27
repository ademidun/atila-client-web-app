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
      industry: "Investment Banking",
      industryConfig: {
        "Tech": {
          name: "Tech",
          label: "Google, Amazon, Facebook, and more",
          urls: [
              "https://public.tableau.com/views/TechTierList2/Sheet3?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/WhatSchoolsDoTechCompaniesHireFromOrganizedbyCompany/Sheet3?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TotalCareerSegmentationPerSchoolIncludingTopInternationalSchools/Sheet1?:display_count=y&:origin=viz_share_link",
          ],
        },
        "Biomedical": {
          name: "Biomedical",
          label: "Pfizer, GSK, and more",
          urls: [
              "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyCompany/Sheet3?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPosition/Sheet4?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPositiontop5/Sheet5?:display_count=y&:origin=viz_share_link",
          ],
        },
        "Investment Banking": {
          name: "Investment Banking",
          label: "Goldman Sachs, RBC Capital Markets and more",
          urls: [
              "https://public.tableau.com/views/AmericanFirms_15860728549960/Sheet3?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/CanadianBanks/Sheet2?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/AmericanFirms_15860728549960/FunnelChart1?:display_count=y&publish=yes&:origin=viz_share_link",
          ],
        },
        "Consulting": {
          name: "Consulting",
          label: "McKinsey, Bain, BCG, and more",
          urls: [
              "https://public.tableau.com/views/TotalMBBFunnel/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TotalDAFunnel/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TOP10Treemap/Sheet1?:display_count=y&:origin=viz_share_link",
          ],
        },
        "All Industries": {
          name: "All Industries",
          label: "Tech, Consulting, Investment Banking, Biomedical",
          urls: [
              "https://public.tableau.com/views/WhatSchoolsDoCompaniesHireFromOrganizedbyCompany/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/UniversityRankingsApril2020/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/AllIndustries2/Sheet2?:display_count=y&:origin=viz_share_link",
          ],
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
              defaultActiveKey='Tech'
              id='UserProfileViewTabs'
              onChange={(e) => this.changeTab(e)}
            >
              {Object.keys(industryConfig).map( industry => (
                  <TabPane tab={industry} key={industry}>
                    <React.Fragment>
                      {industryConfig[industry].urls.map( url => (
                          <React.Fragment>
                            <TableauViz url={url} />
                            <hr/>
                          </React.Fragment>
                      ))}
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
