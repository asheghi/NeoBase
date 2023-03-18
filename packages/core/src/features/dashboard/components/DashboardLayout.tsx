import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BrandLogo from "../assets/logo.svg";
import { manifest } from "../../../lib/manifest";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { dashboardRoutes } from "../dashboard.routes";
import { Link, useNavigate, useHref } from "react-router-dom";
const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
  pageTitle: string;
}

// responsive drawer
export default function DashboardLayout(props: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerItemClicked = (item: { path: string }) => {
    navigate(item.path);
  };

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
        <Typography variant={"h5"}>{manifest.title}</Typography>
      </Box>
      <List>
        {dashboardRoutes
          .filter((it) => !it.hideNav)
          .map((item, index) => {
            const isSelected = item?.path.startsWith(window.location.pathname);
            return (
              <ListItem
                key={item.title}
                disablePadding
                component={Link}
                to={item.path}
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
                  <ListItemText primary={item.title} />
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
  const handleLogoutClicked = () => {
    //
    setAnchorEl(null);
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          minHeight: "4rem",
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
          <Typography variant="h4" noWrap component="div">
            {props.pageTitle}
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
          pt: 6,
          px: 2.5,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
