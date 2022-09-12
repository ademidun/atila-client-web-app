import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import Loading from '../../components/Loading';
import MentorshipAPI from '../../services/MentorshipAPI';
import { getErrorMessage } from '../../services/utils';
import MentorCard from './MentorCard';
import { Mentor } from '../../models/Mentor';

function MentorsList() {

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingUI, setLoadingUI] = useState({message: "", type: ""});

  const loadMentors = useCallback(
    () => {

    setLoadingUI({message: "Loading Mentor profile", type: "info"});
    MentorshipAPI.listMentors()
    .then((res: any) => {
        const { data } = res;
        console.log({res});
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

  
  return (
    <div className='container m-3 p-3'>
      <h1>
        Mentors
      </h1>

      <Row gutter={{ xs: 8, sm: 16, md: 24}}>
          {mentors.map((mentor) =>   
          <Col xs={24} md={12} lg={8} key={mentor.id}>
            <MentorCard mentor={mentor} />
          </Col> 
          )}
      </Row>

        {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
    </div>
  )
}

export default MentorsList