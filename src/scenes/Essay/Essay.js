import React from 'react';
import EssaysList from "./EssaysList";
import { Routes, Route } from "react-router-dom";
import EssayDetail from "./EssayDetail";
import EssayAddEdit from "./EssayAddEdit";

function Essay({ match }) {
    return (
        <Routes>
            <Route path="add" element={<EssayAddEdit />} />
            <Route path="edit/:username/:slug" element={<EssayAddEdit />} />
            <Route path=":username/:slug" element={<EssayDetail />} />
            <Route path="/" element={<EssaysList />} />
        </Routes>
    );
}

export default Essay;