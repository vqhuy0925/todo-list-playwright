@echo off
REM Export presentation.md to PDF and PowerPoint
REM Usage: export-presentation.bat

cd /d "%~dp0"

echo Exporting presentation to PDF...
call npx --registry=https://registry.npmjs.org @marp-team/marp-cli presentation.md --pdf --allow-local-files -o presentation.pdf
if %ERRORLEVEL% EQU 0 (
    echo [OK] PDF exported: presentation.pdf
) else (
    echo [ERROR] PDF export failed
)

echo.
echo Exporting presentation to PowerPoint...
call npx --registry=https://registry.npmjs.org @marp-team/marp-cli presentation.md --pptx --allow-local-files -o presentation.pptx
if %ERRORLEVEL% EQU 0 (
    echo [OK] PPTX exported: presentation.pptx
) else (
    echo [ERROR] PPTX export failed
)

echo.
echo Done!
