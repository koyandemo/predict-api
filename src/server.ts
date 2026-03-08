import express from "express";
import dotenv from "dotenv";
import userRoutes from "./aspect/user/user.routes";
import leagueRoutes from "./aspect/league/league.routes";
import teamRoutes from "./aspect/team/team.routes";
import matchRoutes from "./aspect/match/match.routes";
import {authMiddle} from "./middleware/auth.middleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(authMiddle);
app.use("/api/users", userRoutes);
app.use("/api/leagues", leagueRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);

app.get("/", (req, res) => {
  res.send("Express + Neon + Prisma + TypeScript 🚀");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
