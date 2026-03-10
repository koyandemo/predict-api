import express from "express";
import dotenv from "dotenv";
import userRoutes from "./aspect/user/user.routes";
import leagueRoutes from "./aspect/league/league.routes";
import teamRoutes from "./aspect/team/team.routes";
import matchRoutes from "./aspect/match/match.routes";
import commentRoutes from "./aspect/comment/comment.routes";
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

app.get("/", (req, res) => {
  res.send("Express + Neon + Prisma + TypeScript 🚀");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
