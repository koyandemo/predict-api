import { LeagueT } from "./league.type";

export interface TeamT {
  name: string;
  slug: string;
  short_code: string;
  logo_url: string;
  country: string;
  type: string;
  venue: string;
  league_id: number;
  league: LeagueT;
}

