import React from "react";

export function FlourishViz({visualizationId}) {

    return (
        <div className="flourish-embed flourish-chart"
             data-src={`visualisation/${visualizationId}`}
             data-url={`https://flo.uri.sh/visualisation/${visualizationId}/embed`}>
        </div>
    );
}
