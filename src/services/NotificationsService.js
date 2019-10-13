import Environment from "./Environment";
import request from "axios";
import moment from "moment";

class NotificationsService {

    static VAPID_static_KEY = 'BAjiETJuDgtXH6aRXgeCZgK8vurMT7AbFmPPhz1ybyfcDmfGFFydSXkYDC359HIXUmWw8w79-miI6NtmbfodiVI';

    static DEFAULT_NOTIFICATION_CONFIG = {sendDate: 0, notificationType:'email', daysBeforeDeadline: 1};
    
    static swPush = null;
    static notificationsUrl = `${Environment.apiUrlNodeMicroservice}/notifications`;

    static getPermission() {
    console.log('NotificationsService.swPush', NotificationsService.swPush);

    if (Environment.name === 'dev') {
        // https://stackoverflow.com/questions/53810194/angular-7-pwa-swpush-push-notifications-not-working
        // https://github.com/ademidun/atila-angular/commit/55884135cff7507171eba4e68f93eb8621eee604
        return Promise.reject({error: 'swPush.requestSubscription does not work in DEV'});
    }

    if (NotificationsService.swPush && NotificationsService.swPush.isEnabled) {
        return NotificationsService.swPush.requestSubscription({
            serverstaticKey: NotificationsService.VAPID_static_KEY
        })
    } else {
        return Promise.reject({error: 'swPush is not enabled'});
    }

}

    static postNotifications(messagesList) {

        const apiCompletionPromise = request({
            method: 'post',
            data: messagesList,
            url: `${NotificationsService.notificationsUrl}/save-notifications/`,
        });

        return apiCompletionPromise
            .then(res=> {
                console.log({res});
                return Promise.resolve(res);
            });
    }

    static createScholarshipNotifications(userProfile, scholarship) {

    let getPermissionPromise = NotificationsService.getPermission();

    return getPermissionPromise
        .then((sub) => {

            console.log({ sub });

            // $('#dimScreen').css('display', 'none');

            // todo notificationOptions will be based on userProfile preferences
            const notificationOptions = {
                'email': [7, 1], // each array element represents the number of days before the scholarship deadline a notification should be sent
                'push': [7, 1]
            };

            const fullMessagePayloads = NotificationsService.customizeNotificationMessage(notificationOptions, scholarship, userProfile, sub);

            console.log({fullMessagePayloads});

            if(fullMessagePayloads.length > 0) {
                return NotificationsService.postNotifications(fullMessagePayloads)
                    .then(res => res)
                    .catch(err => Promise.reject(err));
            }
            else {
               return Promise.resolve({message: 'No notifications to create'})
            }
        })
        .catch((err) => {
            console.log({ err });
            // todo notificationOptions will be based on userProfile preferences
            const notificationOptions = {
                'email': [7, 1], // each array element represents the number of days before the scholarship deadline a notification should be sent
            };

            const fullMessagePayloads = NotificationsService.customizeNotificationMessage(notificationOptions, scholarship, userProfile);

            console.log({fullMessagePayloads});
            if(fullMessagePayloads.length > 0) {
                return NotificationsService.postNotifications(fullMessagePayloads)
                    .then(res => res)
                    .catch(err2 => Promise.reject(err2));
            }
            else {
                return Promise.resolve({message: 'No notifications to create'})
            }
        });
}

