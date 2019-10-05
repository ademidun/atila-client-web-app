# Changelog

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
 
 