//////////////////////
// ROOT DATA ENTRY
//////////////////////

export type DataEntryT = {
    league: string;
    season: string;
    week: number;
    matches: DataEntryMatchT[];
  };
  
  //////////////////////
  // MATCH
  //////////////////////
  
  export type DataEntryMatchT = {
    home_team_name: string;
    away_team_name: string;
  
    kickoff: string; // ISO datetime
    timezone: "UTC";
  
    venue: string;
  
    slug: string;
  
    status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";
    type: "NORMAL" | "FINAL" | "SEMIFINAL" | "QUARTERFINAL" | "FRIENDLY";
  
    allow_draw: boolean;
    big_match: boolean;
    derby: boolean;
  
    home_team_id: number;
    away_team_id: number;
  
    league_id: number; //1
    season_id: number; //1
    gameweek_id: number; //1
    published: boolean;
    scoreOptions: DataEntryScoreOptionT[];
    adminMatchVote: DataEntryAdminMatchVoteT;
  };
  
  //////////////////////
  // SCORE OPTION
  //////////////////////
  
  export type DataEntryScoreOptionT = {
    home_score: number;
    away_score: number;
  
    adminScorePrediction?: DataEntryAdminScorePredictionT;
  };
  
  //////////////////////
  // ADMIN MATCH VOTE
  //////////////////////
  
  export type DataEntryAdminMatchVoteT = {
    user_id: number; // admin id
  
    home_votes: number;
    draw_votes?: number; // only when allow_draw = true
    away_votes: number;
  };
  
  //////////////////////
  // ADMIN SCORE PREDICTION
  //////////////////////
  
  export type DataEntryAdminScorePredictionT = {
    user_id: number; // admin id
    vote_count: number;
  };