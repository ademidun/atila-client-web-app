import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router';
import NotionPage from '../../components/Notion/NotionPage';


interface RouteParams {pageId: string};

function Wiki(props: RouteComponentProps<RouteParams>) {

    
  const { pageId } = props.match.params
  return (
    <div className="card container shadow p-5 m-5">
        <NotionPage pageId={pageId} />
    </div>
  )
}

export default withRouter(Wiki);