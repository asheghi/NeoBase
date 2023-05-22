import { Box, Checkbox, CircularProgress, FormControlLabel, FormGroup, IconButton } from "@mui/material";
import { IPermissionItemProps } from "./interfaces/IPermissionItemProps";
import { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { Opacity } from "@mui/icons-material";

export function PermissionItem(props: IPermissionItemProps) {
  const selected = props.parentRole.permissions?.find(it => {
    return it.resource === props.permission.resource && it.action === props.permission.action
  })?.enabled;
  const isExtraPermission = !props.container.permissions.find(
    it => {
      return it.resource === props.permission.resource && it.action === props.permission.action
    }
  )

  const [loading, setLoading] = useState(false);

  const label = <Box display='flex' alignItems={'center'} gap={1} >
    <Box textTransform={'capitalize'}>{props.permission.resource.replaceAll('-', ' ')}</Box>
    <ArrowForwardIcon />
    <Box textTransform={'capitalize'}>{props.permission.action}</Box>
  </Box>

  async function handleChange(e: any, checked: boolean): Promise<void> {
    setLoading(true);
    try {
      if (selected) {
        await props.container.disablePermission(props.parentRole._id, props.permission);
      } else {
        await props.container.enablePermission(props.parentRole._id, props.permission);
      }
    } catch (error) {

    }
    finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
        await props.container.deletePermission(props.parentRole._id, props.permission);
    } catch (error) {
      
    }
  }

  const control = loading ? <CircularProgress size={24} /> : <Checkbox sx={{ width: 24, height: 24 }} checked={selected} onChange={handleChange} />;
  return (
    <Box display="flex" py={1} px={1}

      sx={{
        "& .deleteIcon": {
          opacity: '0',
          pointerEvents: 'none',
        },
        "&:hover": {
          backgroundColor:(theme) => theme.palette.grey[300],
          "& .deleteIcon": {
            pointerEvents: 'auto',
            opacity: '1',
          },
        }
      }}
    >
      <FormGroup sx={{ m: 0, ".MuiFormControlLabel-label": { mx: 1 } }}>
        <FormControlLabel sx={{ m: 0 }} disabled={loading} control={control} label={label} />
      </FormGroup>
      <Box ml="auto" />
      {isExtraPermission && <DeleteIcon onClick={handleDelete} color="error" className="deleteIcon" /> }
    </Box>
  );
}
