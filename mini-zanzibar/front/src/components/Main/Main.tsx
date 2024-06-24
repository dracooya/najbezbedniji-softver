import {Box, Button, Chip, Grid, ListItem, Tab, Tabs, TextField, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {UserService} from "../../services/UserService.ts";
import {FileService} from "../../services/FileService.ts";
import {TagInfo} from "../../TagInfo.ts";
import {PopupMessage} from "../PopupMessage/PopupMessage.tsx";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface UploadForm {
    filename: string
}

interface TagForm {
    name: string,
    value: string
}

interface LoginRegistrationProps {
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

const onSubmit: SubmitHandler<UploadForm> = (formData) => {

}

function tabSetup(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export function Main() {
    const [tabValue, setTabTabValue] = React.useState<number>(0);
    const [addedTags, setAddedTags] = React.useState<TagInfo[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [errorPopupOpen, setErrorPopupOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const {register, handleSubmit, formState: {errors}, setValue: setValueName} = useForm<UploadForm>({
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
    const handleTabChange = (_event: React.SyntheticEvent,newValue: number) => setTabTabValue(newValue);

    function upload(formData : UploadForm) {}

    const onAddTag: SubmitHandler<TagForm> = (tagData) => addTag(tagData);

    const handleTagDelete = (chipToDelete: TagInfo) => () => {
        setAddedTags((chips) => chips.filter((chip) => chip.name !== chipToDelete.name));
    };

    const addTag = (data : TagForm) => {
        if (addedTags.filter(chip => chip.name == data.name).length > 0) {
            setErrorMessage("Tag with the specified name already exists!");
            setIsSuccess(false);
            setErrorPopupOpen(true);
            return;
        }
        addedTags.push({name: data.name, value: data.value});
    }

    const handleErrorPopupClose = (reason?: string) => {
        if (reason === 'clickaway') return;
        setErrorPopupOpen(false);
    };

    useEffect(() => {
    }, []);

    return (
        <>
            <Grid container alignItems={'center'} justifyContent={'center'} className={'dark-background'} height={'100%'} width={'100%'}>
                <Grid container item xs={12} sm={12} md={10} lg={8} xl={8}
                      height={'fit-content'}
                      minHeight={'70vh'}
                      className="container rounded-container">
                            <Grid item container xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box sx={{borderBottom: 1, borderColor: 'divider'}} component={'div'}>
                                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="login & sign-up" centered>
                                            <Tab label="Upload" {...tabSetup(0)} />
                                            <Tab label="Uploads" {...tabSetup(1)} />
                                        </Tabs>
                                    </Box>
                                </Grid>
                                <Grid item justifyContent={'center'} xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TabPanel value={tabValue} index={0}>
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
                                                                        type='submit'>{'Upload'}
                                                                </Button>
                                                            </Grid>
                                                    </Grid>
                                                </Grid>
                                            </React.Fragment>
                                        </Grid>
                                    </TabPanel>
                                </Grid>
                            </Grid>
                            <Grid item justifyContent={'center'} xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TabPanel value={tabValue} index={1}>
                                </TabPanel>
                            </Grid>
                </Grid>
            </Grid>
    <PopupMessage message={errorMessage} isSuccess={isSuccess} handleClose={handleErrorPopupClose} open={errorPopupOpen}/>
        </>
    );
}