import React, { useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "../axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostComments } from "../redux/slices/comments";

export const FullPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth);

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const {activePostComments} = useSelector((state) => state.comments);
  const isCommentsLoading = activePostComments.status === "loading";
  const isAuthLodaing = userData.data?.status === "loading";

  console.log(userData)



  useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setIsLoading(false);
    }).catch((err) => {
      console.warn(err)
      alert('Ошибка при получении статьи')
    })    
  }, [id])
  
  useEffect(() => {
    if(data) {
      dispatch(fetchPostComments(data._id))
    }
  }, [data, dispatch])

  if(isLoading && !isAuthLodaing) {
    return <Post isLoading={isLoading} isFullPost />
  }

  return (
    <>
      <Post 
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl && `http://localhost:4444${data.imageUrl}`}
        user={data.user}
        createdAt={new Date(data.createdAt).toLocaleDateString()}
        viewsCount={data.viewsCount}
        commentsCount={activePostComments.items.length}
        tags={data.tags}
        isFullPost
        isEditable={userData.data._id === data.user._id}
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={activePostComments.items}
        isLoading={isCommentsLoading}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
