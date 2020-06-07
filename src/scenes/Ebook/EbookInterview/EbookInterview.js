import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import "../Ebook.scss";
import { Button } from "antd";

const interviewees = [
  {
    first_name: "Alex",
    last_name: "Lamont",
    img_url: "https://i.imgur.com/dC642Sr.png",
    description_1:
      "Alex attended McGill’s Desautels Business School, and was a varsity soccer athlete",
    quote:
      "Just learn from your experiences and don’t be afraid to take risks.",
  },
  {
    first_name: "Anne",
    last_name: "Chung",
    img_url: "https://i.imgur.com/GDPc4eC.png",
    description_1:
      "Anne is a Computer Science student at The University of Waterloo",
    quote:
      "I think the opportunity to work with some really cool companies in undergrad is really unreal to me...that is why I went with Waterloo",
  },
  {
    first_name: "Raza ",
    last_name: "Khan",
    img_url: "https://i.imgur.com/aqYks77.png",
    description_1:
      "Raza studied at the Ivey School of Business at Western University and is a marketing manager at TELUS.",
    quote:
      "Everything will work out because you don't stop working until it does.",
  },
  {
    first_name: "Sarah ",
    last_name: "Chin",
    img_url: "https://i.imgur.com/ROVNTFa.png",
    description_1:
      "Sarah studied Chemistry at Queen’s University and is currently working for the Ontario Ministry of Children, Community, and Social Services",
    quote:
      "Finding what motivates you and what excites you is important— and that might not be the first thing that you try.",
  },
  {
    first_name: "Emily ",
    last_name: "Chen",
    img_url: "https://i.imgur.com/P1utqdl.png",
    description_1:
      "Emily is a medical school student at the University of Toronto",
    quote:
      "At the end of the day, you’re going to graduate university as a person ... so work on the best version of yourself.",
  },
  {
    first_name: "Tomiwa ",
    last_name: "Ademidun",
    img_url: "https://i.imgur.com/Da74ZDi.png",
    description_1:
      "Tomiwa is a dual degree Engineering and Business student at the Ivey School of Business, Western University",
    quote:
      "You’re paying all this money for tuition, textbooks, and all that stuff. But the most value you get" +
      " are the friends you make and the people you meet..." +
      " that stuff is free, which is kind of ironic.",
  },
  {
    first_name: "Tashiya",
    last_name: "Halahackone",
    img_url:
        "https://lh3.googleusercontent.com/8gM1DH9B4KdDbG6lcazHEaRwbLkNRC06WZkhOl8zYcKnG9Nr9qMmMd0cKS8ESozIFyufchTmwPYPakBMWxo3csagyC6LFi5IYppsyenbKjDgoX3F2gnoJarwtOdYNo-tSifApFpiOSM4wO6-pnOss_45ASmK7yjXp3WpxtOOYMWpqTNdwCLpXQ9jXVByEH59UpaZTa4fm717FXaNhOMrpDbC_PrIgMKb1O-sdUTvsInpIBreK-vivAgtXcmsNRXsmOlB0H_szLxGzzsgMV3y-GN1TyiErFFZVsVD65ShlYSSIXHT2RJDA_oNyyYFy9NYd9RlG0q-t6imPHe6T0GEERr2sZCwFrmwVoLOgjQJQ0NFhj9w6PcAVWLXDQsRwSQ3QmTPv_dE5ukgX8UufjeqTB41Vrkl_ZUfoofmYe_-C1wgc88nD8wtyk2mvKhCfKQ3Mz_JAdeUP1YhljteLyWxsnGT8GEC3ZVAA1ye3nQ9Wq83NrOjvpeyMpr_reh-8zTWZveEN88JW4TG_-QkG2Y_cF_ym-7a2-YCoqcTxyiK8ipnkxJoTnyASxlczk4vy2xZiWVc2PdbGzRs6y_ky3WIiPlzXbiUEEfwCixKhB1Fc6QcH5MzuxjUhrLWtmfrXPyqgOokw08e4PVDKNK5yb-PqpPyXnjf0QyLGQZtloCh0Ph9pRoDija-1GRB8WO2BqTXEZxNAH-I4mygFKbMhw9kMiSi8JahEGFMkk0oLXbBcL6wgN3KIQVDQDTg=w904-h902-no",
    description_1:
        "Tashiya is studying International relations and affairs at Western University.",
    quote:
        "Dont be afraid to ask for help when you need it, because its there for you",
  },
  {
    first_name: "Aaron",
    last_name: "Doerfler",
    img_url: "https://lh3.googleusercontent.com/KYz8aaJ6adKC30PVS6q_b7-Bt11dBEqyD4vrEkgwXJsZ1gbpfepIaPYrW20QAalpwmSUHJpG52cdtCvzAziztu_NlXRADUwGzy0Iz0hkHVTwCXuathra_Gj-lKTTNgOAmy-8krW7HerPO70ROXvIFGowqdbgBroNx4i1SODNQYNqsmSXhFQ5Ur69GLC6rTLpzbXPeEyH6lwid8BT7enTvEn0QBzV7AOidwolDIaa-m6qzJar-X1RNR_45mskivLEgUISHjvjnEYRH2Cz4T26xj3ljNgkBduRaonCLeHkUtXyeZHNZcH24N6LLHkeF7CG8x5-dm-upUCNKugMG-SA1MAZp0PxA63qu8dKdotUE6AFFrVzi43FtNT3-co5StJe3bI-K6z1KV2ev1JYCT00KFlGVVVHReC6HyoT9NYLsohmNS1uQLEjRf7A3B4zVeYgRwj2fqGVxMmAeuhF6jM-RMER8AiTh5jBUFUN8Pn0vYDgUOypCxEOKynxq40I53SLwqDrOp0aLLmADqdJ3ONsYSx2JnYoaa1u_TZEJpnhs3C2SweV9fA_KpzWj77JzHqR6TpdWGWbQK2UJQbR2gs6I9086ovo8zK1Euk2Nh4egCqvihNKBILc7yMWAXOl7cjcAxVBLik5wnLqpjv64VIDIibt1rtBUiqhpIspRMjuvKtg_r_qEINnl492bN80kD_dh0JXucsR3eHmgxRYwqrOLct_1VPr5XslpcZDSIieJmCQCkxphbe8fnJR=w904-h884-no",
    description_1:
      "Aaron is a Media Information and Techno-culture (MIT) student at Western university.",
    quote:
      "At Western I am surrounded by amazing students and faculty that provide me with an unmatched student experience",
  },
  {
    first_name: "Kitan",
    last_name: "Ademidun",
    img_url:
        "https://lh3.googleusercontent.com/9MtWFIKYwCnAJs5EDiwke3tY_nGTt1O1OfEAEyyCWupXPOE4RMacWe7GK8okoL_fNUThUx4VcsJQCboNRsdogkXNNPixfieoJnTReRJIET3aM6fr1BswwZ2RNv7L-9AQrot2wB4eWjABAw-uoOMmZNzsN2T_7LklVUbzMFjhQ1fCpLvgkofHcb57UsIMlXNuHCMRM74uzEtrCI9-xNcYjqvjV0FBBSd1NOqWyi97X7O2Ww-kxXtuZFHTTTgue0fZQFRll79febn6G0icGd12k9_dfvfxhLsV7fWYURLslo67bjA8bjV7RhbhHN1GsncHF7Oz_1V6-1sZY0nv8MoE9L6BlBbUi3ON0244SiSX8L0ymB7W9LmVr3L0Eo1U0nP_6DhIEPX7qBimaNOcUYSMDVoxBQEfKWQS7Jdd9LXX4SS17ofeZlHoQQwaVBS4IPPcv-NOjFKZtcyrDr46pGus2s9wRBEBbLkYZWSjw1PssdtrOUTc2oKYXQvjvbDTD3mfjx4zGATq-5Xq-96kD8ciz9A6VBHYrNtZHBUwaI2n-zV3dVHt-O0LQ32VqesZQPa8JijyAKT4ietRjvs5771SRrO5rA03mHD9rElMIR8kYFX_HCda-4BgYu4NYWniRkyok_v22qF4CXDlX9z9A5LEFZWZKclPW8TtUdjFcWezRlH4PXiLdz2qkE-e29PNmO6bOAH6CC-80173iFwDXJ-Jk05hwB1lYEKKHoBPmlkR41IHFXckazAvGg50=w904-h893-no",
    description_1:
        "Kitan is a dual degree Engineering and Business student at the Ivey School of Business, Western University.",
    quote:
        "You can literally end up anywhere, it’s just a matter of where you decide to go forward.",
  },
  {
    first_name: "Jacob",
    last_name: "Munene",
    img_url: "https://lh3.googleusercontent.com/f6jLcq4ZiCa8VPLlFgYPpYb2IVj4CsHUUE4x7uFs4ReMhF89hGicSvPLYcRe0mFlrQP91rq85H3FCjFnNUlYKxv8LGwosLQZEHzBO5ZKxVXInBtTLu-yo02_zkKQpCI3CisgG-10VsizOC1FOuGjrs_7x3hDuqxGIR1gBPLwqYzunJIdZ1_th9wFSuidzsALYogCn1_2KfHeblgOCvn2Xcllvql3_tDXhxzEqvHL14vSClUplj3zKbq6TCJ3sFn05t1uUvGTuqocxPX1h2DXC1FmfqWdg2AyOzO7GbP2kcXR5cPzRIOOmCvE77wA7YVc_N9ivXgF18E8gNtaI2FStK1p0Cpy21lOO0lCu9Wl5XAs82rNUhj5gDXrEPXNvWXdh4xb69vSHkH7PQZqIlvHnTOEh0nhIuRoc4BGLMYr6IuNmmfbtHMiXH5pBiOb7mEwlpuc2oAhZIjre3Iquufyu6m8YbRNz9N9tXjquWbBmPx_1fXGjSG3nLt7Tni2S_VmOwWlbnCes7m4RN8j--OP2sxWCDDp1kAgkOLtYI1STFhwmkQWUteAxj9L68mNOQ0z-3u_pCnFIY6V1wE0zeEhj2aQB5tk59ymZ1hn5F0xKXkO3MSu2t6oGJ4-wjtWqUy1wAFAXeQ1Yx22AvsaSlUxvMGVo8hJmUASvBvYJzNuRTzfdZ9wHANUd7e5ChZ5Cllg7svBl_67fGkntbuE4pXunALjaHf9yifSGZtDob7fCxmsuoIiLNtlKKnS=w904-h828-no",
    description_1:
      "Jacob is currently studying Financial Modeling and Applied Mathematics at Western University.",
    quote:
      "If you dont know what you want to do, you can take a year off and figure out what your interests are",
  },
  {
    first_name: "Sameeksha",
    last_name: "Tirikollur",
    img_url:
      "https://lh3.googleusercontent.com/mi5drmqpniDbpCPw6yzS2SBoUEaW1zhHqxh0rRR8jcYMLrVcw4LPwizmoqzZ4vUY4H7gOoce5lQ5Yt7dgF3NjViHHXYeMFJROOJyeLoKbeNhX64gixQGj24iCxOQKcnNEBYSCvabaPE-BSHcYU29TXP7kba2meXSjaTgx1XYiqVkwnV0EnXBaGJOWKtEMK1lCVGX34ya17bI42WPMmuE5St11TnwLwuJ8FFyX_PQ3Xmyy-yWXl9dNQbyIkBtz15lNMxM07xFfbOh8CNd2acZkcBTrKxBJ_eeZypfv0Jk9s9GX0hC3_ynUZlO-6qBh2RsyhYDsmJtIbjspC6XgXVKj-8X5gd5h2PRYywe_1V1fdMjUvW49KuSIUOvgwID5UWZacbVP37ee9Rk3cuUXrwCAboiI7gMRKE1OnGz_WbIuomE5x0n03TGGj-8IM7SSU3nl0AsZWhW_qiBcmhzIZwEzcwkzAnzpoKaVQ4h5K6sH9dvb1xnmlfybAMKay6aN0XqZ14D1DIGQZlnE9aZEM6b2H_syiF3V2gw-4IlSJabcfsCmFxgKAaawpTSVv5a3pniK3iVVmQ6cqbDpD_nLyi5kG3eXu7TGxhp_iI4T0WEA4bxl8464SUhBNpL9EuC-2XKvMcS7vxKUa65tedKo_O7zNZKH5KdK0CStdQFXMYoQ3kXtv931JZvQvRN1NH4WFOFbU6JBAw4MucI63kClRLzAy8v5GJLI3QXfsRU2oE4Su51ZcktPiYsw8IW=w807-h952-no",
    description_1:
      "Sameeksha is at Ivey Business school at Western University.",
    quote:
      "If you do choose to do post-secondary, dont forget about life outside the classroom",
  },
  {
    first_name: "Tife",
    last_name: "Ademidun",
    img_url:
      "https://lh3.googleusercontent.com/IvY7RfmvfZ3apMJvlo1BhefH_fXejG5N0qabBZp4eW8qJ9AvnlsT8CZq09c7gdOcSCCIib2UdisWLZG6gf0ddGM12Thu2XjK04XmyqKxAxU8S9plasEEY9C5ekybNHUOr8Xr-na48U4M76nDMVU-f7GYAg9lwbnlvqm21-l-_gaCaYm0mZD2V0mHnzImVFhsPVvTnfYa8DACLdauq7k8_mTELMWQhH5GbBnYIIFlPXVzx_LXeCeKplzUuLWTswFe5biWHuqF0mD4urw3YlzqU1npEKvZ63e9EvU4I-5Vjef88CxPQLLp5A4OzrbSr6IMryki487yc17tiGl5cgXGUQRv2RcIXBfFLZ7ZStfpDLLMzDcnY_IPoOsWaTZmF4BTD1caUxxIHA7qvkrUPte6BTY0D46M8azY9d_uBIw6uVo4a4k0E-26QkCHp4nzft61EjAK0hoVg4PYTdDiC2-IEOGqSruX-Lzr_dv1bWU2QzudSUU5-bSfQu4urLfHhYcmLYmMqrhyJC3pnBqkkULHpeTxvGLnBicWgwXjAZ6qT-whDcA4nYB4Q0sYsJZLMYheLy4u028Vche5y21o0HOjOspqPLFj1b8aeVI0P0Q5M7bBHRffAZqjlJ70CDj7z3JpoNbvZ4bRIMxGD7p2XG-VI9-zmJs7xf0AtI_AonLg9jKiXjPwzx_M49NlKGtjvGY04bij7aCkfWMNSC8maO0OlLqzMAoIgAKtx8rnhCmB_js35k8VLBm5NGml=w901-h952-no",
    description_1: "Tife is an engineering student at Western University",
    quote:
      "Dont compare yourself to others, just make sure your focused on you",
  },
];

