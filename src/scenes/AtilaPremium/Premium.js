import React from "react";
import SubscribeMailingList from "../../components/SubscribeMailingList";

function Premium() {

    const subscribeText = (<h3>
        Get Notified When Atila Premium Launches
    </h3>)
    return (
        <div className="container mt-5">
            <div className="card p-3 pb-5">
                <div className="text-center">
                    <h1>
                        Atila Premium Coming Soon
                        <span role="img" aria-label="eyes and clock emoji">👀 🕛</span>
                    </h1>

                    <SubscribeMailingList subscribeText={subscribeText}
                                          btnText="Get Notified" />
                </div>
            </div>
        </div>
    );
}

export default Premium;