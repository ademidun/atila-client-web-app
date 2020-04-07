import React, { Component } from 'react';
import tableau from 'tableau-api';


class Test extends Component {
    componentDidMount() {
        this.initViz()
    }


    initViz() {
        const techTierVizUrl = 'https://public.tableau.com/views/TechTierList2_15862703467460/Sheet3?:display_count=y&publish=yes&:origin=viz_share_link&embed=y';
        const allIndustriesVizUrl = 'https://public.tableau.com/views/Allindustriesver_1/Sheet1?:display_count=y&:origin=viz_share_link';
        const techVizContainer = this.techVizContainer;
        const allIndustriesVizContainer = this.allIndustriesVizContainer;


        let techTierViz = new window.tableau.Viz(techVizContainer, techTierVizUrl);
        let allIndustriesViz = new window.tableau.Viz(allIndustriesVizContainer, allIndustriesVizUrl);
    }


    render() {
        return (
            <div className="container">
                <h1>Graphics</h1>
                <div ref={(div) => { this.allIndustriesVizContainer = div }}>
                </div>
                <hr/>
                <div ref={(div) => { this.techVizContainer = div }}>
                </div>

            </div>
        )
    }
}


export default Test;  