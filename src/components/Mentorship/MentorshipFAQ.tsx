import React from 'react'
import { Link } from 'react-router-dom';
import { mentorshipPackageExample } from '../../scenes/LandingPage/HowItWorks';
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
            answer: <>
            There are two ways to pay for Atila"
            <ol>
                <li><strong>Atila for Schools:</strong> $50/mentorship session and $100/month/school.<br/> 
                    Schools create a school account which allows students at a given school to receive 
                    mentorship for free, paid for by the school. 
                    This also allows the school to manage all the mentorship sessions booked through the school<br/>
                    <Link to ="demo">Book a Demo to learn more about <strong>Atila for Schools</strong></Link>
                </li>
                <li><strong>Individual Account:</strong>$50/mentorship session.<br/> 
                Students or parents independtly book and pay for mentorship sessions on Atila.
                </li>
            </ol>

            </>,
        },
        {
            question: "What are the personalized mentorship notes?",
            answer: <>The mentor reviews your profile and before the session prepares a document with advice and tips. 
            
            During the session you can review the notes. <a href={mentorshipPackageExample} target="_blank" rel="noreferrer">Sample mentorship package notes</a></>,
        }
    ];
  return (
    <FAQ faqAnswers={faqAnswers} className="m-lg-3 p-lg-3 m-1 p-1" />
  )
}

export default MentorshipFAQ