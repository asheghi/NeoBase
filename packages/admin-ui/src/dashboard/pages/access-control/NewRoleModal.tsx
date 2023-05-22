import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { INewRoleModalProps } from "./interfaces/INewRoleModalProps";

export const NewRoleModal = (props: INewRoleModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [name, setName] = useState<string>("");

    const inputRef = useRef<HTMLElement>(null);

    // todo fix autofocus bug!
    useEffect(() => {
       if (!inputRef?.current) return;
       setTimeout(() => {
        inputRef.current?.focus();
       },1000)
     }, [props.show]);

    const handleCreate = async () => {
        if (!name) return;
        setLoading(true);
        try {
            await props.container.createRole(name);
            props.onClose();
            setName('')
        } catch (error) {
            setError((error as Error)?.message ?? 'failed to create role')
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleCreate();
        }
      };



    return <Dialog
        open={props.show}
        onClose={props.onClose}
    >
        <DialogTitle>New Role</DialogTitle>
        <DialogContent >
            <Box mt={1}>
                <TextField autoFocus inputRef={inputRef} onKeyDown={handleKeyDown} label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button variant="text" color="info" onClick={props.onClose}>Cancel</Button>
            <Button disabled={loading} variant="contained" color="primary" onClick={handleCreate}>
                {loading ? 'Creating' : 'Create'}
            </Button>
        </DialogActions>
    </Dialog>
}