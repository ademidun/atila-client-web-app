import React from 'react';
import {Link} from "react-router-dom";
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import { Blog } from '../../models/Blog';
import ContentListDisplay from '../../components/ContentListDisplay';
import { Row, Col } from 'antd';

function Resources(){


    const title: string = 'Scholarship resources for Students';
    const seoContent = {
        ...defaultSeoContent,
        title,
        description: 'A list of resources to help you get scholarships.',
    };
    const presentationId = "2PACX-1vR2yzK_cDJBfuVPnuf-6MBYlJBNgfZOTKj6zZ69Nw3vN-r1k0uBbq5P-JuhGtXdHLCdx9uEUqcbpqmi";

    const studentResourceBlogs: Blog[] = [
        {
          id: 155,
          contributors: [
            {
              user: 1289,
              first_name: "Aaron",
              last_name: "Doerfler",
              username: "aarondoerfler",
              profile_pic_url: "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fuser-profile-pictures%2F1289%2Fi7aqzlpa-headshotzoom.jpg?alt=media&token=a6071b1c-afd6-43d3-b008-f57e347caa2b"
            },
            {
              user: 1816,
              first_name: "Lauren",
              last_name: "Mercer",
              username: "llmercer",
              profile_pic_url: "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fscholarship-images%2Fedo55xjv-Profile%20Photo.jpg?alt=media&token=1ee1db2a-f81b-4391-ade7-e19265600bda"
            }
          ],
          title: "Atila’s Guide to Getting Scholarships for School",
          slug: "atila-scholarship-guide",
          description: "The average university student graduates with $28K in student debt, yet at the same time, every year there are millions of dollars in scholarships that go unclaimed!\n\nOur guide hopes to solve both of those problems.",
          header_image_url: "https://i.imgur.com/95qV22q.png",
          user: {
            first_name: "Tomiwa",
            last_name: "Ademidun",
            username: "tomiwa",
            profile_pic_url: "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fuser-profile-pictures%2F1%2Fljy9s5nm-Ezc5Hyf.jpg?alt=media&token=2391816e-c546-4b11-b232-0cc91f9f3547",
            id: 1
          },
          body: "",
        },
        {
          id: 190,
          contributors: [],
          title: "Atila’s Guide to Writing a Great Scholarship Application",
          slug: "atila-scholarship-application-guide",
          description: "Advice on how to write a great scholarship application: Be Specific, Give Examples, Provide Proof. Read Applications of Past Winners. Write Simply. Get feedback from others.",
          header_image_url: "https://i.imgur.com/ndVe5D6.png",
           user: {
            first_name: "Tomiwa",
            last_name: "Ademidun",
            username: "tomiwa",
            profile_pic_url: "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fuser-profile-pictures%2F1%2Fljy9s5nm-Ezc5Hyf.jpg?alt=media&token=2391816e-c546-4b11-b232-0cc91f9f3547",
            id: 1
          },
          body: "",
        },
        {
            id: 117,
            contributors: [
                {
                    user: 1,
                    first_name: "Tomiwa",
                    last_name: "Ademidun",
                    username: "tomiwa",
                    profile_pic_url: "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fuser-profile-pictures%2F1%2Fljy9s5nm-Ezc5Hyf.jpg?alt=media&token=2391816e-c546-4b11-b232-0cc91f9f3547"
                }
            ],
            title: "“What’s The Word Count?”: Analyzing the Correlation Between Essay Length and Quality",
            slug: "whats-the-word-count-analyzing-the-correlation-between-essay-length-and-quality",
            body: "",
            description: "We analyzed 350 scholarship application essays to see if there was a correlation between the essay length and quality.\r\n\r\nHere’s a highlight of what we learned:\r\n\r\n- Yes, there is a strong correlation. Longer applications tend to score better\r\n- 70% of an application's score can be determined by its length\r\n- However, the relationship is logarithmic not linear (longer is not always better)",
            header_image_url: "https://imgur.com/iNO7W30.jpg",
            user: {
                first_name: "Eric",
                last_name: "Wang",
                username: "ericwang451",
                profile_pic_url: "https://firebasestorage.googleapis.com/v0/b/atila-prod.appspot.com/o/user-uploads%2Fuser-profile-pictures%2F1972%2Fpoysmr85-hi.png?alt=media&token=0a951337-b510-45b7-b612-e39c26bf8864",
                id: 1972
            }
        }
      ]

      const socialMediaResources :any[] = [];
    //   TODO uncomment this line and make it look nicer
    //   const socialMediaResources = [
    //       {
    //           url: "//instagram.com/p/CTupPp5rvZr/embed/",
    //           title: "Creative Ways to Find Scholarships for School",
    //       },
    //       {
    //           url: `https://twitframe.com/show?${encodeURI('https://twitter.com/atilatech/status/1446837159965691912')}`,
    //           title: "Creative Ways to Find Scholarships for School",
    //       },
    //   ];

        return (<div className="container mt-5">
        <HelmetSeo content={seoContent} />
        <div className="card shadow p-3 text-center">
            <h1>{title}</h1>

            <h2>
                <a href={`https://docs.google.com/presentation/d/e/${presentationId}/pub?start=false&loop=false&delayms=3000`}>
                    How to get Scholarships Presentation
                </a>
            </h2>
            <div className="responsive-google-slides">
              <iframe 
                title="How to get Scholarships Presentation"
                src={`https://docs.google.com/presentation/d/e/${presentationId}/embed?start=false&loop=false&delayms=3000`}></iframe>
            </div>
            <hr/>
            <h2 className="my-2">
                Useful Blog Posts for Students
            </h2>
            <ContentListDisplay contentList={studentResourceBlogs} />
            <hr/>
            {socialMediaResources.length > 0  && 
            <>
                <h2 className="my-2">
                    Useful Social Media Posts for Students
                </h2>
                <Row>
                {socialMediaResources.map (resource => (
                    <Col xs={24} md={12} lg={8} key={resource.url}>
                        <iframe src={resource.url} width="612" height="710" scrolling="no" title={resource.title} ></iframe>
                    </Col>
                ))}
                </Row>
                <hr/>
            </>
            }
            <p>Do you want us to speak to your class about scholarships? <Link to="/contact">Contact Us</Link>
            </p>
        </div>
    </div>);
}

export default Resources;

