import { Button, TableCell, TableRow } from "@mui/material"

export const UserRowItem = (props: {
    item: any,
    onRoleUpdate: (role: string) => void,
    onDelete: () => void
}) => {
    return (
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
                <Button
                    variant="contained"
                    color="warning"
                    onClick={props.onDelete}>
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    )
}