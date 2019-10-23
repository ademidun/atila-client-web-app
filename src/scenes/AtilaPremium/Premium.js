import React from "react";
import {withRouter} from "react-router-dom";
import SubscribeMailingList from "../../components/SubscribeMailingList";

function Premium(props) {
    console.log({props});
    return (
        <div className="container mt-5">
            <div className="card p-3 pb-5">
                <div className="text-center">
                    <h1>
                        Atila Premium Coming Soon
                        <span role="img" aria-label="eyes and clock emoji">👀 🕛</span>
                    </h1>
                    <h3>
                        Get Notified When Atila Premium Launches
                    </h3>
                    <SubscribeMailingList />
                </div>
            </div>
        </div>
    );
}

export default withRouter(Premium);