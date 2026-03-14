# FIFA World Cup 2026 Setup Guide

This guide will help you set up the FIFA World Cup tournament structure in your prediction system.

## Overview

The backend has been updated to support FIFA World Cup features including:
- ✅ Tournament-specific league structure
- ✅ Group stage matches (Groups A-F)
- ✅ Knockout stage (Round of 16, Quarter-finals, Semi-finals, Final, Third Place Playoff)
- ✅ National teams with group assignments
- ✅ Special match types for different tournament stages

## Database Schema Updates

The following changes have been made to support the World Cup:

### New Match Types Added:
- `GROUP_STAGE` - Group phase matches
- `ROUND_OF_16` - First knockout round
- `THIRD_PLACE_PLAYOFF` - Third place match

### New Fields Added:
- **League**: `is_tournament` flag to distinguish tournaments from regular leagues
- **Team**: `group_name` field for group stage assignment (e.g., "A", "B", etc.)
- **Match**: `aggregate_home_score` and `aggregate_away_score` for two-legged ties

## Quick Start

Run all World Cup seeds at once:

```bash
npm run seed:worldcup
```

Or run individual seeds step by step:

```bash
# 1. Create the FIFA World Cup league
npm run seed:worldcup:league

# 2. Add national teams (24 teams in 6 groups)
npm run seed:worldcup:teams

# 3. Create the season
npm run seed:worldcup:season

# 4. Link league and season
npm run seed:worldcup:leagueSeason

# 5. Create game weeks (group stage + knockout rounds)
npm run seed:worldcup:gameweeks

# 6. Create all matches (group stage + knockout)
npm run seed:worldcup:matches
```

## What Gets Created

### League Structure
- **Name**: FIFA World Cup 2026
- **Country**: USA/Canada/Mexico
- **Type**: Tournament
- **Slug**: fifa-world-cup-2026

### Teams (24 teams across 6 groups)

**Group A**: Argentina, Brazil, Canada, Australia
**Group B**: France, Spain, Mexico, Senegal
**Group C**: England, Germany, Japan, Nigeria
**Group D**: Portugal, Italy, USA, Morocco
**Group E**: Belgium, Netherlands, Uruguay, South Korea
**Group F**: Croatia, Denmark, Switzerland, Cameroon

### Tournament Schedule

**Group Stage** (3 matchdays per team):
- Matchday 1: June 11-13, 2026
- Matchday 2: June 15-17, 2026
- Matchday 3: June 19-21, 2026

**Knockout Stage**:
- Round of 16: June 27-30, 2026
- Quarter-finals: July 4-5, 2026
- Semi-finals: July 9, 2026
- Third Place Playoff: July 13, 2026
- Final: July 14, 2026

## File Structure

```
predict-api/prisma/
├── seed.worldCup.ts                  # Master seed script (runs all)
├── seed.worldCupLeague.ts            # Creates FIFA World Cup league
├── seed.worldCupTeams.ts             # Creates 24 national teams
├── seed.worldCupSeason.ts            # Creates 2026 season
├── seed.worldCupLeagueSeason.ts      # Links league and season
├── seed.worldCupGameWeeks.ts         # Creates tournament rounds
├── seed.worldCupMatches.ts           # Creates all matches
└── data/
    └── team/
        └── world-cup-teams.json      # Team data configuration
```

## Customization

### Adding More Teams

Edit `prisma/data/team/world-cup-teams.json`:

```json
{
  "name": "Your Country",
  "slug": "your-country",
  "short_code": "YCO",
  "country": "Country Name",
  "type": "national",
  "logo_url": "",
  "group_name": "A"
}
```

### Adding More Matches

Edit `prisma/seed.worldCupMatches.ts` and add to the `groupStageMatches` or `knockoutMatches` arrays.

### Changing Dates

Modify the date fields in:
- `seed.worldCupMatches.ts` - Match kickoff times
- `seed.worldCupGameWeeks.ts` - GameWeek structure

## API Endpoints

All existing endpoints work with World Cup data:

```bash
# Get all World Cup matches
GET /api/matches?league_id=<WORLD_CUP_LEAGUE_ID>

# Get specific match
GET /api/matches/:id

# Get all teams
GET /api/teams?league_id=<WORLD_CUP_LEAGUE_ID>

# Filter by match type
GET /api/matches?type=GROUP_STAGE
GET /api/matches?type=FINAL
```

## Special Features

### Group Stage
- Draws are allowed (`allow_draw: true`)
- Teams are assigned to groups (A, B, C, etc.)
- Standard 3 points for win, 1 for draw

### Knockout Stage
- No draws allowed (`allow_draw: false`)
- Must have a winner (extra time/penalties if needed)
- Special match types for each round

### Aggregate Scores
For two-legged ties (if needed in future):
- Use `aggregate_home_score` and `aggregate_away_score` fields

## Next Steps

After running the seeds:

1. **Verify Data**: Check your database to ensure all World Cup data was created correctly

2. **Update Frontend**: The frontend needs updates to display:
   - Group standings tables
   - Knockout bracket visualization
   - Special World Cup branding

3. **Add Team Logos**: Update team records with actual national team logos

4. **Configure Venues**: Update match records with actual stadiums

5. **Test Predictions**: Ensure users can predict World Cup matches

## Troubleshooting

### Error: "League not found"
Make sure you run `seed:worldcup:league` first before other seeds.

### Error: "Team not found"
Ensure teams were created successfully by running `seed:worldcup:teams`.

### Duplicate Data
If you need to reset, truncate the tables:
```bash
npm run prisma studio
```
Then manually delete World Cup data or run truncate scripts.

## Migration

The database migration has already been applied:
- Migration name: `20260314070017_add_fifa_world_cup_support`
- Adds new enum values and fields to support World Cup features

To view the migration SQL, check:
```
predict-api/prisma/migrations/20260314070017_add_fifa_world_cup_support/migration.sql
```

## Support

For issues or questions about the World Cup setup, check:
- Prisma schema: `prisma/schema.prisma`
- Seed files in: `prisma/seed.worldCup*.ts`
- Server code: `src/server.ts`
