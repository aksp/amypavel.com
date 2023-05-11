#! /bin/bash
set -e

npx ts-node generateCvTables.ts
rm -r dist
mkdir -p dist
xelatex -output-directory dist cv.tex
xelatex -output-directory dist cv.tex
