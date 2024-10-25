#!/bin/bash

# Vytvoření zip archivu s názvem "archiv.zip"
# -r = rekurzivně projít složky a soubory
# -x = vynechat soubory odpovídající patternům

zip -r archiv.zip . -x "*.md" ".vscode/*" "LICENSE" "*.sh" ".git/*"

echo "Archiv byl úspěšně vytvořen jako archiv.zip."
##
