# Changelog

## October 22, 2019
### Temporary Hack for Page Views Counter

- The page view atila points reminder modal is supposed to show on every 5th page view
e.g. page view 55,70.
- For some reason it is triggering on page views # 56 or 71 instead
- Might be something with how the props are being updated
- Anyway, trying to start working on the pricing page so I just did a temp hack
where we show the modal on (pageView+1), will need to revisit this later

## October 13, 2019
### Netlify Circleci Deployment Continued
- Was still having issues trying to get atila.ca and staging.atila.ca set upin netlifyCI
- this forum was "slightly?" helpful:
 https://community.netlify.com/t/common-issue-how-can-i-disable-automatic-git-deploys/166/2
- Ultimately the best thing to do right now seems to be just create two seperate sites and 
use the CIRCLE_BRANCH and `netlify deploy --site $NETLIFY_SITE_ID_PROD`

- Let's see if this works:
- I also referred back to this blog, really helpful: 
https://medium.com/@thundermiracle/deploy-static-sites-to-netlify-by-circle-ci-ab51a0b59b73

- When you change domain names
    - Update CORS_ORIGIN_WHITELIST in `atila-django`
    - Update your Environment.js and Environment.test.js code
    
    
### Facebook Open Graph Meta Tags Gotchas
- The helmet tag dynamically adds new og:title and other open graph objects
- But there are already some objects in index.html
- And [this answer]
 from [open graph docs](https://ogp.me/#array) says that the first one takes precedence
 - Which is why I think I used jquery code in `atila-anuglar` to replace the original open graph
 meta attributes with the dynamicfacebook  meta tags in HelmetSeo 

## October 11, 2019
### event.stopPropagation()

`event.stopPropagation()`
- Ran into a wierd bug some time ago where we have to `event.stopPropagation()` instead of 
`event.preventDefault()` when handling the state update of checboxes,
see this for more information: https://github.com/facebook/react/issues/3446#issuecomment-82751540
- and `ScholarshipAddEdit`

## October 10, 2019
### Adding SEO to Atila
- Seems like the best option to add SEO to the website is using Netlify
- Found this promising tutorial on the internet: 
https://www.netlify.com/blog/2017/09/26/how-to-build-a-serverless-seo-friendly-react-blog/
- Then did deployment with circleci using:
 https://medium.com/@thundermiracle/deploy-static-sites-to-netlify-by-circle-ci-ab51a0b59b73

- Will likely have to change our circleci deployment and hosting options as well

- Found it through googling and Ending up on [this issue](https://github.com/nfl/react-helmet/issues/181)
- Where someone pointed me to [this comment](https://github.com/nfl/react-helmet/issues/26#issuecomment-339128792)
- Then I went down the rabbit Hole on the commenter [Jimmy Chion's really cool work](http://jimmychion.com)
- I want to work with him! and hire him for Atila, stay tuned to this pot 
- Checked out his work on ballot.fyi, and I think we can do something similar for Canadian politics

## October 4-5, 2019
### Ant Design is a thing??

- So apparently there's this design framework called Ant Design, which I am just hearing about
- Apparently it's big in China and Michael and Yucen said they use it and it's great
- I'm a bit upset at myself for not knowing that this thing existed
- Also a bit hesitant to use it because I have had issues with frameworks before in the past 
*cough* Angular Material Design and also a lot of the code seems to be in Chinese (Mandarin or Cantonese)
- However, I see a lot of people from other parts of the world using it as well, which is an excellent example 
of Globalization

- Anyway, so first thing I had to do is get my app to work with LESS files by using a Less Preprocessor:
https://stackoverflow.com/questions/44227090/how-to-use-less-preprocessor-in-react-create-react-app


### Update Landing Page Copy

- Making some changes to overhaul, I am modifying the Atila elevator pitch to:
"Atila increases your chances of getting more money for school by making it easy to find and apply to scholarships."




## October 3, 2019
- So glad I have tests, I caught an error that only shows up when not logged in (userProfile in redux is null)
- The test was `ScholarshipsList.test.js`
```markdown
TypeError: Cannot read property 'Select Filter' of null
ScholarshipsListFilter.render
src/scenes/Scholarship/ScholarshipsListFilter.js:71
  68 | >
  69 |     <option key={'Select Filter'} disabled hidden>{'Select Filter'}</option>
  70 |     {FILTER_TYPES.map(filter_type => (
> 71 |         <option key={filter_type} value={filter_type}>
     | ^  72 |         {prettifyKeys(filter_type)}
  73 |         </option>
  74 |     ))}

```
- https://circleci.com/gh/ademidun/atila-client-web-app/165

## September 28, 2019
### Checkbox form wierdness

- the checkbox form is acting weird and is setting unchecked forms into empty strings instead of false
- `is_international_students_eligible` and `female_only` are two fields that are affected
- When I tried to manually change the string values using
```javascript
scholarship.international_students_eligible = !! scholarship.international_students_eligible
```
it kept on reverting back to string
- A hacky workaround for now is to just cast the values to boolean in the backend:
https://github.com/ademidun/atila-django/commit/bd66ba420d7258a292963308b8d8d075cfc32631 



## September 21, 2019
### Steps for Adding a New Redux Action
1. Create a constant with the name of the action in  src/redux/actions
2. Export a function in the same file
3. Add your reducer in src/reducers/data/<filename>.js
replace `data` with `ui`, depending on your use case
4. TO use in a component: `import {setLoggedInUserProfile} from "../redux/actions/user";`

## September 20, 2019
### Naming Things is Hard but Important

- I was trying to find react snackbars, no luck finding anything good
- Then I saw [an article](https://reactjsexample.com/simple-snackbar-style-notifications-for-react/) at the botom of the article indicating that the name
is not actually a Snackbar but called Toast
- Snackbar is a concept unique to Angular Material maybe?
- Once I searched react toast notification I found way better results

Toast Notification reveals this:
- https://github.com/fkhadra/react-toastify
- https://github.com/jossmac/react-toast-notifications

Snackbar Notification options:
- https://github.com/rodrigoramosrs/react-snackbar
- https://joeattardi.github.io/react-snackbar-alert

## September 14 2019
### Adding Redux to React App

- The dilemna I am facing now is if I should start decoupling my 
redux store into data and ui now similiar to how I have seen Recat apps built
in past projects (and use things like combine reducers).
- I tried to do that at first but:
1. I can't remember how it's done
2. It almost seems like a case of premature optimization

- I think I will just use the basic structure for now.
And write code in a good way so if I need to refactor, I
can do so easily.  

## September 12 2019
### Add Login, Register, User Authentication
https://github.com/ademidun/atila-client-web-app/pull/7

- Add components to register a new user and login a user
- After user logs in, authenticate using a JWT token that is returned from the backend and saved to local storage
- When user logs out, clear local storage token and remove authorization from each network request

## September 5 2019
### Move repo from public atilatech to private my account

- Move the folder from the public open source version on demo.atila.ca to my private version
- change deployment to use circleci and deploy to firebase (https://atila-7-staging.firebaseapp.com/)
 instead of aws s3 and demo.atila.ca
 
 