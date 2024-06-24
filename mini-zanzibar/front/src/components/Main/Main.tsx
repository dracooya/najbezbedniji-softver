import {
    Avatar,
    Box, Dialog,
    Grid, IconButton, List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Tabs,
} from "@mui/material";
import React, {useEffect, useRef} from "react";
import {UserService} from "../../services/UserService.ts";
import {FileService} from "../../services/FileService.ts";
import {PopupMessage} from "../PopupMessage/PopupMessage.tsx";
import ShareIcon from '@mui/icons-material/Share';
import ImageIcon from '@mui/icons-material/Image';
import {SharingAccess} from "../SharingAccess/SharingAccess.tsx";
import {UploadOrModify} from "../UploadOrModify/UploadOrModify.tsx";
import EditIcon from '@mui/icons-material/Edit';
import {Post} from "../../models/Post.ts";
import CloseIcon from "@mui/icons-material/Close";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface MainProps {
    userService: UserService,
    fileService: FileService
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            className="height-100"
            aria-labelledby={`tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{p: 3}} component={'div'}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}
function tabSetup(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export function Main({userService, fileService} : MainProps) {
    const [tabValue, setTabTabValue] = React.useState<number>(0);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [errorPopupOpen, setErrorPopupOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [sharingDialogOpen, setSharingDialogOpen] = React.useState<boolean>(false);
    const [editDialogOpen, setEditDialogOpen] = React.useState<boolean>(false);
    const [selectedFileToPreview, setSelectedFileToPreview] = React.useState<Post>(null);
    const [selectedFileToEdit, setSelectedFileToEdit] = React.useState<Post>(null);
    const [uploads, setUploads] = React.useState<Post[]>([]);
    const [shared, setShared] = React.useState<Post[]>([]);
    const shouldLoad = useRef(true);

    const handleTabChange = (_event: React.SyntheticEvent,newValue: number) => setTabTabValue(newValue);

    const handleErrorPopupClose = (reason?: string) => {
        if (reason === 'clickaway') return;
        setErrorPopupOpen(false);
    };

    useEffect(() => {
        if(!shouldLoad.current) return;
        const user = userService.getUser();
        fileService.getUserPosts(user).then(posts => {
            setUploads(posts);
            fileService.getUserSharedPosts(user).then(shares => {
                setShared(shares);
                shouldLoad.current = false;
            })
        });
    }, []);

    return (
        <>
            <Grid container alignItems={'center'} justifyContent={'center'} className={'dark-background'} height={'100%'} width={'100%'}>
                <Grid container item xs={12} sm={12} md={10} lg={8} xl={8}
                      height={'fit-content'}
                      minHeight={'80vh'}
                      className="container rounded-container">
                            <Grid item container xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box sx={{borderBottom: 1, borderColor: 'divider'}} component={'div'}>
                                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="actions" centered>
                                            <Tab label="Upload" {...tabSetup(0)} />
                                            <Tab label="Uploads" {...tabSetup(1)} />
                                            <Tab label="Shared With You" {...tabSetup(2)} />
                                        </Tabs>
                                    </Box>
                                </Grid>
                                <Grid item justifyContent={'center'} xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TabPanel value={tabValue} index={0}>
                                       <UploadOrModify item={null}
                                                       userService={userService}
                                                       fileService={fileService}
                                                       isModify={false}></UploadOrModify>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <Grid item sx={{
                                            height:'60vh',
                                            overflowY:'scroll'
                                        }}>
                                            <List dense={false}>
                                                {uploads.map((upload) => {
                                                    return <ListItem
                                                        secondaryAction={
                                                            <IconButton edge="end" aria-label="share"
                                                                        onClick={() => {
                                                                            setSelectedFileToPreview(upload);
                                                                            setSharingDialogOpen(true);
                                                                        }
                                                                        }>
                                                                <ShareIcon/>
                                                            </IconButton>
                                                        }>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <ImageIcon/>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            onClick={() => {
                                                                setSelectedFileToEdit(upload);
                                                                setEditDialogOpen(true);
                                                            }}
                                                            primary={upload.filename}
                                                        />
                                                    </ListItem>
                                                })}
                                            </List>
                                        </Grid>
                                        <SharingAccess open={sharingDialogOpen}
                                                       handleClose={() => setSharingDialogOpen(false)}
                                                       userService={userService}
                                                       fileService={fileService}
                                                       selectedPost={selectedFileToPreview}
                                        />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2}>
                                        <Grid item sx={{
                                            height:'60vh',
                                            overflowY:'scroll'
                                        }}>
                                            <List dense={false}>
                                                {shared.map((share) => {
                                                    return <ListItem
                                                        secondaryAction={
                                                            <IconButton edge="end" aria-label="edit"
                                                                        onClick={() => {
                                                                            setSelectedFileToEdit(share);
                                                                            setEditDialogOpen(true);
                                                                        }
                                                                        }>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        }>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <ImageIcon/>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={share.filename}
                                                        />
                                                    </ListItem>
                                                })}
                                            </List>
                                            <Grid xs={12} sm={12} md={8} lg={8} xl={8} container className="container rounded-container">
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                </Grid>
                            </Grid>
                </Grid>
            </Grid>
            <Dialog  open={editDialogOpen} >
                <Grid item pl={4} pr={4} pt={2} pb={4} className="container rounded-container">
                    <Grid item container justifyContent={'right'} mb={1}>
                        <IconButton aria-label="close" color="primary" className={'close-button'}
                                    onClick={() => setEditDialogOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <UploadOrModify item={selectedFileToEdit}
                                    userService={userService}
                                    fileService={fileService}
                                    isModify={true}></UploadOrModify>
                </Grid>
            </Dialog>
    <PopupMessage message={errorMessage} isSuccess={isSuccess} handleClose={handleErrorPopupClose} open={errorPopupOpen}/>
        </>
    );
}