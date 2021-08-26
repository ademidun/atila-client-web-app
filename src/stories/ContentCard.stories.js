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
        "title":"How We Designed the Atila Black and Indigenous Scholarship Graphic",
        "description":"Recently, we redesigned the graphic for the Atila Black and Indigenous Scholarship. See how we were able to create meaningful designs to represent both Black and Indigenous students from some unique sources of inspiration!","image":"https://i.imgur.com/IVO5kBB.png","id":119,"slug":"/blog/llmercer/how-we-designed-the-atila-black-and-indigenous-scholarship-graphic/",
        "type":"blog",
        "user": { 
            "first_name":"Lauren","last_name":"Mercer",
            "username":"llmercer",
            "profile_pic_url":"https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fscholarship-images%2Fedo55xjv-Profile%20Photo.jpg?alt=media&token=1ee1db2a-f81b-4391-ade7-e19265600bda",
            "id":1816
        },
        "published":true,
        "contributors":[]},
    customStyle: {height: "650px"}
};