import { AppBar, Toolbar, Typography } from "@mui/material";
import HeaderTabs from "./HeaderTabs";

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar variant={"regular"}>
          <Typography variant="h4" color="inherit" component="div">
            Application Cost
          </Typography>
        </Toolbar>
      </AppBar>
      <HeaderTabs />
    </>
  );
}

export default App;
