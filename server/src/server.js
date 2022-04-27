import express from "express";
import { graphqlHTTP } from "express-graphql";
import { readFile, access, mkdir, copyFile } from "fs/promises";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { DateTimeResolver } from "graphql-scalars";
import path from "path";

const DATA_DIR = new URL("../.data", import.meta.url);
const DATA_DIR_INIT = new URL("../data/init", import.meta.url);
const DATA_FILE_MISSIONS = "missions.json";
const DATA_FILES = [DATA_FILE_MISSIONS];
const app = express();
const port = process.env.PORT || 5000;

// This displays message that the server running and listening to specified port
app
  .listen(port, () => console.log(`Listening on port ${port}`))
  .on("error", (err) => {
    process.once("SIGUSR2", () => {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", () => {
      process.kill(process.pid, "SIGINT");
    });
  });

// create a GET route
app.get("/express_backend", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT!" });
});

const _g = async (callback) => {
  try {
    await access(DATA_DIR);
  } catch (err) {
    console.warn(".data directory does not exist. Creating...");
    await mkdir(DATA_DIR, { recursive: true });
  }

  DATA_FILES.forEach(async (file) => {
    try {
      await access(path.join(DATA_DIR.pathname, file));
    } catch (err) {
      console.warn(`${file} does not exist. Creating...`);
      await copyFile(
        path.join(DATA_DIR_INIT.pathname, file),
        path.join(DATA_DIR.pathname, file)
      );
    }
  });

  if (callback) return callback();
};

await _g();

const loadMissions = async () =>
  await _g(async () => {
    return JSON.parse(
      await readFile(path.join(DATA_DIR.pathname, DATA_FILE_MISSIONS), "utf-8")
    );
  });

const schema = await loadSchema("./data/schema.graphql", {
  loaders: [new GraphQLFileLoader()],
  resolvers: {
    DateTime: DateTimeResolver,
    Query: {
      async Missions(obj, args) {
        const missions = await loadMissions();
        if (args.sort) {
          missions.sort((aMission, bMission) => {
            let a, b;
            switch (args.sort?.field) {
              case "Title":
                a = aMission.title;
                b = bMission.title;
                break;
              case "Date":
                a = new Date(aMission.launch.date);
                b = new Date(bMission.launch.date);
                break;
            }
            if (args.sort?.desc !== false) {
              return a > b ? 1 : -1;
            } else {
              return a < b ? 1 : -1;
            }
          });
        }
        return missions;
      },
      async Mission(obj, args) {
        const mission = await loadMissions();
        return mission.find((mission) => mission.id === args.id);
      },
    },
  },
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: { headerEditorEnabled: false },
  })
);
