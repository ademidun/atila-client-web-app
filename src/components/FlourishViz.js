import React from "react";

export function FlourishViz({visualizationId, title}) {

    return (
        <React.Fragment>
            <iframe src={`https://flo.uri.sh/visualisation/${visualizationId}/embed`}
                    frameBorder='0'
                    scrolling='no'
                    style={{ width:'100%', height:'600px'}}
                    title={title}/>
            <div style={{ width:'100%!', marginTop:'4px!important', textAlign: 'right!important' }}>
                <img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg'
                     style={ {width: '105px!important', height: '16px!important',
                         border: 'none!important', margin: '0!important'}}
                />
            </div>
        </React.Fragment>
    );
}