function InterviewCard({ person }) {
  return (
    <div className='InterviewCard bg-white rounded shadow mb-3 p-3'>
      <h2 className='mb-2'>
        {person.first_name} {person.last_name}
      </h2>
      <br />
      <img
        className='Image mb-3'
        src={person.img_url}
        alt={person.first_name}
      />

      <blockquote className='blockquote'>
        <p className='mb-3'>"{person.quote}"</p>
        <p className='blockquote-footer text-right'>{person.description_1}</p>
      </blockquote>
    </div>
  );
}

InterviewCard.propTypes = {
  person: PropTypes.shape({}),
};

const EbookInterviews = () => {

  let interviewCards = interviewees.map((interviewee, index) => (
      <React.Fragment key={interviewee.first_name}>
        {['0','6'].includes(index.toString()) &&
        <Col span={24} className="text-center">
          <img
              className="responsive-images"
              src={index === 6 ?'https://i.imgur.com/XluzC2w.jpg' : 'https://i.imgur.com/Yr0CZL2.jpg'}
              alt='Western Students' />
        </Col>
        }
        <Col xs={24} md={12} xl={8}>
          <InterviewCard person={interviewee} />
        </Col>

      </React.Fragment>
  ));

  return (
    <React.Fragment>
      <div className='container mt-3'>
        <h1>The Students we Interviewed</h1>
        <br />
        <Row gutter={16}>{interviewCards}</Row>
      </div>
      <a href='/team'><Button className='buy-book-button center-block' 
              style={{fontSize: 20}} 
              type='primary' 
              >
                  The Atila Team
              </Button></a>
    </React.Fragment>
  );
};

export default EbookInterviews;
