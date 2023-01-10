import React, { useRef, useEffect } from "react";
import styles from "./Profile.module.scss";
import {
  Backdrop,
  Button,
  Fade,
  Modal,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserPosts from "../../components/UserPosts";
import { useState } from "react";
import axios from "../../axios";
import { updateProfileInfo } from "../../redux/slices/auth";
import { Box } from "@mui/system";

const style = {
  position: "absolute",
  top: "200px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 0.5,
  boxShadow: 24,
  p: 4,
};

function Profile() {
  const [fullName, setFullName] = useState();
  const [avatarUrl, setAvatarUrl] = useState();
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputFileRef = useRef(null);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state);
  const isAuthLoading = auth.status === "loading";

  useEffect(() => {
    if (!isAuthLoading) {
      setAvatarUrl(auth.data.avatarUrl);
      setFullName(auth.data.fullName);
    }
  }, [auth, isAuthLoading]);

  if (!window.localStorage.getItem("token") && !auth.data) {
    return <Navigate to="/" />;
  }

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setAvatarUrl(data.url);
      setIsChange(true);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузке файла");
    }
  };

  const handleChangeFullName = (event) => {
    setFullName(event.target.value);
    setIsChange(true);
  };

  const saveChange = async () => {
    try {
      setIsLoading(true);
      const fields = {
        avatarUrl,
        fullName,
      };
      const updateUser = await axios.patch(`/auth/me/${auth.data._id}`, fields);
      dispatch(
        updateProfileInfo({
          ...updateUser.data,
          avatarUrl: avatarUrl,
          fullName,
        })
      );
      setIsLoading(false);
      setIsChange(false);
      alert("Данные профиля успешно обновлены!");
    } catch (error) {
      alert("Ошибка при обновлении данных прфиля");
    }
  };

  return (
    <Paper style={{ padding: 30 }}>
      <div className={styles.profileTop}>
        {isAuthLoading ? (
          <div className={styles.avatarSkelet}>
            <img src="/noava.png" alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Skeleton variant="text" height={25} width={120} />
              <Skeleton variant="text" height={18} width={230} />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.avatar}>
              {avatarUrl ? (
                <img src={`http://localhost:4444${avatarUrl}`} alt="" />
              ) : (
                <img src="/noava.png" alt="" />
              )}
              <div className={styles.avatarInput}>
                <Button
                  onClick={() => inputFileRef.current.click()}
                  variant="outlined"
                  size="large"
                >
                  {avatarUrl ? "Изменить аватар" : "Добавить аватар"}
                </Button>
                <input
                  ref={inputFileRef}
                  type="file"
                  onChange={handleChangeFile}
                  hidden
                />
              </div>
            </div>
            <div className={styles.userInfo}>
              <h3>
                {fullName} <p className={styles.nameChangeButton} onClick={handleOpen}>Изменить</p>
              </h3>
              <p>{auth.data.email}</p>
              <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <div in={open}>
                  <Box sx={style}>
                    <div className={styles.modalContent}>
                      <button className={styles.closeButton} onClick={handleClose} >
                      ✖
                      </button>
                      <h3>Изменить имя</h3>
                      <input
                        type="text"
                        value={fullName}
                        onChange={handleChangeFullName}
                      />
                      <Button onClick={handleClose} variant="contained">
                        Готово
                      </Button>
                    </div>
                  </Box>
                </div>
              </Modal>
            </div>
            {isChange && (
              <Button
                className={styles.saveButton}
                onClick={saveChange}
                variant="contained"
                size="large"
                disabled={isLoading}
              >
                Сохранить изменнения
              </Button>
            )}
          </>
        )}
      </div>
      <UserPosts userId={auth.data} isAuthLoading={isAuthLoading} />
    </Paper>
  );
}

export default Profile;
