import NotificationsService from "./NotificationsService";
import {UserProfileTest1} from "../models/UserProfile";
import {ScholarshipGeneral} from "../models/Scholarship";
import moment from "moment";

const userProfile = UserProfileTest1;
const scholarship = ScholarshipGeneral;
fdescribe('NotificationsService', () => {


    it('should be created', () => {
        expect(NotificationsService).toBeTruthy();
    });

    it('should create a notification with the scholarship name and deadline',
        () => {

            const deadline = moment(scholarship.deadline).format('dddd, MMMM DD, YYYY');
            const createdNotification = NotificationsService.createScholarshipNotificationMessage(userProfile, scholarship);

            expect(createdNotification.title).toContain(scholarship.name);
            expect(createdNotification.body).toContain(deadline);
        });

    it('#customizeNotificationMessage() should create an email notification with the userProfile and scholarship details',
        () => {
            NotificationsService.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
            const notificationOptions = {
                'email': [1, 7], // each array element represents the number of days before the scholarship deadline a notification should be sent
            };

            const createdNotifications = NotificationsService.customizeNotificationMessage(notificationOptions,scholarship, userProfile);

            expect(createdNotifications.length).toBe(notificationOptions.email.length);

            const createdNotification = createdNotifications[0];

            expect(createdNotification.title).toContain(userProfile.first_name);
            expect(createdNotification.body).toContain(userProfile.first_name);
            expect(createdNotification.html).toContain(userProfile.first_name);

            const deadline = moment(scholarship.deadline).format('dddd, MMMM DD, YYYY');

            expect(createdNotification.title).toContain(scholarship.name);
            expect(createdNotification.html).toContain(deadline);

        });

    it('#customizeNotificationMessage() should contain correct correct due in N days',
        () => {
            NotificationsService.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
            const notificationOptions = {
                'email': [1, 7], // each array element represents the number of days before the scholarship deadline a notification should be sent
            };

            const createdNotifications = NotificationsService.customizeNotificationMessage(notificationOptions,scholarship, userProfile);

            expect(createdNotifications.length).toBe(notificationOptions.email.length);

            expect(createdNotifications[0].title).not.toContain(`${notificationOptions.email[1]} day`);
            expect(createdNotifications[0].title).toContain(`${notificationOptions.email[0]} day`);
            expect(createdNotifications[1].title).toContain(`${notificationOptions.email[1]} day`);

        });

    it('#customizeNotificationMessage() should not create notifications if deadline is in past',
        () => {
            NotificationsService.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
            const notificationOptions = {
                'email': [1, 7], // each array element represents the number of days before the scholarship deadline a notification should be sent
            };

            const scholarshipDeadline = new Date();
            scholarshipDeadline.setDate(scholarshipDeadline.getDate() - 3);
            scholarship.deadline = scholarshipDeadline.toISOString();

            const createdNotifications = NotificationsService.customizeNotificationMessage(notificationOptions,scholarship, userProfile);

            expect(createdNotifications.length).toBe(0);

            expect(createdNotifications).toEqual([]);

        });

    it('#customizeNotificationMessage() should not create notifications if 7 days ago is more than 48 hours in past',
        () => {
            NotificationsService.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
            const notificationOptions = {
                'email': [1, 7], // each array element represents the number of days before the scholarship deadline a notification should be sent
            };

            const scholarshipDeadline = new Date();
            scholarshipDeadline.setDate(scholarshipDeadline.getDate());
            scholarship.deadline = scholarshipDeadline.toISOString();

            const createdNotifications = NotificationsService.customizeNotificationMessage
            (notificationOptions,scholarship, userProfile);

            expect(createdNotifications.length).toBe(notificationOptions.email.length-1);

        });

    it('#customizeNotificationMessage() should create notifications if deadline is a month away',
        () => {
            NotificationsService.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';

            NotificationsService.DEFAULT_NOTIFICATION_CONFIG.notificationType = 'email';
            const notificationOptions = {
                'push': [1, 3, 21],
                'email': [1, 7, 14],
            };

            const scholarshipDeadline = new Date();
            scholarshipDeadline.setDate(scholarshipDeadline.getDate() + 33);
            scholarship.deadline = scholarshipDeadline.toISOString();

            const createdNotifications = NotificationsService.customizeNotificationMessage
            (notificationOptions,scholarship, userProfile);

            expect(createdNotifications.length).toBe(notificationOptions.email.length +
                notificationOptions.push.length);
        });
});