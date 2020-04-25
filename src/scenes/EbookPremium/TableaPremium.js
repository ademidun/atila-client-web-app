import React, { Component } from "react";
// for some reason documentation shows example of creating variables and not using them
/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports
import tableau from "tableau-api";
import PropTypes from "prop-types";
/* eslint-enable no-unused-vars */

class TableauPremium extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industry: this.props.industry,
    };
  }

  componentDidMount() {
    this.initViz();
  }

  initViz() {
    const techTierVizUrl =
      "https://public.tableau.com/views/WhatSchoolsDoTechCompaniesHireFromOrganizedbyCompany/Sheet3?:display_count=y&:origin=viz_share_link";

    const allIndustriesVizUrl =
      "https://public.tableau.com/views/Allindustriesver_1/Sheet1?:display_count=y&:origin=viz_share_link";
    const techVizContainer = this.techVizContainer;
    const allIndustriesVizContainer = this.allIndustriesVizContainer;

    /* eslint-disable no-unused-vars */
    // noinspection JSUnusedLocalSymbols

    let techTierViz = new window.tableau.Viz(techVizContainer, techTierVizUrl);

    // noinspection JSUnusedLocalSymbols
    let allIndustriesViz = new window.tableau.Viz(
      allIndustriesVizContainer,
      allIndustriesVizUrl
    );
    /* eslint-enable no-unused-vars */
  }

  render() {
    const tabIndustry = this.props.industry;
    return (
      <div className='container'>
        <h1>
          Preview of {tabIndustry} industry Graphs{" "}
          <span role='img' aria-labelledby='eyes'>
            👀
          </span>
        </h1>

        <div
          ref={(div) => {
            this.allIndustriesVizContainer = div;
          }}
        ></div>

        <hr />

        <div
          ref={(div) => {
            this.techVizContainer = div;
          }}
        ></div>
      </div>
    );
  }
}

TableauPremium.defaultProps = {
  industry: 'Tech',
};
TableauPremium.propTypes = {
  industry: PropTypes.string,
};

export default TableauPremium;
