import React from 'react';
import { displayLocalTimeZone } from "../../services/utils";
import { MAJORS_LIST, SCHOOLS_LIST } from "../../models/ConstantsForm";
import { AtilaDirectApplicationsPopover } from "../../models/Scholarship";
import { Tag } from "antd";
import { Scholarship } from '../../models/Scholarship.class';
import { UserProfile } from '../../models/UserProfile.class';

export const scholarshipFormConfigsPage1 = [
    {
        keyName: 'name',
        placeholder: 'Scholarship Name',
        type: 'text',
        html: (model: Scholarship) => (
            <p className="text-muted">{model.slug && `Slug: atila.ca/scholarship/${model.slug}`}</p>
        )
    },
    {
        keyName: 'description',
        type: 'textarea',
        placeholder: 'Scholarship Description',
        html: () => (<label htmlFor="description">
            Description (Eligibility): Who is eligible for this scholarship?
        </label>),
    },
    {
        keyName: 'is_atila_direct_application',
        placeholder: (
            <AtilaDirectApplicationsPopover children={<div>
                Allow applicants to directly apply for scholarship through Atila?{' '}<small>Hover to learn more</small>
                {' '}<Tag color="green">new</Tag>
            </div>} />
        ),
        type: 'checkbox',
        className: 'font-weight-bold',
    },
    // Temporarily hide blind applications feature to prevent confusing the application process.
    // We currently launched a bunch of new features and this might confuse new potential sponsors.
    // We can make the blind applications feature available on a case-by-case basis if a scholarship sponsor wants it.
    /*     {
            keyName: 'is_blind_applications',
            placeholder:"Hide names of applicants until a winner is selected",
            type: 'checkbox',
            className: 'font-weight-bold',
            isHidden: (scholarship: Scholarship) => (!scholarship.is_atila_direct_application),
        }, */
    {
        keyName: 'criteria_info',
        type: 'html_editor',
        placeholder: 'Additional Information',
        html: () => (<label htmlFor="description">
            Everything else you want people to know about the scholarship, put it here. <br />
            For example:
            What inspired you to start this scholarship? What types of students would you like to fund.
            What would you like to see from the applicants? etc.
            <span role="img" aria-label="pointing down emoji">
                👇🏿
            </span>
        </label>),
    },
    {
        keyName: 'learn_more_url',
        placeholder: 'Optional: A URL to a place where others can learn more about you or your organization',
        type: 'url',
        isHidden: (scholarship: Scholarship) => (!scholarship.is_atila_direct_application),
    },
    {
        keyName: 'learn_more_title',
        placeholder: 'Title for the url: e.g. Learn more about Skateboards for Hope',
        type: 'text',
        isHidden: (scholarship: Scholarship) => (!scholarship.is_atila_direct_application),
    },
    {
        keyName: 'scholarship_url',
        placeholder: 'Scholarship Url',
        type: 'url',
        isHidden: (scholarship: Scholarship) => (scholarship.is_atila_direct_application),
    },
    {
        keyName: 'form_url',
        placeholder: 'Application Form URL',
        type: 'url',
        isHidden: (scholarship: Scholarship) => (scholarship.is_atila_direct_application),
    },
    {
        keyName: 'img_url',
        placeholder: 'Scholarship Image URL',
        type: 'image',
    },
    {
        keyName: 'deadline',
        type: 'datepicker',
        html: (scholarship: Scholarship) => (<label htmlFor="deadline">
            Deadline <span role="img" aria-label="clock emoji">🕐</span>
            {scholarship.deadline && <small> We recommend picking a deadline within the next two months.
                Using local timezone ({displayLocalTimeZone()}).
            </small>}
        </label>),
    },

    {
        keyName: 'metadata.not_open_yet',
        placeholder: 'Scholarship not open yet?',
        type: 'checkbox',
    },
    {
        keyName: 'open_date',
        type: 'date',
        isHidden: (scholarship: Scholarship) => (scholarship.metadata && !scholarship.metadata.not_open_yet),
        html: () => (<label htmlFor="open_date">
            When does the scholarship open? <span role="img" aria-label="calendar emoji">🗓</span>
        </label>),
    },
    {
        keyName: 'is_not_available',
        placeholder: 'Is not available?',
        type: 'checkbox',
    },
    {
        keyName: 'reddit_url',
        placeholder: 'Reddit Help Thread URL',
        type: 'url',
        isHidden: (scholarship: Scholarship, userProfile: UserProfile) => (userProfile && !userProfile.is_atila_admin),
    },
];
export const additionalQuestions = [
    {
        keyName: 'location',
        placeholder: 'Enter city, province, country 🌏',
        html: () => (<label htmlFor="location">
            Is the scholarship limited to students in certain locations?
            <span role="img" aria-label="globe emoji">🌏</span>
        </label>),
        type: 'location',
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Eligible Schools (leave blank for any) 🏫',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST
    },
    {
        keyName: 'eligible_programs',
        placeholder: 'Eligible Programs (leave blank for any) 📚',
        type: 'autocomplete',
        suggestions: MAJORS_LIST
    },
    {
        keyName: 'female_only',
        placeholder: 'Female Only? 🙍🏿',
        type: 'checkbox',
    },
    {
        keyName: 'international_students_eligible',
        placeholder: 'International Students Eligible? 🌏',
        type: 'checkbox',
    },
    {
        keyName: 'email_contact',
        placeholder: 'Email address for sending questions and submissions',
        type: 'email',
    },
];
