import { createTheme } from "@mui/material";
import { amber, cyan, green, indigo, purple, red, teal, yellow } from "@mui/material/colors";
import { colors_override } from "../config";

export type customColor = 
    "custom1" |
    "custom2" |
    "custom3" |
    "custom4" |
    "custom5" |
    "custom6" |
    "custom7" |
    "custom8"

export const colorize = (name: string): customColor => {
    const lookup = colors_override[name]
    if (lookup) { return lookup }
    const colors: customColor[] = ["custom1", "custom2", "custom3", "custom4", "custom5", "custom6", "custom7", "custom8"]
    const index = [...name, "0"].map(c => c.charCodeAt(0)).reduce((a, b) => a + b)
    return colors[index % 8]
}

declare module "@mui/material/styles" {
    interface Palette {
        custom1: Palette['primary'];
        custom2: Palette['primary'];
        custom3: Palette['primary'];
        custom4: Palette['primary'];
        custom5: Palette['primary'];
        custom6: Palette['primary'];
        custom7: Palette['primary'];
        custom8: Palette['primary'];
    }
    interface PaletteOptions {
        custom1: PaletteOptions['primary'];
        custom2: PaletteOptions['primary'];
        custom3: PaletteOptions['primary'];
        custom4: PaletteOptions['primary'];
        custom5: PaletteOptions['primary'];
        custom6: PaletteOptions['primary'];
        custom7: PaletteOptions['primary'];
        custom8: PaletteOptions['primary'];
    }
}

declare module "@mui/material/Badge" {
    interface BadgePropsColorOverrides {
        custom1: true;
        custom2: true;
        custom3: true;
        custom4: true;
        custom5: true;
        custom6: true;
        custom7: true;
        custom8: true;
    }
}
declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        custom1: true;
        custom2: true;
        custom3: true;
        custom4: true;
        custom5: true;
        custom6: true;
        custom7: true;
        custom8: true;
    }
}

const theme = createTheme({
    palette: {
        custom1: {
            main: red[500],
            contrastText: '#fff'
        },
        custom2: {
            main: indigo[500],
            contrastText: '#fff'
        },
        custom3: {
            main: teal[500],
            contrastText: '#fff'
        },
        custom4: {
            main: amber[500],
            contrastText: '#000'
        },
        custom5: {
            main: purple[500],
            contrastText: '#fff'
        },
        custom6: {
            main: green[500],
            contrastText: '#000'
        },
        custom7: {
            main: cyan[500],
            contrastText: '#000'
        },
        custom8: {
            main: yellow[500],
            contrastText: '#000'
        }
    },
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
