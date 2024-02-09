// https://mui.com/material-ui/customization/color/

// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#f0543c',
//         },
//         secondary: {
//             main: '#f4511e',
//         }
//     }
// });

// export default theme;


import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#f0543c',
        },
        secondary: {
            main: '#f4511e',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif', // Add Poppins font for the whole website
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    // borderRadius: 15, // Set border radius to 30px for TextField
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a bit of drop shadow
                    
                },
            },
        },
    },
});

export default theme;
