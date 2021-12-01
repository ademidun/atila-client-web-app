import { Button } from 'antd';
import React, { useState } from 'react'
import Loading from '../../components/Loading';
import AdminAPI from '../../services/AdminAPI';
import { getErrorMessage, unSlugify } from '../../services/utils';

function AdminActions() {
    const [actionResponse, setActionResponse] = useState("");
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);

    const sendAdminAction = (actionPath: any) => {
        setIsLoadingResponse(true);
        AdminAPI
        .callAction(actionPath)
        .then(res => {
            console.log(res)
            setActionResponse(res.data)
        })
        .catch(err => {
            console.log(err)
            setActionResponse(getErrorMessage(err))
        })
        .then( () => {
            setIsLoadingResponse(false);
        })
    }
    return (
        <div>
            <h2>Admin Actions</h2>
            {Object.values(AdminAPI.ACTIONS).map(adminAction => (
                <Button type="primary" onClick={()=> {sendAdminAction(adminAction)}} disabled={isLoadingResponse}>
                {unSlugify(adminAction)}
            </Button>
            ))}
            {isLoadingResponse && <Loading />}
            

            {actionResponse && 
            
            <pre>
                {JSON.stringify(actionResponse, null, 4)}
            </pre>
            }
        </div>
    )
}

export default AdminActions
