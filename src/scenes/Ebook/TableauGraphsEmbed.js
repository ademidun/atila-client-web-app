import React, { Component } from 'react';
// for some reason documentation shows example of creating variables and not using them
/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports
import tableau from 'tableau-api';
/* eslint-enable no-unused-vars */


class TableauGraphsEmbed extends Component {
    componentDidMount() {
        this.initViz()
    }


    initViz() {
        const techTierVizUrl = 'https://public.tableau.com/views/WhatSchoolsDoTechCompaniesHireFromOrganizedbyCompany/Sheet3?:display_count=y&:origin=viz_share_link';
        const allIndustriesVizUrl = 'https://public.tableau.com/views/Allindustriesver_1/Sheet1?:display_count=y&:origin=viz_share_link';
        const techVizContainer = this.techVizContainer;
        const allIndustriesVizContainer = this.allIndustriesVizContainer;

        /* eslint-disable no-unused-vars */
        // noinspection JSUnusedLocalSymbols
        let techTierViz = new window.tableau.Viz(techVizContainer, techTierVizUrl);
        // noinspection JSUnusedLocalSymbols
        let allIndustriesViz = new window.tableau.Viz(allIndustriesVizContainer, allIndustriesVizUrl);
        /* eslint-enable no-unused-vars */
    }


    render() {
        return (
            <div className="container">
                <h1>Preview of Some Graphics</h1>
                <div ref={(div) => { this.allIndustriesVizContainer = div }}>
                </div>
                <hr/>
                <div ref={(div) => { this.techVizContainer = div }}>
                </div>

            </div>
        )
    }
}


export default TableauGraphsEmbed;