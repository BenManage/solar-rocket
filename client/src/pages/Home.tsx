import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import ReactMarkdown from "react-markdown";

const Home = (): JSX.Element => {
  const [readmeContent, setReadmeContent] = useState("");

  useEffect(() => {
    fetch("/readme").then(async (res: Response) => {
      setReadmeContent(await res.text());
    });
  }, []);

  return (
    <AppLayout>
      <ReactMarkdown>{readmeContent}</ReactMarkdown>
    </AppLayout>
  );
};

export { Home };
