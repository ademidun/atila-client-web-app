import React from "react";

function ScholarshipSponsorAgreementAppendix ({scholarship, awards}) {

    return (
        <div>
        <h1>
            Appendix A: <br/> Scholarship Specific Details
        </h1>

        <h6 className="text-center text-muted">
            Note: This is a sample Appendix. An agreement with the relevant values is available after Sponsor saves a scholarship.
        </h6>

        <p>
            This document specifies the terms outlined in the "Agreement".
        </p>
        <p>
            All dollar amounts are in Canadian Dollar, CAD, unless otherwise indicated.
        </p>
        <table className="table table-bordered">
            <tbody>
                <tr>
                    <td>Sponsor</td>
                    <td>Company Inc.</td>
                </tr>
                <tr>
                    <td>Scholarship Name</td>
                    <td>Sample Scholarship</td>
                </tr>
                <tr>
                    <td>Total Scholarship Amount</td>
                    <td>$20,000</td>
                </tr>
                <tr>
                    <td>Scholarship Awards</td>
                    <td>
                        <ul>
                            <li>
                                1 scholarship for $10,000
                            </li>
                            <li>
                                2 scholarships for $5,000 each
                            </li>
                        </ul></td>
                </tr>
                <tr>
                    <td>Atila Fee</td>
                    <td>$1,800</td>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td>$234</td>
                </tr>
                <tr>
                    <td>Total Sponsor Payment</td>
                    <td>$22,034</td>
                </tr>
                <tr>
                    <td>Eligibility Criteria</td>
                    <td>
                        <ul>
                            <li>
                                Ethnicity: Black or Indigenous
                            </li>
                            <li>
                                Gender: Female
                            </li>
                            <li>
                                Major: Engineering
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>Deadline</td>
                    <td>September 30, 2021 11:59PM Eastern Standard Time (EST)</td>
                </tr>
            </tbody>
        </table>

        </div>
    )
}

export default ScholarshipSponsorAgreementAppendix