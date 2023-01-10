import { Avatar } from '@mui/material';
import React from 'react';
import styles from './UserInfo.module.scss';



export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <Avatar alt={fullName} src={`http://localhost:4444${avatarUrl}`} sx={{width: 30, height: 30, marginRight: 1.5}} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
