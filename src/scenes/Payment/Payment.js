import React from 'react';
import { Routes, Route } from "react-router-dom";
import PaymentAccept from "./PaymentAccept";
import ScholarshipPaymentForm from "./ScholarshipPayment/ScholarshipPaymentForm";

function Payment({ match }) {
    return (
        <Routes>
            <Route path="accept" element={<PaymentAccept />} />
            <Route path="send" element={<ScholarshipPaymentForm />} />
        </Routes>
    );
}

export default Payment;