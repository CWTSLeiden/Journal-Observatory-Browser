import { createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiList: {
            defaultProps: {
                disablePadding: true
            }
        },
        MuiListItem: {
            defaultProps: {
                disablePadding: true
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    padding: 0,
                    margin: 0
                }
            }
        }
    }
})

export default theme
