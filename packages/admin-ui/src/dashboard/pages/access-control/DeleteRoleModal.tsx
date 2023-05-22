import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { IDeleteRoleModalProps } from "./interfaces/IDeleteRoleModalProps";

export const DeleteRoleModal = (props: IDeleteRoleModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await props.container.deleteRole(props.role);
            props.onClose();
        } catch (error) {
            setError((error as Error)?.message ?? 'failed to delete role')
        } finally {
            setLoading(false);
        }
    }

    return <Dialog
        open={props.show}
        onClose={props.onClose}
    >
        <DialogTitle>New Role</DialogTitle>
        <DialogContent >
            <Box mt={1}>
                Are you sure you want to delete <b>{props.role.name}</b> role?
            </Box>
        </DialogContent>
        <DialogActions>
            <Button variant="text" color="info" onClick={props.onClose}>Cancel</Button>
            <Button disabled={loading} variant="contained" color="error" onClick={handleDelete}>
                {loading ? 'Deleting' : 'Delete'}
            </Button>
        </DialogActions>
    </Dialog>
}