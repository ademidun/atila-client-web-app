import { Alert } from "antd";
import React from "react";
import Environment from "./Environment";


export function DemoUserMessage (){

    if (!Environment.isDemoMode) {
        return null
    } else {
        const demoMessage = <div className="font-size-larger">
        <ol>
            <li>An autogenerated user has been pre-filled for you to practise in demo mode</li>
            <li>Demo mode is meant for practising and trying out Atila</li>
            <li>Information here will be deleted periodically</li>
        </ol>
    </div>
        return <Alert message={demoMessage} />
    }
    
}