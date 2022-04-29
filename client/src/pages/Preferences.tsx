import { Container } from "@mui/material";
import { AppLayout } from "../layouts/AppLayout";

const Preferences = (): JSX.Element => {
  return (
    <AppLayout title="Preferences">
      <Container maxWidth="lg">
        <div>Preferences!</div>
      </Container>
    </AppLayout>
  );
};

export { Preferences };
