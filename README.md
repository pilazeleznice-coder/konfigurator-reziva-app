# Konfigurátor řeziva — Pila Železnice

Webová a instalovatelná PWA aplikace pro kalkulaci řeziva, evidenci konceptů a archivu, export PDF/Word a další interní operace.

## Aktualizace navigace CFG-017 (12. 11. 2026)

- Systémové tlačítko Androidu „Zpět“ funguje jako návrat o jednu obrazovku.
- Menu se počítá jako samostatný navigační krok: Domů → Menu → Archiv → Zpět → Menu → Zpět → Domů.
- Funguje také přechod z Nastavení do podstránek Kontakty, Záloha a obnovení a Recenze.
- Zavření Archivu, Konceptů a Koše otevřených z Menu vrací uživatele do Menu.
- Výpočty, data, synchronizace a exporty nebyly touto etapou změněny.

Zdroj aktualizace: ověřený balíček `Konfigurator_reziva_NAVIGACE_MENU_KROK_ZPET_2026-11-12.zip`.

**Ověření:** syntaxe navigačního JavaScriptu a ZIP souboru prošla kontrolou; provoz na konkrétním Android zařízení je nutné ověřit po nasazení.
