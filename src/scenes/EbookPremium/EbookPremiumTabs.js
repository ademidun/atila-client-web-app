import React, { Component } from "react";
import { Row, Col, Tabs } from "antd";
import "../Ebook/Ebook.scss";

const TabPane = Tabs.TabPane;
let viz;

export default class EbookPremiumTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industry: "InvestmentBanking",
    };
  }

  componentDidMount() {
    console.log(this.state.industry);
    const vizUrl =
      "https://public.tableau.com/views/EntryLevelGoogleProductManagervsGoldmanSachsAnalystinNYCUSD/Sheet4?:display_count=y&:origin=viz_share_link";

    const vizContainer = this.vizContainer;
    viz = new window.tableau.Viz(vizContainer, vizUrl);
  }

  componentDidUpdate() {
    console.log(this.state.industry);

    viz.dispose();

    if (this.state.industry === "Tech") {
      const vizUrl =
        "https://public.tableau.com/views/EntryLevelGoogleSoftwareEngineerBaseSalaryinWaterloovsMountainViewCAD/Sheet5?:display_count=y&:origin=viz_share_link";
      const vizContainer = this.vizContainer;
      viz = new window.tableau.Viz(vizContainer, vizUrl);
    }

    if (this.state.industry === "Biomedical") {
      const vizUrl =
        "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPosition/Sheet4?:display_count=y&:origin=viz_share_link";
      const vizContainer = this.vizContainer;
      viz = new window.tableau.Viz(vizContainer, vizUrl);
    }
    if (this.state.industry === "InvestmentBanking") {
      const vizUrl =
        "https://public.tableau.com/views/EntryLevelGoogleProductManagervsGoldmanSachsAnalystinNYCUSD/Sheet4?:display_count=y&:origin=viz_share_link";

      const vizContainer = this.vizContainer;
      viz = new window.tableau.Viz(vizContainer, vizUrl);
    }

    if (this.state.industry === "Consulting") {
      const vizUrl =
        "https://public.tableau.com/views/WhatSchoolsDoCompaniesHireFromOrganizedbyCompanySchoolsNumbers/Sheet2?:display_count=y&:origin=viz_share_link";
      const vizContainer = this.vizContainer;
      viz = new window.tableau.Viz(vizContainer, vizUrl);
    }
  }

  render() {
    const changeTab = (activeKey) => {
      this.setState({
        industry: activeKey,
      });
    };

    return (
      <Row>
        <Col>
          <div className='text-center'>
            <Tabs
              defaultActiveKey='InvestmentBanking'
              id='UserProfileViewTabs'
              onChange={(e) => changeTab(e)}
            >
              <TabPane tab='InvestmentBanking' key='InvestmentBanking'>
                <React.Fragment>
                  Hello
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>

              <TabPane tab='Tech' key='Tech'>
                <React.Fragment>
                  hi
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>

              <TabPane tab='Biomedical' key='Biomedical'>
                <React.Fragment>
                  howdy
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>
              <TabPane tab='Consulting' key='Consulting'>
                <React.Fragment>
                  meow
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    );
  }
}
