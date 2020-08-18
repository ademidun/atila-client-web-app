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
                <li>Employment statistics of university students in the consulting, investment banking, high tech, and biomedical industries.</li>
                <li>Advice and tips on what it takes to get acceptance into a top school</li>
                <li>Interviews of current and past students in top university programs, and describe their experiences before, during and after university.</li>
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
        </div>)},
    { question: "Who are the people in the student profiles section?",
        answer: (<span>
            <p>The student profile section is dedicated to interviews we conducted with students from top Canadian universities about their experiences. These students are either currently studying or alumni of their respective institutions.</p>
        </span>)},
    { question: "Won’t this information eventually become outdated?",
        answer: (<span>
            <p>We plan to continue to update with new versions of the ebook for the rest of the year.
                Once you purchase the ebook, you will have access to all past and future versions of the Atila Schools and Jobs Guide ebook.
                Our data also looks at a wide range of schools across the country and many different companies in a variety of industries, thus we believe this information
            will remain relevant for at least the next five years.</p>
        </span>)},
    { question: "Why does the ebook cost $33?",
        answer: (<span>
            <p>The ebook is priced at $33 because individuals who purchase a copy will have access to updated editions for the rest of the year and exclusive access to special Atila content.
            The level of detailed information we were able to collect is not available anywhere else.</p>
        </span>)},
    { question: "What makes this different from other guides out there?",
        answer: (<span>
            <p>This ebook focuses on the consulting, investment banking, high tech, and biomedical industries with in-depth analysis and explanations as to why some schools have more graduates in some top companies. There are also interviews from students who attend some of Canada’s top undergraduate programs that may provide insight on each school and program.
                Not to mention that individuals who purchase an ebook will have access to new editions for the next 6 months and have exclusive access to Atila content.</p>
        </span>)},
    { question: "Can I get a free preview of this ebook?",
        answer: (<span>
            <p>Yes! Scroll through this page for a free preview of the ebook and you can scroll down to get a free preview PDF of the actual ebook sent to your email.</p>
            <p>If you have any additional questions or comments, send us an email at <a href="mailto:info@atila.ca"  target="_blank" rel="noopener noreferrer">info@atila.ca</a>{' '}
                or dm us on <a href="https://twitter.com/atilatech" target="_blank" rel="noopener noreferrer">Twitter</a> or{' '}
                <a href="https://instagram.com/atilatech" target="_blank" rel="noopener noreferrer">Instagram</a>{' '}
                <a target="_blank" rel="noopener noreferrer" href="https://instagram.com/atilatech">(@atilatech)</a>.
            </p>
        </span>)},
];


function EbookFAQ() {

    const faqAnswerPanels = faqAnswers.map((faqAnswer) =>
        <Panel header={faqAnswer.question} key={faqAnswer.question}>
            {faqAnswer.answer}
        </Panel>
    );

    return (
        <div className="container EbookFAQ" id="faq">
            <h1>Frequently Asked Questions (FAQ)</h1>
            <Collapse defaultActiveKey={[faqAnswers[0].question]} onChange={callback}>
                {faqAnswerPanels}
            </Collapse>
        </div>
    );
}

export default EbookFAQ;
