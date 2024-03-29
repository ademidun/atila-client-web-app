import React from "react";
import {Link} from "react-router-dom";
import { BackTop, Button } from "antd";
import HelmetSeo from "../../components/HelmetSeo";
import {howItWorksSponsorItems} from "../LandingPage/HowItWorks";
import {createTableOfContents, scrollToElement} from "../../services/utils";
// import UtilsAPI from '../../services/UtilsAPI';
import Loading from '../../components/Loading';
import { NotionRenderer } from "react-notion";
import response from "./notionStartScholarshipsData.json";

export const howToStartAScholarshipInformationItems = [
    {
        title: "How does it Work?",
        body: (<div>
            <ol>
                <li>Visit the <Link to="/scholarship/add">add a scholarship</Link> page</li>
                <li>Enter details about the scholarship such as the name of the scholarship, who is eligible, the story behind why you started the scholarship, the deadline, funding amount, questions for the applicants, etc.</li>
                <li>Fund your scholarship. Optional:{' '}
                    <Link to="/blog/tomiwa/introducing-atila-scholarship-pools-anyone-can-contribute-to-scholarships">
                    Others can contribute to the scholarship as well
                    </Link>
                </li>
                <li>Pick finalists and Atila reviews finalists</li>
                <li>Pick winner, Atila reviews winner, winner writes thank you letter and receives funds</li>
            </ol>
        </div>),
        image: "https://imgur.com/HgIoMJ9.jpg",
        imageCaption: "",
    },
    {
        title: "How much does it Cost?",
        body: (<div>
            <ol>
                <p>The cost of sponsoring a scholarship on Atila is 9% of the scholarship amount. This fee is added to the scholarship amount.&nbsp;</p>
                <p>For example, you start a scholarship for $100. You pay an additional $9 (9%*$100) and $1.17 in HST (13% of the $9 fee).

                    The total cost of your scholarship would be $110.17, student receives the full $100, Atila receives $9 and, $1.17 is paid as tax.</p>
                <p>More Information can be found on the <Link to="/pricing">pricing</Link> page.</p>
            </ol>
        </div>),
        image: "https://i.imgur.com/qeovalb.png",
        imageCaption: "Atila pricing diagram",
    },
    {
        title: "What does the Atila fee cover?",
        body: (<div>
            Some of the things the Atila fee covers include:
            <ol>
                <li>A portion is reinvested in sponsoring more scholarships</li>
                <li>Payment processing fees</li>
                <li>Marketing and sales to get more sponsors to start scholarships and students to apply</li>
                <li>Website hosting and server costs</li>
            </ol>
        </div>)
    },
    // {
    //     title: "Are scholarships funded on Atila tax-deductible?",
    //     body: (<div>
    //         <p>Scholarships funded through Atila are not currently tax-deductible. We have met with lawyers and experts
    //             on registered charities about the process for issuing tax receipts.
    //             We will update this page with more information if anything changes.
    //         </p>
    //     </div>)
    // },
    {
        title: "What is the minimum amount to start a scholarship?",
        body: (<div>
            <p>A scholarship can be started for $50 and you can contribute to existing
                scholarships for $10. Atila's vision is democratizing access to education funding. This means making it easier for students to find scholarships. It also means making it easier for people to support students. <a href="https://i.imgur.com/PdsKQBU.png" target="_blank" rel="noopener noreferrer">Starting a scholarship typically requires thousands of dollars</a>. This creates a barrier to entry for people who want to start a scholarship, but don&rsquo;t have the money to start an endowment. By making it very easy and affordable for anyone to start a scholarship, more people are able to make a positive impact and help more students.</p>
        </div>),
    },
    {
        title: "Can Other people Contribute to a Scholarship?",
        body: (<div>
            <p>Anyone can contribute to an existing scholarship for as little as $10. So if you decide to start a scholarship; your family, friends, colleagues at work, kind strangers on the internet, etc. can contribute to the scholarship.</p>
        </div>),
    },
    {
        title: "How is the Winner Picked?",
        body: (<div>
            <p>
                The scholarship sponsor reviews the applications and picks the finalists and winners. <br/>

                <br/>If you want help filtering the applications, Atila will help you review the applications, present you a narrowed down list of the top applications and then you can pick the winner.

                There is no additional cost for this service.
            </p>
            <ol>
                <li aria-level="1">Students submit applications: Submitted applications can start being graded as applications are sent in.</li>
                <li aria-level="1">Deadline passes</li>
                <li aria-level="1">Scholarship Sponsor and Atila have 7 days to score the existing applications and pick a winner. Scores are used internally, to help reviewers track and rank applications, these scores are not shown to students.</li>
                <li aria-level="1">Finalists are chosen: Usually around 5-10 applications are chosen as finalists. Finalists must submit proof of enrollment, a recent transcript and complete the security verification step.</li>
                <li aria-level="1">Winner is selected and has 7 days to verify proof of enrollment and write a thank you letter to the sponsor. Once that is complete, funds are transferred to the student within 24 hours.</li>
            </ol>
        </div>),
    },
    howItWorksSponsorItems[4],

];

