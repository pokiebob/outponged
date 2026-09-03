import { css } from "@emotion/css";
import { useTheme } from "@mui/material/styles";

/**
 * Small compatibility helper for the app's existing JSS-style objects.
 * It keeps the styles colocated with their components without depending on
 * Material UI's deprecated legacy styling package.
 */
export const makeStyles = (stylesOrCreator) => () => {
  const theme = useTheme();
  const styles =
    typeof stylesOrCreator === "function"
      ? stylesOrCreator(theme)
      : stylesOrCreator;

  return Object.fromEntries(
    Object.entries(styles).map(([name, rules]) => [name, css(rules)])
  );
};
