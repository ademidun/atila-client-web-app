

export const mentorProfileFormConfig = [
    {
        keyName: 'bio',
        type: 'html_editor',
        placeholder: 'Tell mentees about yourself',
        html: () => (<label htmlFor="bio">
            You bio: tell mentees about yourself
        </label>),
    },
    {
        keyName: 'mentorship_topics',
        type: 'html_editor',
        html: () => (<label htmlFor="mentorship_topics">
            What topics can you give mentorship about?
        </label>),
    },
    {
        keyName: 'bio_recording_url',
        type: 'audio',
        label: 'Short audio clip:',
        filePath: 'mentor-profile-audio'
    }
];
