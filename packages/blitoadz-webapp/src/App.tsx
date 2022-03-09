import React from "react";
import RoutesWrapper from "./routes";
import { Alert, Snackbar } from "@mui/material";
import { SnackbarErrorContext } from "./contexts/SnackbarErrorContext";
import Box from "@mui/material/Box";
import Header from "./components/Header/Header";

function App() {
  const [snackbarError, setSnackbarError] = React.useState<string | null>(null);

  return (
    <SnackbarErrorContext.Provider
      value={{ error: snackbarError, setError: setSnackbarError }}
    >
      <Box>
        <Header />
        <RoutesWrapper />
      </Box>
      <Snackbar
        open={!!snackbarError}
        autoHideDuration={6000}
        onClose={() => setSnackbarError(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setSnackbarError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarError}
        </Alert>
      </Snackbar>
    </SnackbarErrorContext.Provider>
  );
}

export default App;
