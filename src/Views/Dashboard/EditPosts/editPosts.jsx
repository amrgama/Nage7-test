import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import Select from "Components/Inputs/Select";

import { postServices } from "Services";
import groupServices from "Services/group";

import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { API_ENDPOINT, routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import useQueryService from "Hooks/useQueryService";
import { registerPlugin, FilePond, FileStatus } from "react-filepond";
import filepondPluginFileValidateType from "filepond-plugin-file-validate-type";
import filepondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import filepondPluginImagePreview from "filepond-plugin-image-preview";
import filepondPluginMediaPreview from "filepond-plugin-media-preview";
import "filepond/dist/filepond.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.css";

registerPlugin(
  filepondPluginFileValidateType,
  filepondPluginImageExifOrientation,
  filepondPluginImagePreview,
  filepondPluginMediaPreview
);
const filepondLoading = (status) =>
  [
    FileStatus.LOADING,
    FileStatus.PROCESSING,
    FileStatus.PROCESSING_QUEUED,
  ].includes(status);

const useStyles = makeStyles(styles);

const EditPosts = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const { lang } = useContext(LangContext);
  const { user } = useContext(UserContext);

  const { id } = useParams();

  const navigate = useNavigate();
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });
  const { isLoading: loadingPost } = useQueryService({
    key: ["postServices.getById", id],
    fetcher: () => postServices.getById(id),
    enabled: !!id,
    onSuccess(data) {
      reset({
        privacy: data.privacy,
        text: data.text,
        groups: data.privacy === "GROUPS" ? data.groups : undefined,
      });
      if (data.attachments?.length) {
        setUploading(true);
        setFiles(
          data.attachments.map((attach) => ({
            source: attach.url,
            options: {
              type: "local",
              metadata: {
                type: attach.mimType,
              },
            },
          }))
        );
      }
    },
  });
  const { data: groupsData, isLoading: loadingGroups } = useQueryService({
    key: ["groupServices.getAll", { all: true }],
    fetcher: () => groupServices.getAll({ all: true }),
  });
  const groups = groupsData?.data || [];

  const privacy = watch("privacy");

  const handleEdit = async (values) => {
    setLoading(true);
    console.log("values===>", values);
    const data = values;
    if (values.groups && values.groups.length > 0) {
      data.groups = values.groups.map((v) => v.id);
    } else {
      delete data.groups;
    }
    if (files.length)
      data.attachments = files.map((attach) => ({
        mimType: attach.fileType,
        url: attach.serverId,
      }));
    try {
      const response = await postServices.updateById(id, data);
      if (response.status === 200) {
        navigate(`${routePath}`);
      } else {
        reject(response);
      }
    } catch (error) {
      console.log("error when add posts ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleEdit)}
      spacing={3}
    >
      <Grid item xs={6}>
        <Box display={"flex"} alignItems={"center"}>
          <img
            src={`${API_ENDPOINT}${user.image}`}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
          <Typography variant="h5" mx={2}>
            {user.name}
          </Typography>
        </Box>
      </Grid>

      <Grid
        item
        xs={6}
        className={classes.buttonPostContainer}
        textAlign={"end"}
      >
        <Button
          type="submit"
          disabled={loading}
          variant={loading ? "outlined" : "contained"}
          sx={{ backgroundColor: "#1f5ca9" }}
        >
          {loading ? strings.loading : strings.post}
        </Button>
      </Grid>
      <Grid item xs={12} md={3}>
        <Select
          name={"privacy"}
          control={control}
          labelId={"add-post-type"}
          label={strings.postType}
          fullWidth
        >
          <MenuItem value={"PUBLIC"}>{strings.PUBLIC}</MenuItem>
          <MenuItem value={"MY_STUDENTS"}>{strings.MYSTUDENT}</MenuItem>
          <MenuItem value={"GROUPS"}>{strings.MYGROUPS}</MenuItem>
        </Select>

        {errors.privacy && (
          <Typography variant="subtitle2" className="error_message">
            {errors.privacy.message[lang]}
          </Typography>
        )}
      </Grid>
      {privacy === "GROUPS" && (
        <Grid item xs={12} md={6}>
          <Controller
            name="groups"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                disablePortal
                {...field}
                options={groups}
                multiple
                isOptionEqualToValue={(option, value) =>
                  value?.id === option?.id
                }
                getOptionLabel={(option) => option.name}
                clearOnBlur={false}
                clearOnEscape={false}
                onChange={(e, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    label={strings.groups}
                    fullWidth
                    helperText={error?.message[lang]}
                    error={!!error}
                    {...params}
                  />
                )}
              />
            )}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <TextField
          multiline
          rows={12}
          label={strings.share}
          InputLabelProps={{ shrink: true }}
          placeholder={strings.share}
          fullWidth
          {...register("text")}
        />
      </Grid>
      <Grid item xs={12}>
        <FilePond
          allowImageExifOrientation
          allowImagePreview
          allowMultiple
          allowReorder
          name="image"
          files={files}
          credits={false}
          itemInsertLocation="after"
          onaddfilestart={(file) => {
            setUploading(
              files.some((file) => filepondLoading(file.status)) ||
                filepondLoading(file.status)
            );
          }}
          onprocessfiles={() => {
            setUploading(files.some((file) => filepondLoading(file.status)));
          }}
          onupdatefiles={setFiles}
          onreorderfiles={setFiles}
          acceptedFileTypes={["image/*", "video/*"]}
          server={{
            url: API_ENDPOINT,
            process: {
              url: `/uploader/uploadImage`,
              method: "POST",
              ondata: (data) => {
                const [_, file] = data.getAll("image");
                data.set("image", file);
                return data;
              },
              onload: (response) => {
                const { link } = JSON.parse(response);
                return link;
              },
            },
            load: (source, load, error) => {
              fetch(`${API_ENDPOINT}${source}`)
                .then((res) => res.blob())
                .then(load)
                .catch((err) => error(err.message));
            },
            revert: null,
            fetch: null,
            remove: null,
            restore: null,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} />
    </Grid>
  );
};

export default EditPosts;
