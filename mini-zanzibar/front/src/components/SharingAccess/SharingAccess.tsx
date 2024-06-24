import {FileService} from "../../services/FileService.ts";
import React, {useEffect} from "react";
import {
    Button, Dialog,
    FormControl, FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText, Radio,
    RadioGroup,
    TextField, Typography
} from "@mui/material";
import {useForm} from "react-hook-form";
import {ShareAccess} from "../../models/ShareAccess.ts";
import CloseIcon from '@mui/icons-material/Close';
import {PopupMessage} from "../PopupMessage/PopupMessage.tsx";
import {Post} from "../../models/Post.ts";

interface SharingAccessProps {
    open: boolean,
    handleClose: () => void,
    fileService: FileService,
    selectedPost: Post | null
}

interface UserForm {
    username: string,
}
export function SharingAccess({open,handleClose,fileService,selectedPost} : SharingAccessProps) {

    const [usersList, setUsersList] = React.useState<string[]>([]);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [errorPopupOpen, setErrorPopupOpen] = React.useState<boolean>(false);
    const [accessRights, setAccessRights] = React.useState<string>("viewer");
    const [description, setDescription] = React.useState<string>(
        "User will only be able to see this picture and it's information.")
    const [isSuccess, setIsSuccess] = React.useState(false);
    const {register, handleSubmit, getValues,setValue, formState: {errors}} = useForm<UserForm>({
        defaultValues: {
            username: "",
        },
        mode: "onChange"
    });


    const handleOnAccessRightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccessRights((event.target as HTMLInputElement).value);
    }


    const removeUser = (userToDelete : string) => {
        setUsersList(usersList.filter((u) => u !== userToDelete));
    }

    const shareAccess = () => {
        usersList.forEach((user, index) => {
            const shareAccess: ShareAccess = {
                user: user,
                relation: accessRights,
                object: "doc:" + selectedPost?.id
            }
            fileService.addShareAccess(shareAccess).then(() => {
                window.location.reload();
            }).catch((error) => {
                console.log(error)
                setErrorMessage(error.response.data);
                setIsSuccess(false);
                setErrorPopupOpen(true);
            })
        })
    }

    useEffect(() => {
        if (accessRights == "viewer")
            setDescription("User will only be able to see this picture and it's information.")
        else
            setDescription("User will be able to see this picture, as well as modify it's name and tags.")
    }, [accessRights])

    useEffect(() => {
        setAccessRights('viewer');
    }, [selectedPost])


    return (
        <>
            <Dialog onClose={handleClose} open={open} fullWidth={true}>
                <Grid container justifyContent={'center'}
                      alignItems={'center'}
                      p={3}
                      rowSpacing={3}
                      direction={'column'}>
                    <IconButton aria-label="close" color="primary" className={'close-button'}
                                onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>
                    <Grid container item sx={{width: '100%', position: 'relative'}}>
                        <Grid item container xs={9} sm={9} md={9} lg={9} xl={9}>
                        <TextField id="username"
                                   label="Username"
                                   fullWidth={true}
                                   {...register("username",
                                       {
                                           required: "Username is a required field!",
                                       })}
                                   error={!!errors.username}
                                   helperText={errors.username? errors.username?.message : "Required"}
                        />
                        </Grid>
                        <Grid xs={3} sm={3} md={3} lg={3} xl={3} container justifyContent={'center'} pt={1.3} alignItems={'flex-start'}>
                            <Button variant="contained" onClick={() => {
                                if (usersList.filter(user => user == getValues("username")).length == 0) {
                                    setUsersList(prevState => [...prevState, getValues("username")])
                                }
                                setValue("username","");
                            }} sx={{height:'min-content'}}>Add</Button>
                        </Grid>
                    </Grid>
                    <Grid item sx={{width: '100%'}}>
                        <List dense={false} sx={{
                            height:'30vh',
                            overflowY: 'scroll',
                            border: '1px solid antiquewhite',
                            borderRadius: '1em',
                        }}>
                            {usersList.map((item) => (
                                <ListItem key={item}
                                          secondaryAction={
                                              <IconButton edge="end" aria-label="remove"
                                                          onClick={() => removeUser(item)}>
                                                  <CloseIcon/>
                                              </IconButton>
                                          }>
                                    <ListItemText
                                        primary={item}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item container direction={'column'} justifyContent={'center'} alignItems={'center'}>
                        <FormControl sx={{textAlign: 'center'}}>
                            <FormLabel>Access rights</FormLabel>
                            <RadioGroup
                                defaultValue="viewer"
                                row
                                value={accessRights}
                                onChange={handleOnAccessRightChange}
                                name="radio-buttons-group">
                                <FormControlLabel value="viewer" control={<Radio/>} label="Viewer"/>
                                <FormControlLabel value="editor" control={<Radio/>} label="Editor"/>
                            </RadioGroup>
                        </FormControl>
                        <Typography mt={3} textAlign={'center'}>{description}</Typography>
                    </Grid>
                </Grid>
                <Grid item mt={2} mb={3} container justifyContent={'center'}>
                    <Button variant="contained" onClick={shareAccess}>Confirm</Button>
                </Grid>
            </Dialog>
            <PopupMessage message={errorMessage} isSuccess={isSuccess} handleClose={() => setErrorPopupOpen(false)} open={errorPopupOpen}/>
        </>
    );
}