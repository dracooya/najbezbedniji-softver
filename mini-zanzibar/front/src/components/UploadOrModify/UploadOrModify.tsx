import {Button, Chip, Grid, ListItem, TextField} from "@mui/material";
import React, {useEffect} from "react";
import {Post} from "../../models/Post.ts";
import {FileService} from "../../services/FileService.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {TagInfo} from "../../models/TagInfo.ts";
import {PopupMessage} from "../PopupMessage/PopupMessage.tsx";

interface UploadProps  {
    item: Post | null,
    fileService: FileService,
    isModify: boolean,
}

interface UploadForm {
    filename: string
}

interface TagForm {
    name: string,
    value: string
}

export function UploadOrModify({item,fileService,isModify} : UploadProps) {
    const [addedTags, setAddedTags] = React.useState<TagInfo[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [errorPopupOpen, setErrorPopupOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const {register, handleSubmit, setValue, formState: {errors}} = useForm<UploadForm>({
        defaultValues: {
            filename: ""
        },
        mode: "onChange"
    });

    const {register: registerTag, handleSubmit: handleSubmitTag, formState: {errors: errorsTag},setValue: setValueTag} = useForm<TagForm>({
        defaultValues: {
            name: "",
            value: ""
        },
        mode: "onSubmit"
    });
    const onSubmit: SubmitHandler<UploadForm> = (formData) => {upload(formData)}
    function upload(formData : UploadForm) {
        const post: Post = {
            filename: formData.filename,
            tags: addedTags
        }
        if (!isModify) {
            fileService.addNewPost(post).then(() => {
                setErrorMessage("Successfully added a new post!");
                setIsSuccess(true);
                setErrorPopupOpen(true);
                window.location.reload();
            }).catch((error) => {
                setErrorMessage(error.response.data);
                setIsSuccess(false);
                setErrorPopupOpen(true);
            })
        } else {
            fileService.modifyPost(post).then(() => {
                setErrorMessage("Successfully edited the post!");
                setIsSuccess(true);
                setErrorPopupOpen(true);
                window.location.reload();
            }).catch((error) => {
                setErrorMessage(error.response.data);
                setIsSuccess(false);
                setErrorPopupOpen(true);
            })
        }
    }
    const addTag = (data : TagForm) => {
        if (addedTags.filter(chip => chip.name == data.name).length > 0) {
            setErrorMessage("Tag with the specified name already exists!");
            setIsSuccess(false);
            setErrorPopupOpen(true);
            return;
        }
        addedTags.push({name: data.name, value: data.value});
    }
    const onAddTag: SubmitHandler<TagForm> = (tagData) => addTag(tagData);

    const handleTagDelete = (chipToDelete: TagInfo) => () => {
        setAddedTags((chips) => chips.filter((chip) => chip.name !== chipToDelete.name));
    };

    const handleErrorPopupClose = (reason?: string) => {
        if (reason === 'clickaway') return;
        setErrorPopupOpen(false);
    };

    useEffect(() => {
        if (isModify) {
            setAddedTags(item!.tags);
            setValue("filename", item!.filename);
        }
    }, [item, isModify])

    return (
        <>
            <Grid item>
                <React.Fragment>
                    <form id="mainForm" onSubmit={handleSubmit(onSubmit)}></form>
                    <Grid container  rowSpacing={3} columnSpacing={3}>
                        <Grid item container xs={12} sm={12} md={12} lg={12} xl={12} alignItems={'flex-start'}
                              rowSpacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField id="filename"
                                           fullWidth={true}
                                           type="text"
                                           label='File name'
                                           inputProps={{
                                               form: 'uploadForm'
                                           }}
                                           {...register("filename",
                                               {required: "File name is a required field!"})}
                                           error={!!errors.filename}
                                           helperText={errors.filename ? errors.filename?.message : "Required"}
                                           variant="outlined"/>
                            </Grid>
                            <Grid item container xs={12} sm={12} md={12} lg={12} xl={12}
                                  direction={'row'}>
                                <form
                                    id={'tagForm'} onSubmit={handleSubmitTag(onAddTag)}></form>
                                <Grid item container xs={12} sm={12} md={12} xl={12} lg={12}
                                      rowSpacing={2} columnSpacing={2}>
                                    <Grid item xs={12} sm={6} md={6} xl={6} lg={6}>
                                        <TextField id="tag-name" label="Tag name"
                                                   type="text"
                                                   fullWidth={true}
                                                   inputProps={{
                                                       form: 'tagForm'
                                                   }}
                                                   {...registerTag("name",
                                                       {required: "Tag name must not be empty!"})}
                                                   error={!!errorsTag.name}
                                                   helperText={errorsTag.name ? errorsTag.name?.message : "Required if adding tag"}
                                                   variant="outlined"/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} xl={6} lg={6}>
                                        <TextField id="tag-value" label="Tag value"
                                                   type="text"
                                                   inputProps={{
                                                       form: 'tagForm'
                                                   }}
                                                   fullWidth={true}
                                                   {...registerTag("value",
                                                       {required: "Tag value must not be empty!"})}
                                                   error={!!errorsTag.value}
                                                   helperText={errorsTag.value ? errorsTag.value?.message : "Required if adding tag"}
                                                   variant="outlined"/>
                                    </Grid>
                                    <Grid item container xs={12} sm={12} md={12} lg={12} xl={12}
                                          justifyContent={'center'} mt={2} mb={2}>
                                        <Button color="secondary" variant="contained"
                                                form={'tagForm'}
                                                type={'submit'}>Add tag</Button>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid  item container xs={12} sm={12} md={12} lg={12} xl={12} mb={4}
                                   sx={{border: '1px solid gray',
                                       borderRadius: '1em',
                                       boxShadow: 'none',
                                       height:'15vh',
                                       display:'flex',
                                       flexDirection:'row',
                                       alignItems:'flex-start',
                                       alignContent:'flex-start',
                                       overflowY:'scroll',
                                       overflowX:'hidden',
                                       listStyle: 'none'}}>

                                {addedTags.map((data) => {
                                    return (
                                        <ListItem key={data.name} sx={{width:'fit-content'}}>
                                            <Chip
                                                label={data.name + ":" + data.value}
                                                onDelete={handleTagDelete(data)}
                                            />
                                        </ListItem>
                                    )
                                })}
                            </Grid>
                        </Grid>
                        <Grid item
                              xs={12} sm={12} md={12} lg={12} xl={12}
                              container
                              justifyContent='center'>
                            <Grid item>
                                <Button color="primary"
                                        form='mainForm'
                                        variant="contained"
                                        type='submit'>{isModify? 'Edit' : 'Upload'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </React.Fragment>
            </Grid>
            <PopupMessage message={errorMessage} isSuccess={isSuccess} handleClose={handleErrorPopupClose} open={errorPopupOpen}/>
        </>
    );
}