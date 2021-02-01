import React from 'react';
import {Link, withRouter} from "react-router-dom";
import { PropTypes } from 'prop-types';

import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

class ApplicationsLocal extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            localApplications: null
        };
    }
    componentDidMount() {
     this.loadLocalApplications();   
    }

    loadLocalApplications() {
        
        let {localApplications} = this.state;
        localApplications = [];
        for (let i in Object.entries(localStorage)) {
            const key = localStorage.key( i );
            if (key.includes("local_application_scholarship_id_")) {
                let application = localStorage.getItem(key);
                application = JSON.parse(application);
                localApplications.push(application);
            }
        }
        if (localApplications.length > 0) {
            this.setState({localApplications});
        } else {
            localApplications = null;
        }
    }

    render () {
        const {localApplications} = this.state;
        const { location : { pathname }, scholarship } = this.props;

        if (!localApplications) {
            return null;
        }


        let localApplicationsMenu = localApplications.map(application => (
            <Menu.Item key={application.scholarship.id}>
            <a href={`/application/local/scholarship_${application.scholarship.id}`} 
               target="_blank" 
               rel="noopener noreferrer">
              {application.scholarship.name}
            </a>
          </Menu.Item>
        ));
        localApplicationsMenu = (
            <Menu>
                {localApplicationsMenu}
            </Menu>
        )

        let localApplicationsRemovalNotice;
        if(pathname.includes("/local/")) {
            localApplicationsRemovalNotice = (
                <React.Fragment>
                    <h3>Important: Locally saved applications will be removed soon. Copy and paste these responses
                        into a new application. 
                        To get a new application, 
                        go to the <Link to={`/scholarship/${scholarship.slug}`}>scholarship page</Link>{' '}
                        and click Apply Now or Continue Application.
                    </h3>
                </React.Fragment>
            )
        }

        return (
            <div className="my-3">
            {localApplicationsRemovalNotice}
            <Dropdown overlay={localApplicationsMenu}>
                <Button type="link" onClick={e => e.preventDefault()} style={{"fontWeight": "bold"}}>
                Your Locally Saved Applications <DownOutlined />
                </Button>
            </Dropdown>
            </div>
        )
    }
}
ApplicationsLocal.propTypes = {
    scholarship: PropTypes.shape({}),
}
export default  withRouter(ApplicationsLocal);
