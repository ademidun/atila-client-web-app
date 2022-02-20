import React from 'react';
import { Link } from "react-router-dom";
import { Col, Row, Tag } from "antd";
import { formatCurrency } from "../../services/utils";
import { UserProfile } from '../../models/UserProfile.class';
import { Currencies } from '../../models/ConstantsPayments';
import CurrencyDisplay from '@atila/web-components-library.ui.currency-display';
import { Contributor } from '../../models/Contributor';

interface UserProfileCardProps {
    userProfile: UserProfile | Contributor
}

export function UserProfileCard(props: UserProfileCardProps) {

    const { userProfile } = props;

    const fundingAmount = <>
    {userProfile.funding_amount &&
        <strong>
            <br/>
            {Currencies[(userProfile as Contributor).currency]?.is_crypto  ?
            
            <CurrencyDisplay amount={userProfile.funding_amount} inputCurrency={(userProfile as Contributor).currency} /> :
            formatCurrency(userProfile.funding_amount, true)
            }
        </strong>}
    </>;

return (
    
    <div className='UserCard'>

        <div className='userUpper-container'>
            <div className='userImage-container'>
                <Link to={`/profile/${userProfile.username}`}>
                    <img id="avatar-pic"
                        alt="user profile"
                        src={userProfile.profile_pic_url} />
                </Link>
            </div>
        </div>
        <div className='tag'>
            {(userProfile as UserProfile).is_winner && <Tag color="green">{' '}Winner</Tag>}
            {userProfile.is_owner && <Tag color="green">{' '}Creator</Tag>}
        </div>
        {userProfile.is_anonymous || !userProfile.username ?

            <div className='userLower-container'>
                {userProfile.is_anonymous ? "Anonymous" : `${userProfile.first_name} ${userProfile.last_name}`}{fundingAmount}
            </div>
            :
            <div className='userLower-container'>
                <Link to={`/profile/${userProfile.username}`}>
                    {userProfile.first_name}{' '}{userProfile.last_name}
                </Link>
                {fundingAmount}
            </div>}

    </div>);
}

interface UserProfileCardsListProps {
    userProfiles: UserProfile[] | Contributor[],
    userKey: string
}

UserProfileCardsList.defaultProps = {
    userKey: "username"
}
export function UserProfileCardsList(props: UserProfileCardsListProps) {

    const { userProfiles, userKey = "username" } = props;

    return (

        <Row gutter={[{ xs: 8 }, 16]}>
            {userProfiles.map((userProfile) => 
                <Col md={8} sm={24} key={(userProfile as any)[userKey]}>
                <UserProfileCard userProfile={userProfile} />
                </Col>
                )
            }

        </Row>
    );

}
;
