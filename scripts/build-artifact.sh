#!/bin/sh
# Genera dist/artifact.html: index.html con due script inline e senza tag doctype/html/head/body,
# nel formato richiesto per la pubblicazione come artifact su claude.ai.
cd "$(dirname "$0")/.." || exit 1
mkdir -p dist
node -e "
const fs=require('fs');let h=fs.readFileSync('index.html','utf8');
const i18n=fs.readFileSync('i18n.js','utf8'),qr=fs.readFileSync('qr.js','utf8');
h=h.replace('<script src=\"i18n.js\"></script>',()=>'<script>'+i18n+'</script>')
   .replace('<script src=\"qr.js\"></script>',()=>'<script>'+qr+'</script>')
   .replace(/<!DOCTYPE html>\s*/i,'').replace(/<html[^>]*>\s*<head>/i,'').replace(/<meta charset=\"utf-8\">\s*/i,'')
   .replace(/<meta name=\"viewport\"[^>]*>\s*/i,'').replace('</style></head><body>','</style>\n')
   .replace(/<\/body>\s*<\/html>\s*$/i,'');
fs.writeFileSync('dist/artifact.html',h);
"
