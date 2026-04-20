import express from "express";
import dotenv from "dotenv";
import userRoutes from "./aspect/user/user.routes";
import leagueRoutes from "./aspect/league/league.routes";
import teamRoutes from "./aspect/team/team.routes";
import matchRoutes from "./aspect/match/match.routes";
import commentRoutes from "./aspect/comment/comment.routes";
import contactRoutes from "./aspect/contact/contact.routes";
import seasonRoutes from "./aspect/season/season.routes";
import gameWeekRoutes from "./aspect/gameWeek/gameWeek.routes";
import fileRoutes from "./aspect/file/file.route";
import winnerVoteRoutes from "./aspect/winnerVote/winnerVote.routes";
import teamStandingsRoutes from "./aspect/teamStanding/teamStanding.routes";
import { authMiddle } from "./middleware/auth.middleware";
import { ALLOWED_ORIGINS } from "./lib/utils";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());
app.use(authMiddle);
app.use("/api/users", userRoutes);
app.use("/api/leagues", leagueRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/gameWeeks", gameWeekRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/winner-votes", winnerVoteRoutes);
app.use("/api/team-standings", teamStandingsRoutes);
app.use("/api/contacts", contactRoutes);

app.get("/", (req, res) => {
  res.send("Express + Neon + Prisma + TypeScript 🚀");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
