import React from 'react'
import FAQ, { FAQItem } from '../FAQ';

function MentorshipFAQ() {

    const faqAnswers: FAQItem[] = [
        { question: "What can I get mentorship about?",
            answer: (
                <div>
                    These are just some examples of things that mentors can provide advice about.
                    <ol>
                        <li><strong>University:</strong>Admissions advice for getting into your desired program, recommended courses, scholarships advice.</li>
                        <li><strong>Career:</strong>Recruiting advice, interview prep tips, resume review</li>
                        <li><strong>Immigration:</strong>Schools, making new friends, rent, opening a bank account, permanent residence advice etc.</li>
                        <li><strong>Other:</strong>General life advice such as how to make friends, starting a business as a student, etc.</li>
                    </ol>
                </div>
            ),
        },
        {
            question: "How much does it cost?",
            answer: <>$50. Which includes a 1 hour mentorship session and personalized mentorship notes.</>,
        },
        {
            question: "What are the personalized mentorship notes?",
            answer: <>The mentor reviews your profile and before the session prepares a document with advice and tips. During the session you can review the notes.</>,
        }
    ];
  return (
    <FAQ faqAnswers={faqAnswers} className="m-lg-3 p-lg-3 m-1 p-1" />
  )
}

export default MentorshipFAQ