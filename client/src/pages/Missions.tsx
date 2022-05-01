import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Toolbar,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { ListMenu } from "../components/ListMenu";

type SortField = "Title" | "Date";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}

const getMissions = async (
  sortField: SortField,
  sortDesc?: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
  {
    Missions(
      sort: {
        field: ${sortField}
      }
    ) {
      id
      title
      operator
      launch {
        date
      }
    }
  }
  `,
    []
  );
};

const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [errMessage, setErrMessage] = useState<String | null>(null);

  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };

  const handleNewMissionOpen = () => {
    setTempLaunchDate(null);
    setNewMissionOpen(true);
  };

  const handleNewMissionClose = () => {
    setNewMissionOpen(false);
  };

  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };

  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };
  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };

  useEffect(() => {
    getMissions(sortField)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField]);

  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((missions: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={missions.title}
                    subheader={new Date(missions.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{missions.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button>Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        <Tooltip title="New Mission">
          <Fab
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            color="primary"
            aria-label="add"
            onClick={handleNewMissionOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Dialog
          open={newMissionOpen}
          onClose={handleNewMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>New Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  label="Name"
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  label="Description"
                  variant="standard"
                  fullWidth
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"
                    value={tempLaunchDate}
                    onChange={handleTempLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewMissionClose}>Cancel</Button>
            <Button onClick={handleNewMissionClose}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export { Missions };
