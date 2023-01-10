import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../redux/slices/comments";

export const Index = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);

  console.log(userData)
  const dispatch = useDispatch()

  const [text, setText] = useState('');
  const [isLoadig, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }
    setIsLoading(true)
    const fields = {
      text,
      postId: id
    }
    const response = await axios.post('/comments', fields);
    setIsLoading(false)
    setText('')
    dispatch(addComment({...response.data, user: userData}))
  }

  return (
    <>
      <div className={styles.root}>
        {userData && <Avatar
          classes={{ root: styles.avatar }}
          src={`http://localhost:4444${userData.avatarUrl}` }
        />}
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            value={text}
            onChange={e => setText(e.target.value)}
            maxRows={10}
            multiline
            fullWidth
          />
          <Button disabled={isLoadig} onClick={onSubmit} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
