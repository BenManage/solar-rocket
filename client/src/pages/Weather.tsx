import { Container } from "@mui/material";
import { AppLayout } from "../layouts/AppLayout";

const Weather = (): JSX.Element => {
  return (
    <AppLayout title="Weather">
      <Container maxWidth="lg">
        <div>Weather!</div>
      </Container>
    </AppLayout>
  );
};

export { Weather };
