import { UserProfile } from "./UserProfile.class";

export interface Mentor {
    id: string,
    user: UserProfile,
    bio: string,
    mentorship_topics: string,
    price: string, // string because it's a decimal number
};


export const mentorProfileFormConfig = [
    {
        keyName: 'bio',
        type: 'html_editor',
        placeholder: 'Tell mentees about yourself',
        // html: () => (<label htmlFor="description">
        //     Everything else you want people to know about the scholarship, put it here. <br />
        //     For example:
        //     What inspired you to start this scholarship? What types of students would you like to fund.
        //     What would you like to see from the applicants? etc.
        //     <span role="img" aria-label="pointing down emoji">
        //         👇🏿
        //     </span>
        // </label>),
    },
    {
        keyName: 'mentorship_topics',
        type: 'html_editor',
        placeholder: 'Tell mentees about yourself',
    }
];