import React, { Component } from "react";
import {Row, Col, Tabs, Tag} from "antd";
import "../Ebook/Ebook.scss";
/* eslint-disable no-unused-vars */
// The tableau library needs to be imported even though it will be used
// via window.tableau.Viz and not tableau.Viz
// noinspection ES6UnusedImports
import tableau from "tableau-api";
import TableauViz from "../../components/TableauViz";
import {FlourishViz} from "../../components/FlourishViz";
/* eslint-enable no-unused-vars */

const TabPane = Tabs.TabPane;

export default class EbookPremiumTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industry: "Tech",
      industryConfig: {
        "Tech": {
          name: "Tech",
          label: "Google, Amazon, Facebook, and more",
          tableauUrls: [
              "https://public.tableau.com/views/WhatSchoolsDoTechCompaniesHireFromOrganizedbyCompany/Sheet3?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TotalCareerSegmentationPerSchoolIncludingTopInternationalSchools/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TechTierList2/Sheet3?:display_count=y&:origin=viz_share_link",
          ],
          flourishUrls: [
                {
                    visualizationId: '1818468',
                    isNew: true,
                    title: 'Jobs at Tech Companies by Canadian Universities\n'
                },
                {
                    visualizationId: '1704268',
                    isNew: true,
                    title: 'Software Engineers by School'
                }
            ]
        },
        "Biomedical": {
          name: "Biomedical",
          label: "Pfizer, GSK, and more",
          tableauUrls: [
              "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyCompany/Sheet3?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPosition/Sheet4?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPositiontop5/Sheet5?:display_count=y&:origin=viz_share_link",
          ],
        },
        "Investment Banking": {
          name: "Investment Banking",
          label: "Goldman Sachs, RBC Capital Markets and more",
          tableauUrls: [
              "https://public.tableau.com/views/AmericanFirms_15860728549960/Sheet3?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TotalCanadianBanks/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/AmericanFirms_15860728549960/FunnelChart1?:display_count=y&publish=yes&:origin=viz_share_link",
          ],
        },
        "Consulting": {
          name: "Consulting",
          label: "McKinsey, Bain, BCG, and more",
          tableauUrls: [
              "https://public.tableau.com/views/TotalMBBFunnel/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TotalDAFunnel/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/TOP10Treemap/Sheet1?:display_count=y&:origin=viz_share_link",
          ],
          flourishUrls: [
                {
                    visualizationId: '1647836',
                    isNew: true,
                    title: 'Top 5 Schools for MBB Consulting'
                }
            ]
        },
        "All Industries": {
          name: "All Industries",
          label: "Tech, Consulting, Investment Banking, Biomedical",
          tableauUrls: [
              "https://public.tableau.com/views/WhatSchoolsDoCompaniesHireFromOrganizedbyCompany/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/UniversityRankingsApril2020/Sheet1?:display_count=y&:origin=viz_share_link",
              "https://public.tableau.com/views/AllIndustries2/Sheet2?:display_count=y&:origin=viz_share_link",
          ],
          flourishUrls: [
              {
                  visualizationId: '1924813',
                  isNew: true,
                  title: 'School Rankings By Industry'
              }
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
        <div>
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
                              {industryConfig[industry].flourishUrls &&
                              industryConfig[industry].flourishUrls.map( item => (
                                  <div key={item.visualizationId}>
                                      {item.isNew &&
                                        <Tag color="green">new</Tag>
                                      }
                                      <div
                                           style={item.isNew ? {border: 'solid #B7EB8F', marginBottom: '1%'} : null}>
                                          <FlourishViz visualizationId={item.visualizationId}
                                                       title={item.title} />
                                      </div>
                                  </div>
                              ))}
                          </React.Fragment>
                        <React.Fragment>
                          {industryConfig[industry].tableauUrls.map( url => (
                              <React.Fragment key={url}>
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
        </div>
    );
  }
}
