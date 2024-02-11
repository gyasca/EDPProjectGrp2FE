import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, List } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import StoreIcon from '@mui/icons-material/Store';
import SupportIcon from '@mui/icons-material/Support';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ArticleIcon from '@mui/icons-material/Article';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ForumIcon from '@mui/icons-material/Forum';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { Add, AddLocation, Category, CurrencyExchange, DirectionsBike, Explore, Home, HowToReg, Map, NoCrash, Person, PersonAdd, Place, RequestPage } from '@mui/icons-material';


function AdminNavList() {
    const [usersOpen, setUsersOpen] = React.useState(false);
    // lines can be replaced with your own relevant feature names. this is just
    // to handle the collapsing and opening of side bar.
    const [forumsOpen, setForumsOpen] = React.useState(false);
    const [bicyclesOpen, setBicyclesOpen] = React.useState(false);
    const [locationsOpen, setLocationsOpen] = React.useState(false);
    const [requestsOpen, setRequestsOpen] = React.useState(false);
    const [shopOpen, setShopOpen] = React.useState(false);
    const [supportOpen, setSupportOpen] = React.useState(false);

    const handleClickUsers = () => {
        setUsersOpen(!usersOpen);
    };

    const handleClickForums = () => {
        setForumsOpen(!forumsOpen);
    };

    // const handleClickBicycles = () => {
    //     setBicyclesOpen(!bicyclesOpen);
    // };

    // const handleClickLocations = () => {
    //     setLocationsOpen(!locationsOpen);
    // };

    // const handleClickRequests = () => {
    //     setRequestsOpen(!requestsOpen);
    // };

    // const handleClickShop = () => {
    //     setShopOpen(!shopOpen);
    // };

    // const handleClickSupport = () => {
    //     setSupportOpen(!supportOpen);
    // };

    return (
        <>
            <ListItem key={"Home"} disablePadding>
                <ListItemButton component={Link} to="/admin/home">
                    <ListItemIcon><Home /></ListItemIcon>
                    <ListItemText primary={"Home"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Users"} disablePadding>
                <ListItemButton onClick={handleClickUsers}>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary={"Users"} />
                    {usersOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={usersOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem key={"ViewUsers"} disablePadding>
                        <ListItemButton component={Link} to="/admin/users/allusers">
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary={"View Users"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"CreateUser"} disablePadding>
                        <ListItemButton component={Link} to="/admin/users/create">
                            <ListItemIcon><PersonAdd /></ListItemIcon>
                            <ListItemText primary={"Create User"} />
                        </ListItemButton>
                    </ListItem>
                    {/* <ListItem key={"EditUser"} disablePadding>
                        <ListItemButton component={Link} to="/admin/users/edit/:id">
                            <ListItemIcon><PersonAdd /></ListItemIcon>
                            <ListItemText primary={"Edit User"} />
                        </ListItemButton>
                    </ListItem> */}
                </List>
            </Collapse>

            {/* Example only. can be changed to ur own feature. */}
            <ListItem key={"Forums"} disablePadding>
                <ListItemButton onClick={handleClickForums}>
                    <ListItemIcon><ForumIcon /></ListItemIcon>
                    <ListItemText primary={"Forums"} />
                    {forumsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={forumsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem key={"ViewAllPosts"} disablePadding>
                        <ListItemButton component={Link} to="/admin/driver/viewdriverapplications">
                            <ListItemIcon><DensitySmallIcon /></ListItemIcon>
                            <ListItemText primary={"View All Forum Posts"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"ViewQuestions"} disablePadding>
                        <ListItemButton component={Link} to="/admin/driver/viewdrivers">
                            <ListItemIcon><ContactSupportIcon /></ListItemIcon>
                            <ListItemText primary={"View Questions"} />
                        </ListItemButton>
                    </ListItem>
                    {/* Add more here for more sublist items */}
                </List>
            </Collapse>
        </>
    );
}

export default AdminNavList;
