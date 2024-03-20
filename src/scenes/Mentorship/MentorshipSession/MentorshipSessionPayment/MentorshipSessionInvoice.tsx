import moment from 'moment';
import React from 'react'
import { ATILA_MENTORSHIP_FEE, ATILA_SCHOLARSHIP_FEE_TAX } from '../../../../models/ConstantsPayments';
import { MentorshipSession } from '../../../../models/MentorshipSession';
import { formatCurrency } from '../../../../services/utils';
import { ATIlA_LOGO_URL } from '../../../Payment/ScholarshipPayment/Invoice';
import "./MentorshipSessionInvoice.scss";

function MentorshipSessionInvoice({session}: ({session: MentorshipSession})) {

  const todayString = moment(Date.now()).format('MMMM DD, YYYY');

  const mentorPrice = Number.parseFloat(session.duration?.price.toString() || "0");
  const mentorshipFee =  mentorPrice * ATILA_MENTORSHIP_FEE;
  const mentorshipTax =  (mentorPrice + mentorshipFee) * ATILA_SCHOLARSHIP_FEE_TAX;
  const totalmentorshipCost =  mentorPrice + mentorshipTax + mentorshipFee;

  return (
    <div>
        <div className="invoice-box">
			<table cellPadding="0" cellSpacing="0">
                <tr className="top">
                    <td colSpan={2}>
                        <table>
                            <tbody>
                            <tr>
                                <td className="title">
                                    <img src={ATIlA_LOGO_URL}
                                         style={{maxHeight:'75px'}} alt="atila logo" />
                                </td>
                                <td>
                                    {todayString}<br />
                                    Atila Tech.<br />
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </td>
                </tr>

				<tr className="information">
					<td colSpan={2}>
						<table>
							<tr>
								<td>
                                {session.mentee?.first_name}{' '} {session.mentee?.last_name}
                                {session.mentee?.email}
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr className="heading">
					<td>Item</td>

					<td>Price</td>
				</tr>

				<tr className="item">
					<td>Mentorship ({session.duration?.minutes} minutes)</td>

					<td>{formatCurrency(mentorPrice)}</td>
				</tr>

                <tr className="item">
                    <td>Atila Fee</td>
                    <td>{formatCurrency(mentorshipFee)}</td>
                </tr>

				<tr className="item last">
					<td>Tax ({(ATILA_SCHOLARSHIP_FEE_TAX * 100).toFixed(0)}%)</td>

					<td>{formatCurrency(mentorshipTax)}</td>
				</tr>
                {session.discountcode_set?.length && session.discountcode_set?.length > 0 ?
                    <>
                        <tr className="discountCode">
                            <td>Atila Mentorship Scholarship</td>

                            <td>-{formatCurrency(totalmentorshipCost)}</td>
                        </tr>
                    <tr className="total">
                        <td></td>

                        <td>Total: {formatCurrency(0)}</td>
                    </tr>
                    </>
                    :
                    <tr className="total">
                        <td></td>

                        <td>Total: {formatCurrency(totalmentorshipCost)}</td>
                    </tr>
                }
			</table>
		</div>
    </div>
  )
}

export default MentorshipSessionInvoice