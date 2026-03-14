# 🏆 FIFA World Cup 2026 - Quick Start Guide

## One-Command Setup

```bash
cd predict-api
npm run seed:worldcup
```

This runs all seeds and creates:
- ✅ FIFA World Cup league
- ✅ 24 national teams in 6 groups
- ✅ 2026 season
- ✅ 8 game weeks (group stage + knockout)
- ✅ 34 matches (group stage + knockout rounds)

---

## What You Get

### League Info
- **ID**: 16
- **Name**: FIFA World Cup 2026
- **Type**: Tournament
- **Slug**: fifa-world-cup-2026

### Groups
- Group A: Argentina, Brazil, Canada, Australia
- Group B: France, Spain, Mexico, Senegal
- Group C: England, Germany, Japan, Nigeria
- Group D: Portugal, Italy, USA, Morocco
- Group E: Belgium, Netherlands, Uruguay, South Korea
- Group F: Croatia, Denmark, Switzerland, Cameroon

### Matches
- 18 Group Stage matches
- 8 Round of 16 matches
- 4 Quarter-finals
- 2 Semi-finals
- 1 Third Place Playoff
- 1 Final

---

## API Endpoints

```bash
# Get all World Cup matches
GET /api/matches?league_id=16

# Get World Cup teams
GET /api/teams?league_id=16

# Filter by type
GET /api/matches?type=GROUP_STAGE
GET /api/matches?type=FINAL
```

---

## Database Changes

### New Fields
- `League.is_tournament` - Boolean flag for tournaments
- `Team.group_name` - Group assignment (A, B, C, etc.)
- `Match.aggregate_home_score` - For two-legged ties
- `Match.aggregate_away_score` - For two-legged ties

### New Match Types
- `GROUP_STAGE`
- `ROUND_OF_16`
- `THIRD_PLACE_PLAYOFF`

---

## Files Created

**Seeds:**
- `prisma/seed.worldCup.ts` (master)
- `prisma/seed.worldCupLeague.ts`
- `prisma/seed.worldCupTeams.ts`
- `prisma/seed.worldCupSeason.ts`
- `prisma/seed.worldCupLeagueSeason.ts`
- `prisma/seed.worldCupGameWeeks.ts`
- `prisma/seed.worldCupMatches.ts`

**Data:**
- `prisma/data/team/world-cup-teams.json`

**Docs:**
- `WORLD_CUP_SETUP.md` (detailed guide)
- `WORLD_CUP_SUMMARY.md` (this summary)
- `WORLD_CUP_QUICK_START.md` (this file)

---

## Verify Installation

```bash
# Check database
npx prisma studio

# Look for:
# - League: "FIFA World Cup 2026" (ID: 16)
# - Teams: 24 national teams
# - Matches: 34 total
```

---

## Next Steps

1. ✅ Backend is ready
2. ⏳ Update frontend (see frontend setup guide)
3. ⏳ Add team logos
4. ⏳ Test predictions

---

**Need Help?**
- Full documentation: `WORLD_CUP_SETUP.md`
- Summary: `WORLD_CUP_SUMMARY.md`
