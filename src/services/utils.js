import {toastNotify} from "../models/Utils";

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
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
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

export function slugify(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .trim()
        .replace(/ +/g, '-')
        ;
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

export function transformFilterDisplay(filter_type, userProfile) {

    let filterValue = null;

    if (!userProfile) {
        if (['city', 'province', 'country'].includes(filter_type)) {
            switch (filter_type) {
                case 'city':
                    filterValue = 'Toronto';
                    break;
                case 'province':
                    filterValue = 'Ontario';
                    break;
                case 'country':
                    filterValue = 'Canada';
                    break;
                default:
                    break;
            }
        }
        else {
            switch (filter_type) {

                // todo: pick default categories based on what is most popular
                // amongst students or has the most scholarships
                case 'major':
                    filterValue = 'Engineering';
                    break;
                case 'post_secondary_school':
                    filterValue = 'University of Western Ontario';
                    break;
                case 'ethnicity':
                    filterValue = 'Asian/East-Asian';
                    break;
                case 'heritage':
                    filterValue = 'India';
                    break;
                case 'citizenship':
                    filterValue = 'Canada';
                    break;
                case 'religion':
                    filterValue = 'Christianity';
                    break;
                case 'activities':
                    filterValue = 'Drawing';
                    break;
                case 'sports':
                    filterValue = 'Soccer';
                    break;
                case 'disability':
                    filterValue = 'Autism';
                    break;
                case 'language':
                    filterValue = 'French';
                    break;
                case 'eligible_schools':
                    filterValue = [
                        'Ivey Business School',
                        'University of Waterloo',
                        'DeGroote School of Medicine'
                    ];
                    break;
                case 'eligible_programs':
                    filterValue = [
                        'Health Sciences',
                        'Computer Engineering',
                        'Biomedical Engineering'
                    ];
                    break;
                default:
                    break;
            }
        }

    }
    else if (['city', 'province', 'country'].includes(filter_type)) {
        filterValue = userProfile[filter_type][0]['name']
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

