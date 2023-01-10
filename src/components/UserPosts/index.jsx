import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts, fetchRemovePost } from "../../redux/slices/posts";
import { SideBlock } from "../SideBlock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Clear";

import styles from "./UserPosts.module.scss";

function UserPosts() {
  const { auth } = useSelector((state) => state);
  const { posts } = useSelector((state) => state.posts);

  const dispatch = useDispatch();
  let myPosts = [];

  const isPostLoading = posts.status === "loading";
  const isAuthLoading = auth.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (!isPostLoading && !isAuthLoading) {
    myPosts = posts.items.filter((post) => post.user._id === auth.data._id);
  }

  const onClickRemove = (id) => {
    if (window.confirm("Вы действительно хотите удалить статью?")) {
      dispatch(fetchRemovePost(id));
    }
  };

  return (
    <SideBlock title="Мои статьи">
      <List>
        {(isPostLoading ? [...Array(5)] : myPosts).map((post) => (
          <>
            <ListItem className={styles.post} alignItems="flex-start">
              <Link className={styles.link} to={!isPostLoading && `/posts/${post._id}`}>
                <ListItemAvatar>
                  {isPostLoading ? (
                    <Skeleton variant="square" width={40} height={40} />
                  ) : (
                    <Avatar
                      variant="square"
                      src={`http://localhost:4444${post.imageUrl}`}
                    >
                      P
                    </Avatar>
                  )}
                </ListItemAvatar>
                {isPostLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <ListItemText
                    primary={post.title}
                    secondary={
                      <ul className={styles.tags}>
                        {post.tags.map((name) => (
                          <li key={name}>
                            <span>#{name}</span>
                          </li>
                        ))}
                      </ul>
                    }
                  />
                )}
              </Link>
              {!isPostLoading && (
                <div className={styles.editButtons}>
                  <Link to={`/posts/${post._id}/edit`}>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    onClick={() => onClickRemove(post._id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </ListItem>
            <Divider variant="inset" component="p" />
          </>
        ))}
      </List>
    </SideBlock>
  );
}

export default UserPosts;
