@echo off
setlocal

cd /d "%~dp0.."

echo MiniShop API baslatiliyor...
echo.

dotnet run --project src\MiniShop.Api

if errorlevel 1 (
    echo.
    echo API baslatilirken bir hata olustu.
    pause
)

endlocal
