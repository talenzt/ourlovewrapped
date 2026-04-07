@echo off
echo ========================================
echo   Actualizando Proyecto en GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Agregando cambios...
git add .

echo.
set /p commit_msg="Describe tus cambios: "
if "%commit_msg%"=="" set commit_msg=Actualizacion del proyecto

echo.
echo [2/3] Guardando cambios...
git commit -m "%commit_msg%"

echo.
echo [3/3] Subiendo a GitHub...
git push

if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudo subir a GitHub
    echo Verifica tu conexion a internet
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo   CAMBIOS SUBIDOS EXITOSAMENTE!
echo ========================================
echo.
echo Vercel actualizara automaticamente tu proyecto
echo en 1-2 minutos.
echo.
echo Tu pareja vera los cambios en el mismo link.
echo.
pause
