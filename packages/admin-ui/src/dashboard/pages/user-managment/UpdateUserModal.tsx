import { Box, Button, Modal, TextField } from "@mui/material"
import { useState } from "react"

export const UpdateUserModal = (props: {
  isOpen: boolean,
  onClose: () => void,
  onSave: (updatedUser: any) => void,
  user: any,
}) => {
  const [isAdvanced, setIsAdvanced] = useState();
  const [editState, setEditState] = useState(props.user);
  const [roleInput, setRoleInput] = useState(props.user.role ?? "");

  const hasChanged = JSON.stringify(props.user) !== JSON.stringify(editState);

  const handleRoleChange = (e: any) => {
    const role = e.target.value;
    setRoleInput(role);
    setEditState({ ...editState, role });
  }

  const handleSave = () => {
    props.onSave(editState);
    props.onClose();
  }

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

  return <Modal onClose={props.onClose} open={props.isOpen}>
    <Box sx={modalStyle}>
      <Box>Update User (#{props.user._id})</Box>
      <TextField label="Role" value={roleInput} onChange={handleRoleChange} />
      <Button
        variant="contained"
        color="success"
        disabled={!hasChanged}
        onClick={handleSave}
      >
        Save
      </Button>
    </Box>
  </Modal>
}