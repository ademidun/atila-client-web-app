import React, { useEffect } from 'react'

const calendlyWidgetScript = 'calendlyWidgetScript'
function MentorshipSessionSchedule() {

    useEffect(() => {
        const head = document.querySelector('head');
        if (!document.getElementById(calendlyWidgetScript) && head) {
            const script = document.createElement('script');
            script.setAttribute('src',  'https://assets.calendly.com/assets/external/widget.js');
            script.setAttribute('id',  calendlyWidgetScript);
            head.appendChild(script);
        }
    }, [])
    
  return (
    <div>
        
        <div id="schedule_form">
                    <div 
                        className="calendly-inline-widget"
                        data-url="https://calendly.com/tomiwa1a/meeting"
                        style={{ minWidth: '320px', height: '1250px' }} />
                    </div>
    </div>
  )
}

export default MentorshipSessionSchedule