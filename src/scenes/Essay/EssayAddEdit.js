import React from 'react';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";
import EssaysApi from "../../services/EssaysAPI";

function EssayAddEdit(){

    return (
        <div className="text-center container">
            <ContentAddEdit contentType="Essay" ContentAPI={EssaysApi} />
        </div>
    );
}

export default EssayAddEdit;
