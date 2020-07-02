import React from "react";
import { Collapse } from 'antd';

const { Panel } = Collapse;

function callback(key) {
    console.log(key);
}

const faqAnswers = [
    { question: "What's inside the ebook?",
        answer: (
            <ol>
                <li>This ebook analyzes the employment statistics of university students in the consulting, investment banking, high tech, and biomedical industries.</li>
                <li>This ebook also contains interviews of students who attend top university programs who describe their experiences so far.</li>
                <li>There are also interviews of students who are in top university programs, and describe their experiences throughout university.</li>
            </ol>
        ),},
    { question: "What can I expect to learn after reading this ebook?",
        answer: (<span>
            <p>If you are a high school student, you can expect to make a more well-informed decision on which university you will attend be attending based on the industry you&rsquo;re most interested in.&nbsp;</p>
<p>As for our readers who are currently in university or have graduated from university, you can expect to learn more about why certain schools perform better in the hiring process for the industries we explored.</p>
        </span>)},
    { question: "Where is this data coming from?",
        answer: (<div>
            <h3>LinkedIn</h3>
            <p>We used LinkedIn to estimate how many people worked at a company from a certain school and working in a certain position. We use the term estimate because the data is not perfectly precise. For example, not everyone who works at a certain company may have a LinkedIn account or they may not update it frequently. However, we also interviewed people who work at these companies to help us refine our data and make it more accurate. All data was collected between January - April, 2020.</p>
            <h3>Glassdoor</h3>
            <p>We used Glassdoor to estimate the salaries for various positions, companies, and locations. We included the number of reported salaries in our data set and the Glassdoor confidence interval for each company and position.</p>
            <h3>h1bdata.info</h3>
            <p>h1bdata.info is an H1B Visa salary database that employers fill when applying to grant non-American employees an H1B visa to work in America. We used this to cross-reference our salary data from Glassdoor.&nbsp;</p>
            <h3>levels.fyi</h3>
            <p>We used levels.fyi to cross-reference salaries specifically for jobs in the tech industry.</p>
            <h3>Currency Conversion Rates</h3>
            <p>When comparing Canadian salaries to American salaries, we converted American Dollars to Canadian Dollars using an exchange rate of 1 USD = 1.3147 CAD exchange rate. This rate is based on the XE Money transfer rates on January 26, 2020, 5pm UTC.</p>
        </div>)}
];


function EbookFAQ() {

    const faqAnswerPanels = faqAnswers.map((faqAnswer) =>
        <Panel header={faqAnswer.question} key={faqAnswer.question}>
            {faqAnswer.answer}
        </Panel>
    );

    return (
        <div className="container">
            <h1>Frequently Asked Questions (FAQ)</h1>
            <Collapse defaultActiveKey={[faqAnswers[0].question]} onChange={callback}>
                {faqAnswerPanels}
            </Collapse>
        </div>
    );
}

export default EbookFAQ;
