import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BrandLogo from "../../../public/logo.svg";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { routes, usePageTitle } from "../routes";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { sideBarItems } from "../sideBarItems";
import { usePageContext } from "../../lib";
import { useClient } from "../../lib/client";
const drawerWidth = 240;

interface Props {
  pageTitle?: string;
}

// responsive drawer
export default function DashboardLayout(props: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const pageTitle = usePageTitle();
  const client = useClient();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerItemClicked = (item: { href: string }) => {
    navigate(item.href);
  };

  const pageContext = usePageContext();

  const drawer = (
    <Box
      sx={{
        bgcolor: "primary.dark",
        height: "100%",
        color: "white",
        borderRightColor: "red",
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={3}
        sx={{
          px: 2,
          py: 2,
        }}
      >
        <img style={{ height: "1.5rem" }} src={BrandLogo} />
        <Typography variant={"h5"}>{pageContext?.manifest?.title}</Typography>
      </Box>
      <List>
        {sideBarItems
          .map((item, index) => {
            const isSelected = item?.href.startsWith(window.location.pathname);
            return (
              <ListItem
                key={item.label + index}
                disablePadding
                component={Link}
                to={item.href}
                sx={{
                  color: "white",
                }}
              >
                <ListItemButton
                  onClick={() => handleDrawerItemClicked(item)}
                  selected={isSelected}
                >
                  <ListItemIcon>
                    <item.icon
                      sx={{
                        color: "white",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );

  const handleProfileClicked = () => {
    setAnchorEl(null);
    //
  };
  const handleLogoutClicked = async () => {
    //
    setAnchorEl(null);
    await client.Auth.logout();
    window.location.href = '/login/'
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", height: '100%' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        color={"transparent"}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ textTransform: 'capitalize' }}>
            {pageTitle}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              ml: "auto",
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
          >
            <MenuItem onClick={handleProfileClicked}>Profile</MenuItem>
            <MenuItem onClick={handleLogoutClicked}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            borderRightColor: "primary.dark",
          }}
          color={"primary"}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRightColor: "primary.dark",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          pt: 7,
          px: 2.5,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
