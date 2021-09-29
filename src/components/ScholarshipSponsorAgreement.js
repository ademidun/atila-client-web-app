import React from "react";
import { ScholarshipAgreementExample } from "../models/Scholarship";
import HelmetSeo, { defaultSeoContent } from "./HelmetSeo";
import ScholarshipSponsorAgreementAppendix from "./ScholarshipSponsorAgreementAppendix";


function ScholarshipSponsorAgreement ({scholarship = ScholarshipAgreementExample, awards = []}) {

    
    const seoContent = {
        ...defaultSeoContent,
        title: 'Atila Scholarship Sponsor Agreement',
        description: 'The contract which every Atila Direct Applications scholarship Sponsor on Atila must agree to.',
    };

    return (
        <div className="container">
        <HelmetSeo content={seoContent} />
            <div className="card container mt-3 p-5 shadow">
            <h1>
                Scholarship Sponsor Agreement
            </h1>
            <p>
                This agreement (&ldquo;Agreement&rdquo;) is entered between Atila Inc. (&ldquo;Atila&rdquo;) and an Individual or Organization (&ldquo;Sponsor&rdquo;) that creates a scholarship on Atila.
            </p>
            <p>
                By sponsoring a scholarship on Atila, Sponsor agrees to the terms outlined in this agreement.
            </p>
            <p>
                Please refer to the defined terms in the table in Appendix A: Scholarship Specific Details  (&ldquo;Appendix A&rdquo;) as you review the Agreement.
            </p>
            <p>
                All dollar amounts are in Canadian Dollar, (&ldquo;CAD&rdquo;) unless otherwise indicated.
            </p>
            <h2>
                Purpose
            </h2>
            <p>
                The purpose of this Agreement is to outline the terms of a scholarship created by Sponsor on the Atila platform.
            </p>
            <p>
                Sponsor will fund &ldquo;Scholarship Awards&rdquo; using the Atila Platform and select students to receive the Scholarship Awards.
            </p>
            <p>
                Atila will promote the scholarships and provide a platform that allows Sponsor to review applications, select winners and Atila that Scholarship Awards are given to selected winners.
            </p>
            <h2>
                Scholarship Requirements and Selection
            </h2>
            <ol>
                <li>
                    Scholarships distributed from this Agreement may only be awarded to students that have been selected by either Sponsor or Atila.
                    <br/>
                    <br/>
                </li>
                <li>
                    Students must provide proof of enrollment or proof of admission to an accredited secondary or post-secondary academic institution.
                <ol>
                    <li>
                        Valid proof of enrollment includes but is not limited to a school transcript, acceptance letter, proof of enrollment letter, an official letter from the university.
                    </li>
                    <li>
                        Enrollment proof must contain the student&rsquo;s name, the name of the educational institution and the date.
                    </li>
                    <li>
                        For the list of accredited post-secondary schools in Canada, the Government of Canada&rsquo;s List of Designation Educational Institutions[1] is used
                    </li>
                    <li>
                        For secondary schools and schools in other countries, the school must appear on the appropriate government website list of accredited educational institutions for that location.
                    </li>
                    <br/>
                </ol>
                </li>
                <li>
                    &ldquo;Additional Eligibility Criteria&rdquo; pertaining to the applicant&rsquo;s race, national or ethnic origin, colour, religion, sex, sexual orientation, gender identity or expression will be determined .by the applicant&rsquo;s self-identification.
                    <br/>
                    <br/>
                </li>
                <li>
                    Sponsor may designate a group of individuals to form the scholarship review panel that may assist in the review, scoring and selection of the scholarship winner.
                    <br/>
                    <br/>
                </li>
                <li>
                    The selection of recipients must be made on an objective, nondiscriminatory basis.
                    <br/>
                    <br/>
                </li>
                <li>
                    The timeframe and process for applications are as follows:
                <ol>
                    <li>
                        Sponsor must select a minimum of 3 finalists for each award in Scholarship Awards.
                    </li>
                    <li>
                        Sponsor must select a maximum number of finalists that is the lesser of 10 finalists for each award or 20% of all submitted applications.
                    </li>
                    <li>
                        Finalists must be selected at most 14 days after the &ldquo;Deadline&rdquo;.
                    </li>
                    <li>
                        If Sponsor requires more time they may request 1 additional 14-day extension to review the applications.&nbsp;
                    </li>
                    <li>
                        If Sponsor does not request a deadline, Atila may choose to automatically give Sponsor a 14-day extension.
                    </li>
                    <li>
                        Winners must be selected at most 14 days after the finalists have been selected.
                    </li>
                    <li>
                        If Sponsor does not request an extension and has not picked a finalist and winner after 28 days, Atila will select a list of finalists for Sponsor and Sponsor has 14 days from the date that Atila notifies Sponsor that finalists have been selected on their behalf to select winners for each of the Scholarship Awards.
                    </li>
                    <li>
                        If Sponsor does not select winners within the aforementioned timeframe, Atila will select winners on Sponsor&rsquo;s behalf.
                    </li>
                    <li>
                    If Sponsor selects a scholarship winner, Atila will verify and confirm the identity of the winner before the scholarship can be given to the winner. In the case of an invalid scholarship winner, Sponsor must pick alternate winners until a valid winner is selected. If Sponsor does not pick a valid winner within the 14-day period, Atila will pick a winner on the Sponsor’s behalf.
                    </li>
                </ol>
                <br/>
                </li>
                <li>
                    For any individual award in Scholarship Awards valued at CAD 5,000 or more, Sponsor has the option to mail a ceremonial cheque to the winner. Atila will be responsible for sending the ceremonial cheque to the winners as decided by Sponsor at no additional cost to Sponsor.
                    <br/>
                </li>
            </ol>
            <p>
                [1] ​​Government of Canada. (2019). List of Educational Institutions.
                <a href="https://tools.canlearn.ca/cslgs-scpse/cln-cln/reea-mdl/reea-mdl-1-eng.do?nom-name=ON">
                    https://tools.canlearn.ca/cslgs-scpse/cln-cln/reea-mdl/reea-mdl-1-eng.do?nom-name=ON
                </a>
                Accessed September 28, 2021.
            </p>
            <h2>
                Funding
            </h2>
            <ol>
                <li>
                    Sponsor will pay &ldquo;Total Sponsor Payment&rdquo; to Atila. Atila will distribute &ldquo;Total Scholarship Amount&rdquo; to the winning students.
                    <br/>
                    <br/>
                </li>
                <li>
                    Sponsor will pay Total Sponsor Payment in full before students may begin applying for the Scholarship.
                </li>
            </ol>
            <h2>
                Indemnity
            </h2>
            <p>
                In consideration of Sponsor creating a Scholarship and for other good and valuable consideration, Sponsor hereby agrees to indemnify and hold harmless Atila against any liability, cost, or expense which Atila may incur by reason of its acting upon instructions or recommendations given to Atila by any of the persons affiliated with Sponsor or by persons authorized to make recommendations with regard to the Scholarship.
            </p>
            <h2>
                Non-Endorsement/No Agency
            </h2>
            <p>
                Sponsor agrees that all written material and items in connection with this Agreement do not imply that Sponsor is endorsed by Atila or any of its agents or employees and will not communicate that Atila is endorsing Sponsor or its products or services in any way. Sponsor further agrees that it has no right to act on behalf of Atila in any way as a result of entering into this agreement.
            </p>
            <h2>
                Compliance&nbsp;
            </h2>
            <p>
                This Agreement is intended as a binding and enforceable agreement between Sponsor and Atila.&nbsp;
            </p>




                <hr/>
                <ScholarshipSponsorAgreementAppendix scholarship={scholarship} awards={awards} />
            </div>
        </div>
    )
}

export default ScholarshipSponsorAgreement