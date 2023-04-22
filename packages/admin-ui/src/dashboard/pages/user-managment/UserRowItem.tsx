import { Box, Button, TableCell, TableRow } from "@mui/material"
import { useState } from "react"
import { UpdateUserModal } from "./UpdateUserModal";

export const UserRowItem = (props: {
    item: any,
    onRoleUpdate: (role: string) => void,
    onDelete: () => void
    onUpdate: (uid: string, payload: any) => void,
}) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const handleEditClicked = () => {
        setEditModalOpen(true);
    }
    const handleEditModalClose = () => {
        setEditModalOpen(false);
    }
    const handleUserUpdate = (payload: any) => {
        props.onUpdate(props.item._id, payload);
    }

    return (
        <>
            <TableRow
                key={props.item._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell>
                    {props.item.username}
                </TableCell>
                <TableCell>
                    {props.item.role}
                </TableCell>
                <TableCell>
                    {props.item.createdAt}
                </TableCell>
                <TableCell>
                    {props.item._id}
                </TableCell>
                <TableCell>
                    <Box display="flex" gap={2}>
                        <Button
                            onClick={handleEditClicked}
                            color="info"
                            variant="outlined"
                        >
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={props.onDelete}>
                            Delete
                        </Button>
                    </Box>
                </TableCell>
            </TableRow>
            <UpdateUserModal
                isOpen={isEditModalOpen}
                user={props.item}
                onClose={handleEditModalClose}
                onSave={handleUserUpdate} />
        </>
    )
}