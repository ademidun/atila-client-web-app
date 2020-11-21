import React from "react";
import PropTypes from "prop-types";

import { Col, Row } from "antd";
import HelmetSeo from "./HelmetSeo";
import {Link} from "react-router-dom";

let testimonials = [
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
    description: "I think the site is straight forward clean and very organized I love the flow of it.",
  },
  {
    first_name: "Hannah",
    last_name: "Balkissoon",
    position: "Student, J Clarke Richardson",
    description: "It's a good website that provides scholarships, sometimes it can be hard to find stuff." +
        " You could make the visuals easier to follow.",
  },
  {
    first_name: "Student Services",
    position: "Toronto District School Board",
    img_url: "https://i.imgur.com/CnqL9km.png",
    description: "A great resource for students, I have posted this on my Student Services google class.",
  },
  {
    first_name: "Samantha",
    position: "High School Student",
    description: "The site was clean and organized, really easy to operate. The language used also made for a non-intimidating experience.",
  },
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
      style={{ height: "350px" }}
    >
      <h5 className='mb-0'>
        <strong>
          {testimonial.first_name} {testimonial.last_name}
        </strong>
      </h5>
      <span className="small text-uppercase text-muted">
        {testimonial.position}
      </span>

      <p className="col-12 text-muted">
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
    title: "Atila Testimonials - What our users say about us",
    description: `"A great resource for students". Read what people say about Atila`,
    image: "https://i.imgur.com/ZjHECiw.png",
    slug: "/team",
  };

  if (filterArray !== null) {
    testimonials = testimonials.filter(testimonial => filterArray.includes(testimonial.first_name))
  }

  let teamCards = testimonials.map((testimonial) => (
    <Col xs={24} sm={12} key={testimonial.first_name}>
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
      </div>
    </React.Fragment>
  );
};

export default Testimonials;
