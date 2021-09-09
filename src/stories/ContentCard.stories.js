import React from 'react';
import ContentCard from '../components/ContentCard';

//👇 This default export determines where your story goes in the story list
export default {
    title: 'ContentCard',
    component: ContentCard,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <ContentCard {...args} />;

export const Blog = Template.bind({});

Blog.args = {
    hideImage: false,
    className: "mb-3",
    content: {
        "title": "How We Designed the Atila Black and Indigenous Scholarship Graphic",
        "description": "Recently, we redesigned the graphic for the Atila Black and Indigenous Scholarship. See how we were able to create meaningful designs to represent both Black and Indigenous students from some unique sources of inspiration!", "image": "https://i.imgur.com/IVO5kBB.png", "id": 119, "slug": "/blog/llmercer/how-we-designed-the-atila-black-and-indigenous-scholarship-graphic/",
        "type": "blog",
        "user": {
            "first_name": "Lauren", "last_name": "Mercer",
            "username": "llmercer",
            "profile_pic_url": "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fscholarship-images%2Fedo55xjv-Profile%20Photo.jpg?alt=media&token=1ee1db2a-f81b-4391-ade7-e19265600bda",
            "id": 1816
        },
        "published": true,
        "contributors": []
    },
    customStyle: { height: "650px" }
};

export const Essay = Template.bind({});

Essay.args = {
    "content": {
        "title": "Atila Science and Engineering STEM Scholarship Application by Jan Prus-Czarnecki",
        "description": "Ever since I've been a kid I have had a passion for science and math. Since a young age me and my older brother would build toy rockets from any materials we could find such as cardboard paper towel tubes and cut fins from tuna cans. We would always beg our parents to take us to Hobby Wholesale to buy rocket fuel and then we would launch our creations into the sky. As I got older and built more gadgets I studied more about electricity and circuits from any books I could get my hands on. This pic...",
        "slug": "/essay/janpc01/atila-science-and-engineering-stem-scholarship-application-by-jan-prus-czarnecki-cmgw3cw7/",
        "image": "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fuser-profile-pictures%2F1803%2Fob64vq83-thumbnail%20(2).jpg?alt=media&token=9541c222-935f-43ec-ac01-885786cf959d",
        "type": "essay",
        "user": { first_name: "Jan", last_name: "Prus-Czarnecki", },
        "published": true
    },
    "customStyle": {
        "height": "850px"
    },
    "className": "mb-3",
    "hideImage": false
};