@echo off
title Calcolatore Mutuo
cd /d "%~dp0"

if not exist node_modules (
  echo Prima installazione: scarico le librerie necessarie...
  call npm install || (pause & exit /b 1)
)

echo Avvio del Calcolatore Mutuo in corso...
echo Per chiudere usa il pulsante "Chiudi applicazione" nella pagina.
call npm run dev -- --open
