import React, { useCallback, useEffect, useState } from 'react';
import { Col, Divider, Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Mentor } from '../../../models/Mentor';
import { UserProfilePreview } from '../../../components/ReferredByInput';
import { getErrorMessage, stripHtml, truncate } from '../../../services/utils';
import MentorshipAPI from '../../../services/MentorshipAPI';
import Loading from '../../../components/Loading';
import MentorProfileView from '../../../components/Mentorship/Mentor/MentorProfileView';
import MentorshipSessionSchedule from './MentorshipSessionSchedule';


const columns: ColumnsType<Mentor> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (_, mentor: Mentor) => <UserProfilePreview userProfile={mentor.user} linkProfile={true} />,
  },
  {
    title: 'Description',
    dataIndex: 'bio',
    render: (_, mentor: Mentor) => <>{ truncate(stripHtml(mentor.bio))}</>,
  },
];

export interface SelectMentorProps {
  onSelectMentor?: (mentor: Mentor) => void
}

function SelectMentor(props: SelectMentorProps) {

    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor>()
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
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: Mentor[]) => {
          props.onSelectMentor?.(selectedRows[0]);
          setSelectedMentor(selectedRows[0]);
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: Mentor) => ({
        name: `${record.user.first_name} ${record.user.last_name}`,
        }),
        columnTitle: 'Select Mentor'
    };

    console.log({selectedMentor});
    return (
        <div>
            <h1>Select Mentor</h1> 
        <Divider />

        <Table
            rowSelection={{
            type: 'radio',
            ...rowSelection,
            }}
            columns={columns}
            dataSource={mentors}
            rowKey='id'
        />

          
          {
            selectedMentor && 
              <Row gutter={16}>

                <Col sm={24} md={12}>
                    <div className="col-md-5 col-sm-12 text-center">
                         <img
                            alt="user profile"
                            style={{ height: '250px', width: 'auto' }}
                            className="rounded-circle cursor-pointer"
                            src={selectedMentor.user.profile_pic_url}
                         />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <h1>{ selectedMentor.user.first_name }{' '}{ selectedMentor.user.last_name }</h1>
                    </div>
                  <MentorshipSessionSchedule />
                </Col>
                <Col sm={24} md={12}>
                  <MentorProfileView mentor={selectedMentor} />
                </Col>

              </Row>
          }
        {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
        </div>
    );
};

export default SelectMentor;