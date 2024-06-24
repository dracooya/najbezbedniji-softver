import {Alert, Snackbar, SnackbarOrigin} from "@mui/material";
import React from "react";

interface SnackBarState extends SnackbarOrigin {
    open: boolean;
}

interface PopupMessageProps {
    open: boolean,
    handleClose: () => void,
    isSuccess: boolean,
    message: string
}

export function PopupMessage({open,handleClose,isSuccess, message} : PopupMessageProps) {
    const [snackBarState] = React.useState<SnackBarState>({
        open: false,
        vertical: 'top',
        horizontal: 'right',
    });
    const {vertical, horizontal} = snackBarState;
    return (
        <>
            <Snackbar
                open={open}
                anchorOrigin={{vertical, horizontal}}
                autoHideDuration={5000}
                onClose={handleClose}
                message={message}>
                <Alert severity={isSuccess ? 'success' : 'error'} onClose={handleClose}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}