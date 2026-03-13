import { TeamT } from "./team.type";

export interface LeagueT {
  name: string;
  country: string;
  slug: string;
  logo_url?: string;
  sort_order?: number;
  teams?: TeamT[];
}

export interface LeagueResponseT {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface LeagueTT {
  name: string;
  country: string;
  slug: string;
  logo_url: string;
  sort_order: number;
}