// https://www.notion.so/How-to-Start-a-Scholarship-on-Atila-e412e194b70b46698133927e760dd294
export const HOW_TO_START_A_SCHOLARSHIP_NOTION_PAGE_ID = "e412e194b70b46698133927e760dd294";


export const startAScholarshipFeatures = [
    {
        title: "Easily score and manage all applications",
        body: (<div>
            <ol>
                <li>Invite others to help you score applications</li>
                <li>Sort and filter applications by score</li>
            </ol>
        </div>),
        image: "https://i.imgur.com/b9J1uyA.png",
        imageCaption: "",
    },
]

class HowToStartAScholarship extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            notionPagedata: null,
        }

    }
    componentDidMount() {

        this.loadNotionPage();
    }

    loadNotionPage() {
        const { location } = this.props;

        this.setState({notionPagedata: response}, () => {

            createTableOfContents(".how-to-start-scholarship-questions");

            if (location && location.hash) {
                // Pause for 300 milliseconds before scrolling to the hash element, without this setTimeout
                // the element kept scrolling back to the top of the page.
                setTimeout(() => {
                    scrollToElement(location.hash);
                }, 500);
            }
            });
        // const { location } = this.props;
        // this.setState({loading: "Loading how to start a scholarship information"});
        // UtilsAPI
        // .loadNotionContent(HOW_TO_START_A_SCHOLARSHIP_NOTION_PAGE_ID)
        // .then(res => {
        //     this.setState({notionPagedata: res.data}, () => {

        //     createTableOfContents(".how-to-start-scholarship-questions");

        //     if (location && location.hash) {
        //         // Pause for 300 milliseconds before scrolling to the hash element, without this setTimeout
        //         // the element kept scrolling back to the top of the page.
        //         setTimeout(() => {
        //             scrollToElement(location.hash);
        //         }, 500);
        //     }
        //     });
        // })
        // .catch(err => {
        //     console.log({err})
        // })
        // .finally( () => {
        //     this.setState({loading: false});
        // })
    }

    render() {
        const { loading, notionPagedata } = this.state;

        const presentationDescription = 'Easily start a scholarship with Atila. Enter scholarship details. Fund your scholarship. Pick a winner.';
        const seoContent = {
            title: 'How to Start a Scholarship',
            description: presentationDescription,
            image: 'https://i.imgur.com/Lo9Yhmm.png',
            slug: '/start'
        };

        const ScholarshipCTA = (
            <React.Fragment>

                <Button type="primary" className="font-size-larger col-12 my-2" style={{fontSize: "25px"}}>
                    <Link to={`/demo`}>
                        Step 1: Try a Demo (Optional)
                    </Link>
                </Button>
                <Button type="primary" className="font-size-larger col-12 mt-3 my-2" style={{fontSize: "25px"}}>
                        <Link to="/register?type=sponsor">
                            Step 2: Create an Account
                        </Link>
                    </Button>

                    <Button type="primary" className="font-size-larger col-12 my-2" style={{fontSize: "25px"}}>
                        <Link to="/scholarship/add">
                            Step 3: Add a Scholarship
                        </Link>
                    </Button>
            </React.Fragment>
        )

        return (
            <div className="HowToStartAScholarship">
                <HelmetSeo content={seoContent} />
                {loading && <Loading title={loading} /> }
                <h1 className="col-sm-12 text-center">
                    How to Start a Scholarship
                </h1>
                <BackTop/>

                <div className="container mt-5">
                {ScholarshipCTA}
                    <div className="card shadow p-3 how-to-start-scholarship-questions">
                        
                        {notionPagedata && 
                        <div style={{ maxWidth: 768 }}>
                            <NotionRenderer blockMap={notionPagedata} />
                        </div>
                        }
                    </div>

                    {ScholarshipCTA}
                </div>
            </div>
        );
    }
}

export default HowToStartAScholarship;