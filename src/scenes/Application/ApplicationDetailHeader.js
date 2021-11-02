import React from "react";
import {Link} from "react-router-dom";
import {Button} from "antd";
import { formatCurrency } from "../../services/utils";


function ApplicationDetailHeader({ application, scholarship, isOwnerOfApplication }){
    if (!isOwnerOfApplication) {
        return null;
    }

    if (application.accepted_payment) {
        return (
            <h3 className={"text-success"}>
                You have already accepted your payment for this scholarship!
            </h3>
        )
    }

    if (application.is_winner && scholarship) {
        return (
            <div>
                <h3 className="text-success">
                    Congratulations! You received the award of{' '}
                    {formatCurrency(Number.parseInt(scholarship.funding_amount))}
                </h3>
                <Button onClick={()=> {}} type="primary">
                    <Link to={`/payment/accept/?application=${application.id}`}>
                        Accept Payment
                    </Link>
                </Button>
            </div>
        )
    }

    let dateSubmitted;
    if (application.is_submitted) {

        dateSubmitted = new Date(application.date_submitted);
        return (
            <>
                <h5 className="text-muted">
                    Your application has been submitted.
                    {application.date_submitted && 
                    <>
                        {' '}
                        Date Submitted: {' '}
                        {dateSubmitted.toDateString()}{' '}
                        {dateSubmitted.toLocaleTimeString()}
                        {' '}
                    </>
                    }
                    Good luck! <br/>
                </h5>
                <div>
                    <strong>
                        <ol>
                            <li>Important: Make sure you received your submission confirmation in your email.</li>
                            <li>If it's in your spam, mark it as not spam.</li>
                            <li>If you don't mark the Atila emails as not spam, you might also miss the email to accept your award payment if you win.</li>
                            <li>If you don't accept your award before the acceptance deadline, it might be given to someone else.</li>
                        </ol>
                    </strong>
                    Contact us using the chat in the bottom right if you need help.
                </div>

            </>
        )
    };

    // Your IDE might tell you that a return null statement is unnecessary at the end of a file
    // and you might be tempted to remove it. DO NOT Remove it. React's render() method expects a return value.
    // The following error is returned when it is removed.
    // Error: ApplicationDetailHeader(...): Nothing was returned from render.
    // This usually means a return statement is missing. Or, to render nothing, return null.
    return null;
}

export default ApplicationDetailHeader;
