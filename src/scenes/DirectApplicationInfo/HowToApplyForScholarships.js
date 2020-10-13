import React from "react";
import HelmetSeo from "../../components/HelmetSeo";
import {Link} from "react-router-dom";

function HowToApplyForScholarships() {

    const presentationDescription = 'This is a presentation for high school students' +
        ' about your life after high school: what are your options, ' +
        'how to learn what path is best for you and how can they achieve your goals.';
    const seoContent = {
        title: 'How to Apply for Scholarships',
        description: presentationDescription,
        image: 'https://i.ytimg.com/vi/bpyEWzblFrU/maxresdefault.jpg',
        slug: '/high-school'
    };

    return (
        <React.Fragment>
            <HelmetSeo content={seoContent} />
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>How to Apply for Scholarships</h1>
                    <h5 className="text-center">
                        <Link to="/start">
                            Interested in how to start a scholarship?
                        </Link>
                    </h5>

                    <ol>
                        <li>Create your profile to find scholarships you qualify for.<br /><br /></li>
                        <li>Find a scholarship you want and click Apply now. Save time by pre-filling similar responses you&rsquo;ve entered in the past.<br /><br /></li>
                        <li>If selected, write a thank you email to the sponsor<br /><br /></li>
                        <li>Connect your bank Account<br /><br /></li>
                        <li>Accept payment and have funds deposited in bank account within 24 hours</li>
                    </ol>
                    <h2>Questions</h2>
                    <p><strong>What Happens After I win?</strong></p>
                    <p>After you win the award the following things happen:</p>
                    <ol>
                        <li>You will receive an email notifying you that you won the award. Make sure that Atila emails are not going to your junk inbox or spam. You may have to mark Atila emails as not spam (tk add link to how to do so in Gmail and hotmail).&nbsp;</li>
                    </ol>
                    <ol>
                        <li>You write a thank you email to the scholarship sponsor<br /><br /></li>
                        <li>You will be listed as the scholarship winner on the scholarship page and Atila will contact you asking if we can share your winning application and your name and photo. You will have the opportunity to edit your application slightly before sharing.<br /><br /></li>
                        <li>If the scholarship awarded to you is valued at $5,000 or more, we will mail you a</li>
                    </ol>
                    <p><br /><br /></p>
                    <p><strong>How do I receive my funding?</strong></p>
                    <p>After you&rsquo;ve completed the tasks above, you can click on the link in the email which you were provided and it will take you to the payment acceptance page. You will then connect your bank account using <a href="https://stripe.com/">Stripe</a>, after connecting your bank account and accepting the payment, you should receive the funding typically within the next 24 hours.</p>
                    <p><br /><br /></p>
                    <p><strong>Does Atila Save my Banking Information? Is it Secure?</strong></p>
                    <p>Atila does not save your banking information. All of the payment processing is handled using <a href="https://stripe.com/en-ca">Stripe</a>, a payment processing company that is used to handle payments for companies such as Shopify, Lyft, Doordash, Shopify and more.</p>
                    <p><br /><br /></p>
                    <p><strong>Can Students outside of Canada use Atila?</strong></p>
                    <p>Students outside of Canada may use Atila to find scholarships, but they are not currently able to use the Atila Direct applications feature. This means they cannot apply for scholarships through Atila and receive the funding through the Atila Platform. We want to open up this feature to as many students as possible so if you&rsquo;re outside of Canada and want to use Atila, contact us and let us know what country you&rsquo;re in so we know what countries we should prioritize in launching next.</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HowToApplyForScholarships;