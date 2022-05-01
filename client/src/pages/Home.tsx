import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import ReactMarkdown from "react-markdown";
import { Box, CircularProgress, Container } from "@mui/material";

const Home = (): JSX.Element => {
  const [readmeContent, setReadmeContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("/readme").then(async (res: Response) => {
      setReadmeContent(await res.text());
    });
  }, []);

  return (
    <AppLayout>
      <Container maxWidth="lg">
        {readmeContent ? (
          <ReactMarkdown linkTarget="_blank" components={{code({children, ...props}){
            return <code {...props} style={{backgroundColor: "#eee", padding: 2, fontSize: "0.8em"}}>{children}</code>
          }}}>
            {readmeContent}
          </ReactMarkdown>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </AppLayout>
  );
};

export { Home };
