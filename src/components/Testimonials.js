import React from "react";
import PropTypes from "prop-types";

import { Col, Row } from "antd";
import HelmetSeo from "./HelmetSeo";
import {Link} from "react-router-dom";

let testimonials = [
  {
    first_name: "Jasleen",
    last_name: "Bahia",
    position: "Loran Scholar",
    description: "The interactive features of the website and organized layout make the website " +
        "easy to navigate and fun to explore! I especially enjoy the blogs tab on the page because " +
        "it's so cool to see  the recent and creative projects that the Atila team" +
        " has been working on! ",
    profile_pic_url: "https://i.imgur.com/xYh30Xz.jpg",
  },
  {
    first_name: "Natalie",
    last_name: "Ngo",
    position: "Co-Founder, Step Up Youth Organization",
    description: "I've found Atila to be an extremely valuable and easy-to-use tool for both high school" +
        " and university students. It's a fantastic one-stop shop to not only search for scholarships, " +
        "but also provide guidance on how to excel in applications!",
    profile_pic_url: "https://i.imgur.com/fdEg6jq.jpg",
  },
  {
    first_name: "Grace",
    last_name: "Tse",
    position: "Student, Western University. (Previous Atila Intern)",
    description: "To simply put it, the culture at Atila is fun, flexible, and caring. When I was first onboarded, I felt welcomed and at home right away. I must admit though, at the beginning of the Zoom call, I felt intimidated since I was the youngest member, however, instead of being looked down upon, each member saw me as an equal and never questioned my capabilities. ",
    profile_pic_url: "https://i.imgur.com/Z0uHDTV.jpg",
  },
  {
    first_name: "Chris",
    last_name: "Bis",
    position: "Student Services Teacher, Toronto District School Board",
    img_url: "https://i.imgur.com/XzOTTkV.png",
    description: "A great resource for students, I have posted this on my Student Services google class.",
  },
  {
    first_name: "Hania",
    last_name: "Noor",
    position: "Kinesiology Student, University of Toronto",
    description: "I really like that I get emails about scholarships I am eligible for. It’s really helpful especially during these times. This service is amazing and beneficial and so I believe that more students should know about it.",
    profile_pic_url: "https://imgur.com/aIRQWeC.jpg",
  },
  {
    first_name: "Oluwatofunmi",
    last_name: "",
    position: "Radiation Therapy Student, Laurentian University",
    description: "I think it is a great platform. It has a simple and easy to use user interface. There are so many students out there looking for funding opportunities and personally I know a few friends that can really use this platform to support their income and education. ",
    profile_pic_url: "https://imgur.com/5a8TcOu.jpg",
  },
  {
    first_name: "Sarim",
    last_name: "Zia",
    position: "Garth Webb Secondary School",
    description: "I think the website has many great interactive features" +
        " and accessibility options that allows me to use the website easily ",
  },
  {
    first_name: "Guidance Counsellor",
    position: "Halton District School Board",
    img_url: "https://i.imgur.com/ZjHECiw.png",
    description:
        "Thank you for sharing this information with us here at [School]. I have shared with our Grade 12 students " +
        "and I'm very happy to be connected with you.",
  },
  {
    first_name: "Emily",
    position: "Goergetown District High School",
    description: "I think the site is straight forward clean and very organized. I love the flow of it.",
  },
  {
    first_name: "Hannah",
    last_name: "Balkissoon",
    position: "Student, J Clarke Richardson",
    description: "It's a good website that provides scholarships, sometimes it can be hard to find stuff." +
        " You could make the visuals easier to follow.",
  },
  // {
  //   first_name: "Samantha",
  //   position: "High School Student",
  //   description: "The site was clean and organized, really easy to operate. The language used also made for a non-intimidating experience.",
  // },
  // {
  //   first_name: "Hadi",
  //   last_name: "Al Hakeem",
  //   position: "Software",
  //   username: "hadi",
  //   img_url: null,
  //   description:
  //       "Hadi is currently studying Mathematics at the University of Waterloo.",
  //   link_type: "LinkedIn",
  //   link_url: "https://www.linkedin.com/in/hadi-al-hakeem-24182819a/",
  //   link2_type: "Website",
  //   link2_url: "https://hadihakeem.com/",
  // },
];

function TestimonialCard({ testimonial }) {
  return (
    <div
      className='bg-white rounded shadow mb-3 p-3'
      style={{ height: "575px" }}
    >
      <h5 className="text-center">
        <strong>
          {testimonial.first_name} {testimonial.last_name}
        </strong>
      </h5>
      {testimonial.profile_pic_url &&


      <img
          className='center-block-2 my-2'
          src={testimonial.profile_pic_url}
          alt={`${testimonial.first_name} Atila Testimonial`}
          style={{ width: "250px", height: "250px", borderRadius: "50%"}}

      />
      }
      <span className="small text-uppercase text-muted">
        {testimonial.position}
      </span>

      <p className="col-12 text-muted border-left mt-2">
        {testimonial.description}
      </p>
      {testimonial.img_url &&
      <div>

        {/*Note: TO get the image to size responsively.
                            I just had to put it inside a parent div and add 'col-12' class.*/}
        <img src={testimonial.img_url}
             alt={testimonial.description}
             title={testimonial.description}
             className="col-12"
        />
      </div>
      }
    </div>
  );
}

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({}),
};

/**
 * showSeo set to false if using anywhere except for the main Testimonial page to avoid changing the meta tags.
 * filterArray: An array of first names to show if you don't want to show all items.
 * @param showSeo
 * @param filterArray
 * @returns {*}
 * @constructor
 */
const Testimonials = ({ showSeo = true, filterArray=null }) => {
  const seoContent = {
    title: "Atila Testimonials - What people say about Atila",
    description: `"A great resource for students". Read what people say about Atila`,
    image: "https://i.imgur.com/hOWDsYg.png",
    slug: "/testimonials",
  };

  if (filterArray !== null) {
    testimonials = testimonials.filter(testimonial => filterArray.includes(testimonial.first_name))
  }

  let teamCards = testimonials.map((testimonial) => (
    <Col xs={24} md={12} key={testimonial.first_name}>
      <TestimonialCard testimonial={testimonial} />
    </Col>
  ));
  let title = (<h1>Atila Testimonials and Reviews</h1>);

  if (!showSeo) {
    title = <Link to={"/testimonials"}>
      {title}
    </Link>
  }

  return (
    <React.Fragment>
      {showSeo && <HelmetSeo content={seoContent} />}
      <div className='container mt-3'>
        {title}
        <h3 className="col-sm-12 text-center text-muted">
          What People say about Atila
        </h3>
        <br />
        <Row gutter={16}>
          {teamCards}
        </Row>
        {!showSeo &&
            <h3 className="text-center">
              <Link to={"/testimonials"}>
                Read More
              </Link>
            </h3>
        }
      </div>
    </React.Fragment>
  );
};

export default Testimonials;
