import { Alert } from 'antd'
import React from 'react'
import { BarLoader } from 'react-spinners'

export interface NetworkResponse {
    type: "error" | "loading" | "success" | null,
    title: string,
}
export interface NetworkResponseDisplayProps {
    response: NetworkResponse,
}
export function NetworkResponseDisplay(props: NetworkResponseDisplayProps) {

  const { response } = props;

  if (!response.type) {
    return null
  }

  return (
    <div>
        {
            response.type === "loading" ? 
            <>
                <h5>{response.title}</h5>
                <div className="center-block">
                    <BarLoader color={'#0b9ef5'} />
                </div>
            </> : 

            <Alert message={response.title} type={response.type as "error"| "success"} />
        }
    </div>
  )
}