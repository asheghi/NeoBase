import { Box, Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"
import { JsonEditor } from "../../../../../lib/components/JsonEditor";

enum UserType {
    UnAuthenticated = 'unauthenticated',
    Authenticated = 'authenticated',
    WithRole = 'with-role',
    Custom = 'custom'
}

enum PermissionType {
    None = 'none',
    All = 'all',
    Created = 'owner',
    Custom = 'custom',
}

export const RuleItem = (props: {
    item: any,
    onDelete: () => void,
    onUpdate: (newItem: any) => void,
}) => {
    const whichUserType = getUserType(props.item.user);


    const handleNameChange = (e) => {
        const val = e.target.value;
        const newItem = { ...props.item, name: val }
        props.onUpdate(newItem)
    }

    const handleUserTypeChanged = (e) => {
        const newVal = e.target.value;
        const newItem = { ...props.item };

        if (newVal === UserType.UnAuthenticated) {
            newItem.user = null;
        } else if (newVal === UserType.Authenticated) {
            newItem.user = true;
        } else if (newVal === UserType.WithRole) {
            newItem.user = { role: '' };
        } else if (newVal === UserType.Custom) {
            newItem.user = {};
        }

        props.onUpdate(newItem);
    }

    const handleCustomUserChange = (val: any) => {
        const newItem = { ...props.item, user: val };
        props.onUpdate(newItem);
    }


    const handleUserRoleChange = (e) => {
        const val = e.target.value;
        const newItem = { ...props.item, user: { role: val } };
        props.onUpdate(newItem);

    }

    const handleCreateCheckboxChange = (e) => {
        console.log('checked:', e);

        const val = e.target.checked;
        const newItem = { ...props.item, create: val };
        props.onUpdate(newItem);
    }

    const formGroupStyles = {
        display: 'flex',
        justifyItems: 'center',
        alignItems: 'center',
        gap: 1,
    }

    return <Box sx={{
        border: '1px solid rgba(0,0,0,.2)',
        px: 2,
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 1,
        background: 'white',
        zIndex:1,
        maxWidth: '600px'
    }}
    >
        <Box sx={formGroupStyles}>
            <Box>Name:</Box>
            <OutlinedInput sx={{ height: '2.5rem', fontSize: '1.25em' }} onChange={handleNameChange} value={props.item?.name ?? ''} />
            <Box ml={'auto'} />
            <Button variant="outlined" color="warning" onClick={props.onDelete}>Delete Rule</Button>
        </Box>
        <Box sx={{ ...formGroupStyles, alignItems: 'start' }}>
            <Box sx={{ pt: '.5rem' }}>User:</Box>
            <Select sx={{ height: '2.5rem', fontSize: '1.25em' }} onChange={handleUserTypeChanged} value={whichUserType}>
                <MenuItem value={UserType.UnAuthenticated} >All Un-authenticated users</MenuItem>
                <MenuItem value={UserType.Authenticated} >All Authenticated users</MenuItem>
                <MenuItem value={UserType.WithRole}>All Users with Role</MenuItem>
                <MenuItem value={UserType.Custom}>Custom</MenuItem>
            </Select>
            {
                whichUserType === UserType.WithRole &&
                <OutlinedInput sx={{ height: '2.5rem', fontSize: '1.25em' }} onChange={handleUserRoleChange} placeholder="user role" value={props?.item?.user?.role} />
            }
            {
                whichUserType === UserType.Custom &&
                <JsonEditor onChange={handleCustomUserChange} value={props.item.user} />
            }
        </Box>
        <Box sx={formGroupStyles}>
            <FormControlLabel label="Can Create Documents" control={<Checkbox onChange={handleCreateCheckboxChange} checked={props?.item?.create} />} />
        </Box>
        {
            ['read', 'update', 'delete'].map(mode => {
                const permissionType = getPermissionType(props.item[mode])
                const handleUpdatePermissionChange = (e) => {
                    const val = e.target.value;
                    const newItem = { ...props.item };

                    if (val === PermissionType.All) {
                        newItem[mode] = true;
                    } else if (val === PermissionType.None) {
                        newItem[mode] = false;
                    } else if (val === PermissionType.Created) {
                        newItem[mode] = { createdBy: '$uid' };
                    } else if (val === PermissionType.Custom) {
                        newItem[mode] = {};
                    }

                    props.onUpdate(newItem);
                }

                const handleCustomPermissionChange = (val) => {
                    const newItem = { ...props.item, [mode]: val };
                    props.onUpdate(newItem);
                }

                return <>
                    <Box sx={formGroupStyles}>
                        <Box>{mode} Documents:</Box>
                        <Select sx={{ height: '2.5rem', fontSize: '1.25em' }} value={permissionType} onChange={handleUpdatePermissionChange}>
                            <MenuItem value={PermissionType.All}>Can {mode} all Documents</MenuItem>
                            <MenuItem value={PermissionType.None}>Cannot {mode} Documents</MenuItem>
                            <MenuItem value={PermissionType.Created}>Can {mode} Documents created by</MenuItem>
                            <MenuItem value={PermissionType.Custom}>Can {mode} some documents</MenuItem>
                        </Select>

                    </Box>
                    {
                        permissionType === PermissionType.Custom &&
                        <Box sx={{mb:2}}>
                            <JsonEditor onChange={handleCustomPermissionChange} value={props.item[mode]} />
                        </Box>
                    }
                </>
            })
        }
        {/* <pre>{JSON.stringify(props.item, null, 2)}</pre> */}
    </Box>
}

function getUserType(user: any): UserType {
    if (!user) {
        return UserType.UnAuthenticated;
    }

    if (user === true) {
        return UserType.Authenticated;
    }

    if (user && Object.keys(user).includes('role') && Object.keys(user).length === 1) {
        return UserType.WithRole;
    }

    return UserType.Custom;
}


function getPermissionType(value: any): PermissionType {
    if (value === true) {
        return PermissionType.All;
    } else if (value === false) {
        return PermissionType.None
    } else if ((value) && value.createdBy && value.createdBy === '$uid') {
        return PermissionType.Created;
    }
    return PermissionType.Custom;
}