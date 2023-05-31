import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Grid,
  Paper,
  Container,
  CircularProgress,
  Collapse,
  Divider,
  TextField,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";

interface ApplicationsTabProps {
  tabIndex: number;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ tabIndex }) => {
  const [applicationNames, setApplicationNames] = useState<string[]>();
  const [applicationData, setApplicationData] = useState<
    {
      name: string;
      maxCost: number;
      averageCost: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const [open, setOpen] = useState<number[]>([]);

  useEffect(() => {
    //fetch applications whenever search input changes or tab is switched
    fetch("https://engineering-task.elancoapps.com/api/applications")
      .then((response) => response.json())
      .then((data) => {
        //Check if filtered values need to be shown
        if (searchInput === "") setApplicationNames(data);
        else {
          const filteredValues = data.filter((value: string) =>
            value.toLowerCase().includes(searchInput)
          );
          setApplicationNames(filteredValues);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [tabIndex, searchInput]);

  const handleExpand = (index: number, value: string) => {
    //fetch data based on expanded card
    getResourceNameData(value);
    if (open.includes(index)) {
      const expandedIndex = open.filter((element) => {
        return element !== index;
      });
      setOpen(expandedIndex);
    } else {
      const expandedIndex = [...open];
      expandedIndex.push(index);
      setOpen(expandedIndex);
    }
  };

  const getResourceNameData = (resourceName: string) => {
    fetch(
      `https://engineering-task.elancoapps.com/api/applications/${resourceName}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const duplicate = applicationData.some((i) => i.name === resourceName);
        if (!duplicate) {
          const maxCost = Math.max(
            ...data.map((o: { Cost: string }) => Number(o.Cost))
          );

          let sum = 0;

          // calculate sum using forEach() method
          data.forEach((k: { Cost: number }) => {
            sum += Number(k.Cost);
          });

          const average = sum / data.length;

          setApplicationData((current) => [
            ...current,
            { averageCost: average, maxCost: maxCost, name: resourceName },
          ]);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching data:", error);
      });
  };
  const gridData = () => {
    //Show a spinner while data is being fetched
    const applications = loading ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress />
      </div>
    ) : (
      applicationNames &&
      applicationNames.map((value: string, index: any) => (
        <Grid
          item
          xs={4}
          md={12}
          lg={12}
          sx={{ margin: 2, textAlign: "center" }}
        >
          <Paper>
            <IconButton onClick={() => handleExpand(index, value)}>
              {!open.includes(index) ? (
                <KeyboardArrowDown />
              ) : (
                <KeyboardArrowUp />
              )}
              {value}
            </IconButton>

            <Collapse in={open.includes(index)} timeout="auto">
              {applicationData.map(
                (i) =>
                  i.name === value && (
                    <>
                      <Box>{`Maximum Cost:${i?.maxCost}`}</Box>
                      <Divider />
                      <Box>{`Average Cost:${i?.averageCost}`}</Box>
                    </>
                  )
              )}
            </Collapse>
          </Paper>
        </Grid>
      ))
    );
    return applications;
  };

  const onInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchInput(event.target.value);
  };

  return (
    <Container maxWidth="xs">
      <Toolbar>
        <TextField
          id="outlined-basic"
          onChange={onInputChange}
          sx={{ paddingBottom: 5, maxWidth: "100%" }}
          label="Search applications"
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
      <Grid container>{gridData()}</Grid>
    </Container>
  );
};

export default ApplicationsTab;
