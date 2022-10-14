import React, { ReactElement } from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;


export interface FAQItem {
    question: string,
    answer: ReactElement,
}
export interface FAQProps {
    faqAnswers: Array<FAQItem>;
    className: string,
    onChange?: () => {},
}

function FAQ(props: FAQProps) {

    const { faqAnswers, onChange, className } = props;
    const faqAnswerPanels = faqAnswers.map((faqAnswer) =>
    <Panel header={faqAnswer.question} key={faqAnswer.question}>
        {faqAnswer.answer}
    </Panel>
);

return (
    <div className={className} id="faq">
        <h1>Frequently Asked Questions (FAQ)</h1>
        <Collapse defaultActiveKey={[faqAnswers[0].question]} onChange={onChange}>
            {faqAnswerPanels}
        </Collapse>
    </div>
);
}

export default FAQ