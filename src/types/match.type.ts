import { LeagueT } from "./league.type";
import { TeamT } from "./team.type";
import { UserT } from "./user.type";

export type MatchT = {
  id: number;
  kickoff: Date;
  venue: string;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";
  slug: string;
  allow_draw: boolean;
  big_match: boolean;
  derby: boolean;
  type: "NORMAL" | "FINAL" | "SEMIFINAL" | "QUARTERFINAL" | "FRIENDLY";
  home_score: number;
  away_score: number;
  published: boolean;
  home_team?: TeamT;
  away_team?: TeamT;
  league?: LeagueT;
  season_id:number;
  gameweek_id:number;

  home_team_id: number;
  away_team_id: number;
  league_id: number;
};

export type MatchVoteT = {
  id: number;
  user_id: number;
  user?: UserT;
  match_id: number;
  match?: MatchT;
  vote: "HOME" | "AWAY" | "DRAW";
  created_at: Date;
  updated_at: Date;
};

export type MatchVoteResultT = {
  home: {
    votes: number;
    percentage: number;
  };
  draw: {
    votes: number;
    percentage: number;
  };
  away: {
    votes: number;
    percentage: number;
  };
  total_votes: number;
};

export type ScoreOptionT = {
  id: number;
  match_id: number;
  match?: MatchT;
  home_score: number;
  away_score: number;
  created_at: Date;
  votes?: ScorePredictionT[];
  admin_score_prediction?: AdminScorePredictionT;
};

export type ScorePredictionT = {
  id: number;
  user_id: number;
  user?: UserT;
  match_id: number;
  match?: MatchT;
  score_option_id: number;
  score_option?: ScoreOptionT;
  created_at: Date;
  updated_at: Date;
};

export interface ApiResScorePredictionT {
  away_score: number;
  home_score: number;
  id: number;
  percent: number;
  current_user_vote: boolean;
  votes: number;
}

export type AdminMatchVoteT = {
  id: number;
  match_id: number;
  match?: MatchT;
  user_id: number;
  user?: UserT;
  home_votes: number;
  draw_votes: number;
  away_votes: number;
  created_at: Date;
  updated_at: Date;
};

export type AdminScorePredictionT = {
  id: number;
  score_option_id: number;
  score_option?: ScoreOptionT;
  user_id: number;
  user?: UserT;
  vote_count: number;
  created_at: Date;
  updated_at: Date;
};
