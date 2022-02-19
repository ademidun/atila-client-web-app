import $ from 'jquery';
import {toastNotify} from "../models/Utils";
import {MAX_BLOG_PAGE_VIEWS, MAX_ESSAY_PAGE_VIEWS, MAX_SCHOLARSHIP_PAGE_VIEWS} from "../models/Constants";
import moment from "moment";
import { message } from 'antd';
/*import { element } from 'prop-types';*/

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
    let user = item.user || item.user_json;

    switch(item.type) {
        case 'scholarship':
            item = {
                ...item,
                title: item.name,
                slug: `/scholarship/${item.slug}/`,
                image: item.img_url,
            };
            break;
        case 'essay':
            item = {
                ...item,
                title: item.title,
                slug: user ? `/essay/${user.username}/${item.slug}/` : "",
                image: user ? `${user.profile_pic_url}` : "",
            };
            break;
        case 'blog':
            item = {
                ...item,
                title: item.title,
                image: item.header_image_url,
                slug: user ? `/blog/${user.username}/${item.slug}/` : "",
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
    else if (item.hasOwnProperty('essay_source_url') || item.hasOwnProperty('is_anonymous_essay')) {
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

export function formatCurrency(input, convertToInteger=false, decimalPlaces=false, currency='CAD') {
    if (convertToInteger) {
        input = Number.parseInt(input);
    }
    if (decimalPlaces) {
        input = input.toFixed(decimalPlaces)
    }
    return input.toLocaleString('en-ca', {style : 'currency', currency});
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
export function getErrorMessage(error, stringifyError=true) {

    let formattedMessage = error?.message || error;

    if(error.response ) {
        if (error.response.status === 500) {
            formattedMessage = "Internal server error. Please contact us using the blue chat icon in the bottom right or visit atila.ca/contact."
        } else {
            formattedMessage = error?.response?.data?.error?.message || error?.response?.data?.error || error?.response?.data || error.response
        }    
    }

    if (stringifyError) {
        formattedMessage = JSON.stringify(formattedMessage);
    }
    
    return formattedMessage;
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

export function getRandomString(maxLength=6) {
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

/**
 * @see https://stackoverflow.com/a/46181/5405197
 * @returns {boolean}
 */
export function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function addStyleClasstoTables(parentSelector) {
    let element;
    const tableSelectors = `${parentSelector} table`

    $(tableSelectors).each(function() {

        element = $(this);
        element.addClass(`table table-striped table-responsive border-light`)
    });

}
/**
 *
 * @param parentSelector: Where to insert the new table of contents.
 * Leave blank if you only wnat to return the table of contents without
 * automatically prepending to the parent component.
 * @see: https://css-tricks.com/automatic-table-of-contents/
 */
export function createTableOfContents(parentSelector="") {

    let element, title, link, newLine;
    let allLines = "";

    const titleSelectors = `${parentSelector} h1, ${parentSelector} h2, ${parentSelector} h3`;

    $(titleSelectors).each(function() {

        element = $(this);
        if (!element || !element.text || !element.text()) {
            return
        }
        title = element.text();

        link = element.attr("id");
        if (!link) {
            link = slugify(title, 50);
            element.attr('id', link);
        }
        if (!link) {
            return;
        }

        link = `${window.location.pathname}${window.location.search}#${link}`;

        let indentStyle = ""
        if(element[0].localName === "h1") {
            indentStyle = `font-size: larger`
        } else {
            const indentAmount = element[0].localName === "h2" ? "3%" : "5%";
            indentStyle = `margin-left: ${indentAmount}`
        }

        newLine = `<li style="${indentStyle}"><a href="${link}">${title}</a></li>`;
        allLines += newLine

    });

    let tableOfContents =
        "<div class='mb-3 p-3 border-light'><nav role='navigation' class='table-of-contents'> " +
        "<h2>Table of Contents:</h2>" +
        "<ul>";

    // Only show the table of contents if there are headings in the document.
    if (newLine) {
        tableOfContents += allLines;
        tableOfContents += "</ul>" +
            "</nav></div><hr class='mb-5' />";

        if (parentSelector) {
            $(parentSelector).before(tableOfContents);
        }

    }

    return tableOfContents;

}

export function openAllLinksInNewTab(parentSelector=""){
    const anchorSelectors = `${parentSelector} a`

    $(anchorSelectors).each(function() {
        let element = $(this);

        const linkOnSamePage = element.prop("href").includes(window.location.href);
        if (!linkOnSamePage) { //don't open links to content on the same page in a new tab
            element.attr("target", "_blank")
            element.attr("rel", "noopener noreferrer")
        }
    });
}

export function makeImagesCards(parentSelector=""){
    let element;
    const selectors = `${parentSelector} img`;
    console.log("makeImagesCards");
    console.log({parentSelector, selectors, element});

    $(selectors).each(function() {

        element = $(this);
        element.addClass(`card shadow`)
    });

}

/**
 * https://stackoverflow.com/a/822486/5405197
 * @param {*} html 
 */
export function stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

export function joinListGrammatically(lst) {
    if (!lst) {
        return "";
    }

    if (lst.length === 0) {
        return "";
    }

    if (lst.length === 1) {
        return  lst[0];
    }

    if (lst.length === 2) {
        return lst.join(" and ");
    }

    const seperator = ", "
    const commaSeperatedList = lst.slice(0, lst.length-2);
    return commaSeperatedList.join(seperator) + seperator + lst[lst.length-2] + ', and ' + lst[lst.length -1]
}

// see https://stackoverflow.com/a/50067769/14874841
// Copies formatted html to clipboard
export function copyToClipboard(str) {
    function listener(e) {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);

    message.success("Copied!")
}

// See https://stackoverflow.com/a/34602679/14874841 for where this code snippet comes from
export function displayLocalTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}


export function transformListToValueLabelList(inputList) {
    return inputList.map(string => {
        return {
            label: string,
            value: string
        }
    })
}

// See https://stackoverflow.com/a/63627688/14874841 for
// how to securely open a new tab
export function openInNewTab(url){
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}
