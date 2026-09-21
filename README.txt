Grammar data bundle

1. Copy folders `content`, `scripts`, and `src/data/grammar` into the root of hebrew-react-ts.
2. Install SheetJS:
   npm install -D xlsx
3. Add this script to package.json:
   "grammar:build": "node scripts/convert-grammar-data.mjs"
4. Rebuild JSON after any Excel change:
   npm run grammar:build

The converter validates:
- numeric integer id
- numeric level where present
- duplicate ids
- continuous ids 1..500 / 1..300 in base tables
- expected row counts for all 12 tables
- word identity across linked tables
