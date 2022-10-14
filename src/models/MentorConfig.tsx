export const mentorProfileFormConfig = [
    {
        keyName: 'description',
        type: 'textarea',
        placeholder: 'Tell mentees about yourself',
        html: () => (<label htmlFor="bio">
            A short description of yourself that is relevant to mentees.
        </label>),
    },
    {
        keyName: 'linkedin_url',
    },
    {
        keyName: 'bio',
        type: 'html_editor',
        placeholder: 'Tell mentees about yourself',
        html: () => (<label htmlFor="bio">
            You bio: tell mentees about yourself.<br/> Tip: Write this in a seperate document like {' '}
                    <a href="https://docs.new" target="_blank" rel="noopener noreferrer">
                     Google docs</a> then copy-paste them back here.
        </label>),
    },
    {
        keyName: 'mentorship_topics',
        type: 'html_editor',
        html: () => (<label htmlFor="mentorship_topics">
            What topics can you give mentorship about? What information should mentees include in their mentorship session introduction notes.<br/> Tip: Write this in a seperate document like {' '}
                    <a href="https://docs.new" target="_blank" rel="noopener noreferrer">
                     Google docs</a> then copy-paste them back here.
        </label>),
    },
    {
        keyName: 'bio_recording_url',
        type: 'audio',
        label: 'Record a voice note about yourself:',
        filePath: 'mentor-profile-audio'
    }
];
