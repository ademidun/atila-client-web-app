import React, { useCallback, useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import MentorshipAPI from '../../services/MentorshipAPI';
import { getErrorMessage } from '../../services/utils';
import { Mentor } from '../../models/Mentor';
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import ContentListDisplay from '../../components/ContentListDisplay';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function MentorsList() {

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingUI, setLoadingUI] = useState({message: "", type: ""});

  const loadMentors = useCallback(
    () => {

    setLoadingUI({message: "Loading Mentor profile", type: "info"});
    MentorshipAPI.listMentors()
    .then((res: any) => {
        const { data } = res;
        setMentors(data.results);
    })
    .catch(error => {
        console.log({error});
        setLoadingUI({message: getErrorMessage(error), type: "error"});
    })
    .finally(()=> {
        setLoadingUI({message: "", type: ""});
    })
      return ;// code that references a prop
    },
    []
  );

  useEffect(() => {
    loadMentors();  
  }, [loadMentors]);

  const seoContent = {
    ...defaultSeoContent,
    title: 'Atila Mentorship - Connecting students with mentors'
};

  
  return (
    <div className='container m-3 p-3'>
      <HelmetSeo content={seoContent} />
      <h1>
        Mentors
      </h1>
      <div className='text-center m-3'>
        <Link to="/mentorship/about">
          <Button>
            Learn More
          </Button>
        </Link>
      </div>

      <ContentListDisplay contentList={mentors} />

        {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
    </div>
  )
}

export default MentorsList