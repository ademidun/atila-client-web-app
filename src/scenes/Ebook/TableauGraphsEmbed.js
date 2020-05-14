import React, { Component } from "react";
// for some reason documentation shows example of creating variables and not using them
/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports
import tableau from "tableau-api";
/* eslint-enable no-unused-vars */

class TableauGraphsEmbed extends Component {
  componentDidMount() {
    this.initViz();
  }

  initViz() {
      const allIndustriesVizUrl = 'https://public.tableau.com/views/WhatSchoolsDoCompaniesHireFromOrganizedbyCompanySchoolsNumbersmobileupdated/Dashboard1?:display_count=y&publish=yes&:origin=viz_share_link';
      const allIndustriesVizContainer = this.allIndustriesVizContainer;

      const techTierVizUrl = 'https://public.tableau.com/views/WhatSchoolDoTechCompainesHireFrommobilefriendly/Dashboard1?:display_count=y&:origin=viz_share_link';
      const techVizContainer = this.techVizContainer;

    /* eslint-disable no-unused-vars */
      // noinspection JSUnusedLocalSymbols
      let allIndustriesViz = new window.tableau.Viz(
          allIndustriesVizContainer,
          allIndustriesVizUrl
      );
    // noinspection JSUnusedLocalSymbols
    let techTierViz = new window.tableau.Viz(techVizContainer, techTierVizUrl);
    /* eslint-enable no-unused-vars */
  }

  render() {
    return (
      <div className='container'>
        <h1>
          Preview of Some Graphics{" "}
          <span role='img' aria-labelledby='eyes'>
            👀
          </span>
        </h1>
        <div
            ref={(div) => {
                this.allIndustriesVizContainer = div;
            }}
        />
        <hr />
        <div
          ref={(div) => {
            this.techVizContainer = div;
          }}
        />
      </div>
    );
  }
}

export default TableauGraphsEmbed;
