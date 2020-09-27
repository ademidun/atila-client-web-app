import {ATILA_SCHOLARSHIP_FEE} from "../../models/Constants";
import {formatCurrency} from "../../services/utils";
import {Button} from "antd";
import React from "react";


export function ScholarshipAddEditReview ({scholarship}){

    const totalFundingAmount = scholarship.funding_amount * scholarship.number_available_scholarships;

    const atilaFee = scholarship.funding_amount * scholarship.number_available_scholarships * ATILA_SCHOLARSHIP_FEE;

    const totalScholarshipPlusFees = totalFundingAmount + atilaFee;

    console.log(scholarship.funding_amount,{totalFundingAmount, atilaFee, totalScholarshipPlusFees} );
    return (
        <div className="container mt-5">
            <div className="card shadow p-3">
                <h1>Review Your Scholarship</h1>
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
                <Button type="primary">
                    Fund Scholarship
                </Button>

            </div>
        </div>
    )
}