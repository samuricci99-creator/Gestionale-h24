#!/bin/sh
# Estrae lo script inline di index.html ed esegue i test (nessuna dipendenza, solo Node).
cd "$(dirname "$0")/.." || exit 1
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const m=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];fs.writeFileSync('tests/.check.js',m[0][1]);" || exit 1
node --check tests/.check.js && node --check i18n.js && node --check qr.js || exit 1
for t in tests/*.test.js; do echo "== $t"; node "$t" | tail -1 || exit 1; done
