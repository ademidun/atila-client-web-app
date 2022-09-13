import React, { useCallback, useEffect, useState } from 'react';
import { Divider, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Mentor } from '../../../models/Mentor';
import { UserProfilePreview } from '../../../components/ReferredByInput';
import { getErrorMessage, stripHtml, truncate } from '../../../services/utils';
import MentorshipAPI from '../../../services/MentorshipAPI';
import Loading from '../../../components/Loading';


const columns: ColumnsType<Mentor> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (_, mentor: Mentor) => <UserProfilePreview userProfile={mentor.user} />,
  },
  {
    title: 'Description',
    dataIndex: 'bio',
    render: (_, mentor: Mentor) => <>{ truncate(stripHtml(mentor.bio))}</>,
  },
];

function SelectMentor() {

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
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: Mentor[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: Mentor) => ({
        name: `${record.user.first_name} ${record.user.last_name}`,
        }),
        columnTitle: 'Select Mentor'
    };

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
        {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
        </div>
    );
};

export default SelectMentor;