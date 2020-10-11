import {ATILA_SCHOLARSHIP_FEE} from "../../models/Constants";
import {formatCurrency} from "../../services/utils";
import {Button} from "antd";
import React from "react";
import {Link} from "react-router-dom";


export function ScholarshipAddEditReview ({scholarship}){

    const totalFundingAmount = scholarship.funding_amount * scholarship.number_available_scholarships;

    const atilaFee = scholarship.funding_amount * scholarship.number_available_scholarships * ATILA_SCHOLARSHIP_FEE;

    const totalScholarshipPlusFees = totalFundingAmount + atilaFee;

    console.log(scholarship.funding_amount,{totalFundingAmount, atilaFee, totalScholarshipPlusFees} );
    return (
        <div className="container mt-5">
            <div className="card shadow p-3">
                <h1>Fund Scholarship</h1>
                <p style={{fontSize: "1.5rem", lineHeight: "45px"}}>
                    Funding per Scholarship: {formatCurrency(Number.parseFloat(scholarship.funding_amount))}
                    <br/>
                    Scholarships Awarded: {scholarship.number_available_scholarships}
                    <br/>
                    Total Scholarships Amount: {formatCurrency(totalFundingAmount)}
                    <br/>
                    Atila Fee ({ATILA_SCHOLARSHIP_FEE * 100}%): {formatCurrency(atilaFee)}
                    <br/>
                    Total Amount: {formatCurrency(totalScholarshipPlusFees)}
                </p>
                {!scholarship.is_funded &&
                <Button type="primary">
                    <Link to={`/payment/send/?scholarship=${scholarship.id}`}>
                        Fund Scholarship
                    </Link>
                </Button>
                }
                {scholarship.is_funded &&
                <p style={{fontSize: "1.5rem", lineHeight: "45px", color: 'green'}}>
                    Your scholarship has been funded!
                </p>
                }
            </div>
        </div>
    )
}