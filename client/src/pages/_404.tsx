import { Container, Typography } from "@mui/material";
import { AppLayout } from "../layouts/AppLayout";
export const _404 = (): JSX.Element => {
  return (
    <AppLayout title="404 - Not found">
      <Container maxWidth="lg">
        <Typography variant="h2">404 - Page not found</Typography>
        <Typography variant="h4">
          The page you are looking for was not found. Did you forget to bring a
          map?
        </Typography>
      </Container>
    </AppLayout>
  );
};
