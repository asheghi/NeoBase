import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";

export const NewUserModal = (props: { isModalOpen: boolean, onClose: () => void, createUser: (payload: any) => void }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [role, setRole] = useState();

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 4,
    };

    const handleCreate = () => {
        const payload = {
            username,
            password,
            role,
        }
        props.createUser(payload);
        props.onClose();
    }

    return <Modal
        open={props.isModalOpen}
        onClose={props.onClose}
    >
        <Box
            sx={modalStyle}>
            <TextField label="username" value={username} onChange={(e: any) => setUsername(e?.target?.value)} />
            <TextField label="password" value={password} onChange={(e: any) => setPassword(e?.target?.value)} />
            <TextField label="role" value={role} onChange={(e: any) => setRole(e?.target?.value)} />
            <Button variant="contained" size="large" onClick={handleCreate}>Create</Button>
        </Box>
    </Modal>
}