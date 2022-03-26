import {configure} from "enzyme";
import React from "react";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {getGuestUserId, getPageViewLimit} from "./utils";
import {MAX_BLOG_PAGE_VIEWS, MAX_ESSAY_PAGE_VIEWS, MAX_SCHOLARSHIP_PAGE_VIEWS} from "../models/Constants";

configure({ adapter: new Adapter() });

const pageViewsRemindScholarshipBlog = {
    count: 123,
    scholarship: 42,
    essay: 30,
    blog: 51,
    is_owner: 66,
    thisMonth: {
        scholarship: MAX_SCHOLARSHIP_PAGE_VIEWS,
        essay: 11,
        blog: MAX_BLOG_PAGE_VIEWS
    }
};
const pageViewsRemindEssay = {
    count: 123,
    scholarship: 42,
    essay: 30,
    blog: 51,
    is_owner: 66,
    thisMonth: {
        scholarship: 0,
        essay: MAX_ESSAY_PAGE_VIEWS*2,
        blog: 13
    }
};

const essaySlug = '/essay/tomiwa/why-i-write';
const scholarshipSlug = '/scholarship/interstellar-scholarship-fund';


describe('services/utils.js', () => {
    describe('getPageViewLimit', () => {
        it('returns essay page view NOT over limit', () => {

            const { viewCount, viewCountType, showReminder } = getPageViewLimit(pageViewsRemindScholarshipBlog,essaySlug);

            expect(showReminder).toBeFalsy();
            expect(viewCountType).toEqual('essay');
            expect(viewCount).toEqual(11);
        });
        it('returns essay page view NOT over limit', () => {

            const { viewCount, viewCountType, showReminder } = getPageViewLimit(pageViewsRemindEssay,essaySlug);

            expect(showReminder).toBeTruthy();
            expect(viewCountType).toEqual('essay');
            expect(viewCount).toEqual(MAX_ESSAY_PAGE_VIEWS*2);
        });
        it('returns scholarship over limit', () => {
            const { viewCount, viewCountType, showReminder } = getPageViewLimit(pageViewsRemindScholarshipBlog,scholarshipSlug);

            expect(showReminder).toBeTruthy();
            expect(viewCountType).toEqual('scholarship');
            expect(viewCount).toEqual(MAX_SCHOLARSHIP_PAGE_VIEWS);
        });
    });

    describe('getGuestUserId', () => {

        it('returns same guestUserId if called twice', () => {
            const guestUserId = getGuestUserId();

            const guestUserId2 = getGuestUserId();
            expect(guestUserId).toBeTruthy();
            expect(guestUserId2).toEqual(guestUserId);
        });
    })
});