import { prettifyKeys } from '../services/utils';
import { ALL_DEMOGRAPHICS } from './ConstantsForm';

export const CONTACT_TYPES = ["student_club", "non_profit_company", "for_profit_company",
"government_organization", "individual"];

export const DEFAULT_CONTACT = {
    organization_name: "",
    instagram_username: "",
    eligible_programs: [],
    heritage:[],
    sports: [],
    industries: [],
    eligible_schools: [],
    account_type: CONTACT_TYPES[0],
};

export const CONTACT_FORM_CONFIG_PAGE_1 = [
    {
        keyName: 'organization_name',
    },
    {
        keyName: 'profile_description',
        type: 'textarea',
    },
    {
        keyName: 'instagram_username',
    },
    {
        keyName: 'twitter_username',
    },
    {
        keyName: 'profile_pic_url',
    },
    {
        keyName: 'tiktok_username',
    },
    {
        keyName: 'facebook_username',
    },
    {
        keyName: 'linkedin_url',
    },
    {
        keyName: 'website_url',
    },
    {
        keyName: 'account_type',
        type: 'select',
        options: CONTACT_TYPES,
        renderOption: (option) => prettifyKeys(option)
    }
];

for (const [demographicKey, demographicOptions] of Object.entries(ALL_DEMOGRAPHICS)) {
    const inputConfig = {
        keyName: demographicKey,
        type: 'autocomplete',
        suggestions: demographicOptions,
        skipPrettifyKeys: true,
    }
    CONTACT_FORM_CONFIG_PAGE_1.push(inputConfig);
}