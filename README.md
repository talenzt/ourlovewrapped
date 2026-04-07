# Our Love Wrapped 💕

Una experiencia interactiva de aniversario inspirada en Spotify Wrapped, construida con React, Tailwind CSS y Framer Motion.

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa del build
npm run preview
```

## 📦 Deploy

### Opción 1: Netlify (Recomendado)

1. Haz push de tu código a GitHub
2. Conecta tu repositorio en [Netlify](https://netlify.com)
3. Netlify detectará automáticamente la configuración desde `netlify.toml`

### Opción 2: Vercel

1. Haz push de tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Vercel detectará automáticamente que es un proyecto Vite

### Opción 3: GitHub Pages

```bash
npm run build
# Sube la carpeta dist/ a tu repositorio
```

## 🛠️ Stack Tecnológico

- **React 19** - UI Framework
- **Vite 8** - Build Tool
- **Tailwind CSS 4** - Styling
- **Framer Motion 12** - Animaciones
- **Lucide React** - Iconos

## 📁 Estructura del Proyecto

```
OurLoveWrapped/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globales con Tailwind
├── public/              # Assets estáticos
├── dist/                # Build de producción
└── index.html           # HTML template
```
