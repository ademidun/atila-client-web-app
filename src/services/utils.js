import $ from 'jquery';
import {toastNotify} from "../models/Utils";
import {MAX_BLOG_PAGE_VIEWS, MAX_ESSAY_PAGE_VIEWS, MAX_SCHOLARSHIP_PAGE_VIEWS} from "../models/Constants";
import moment from "moment";

export function makeXHRRequestAsPromise (method, url, data) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                    response: xhr.response,
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText,
                response: xhr.response,
            });
        };
        // url encode form data for sending as post data
        const encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');
        xhr.send(encoded);
    });
}

export function genericItemTransform (item) {

    item.type = getItemType(item);

    switch(item.type) {
        case 'scholarship':
            item = {
                title: item.name,
                description: item.description,
                id: item.id,
                slug: `/scholarship/${item.slug}/`,
                image: item.img_url,
                type: item.type,
            };
            break;
        case 'essay':
            item = {
                title: item.title,
                description: item.description,
                id: item.id,
                slug: `/essay/${item.user.username}/${item.slug}/`,
                image: `${item.user.profile_pic_url}`,
                type: item.type,
                user: item.user,
                published: item.published,
            };
            break;
        case 'blog':
            item = {
                title: item.title,
                description: item.description,
                image: item.header_image_url,
                id: item.id,
                slug: `/blog/${item.user.username}/${item.slug}/`,
                type: item.type,
                user: item.user,
                published: item.published,
            };
            break;
        case 'forum':
            item = {
                title: item.starting_comment ? item.starting_comment.title || item.title : item.title,
                description: item.starting_comment ?  item.starting_comment.text || item.text: item.text,
                id: item.id,
                slug: `/forum/${item.slug}/`,
                type: item.type,
            };
            break;
        default:
        // code block
    }

    return item;

}


export function getItemType(item) {

    let itemType = '';
    if (item.hasOwnProperty('deadline')) {
        itemType = 'scholarship'
    }
    else if (item.hasOwnProperty('starting_comment')) {
        itemType = 'forum'
    }
    else if (item.hasOwnProperty('header_image_url')) {
        itemType = 'blog'
    }
    else if (item.hasOwnProperty('essay_source_url')) {
        itemType = 'essay'
    }
    return itemType;
}

// https://github.com/ademidun/atila-angular/blob/9cb6dbbe8e2c1f0f4d7812740c1a06c6d811e331/src/app/_shared/utils.ts#L3
export function prettifyKeys(rawKey) {

    return toTitleCase(rawKey.replace(/_/g, ' ' ));

}

// https://github.com/ademidun/atila-angular/blob/9cb6dbbe8e2c1f0f4d7812740c1a06c6d811e331/src/app/_shared/utils.ts#L11
export function toTitleCase(str) {
    var i, j, lowers, uppers;
    str = str.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++) {
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function(txt) {
                return txt.toLowerCase();
            });
    }


    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++) {
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
            uppers[i].toUpperCase());
    }

    return str;
}

export function formatCurrency(input) {
    return input.toLocaleString('en-ca', {style : 'currency', currency: 'CAD'});
}

