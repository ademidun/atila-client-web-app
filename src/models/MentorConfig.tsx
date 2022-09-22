

export const mentorProfileFormConfig = [
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
            What topics can you give mentorship about?<br/> Tip: Write this in a seperate document like {' '}
                    <a href="https://docs.new" target="_blank" rel="noopener noreferrer">
                     Google docs</a> then copy-paste them back here.
        </label>),
    }
];
