import React from 'react'
import NotionPage from '../../components/Notion/NotionPage'

function MentorshipAbout() {
  return (
    <div className='container m-3 p-3 card shadow'>
        <h1>
            About Atila Mentorship
        </h1>
        <NotionPage pageId="7c05b931d4f348808f0d75aea93bbef5" showTableOfContents={true} className="p-2" />
    </div>
  )
}

export default MentorshipAbout
