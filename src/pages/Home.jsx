import React, { useEffect, useMemo } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { fetchComments } from "../redux/slices/comments";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Home = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);

  console.log(searchParams.get('tag'))

  const isPostLoading = posts.status === "loading";
  const isCommentsLoading = comments.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const [sorted, setSorted] = useState(0);

  const filterPosts = useMemo(() => {
    if (sorted === 0) {
      const sortPosts = [...posts.items].reverse();
      return sortPosts;
    } else if (sorted === 1) {
      const sortPosts = [...posts.items].sort((a, b) =>
        a.viewsCount < b.viewsCount ? 1 : -1
      );
      return sortPosts;
    }
    return posts.items;
  }, [sorted, posts]);

  const tag = searchParams.get('tag'); 

  useEffect(() => {
    tag ? dispatch(fetchPosts({tag})) : dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch, tag]);

  return (
    <>
      {tag ? <h2>Статьи по тэгу "{tag}"</h2> : <Tabs
        style={{ marginBottom: 15 }}
        value={sorted}
        aria-label="basic tabs example"
      >
        <Tab onClick={() => setSorted(0)} label="Новые" />
        <Tab onClick={() => setSorted(1)} label="Популярные" />
      </Tabs>}
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : filterPosts).map((obj, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl && `http://localhost:4444${obj.imageUrl}`
                }
                user={obj.user}
                createdAt={new Date(obj.createdAt).toLocaleDateString()}
                viewsCount={obj.viewsCount}
                commentsCount={
                  comments.items.filter((com) => com.post === obj._id).length
                }
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={comments.items.slice(-5)}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
