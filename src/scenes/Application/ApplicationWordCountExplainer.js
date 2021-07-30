import React from 'react';
import { Tag } from 'antd';
import {Link} from "react-router-dom";


function ApplicationWordCountExplainer(){

    return (
        <details className="pl-4">
                <summary>What's the word count?{' '}<Tag color="green">new</Tag></summary>
                There are no word count rules for scholarship applications on Atila.
                <br/>
                But if you want an idea on how much to write, a suggested length is around 500 words per long answer question. 
                <br/>
                We chose 500 because it's the word count of the average scholarship winner, but feel free to write less or more.
                <br/>
                <Link to="/blog/ericwang451/whats-the-word-count-analyzing-the-correlation-between-essay-length-and-quality/">Learn More.</Link> 
        </details>
    )
}

export default ApplicationWordCountExplainer;