    static customizeNotificationMessage(notificationOptions,
        scholarship, userProfile, sub) {
        const fullMessagePayloads = [];
    
        const today = new Date();
    
        const scholarshipDeadline = new Date(scholarship.deadline);
    
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
    
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(today.getDate() - 2);

        // the following line is redundant but I need to add it to get rid of the following warning
        // ./src/services/NotificationsService.js
        //   Line 102:  'notificationType' is defined but never used  no-unused-vars
        let notificationType = null;
        for (notificationType in notificationOptions) {
            if (!notificationOptions.hasOwnProperty(notificationType)) {
                continue;
            }
            for (let i = 0; i < notificationOptions[notificationType].length; i++) {
                // don't create notification for scholarship if deadline was more than 1 day ago
                // or sendDate is more than 48 hours ago
    
                if (scholarshipDeadline.getTime() < yesterday.getTime()) {
                    break
                }
    
                const daysBeforeDeadline = notificationOptions[notificationType][i];
                let sendDate = new Date();
                // following line fails because if deadline is July 6 and current date is June 22
                // and sendDate is 1 day before Deadline, the send date will be June 5
    
                sendDate.setTime( scholarshipDeadline.getTime() - (daysBeforeDeadline * 86400000) );
    
    
                if (sendDate.getTime() < twoDaysAgo.getTime()) {
                    continue;
                }
    
                sendDate = sendDate.getTime();
                const notificationConfig = {notificationType: notificationType, sendDate, daysBeforeDeadline};
                const notificationMessage = NotificationsService.createScholarshipNotificationMessage(userProfile, scholarship, notificationConfig);
    
                const fullMessagePayload = {...sub, ...notificationMessage};
                if (sub && sub.endpoint) {
                    fullMessagePayload['endpoint'] = sub.endpoint;
                    fullMessagePayload['_sub'] = sub;
                }
    
                fullMessagePayload['_notificationMessage'] = notificationMessage;
                fullMessagePayloads.push(fullMessagePayload);
    
            }
        }
    
        return fullMessagePayloads;
    }

    static createScholarshipNotificationMessage(userProfile, scholarship,
                                                notificationConfig= NotificationsService.DEFAULT_NOTIFICATION_CONFIG) {
    
        let createdAt = new Date(scholarship.deadline);
    
        createdAt = createdAt.getTime();
        const deadlineString = moment(scholarship.deadline).format('dddd, MMMM DD, YYYY');
    
        const urlAnalyticsSuffix = `?utm_source=${notificationConfig.notificationType}&utm_medium=${notificationConfig.notificationType}`+
            `&utm_campaign=scholarship-due-remind-${notificationConfig.daysBeforeDeadline}`;
    
        notificationConfig.daysBeforeDeadline = notificationConfig.daysBeforeDeadline === 1 ?
            '1 day ': `${notificationConfig.daysBeforeDeadline} days `;
        const messageData = {
            title: `${userProfile.first_name}, a scholarship you saved: ${scholarship.name} is due in ${notificationConfig.daysBeforeDeadline}`+
                `on ${deadlineString}`,
            body: `Scholarship due on ${deadlineString}: ${scholarship.name}.
           Submit your Application!`,
            clickAction: `https://atila.ca/scholarship/${scholarship.slug}/${urlAnalyticsSuffix}`,
            // todo: user scholarship.img_url, for now use Atila Logo to build brand awareness
            image: 'https://storage.googleapis.com/atila-7.appspot.com/static/atila-logo-right-way-circle-transparent.png',
            icon: 'https://storage.googleapis.com/atila-7.appspot.com/static/atila-logo-right-way-circle-transparent.png',
            badge: 'https://storage.googleapis.com/atila-7.appspot.com/static/atila-logo-right-way-circle-transparent.png',
            sendDate: notificationConfig.sendDate || 0,
            notificationType: notificationConfig.notificationType || 'push',
            user_id: userProfile.user, // use user_id instead of userId to match pageViews
            createdAt: createdAt,
        };
    
        if (messageData.notificationType === 'email') {
            messageData.email = userProfile.email;
    
            messageData.body = `Hey ${userProfile.first_name},
          The scholarship you saved, ${scholarship.name} is due in ${notificationConfig.daysBeforeDeadline} on
          ${deadlineString}. View Scholarship: ${messageData.clickAction}`;
    
            messageData.html = `Hey ${userProfile.first_name}, <br/> <br/>
          The scholarship you saved, <strong>${scholarship.name} is due in ${notificationConfig.daysBeforeDeadline} on
          ${deadlineString}. </strong> <br/> <br/>
          <a href="${messageData.clickAction}">View Scholarship: ${scholarship.name}</a> <br/> <br/>`;
        }
    
        messageData['actions'] = [
            {
                action: `scholarship/${scholarship.slug}/${urlAnalyticsSuffix}`,
                title: 'View Scholarship',
                icon: 'https://storage.googleapis.com/atila-7.appspot.com/static/atila-logo-right-way-circle-transparent.png'
            },
        ];
    
    
        return messageData;
    }
}

export default NotificationsService
