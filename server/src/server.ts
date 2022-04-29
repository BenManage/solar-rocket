import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import { readFile, access, mkdir, copyFile, writeFile } from "fs/promises";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { DateTimeResolver } from "graphql-scalars";
import path from "path";
import { GraphQLSchema } from "graphql";
import { Mission } from "./types";
import { CreateMission, GetMissionById, ListMissions } from "./queries";

const DATA_DIR = path.join(__dirname, "../.data");
const DATA_DIR_INIT = path.join(__dirname, "../data/init");
const DATA_FILE_MISSIONS = "missions.json";
const DATA_FILES = [DATA_FILE_MISSIONS];

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

let schema: GraphQLSchema;

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

// Wrapper function which initializes data if necessary
const _g = async (callback?: Function) => {
  try {
    await access(DATA_DIR);
  } catch (err) {
    console.warn(".data directory does not exist. Creating...");
    await mkdir(DATA_DIR, { recursive: true });
  }

  DATA_FILES.forEach(async (file) => {
    try {
      await access(path.join(DATA_DIR, file));
    } catch (err) {
      console.warn(`${file} does not exist. Creating...`);
      await copyFile(path.join(DATA_DIR_INIT, file), path.join(DATA_DIR, file));
    }
  });

  if (callback) return callback();
};

const loadMissions = async (): Promise<Mission[]> =>
  await _g(async () => {
    return JSON.parse(
      await readFile(path.join(DATA_DIR, DATA_FILE_MISSIONS), "utf8")
    );
  });

const main = async () => {
  await _g();

  schema = await loadSchema("./data/schema.graphql", {
    loaders: [new GraphQLFileLoader()],
    resolvers: {
      DateTime: DateTimeResolver,
      Query: {
        async Missions(obj, args) {
          const missions = await loadMissions();
          return ListMissions(missions, args);
        },
        async Mission(obj, args) {
          const missions = await loadMissions();
          return GetMissionById(missions, args.id);
        },
      },
      Mutation: {
        async createMission(obj, args) {
          const missions = await loadMissions();

          const mission = CreateMission(args.mission);
          missions.push(mission);

          await writeFile(
            path.join(DATA_DIR, DATA_FILE_MISSIONS),
            JSON.stringify(missions),
            "utf8"
          );
          return mission;
        },
      },
    },
  });

  app.get("/readme", 
    async (req : Request, res: Response ) => {
      const readme : String = await readFile(path.join(__dirname, "../../README.md"), "utf8")
      res.send(readme);
    }
  );

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: { headerEditorEnabled: false },
    })
  );
};

main();