export function slugify(text, maxLength=null) {

    if (maxLength) {
        text = text.substring(0,maxLength);
    }
    return text
        .trim()
        .toLowerCase()
        .replace(/[^\w /-]+/g, '')
        .trim()
        .replace(/ +/g, '-')
        .replace(/\//g, '-')
        .replace(/-{2,}/g, '-')
        ;
}

export function unSlugify(str) {
    if(!str) {
        return str
    }
    return toTitleCase(str.replace(/-/g, " ").replace(/\+/g, " "));
}

// https://github.com/ademidun/atila-angular/blob/617cd6547ff82d85689773d86841d74f98b12152/src/app/scholarship/scholarships-list/scholarships-list.component.ts#L576
export function  transformLocation(placeResult) {

    const locationData = {};

    placeResult.address_components.forEach(element => {
        if (element.types[0] === 'locality' ||
            element.types[0] === 'administrative_area_level_3'
            || element.types[0] === 'postal_town' ||
            element.types[0] === 'sublocality_level_1') {
            locationData.city = element.long_name;
        }

        if (element.types[0] === 'administrative_area_level_1') {
            locationData.province = element.long_name;
        }

        if (element.types[0] === 'country') {
            locationData.country = element.long_name;
        }
    });

    return locationData;

}

export function transformFilterDisplay(filter_type, inputUserProfile) {
    const mockUserProfile = {
        'city': [{id: 22, province: "Ontario", name: "Halton Hills", country: "Canada"}],
        'province':  [{id: 1, name: "Ontario", country: "Canada"}],
        'country': [{name: "Canada"}],
        'major': 'Engineering',
        'post_secondary_school': 'University of Western Ontario',
        'ethnicity': 'Asian/East-Asian',
        'heritage': 'India',
        'citizenship': 'Canada',
        'religion': 'Christianity',
        'activities': 'Drawing',
        'sports': 'Soccer',
        'disability': 'Autism',
        'language': 'French',
        'eligible_schools': [
            'Ivey Business School',
            'University of Waterloo',
            'DeGroote School of Medicine'
        ],
        'eligible_programs': [
            'Health Sciences',
            'Computer Engineering',
            'Biomedical Engineering'
        ]
    }
    let userProfile = "";

    if (inputUserProfile){
        userProfile = inputUserProfile;
    } else {
        userProfile = mockUserProfile;
    }

    let filterValue = null;

    if (['city', 'province', 'country'].includes(filter_type)) {
        if (userProfile[filter_type][0] == null){
            filterValue = ""
        }
        else {
            filterValue = userProfile[filter_type][0]['name']
        }
    } else {
        filterValue = userProfile[filter_type];
    }

    return filterValue
}

// https://github.com/ademidun/atila-angular/blob/e9db29bd4a39137980c66c760f45a71f1e7b2048/src/app/_pipes/truncate.pipe.ts#L7-L6
export function truncate(value, length=75){

    // Set the limit to truncated
    let limit = length;

    // Truncate string if its greater than the limit
    if(value){
        return value.length > limit ? value.substring(0, limit) + "..." : value;
    }

    else{
        return value;
    }

}

export function handleError(error) {
    console.log('handleError', error);
    let postError = error.response && error.response.data;
    postError = JSON.stringify(postError, null, 4);
    toastNotify(`🙁${postError}`, 'error');
}

export function scrollToElement(elementSelector) {
    if(!$(elementSelector).offset()) {
        console.error(`Element with selector:${elementSelector} not found. `+
        `Make sure you included a css prefix: '#' for ID or '.' for class.`);
        return;
    }

    $('html, body').animate({scrollTop: $(elementSelector).offset().top}, 1000);
}

/**
 * The error attribute we want may be nested under a set of attributes that may or may not exist.
 * So we need to dynamically check for the existence of the deeply nested attribute.
 * "All 200 responses are alike, each 400 response is an error in it's own way."
 * @param error
 * @returns {string|{response}|*}
 */
export function getErrorMessage(error) {

    let formattedMessage = "";
    if(error.response && error.response.data ) {
        if(error.response.data.error && error.response.data.error.message) {
            formattedMessage = error.response.data.error.message
        } else if (error.response.data.error) {
            formattedMessage = error.response.data.error
        } else if(error.response.data) {
            formattedMessage = error.response.data
        }
    } else {
        formattedMessage = error.message ? error.message : error;
    }
    
    return JSON.stringify(formattedMessage);
}

export function getPageViewLimit(pageViews, pathname) {
    let pageViewResult = {
        showReminder: false,
        viewCount: null,
        viewCountType: null,
    };

    const viewTypes = ['blog', 'essay', 'scholarship'];

    const viewTypesLimit = {
        blog: MAX_BLOG_PAGE_VIEWS,
        essay: MAX_ESSAY_PAGE_VIEWS,
        scholarship: MAX_SCHOLARSHIP_PAGE_VIEWS,
    };

    let  viewType = null;
    for (viewType of viewTypes){
        if (pathname.includes(`/${viewType}/`)) {
            if (pageViews.thisMonth[viewType] >= viewTypesLimit[viewType] &&
                pageViews.thisMonth[viewType] % viewTypesLimit[viewType]  === 0){
                pageViewResult = {
                    showReminder: true,
                    viewCount: pageViews.thisMonth[viewType],
                    viewCountType: viewType,
                }
            } else {
                pageViewResult = {
                    showReminder: false,
                    viewCount: pageViews.thisMonth[viewType],
                    viewCountType: viewType,
                }
            }
            break;
        }
    }
    return pageViewResult;
}

export function guestPageViewsIncrement() {

    let guestPageViews = localStorage.getItem('guestPageViews');

    if (guestPageViews && !isNaN(guestPageViews)) {
        guestPageViews = parseInt(guestPageViews) + 1
    } else {
        guestPageViews = 1;
    }
    localStorage.setItem('guestPageViews', guestPageViews);

    return guestPageViews;
}

/**
 * get a nested field of an object using dotted path
 * e.g. obj = scholarship, path='metadata.is_not_open'
 * return scholarship[metadata][is_not_open]
 * @see https://stackoverflow.com/a/8750472/
 * @param obj
 * @param path
 * @returns {*}
 */
export function nestedFieldGet(obj, path) {
    path=path.split('.');
    let res = obj;
    for (let i=0;i<path.length;i++){
        if(!res) {
            return res
        }
        res=res[path[i]]
    }
    return res;
}

/**
 * update nested field of an object using dotted path
 * (for now this function only goes one level deep
 * e.g. obj = scholarship, path='metadata.is_not_open', value= true
 * scholarship[metadata][is_not_open] = true
 * return scholarship
 * @param obj
 * @param value
 * @param path
 * @returns {*}
 */
export function nestedFieldUpdate(obj, path, value) {
    const updatedObj = Object.assign({}, obj);
    path=path.split('.');
    updatedObj[path[0]][path[1]] = value;

    return updatedObj;
}

/**
 * @see https://gist.github.com/James1x0/8443042
 *The const "humanizedGreeting" below will equal (assuming the time is 8pm)
 * "Good evening, James."
 const user = "James";
 var humanizedGreeting = "Good " + getGreetingTime(moment()) + ", " + user + ".";
 * @returns {string}
 */
export function getGreetingTime () {
    let greeting = null; //return greeting

    const m = moment();

    const split_afternoon = 12; //24hr time to split the afternoon
    const split_evening = 17; //24hr time to split the evening
    const currentHour = parseFloat(m.format("HH"));

    if(currentHour >= split_afternoon && currentHour <= split_evening) {
        greeting = "Afternoon";
    } else if(currentHour >= split_evening) {
        greeting = "Evening";
    } else {
        greeting = "Morning";
    }

    return greeting;
}

export function getRandomString(maxLength=null) {
    // https://gist.github.com/gordonbrander/2230317
    let randomString = '';

    for (let i =0; i< 4; i++) {
        randomString += Math.random().toString(36).substr(2, 8);
    }
    if (maxLength) {
        randomString = randomString.substring(0, maxLength);
    }

    return randomString;
}

export function getGuestUserId() {

    const guestUserIdName = 'guestUserId';
    let guestUserId = localStorage.getItem(guestUserIdName);

    if(!guestUserId) {
        guestUserId = getRandomString();
        localStorage.setItem(guestUserIdName, guestUserId)
    }

    return guestUserId;

}

export function myJoin(value, separator) {
    // This function is equivalent to .join(), however also works on strings unlike .join()
    if (typeof value === 'string'){
        return value
    } else {
        return value.join(separator)
    }
}
