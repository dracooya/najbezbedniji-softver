import {Button, Grid, TextField, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {UserService} from "../../services/UserService.ts";

interface LoginForm {
    username: string,
}

interface LoginProps {
    userService: UserService
}
export function Login({userService} : LoginProps) {
    const navigate = useNavigate();


    const onSubmit = (formData: LoginForm) => tryLogin(formData)
    const {register, handleSubmit, formState: {errors}} = useForm<LoginForm>({
        defaultValues: {
            username: "",
        },
        mode: "onChange"
    });

    function tryLogin(formData : LoginForm) {
        userService.loginUser(formData.username);
        navigate('/main');
    }

    return (
        <>
            <Grid container alignItems={'center'} justifyContent={'center'} className={'dark-background'} height={'100%'}>
                <Grid container item xs={12} sm={12} md={10} lg={8} xl={8}
                      height={'fit-content'}
                      minHeight={'70vh'}
                      className="container rounded-container">
                      <Grid item container xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid item justifyContent={'center'} xs={12} sm={12} md={12} lg={12} xl={12} >
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container
                                          item
                                          xs={12} sm={12} md={12} lg={12} xl={12}
                                          direction={'row'}
                                          justifyContent={"center"}>
                                        <Grid item container rowSpacing={3}>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <Typography variant="h2" mb={10} mt={5} fontWeight={400}>Login</Typography>
                                            </Grid>
                                            <Grid item container xs={12} sm={12} md={12} lg={12} xl={12}
                                                  justifyContent={'center'}>
                                                <Grid item xs={12} sm={12} md={8} lg={8} xl={6}>
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
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={10}>
                                                <Button variant="contained" type="submit">Login</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}