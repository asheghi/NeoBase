import DatabaseIcon from "@mui/icons-material/Storage";
import UsersIcon from "@mui/icons-material/People";
import AccessIcon from "@mui/icons-material/Tune";

export const sideBarItems = [
    {
        label:"Database",
        href:'/dashboard/database',
        icon: DatabaseIcon
    },
    {
        label:"Users",
        href:'/dashboard/users',
        icon: UsersIcon
    },
    {
        label:"Access Control",
        href:'/dashboard/access-control',
        icon: AccessIcon,
    },

]