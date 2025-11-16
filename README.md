# Fleet Management Dashboard

Dashboard de monitoreo inteligente para la gestión de flotas de transporte público urbano mediante procesamiento avanzado de datos GPS y técnicas de Machine Learning.

## 📋 Descripción del Proyecto

Este proyecto forma parte de una investigación de maestría en Ciencia de Datos que aborda la optimización de la gestión operativa de flotas de transporte público urbano. El sistema utiliza técnicas de Machine Learning (ML) para diseñar un sistema inteligente de gestión de alertas que transforma el volumen masivo de registros GPS en información accionable y priorizada.

### Características Principales

- **Detección de Anomalías No Supervisada**: Utiliza Isolation Forest para detectar outliers estadísticos
- **Priorización Contextual Supervisada**: Emplea Random Forest para clasificar y priorizar alertas
- **Arquitectura Multicapa**: Integración de MLOps y Complex Event Processing (CEP)
- **Tipos de Alertas Monitoreadas**:
  - Exceso de Velocidad
  - Detenciones No Autorizadas
  - Salidas de Ruta
  - Pérdidas de Señal

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **pnpm** (gestor de paquetes recomendado)

### Instalación de Node.js

#### Windows

1. Visita el sitio oficial de Node.js: [https://nodejs.org/](https://nodejs.org/)
2. Descarga la versión LTS (Long Term Support) recomendada
3. Ejecuta el instalador `.msi` y sigue las instrucciones del asistente
4. Verifica la instalación abriendo PowerShell o CMD y ejecutando:

```bash
node --version
npm --version
```

#### macOS

**Opción 1: Instalador oficial**

1. Visita [https://nodejs.org/](https://nodejs.org/)
2. Descarga el instalador `.pkg` para macOS
3. Ejecuta el instalador y sigue las instrucciones

**Opción 2: Usando Homebrew (recomendado)**

```bash
brew install node
```

#### Linux (Ubuntu/Debian)

```bash
# Actualizar el índice de paquetes
sudo apt update

# Instalar Node.js y npm
sudo apt install nodejs npm

# Verificar la instalación
node --version
npm --version
```

#### Verificación

Después de instalar Node.js, verifica que todo esté correcto:

```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar la versión de npm
```

### Instalación de pnpm

Una vez que tengas Node.js instalado, instala pnpm globalmente:

```bash
npm install -g pnpm
```

Verifica la instalación:

```bash
pnpm --version
```

## 📦 Instalación

1. **Clona el repositorio** (si aplica) o navega al directorio del proyecto:

```bash
cd fleet_management_dashboard
```

2. **Instala las dependencias**:

```bash
pnpm install
```

Este comando instalará todas las dependencias necesarias listadas en `package.json`.

## 🛠️ Desarrollo

### Ejecutar en Modo Desarrollo

Para iniciar el servidor de desarrollo con hot-reload:

```bash
pnpm dev
```

El servidor se iniciará en `http://localhost:5173` (o el puerto que Vite asigne automáticamente).

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia el servidor de desarrollo

# Producción
pnpm build        # Compila el proyecto para producción
pnpm preview     # Previsualiza la build de producción

# Calidad de Código
pnpm lint        # Ejecuta ESLint para verificar el código
```

## 📁 Estructura del Proyecto

```
fleet_management_dashboard/
├── public/                 # Archivos estáticos públicos
│   └── vite.svg
├── src/
│   ├── app/               # Configuración de la aplicación
│   │   ├── providers/     # Providers de React (Router, Query, etc.)
│   │   │   └── RouterProvider.tsx
│   │   └── routes/        # Configuración de rutas
│   │       ├── index.tsx           # Definición de rutas
│   │       ├── ProtectedRoute.tsx  # Componente de ruta protegida
│   │       └── routes.constants.ts  # Constantes de rutas
│   ├── assets/            # Recursos estáticos (imágenes, iconos)
│   │   └── react.svg
│   ├── config/            # Archivos de configuración
│   ├── features/          # Features/dominios de la aplicación
│   ├── lib/               # Librerías y utilidades externas
│   ├── pages/             # Componentes de páginas
│   │   ├── Home.tsx              # Página principal
│   │   ├── Analytics.tsx         # Página de análisis
│   │   ├── Configuracion.tsx     # Página de configuración
│   │   ├── Login.tsx             # Página de login
│   │   └── Error.tsx              # Página de error
│   ├── shared/            # Componentes y utilidades compartidas
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx    # Layout principal con Sidebar
│   │   │   │   └── index.ts
│   │   │   └── Sidebar/
│   │   │       ├── Sidebar.tsx    # Menú lateral colapsable
│   │   │       └── index.ts
│   │   └── utils/         # Utilidades compartidas
│   │       └── cn.ts      # Helper para combinar clases CSS
│   ├── styles/            # Estilos globales
│   │   └── index.css      # Estilos principales (Tailwind)
│   ├── App.tsx            # Componente raíz de la aplicación
│   └── main.tsx           # Punto de entrada de la aplicación
├── .gitignore
├── eslint.config.js       # Configuración de ESLint
├── index.html             # HTML principal
├── package.json           # Dependencias y scripts
├── pnpm-lock.yaml         # Lock file de pnpm
├── postcss.config.js      # Configuración de PostCSS
├── tailwind.config.ts     # Configuración de Tailwind CSS
├── tsconfig.json          # Configuración de TypeScript
├── tsconfig.app.json      # Configuración TS para la app
├── tsconfig.node.json     # Configuración TS para Node
└── vite.config.ts         # Configuración de Vite
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

- **`app/`**: Configuración centralizada de la aplicación (rutas, providers)
- **`pages/`**: Componentes de nivel de página (Home, Analytics, etc.)
- **`shared/`**: Código compartido entre diferentes partes de la aplicación
  - **`components/`**: Componentes reutilizables (Layout, Sidebar)
  - **`utils/`**: Funciones utilitarias
- **`features/`**: (Reservado para futuras features modulares)
- **`config/`**: Archivos de configuración
- **`lib/`**: Wrappers de librerías externas

### Rutas de la Aplicación

- `/` - Página principal (Home)
- `/analytics` - Panel de análisis y métricas
- `/configuracion` - Configuración del sistema
- `/login` - Página de autenticación

Todas las rutas excepto `/login` están protegidas y requieren autenticación.

## 🎨 Tecnologías Utilizadas

### Core

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite 7** - Build tool y dev server

### Routing

- **React Router DOM 7** - Enrutamiento de la aplicación

### Estilos

- **Tailwind CSS 4** - Framework de utilidades CSS
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos

### Estado y Datos

- **Zustand** - Gestión de estado global
- **TanStack Query** - Gestión de estado del servidor y caché
- **Axios** - Cliente HTTP

### UI y Componentes

- **Lucide React** - Iconos
- **Recharts** - Gráficos y visualizaciones
- **React Hot Toast** - Notificaciones
- **React Loading Skeleton** - Placeholders de carga

### Desarrollo

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **TypeScript ESLint** - Reglas de linting para TypeScript

## ⚙️ Configuración

### Alias de Importación

El proyecto utiliza alias de importación para facilitar las importaciones:

```typescript
import { Layout } from "@/shared/components/Layout";
```

El alias `@` apunta a `./src` y está configurado en:

- `vite.config.ts` (para Vite)
- `tsconfig.app.json` (para TypeScript)

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto para variables de entorno:

```env
VITE_API_URL=http://localhost:3000/api
```

Las variables deben comenzar con `VITE_` para ser accesibles en el código.

## 🧩 Componentes Principales

### Layout

Componente que envuelve todas las páginas protegidas e incluye el Sidebar.

### Sidebar

Menú lateral colapsable con navegación entre páginas:

- **Home**: Página principal del dashboard
- **Analytics**: Panel de análisis
- **Configuración**: Configuración del sistema

Características:

- Colapsable/expandible
- Resalta la página activa
- Muestra solo iconos cuando está colapsado

## 🔧 Solución de Problemas

### Los estilos de Tailwind no se aplican

1. Verifica que `postcss.config.js` esté configurado correctamente
2. Asegúrate de que `@tailwindcss/postcss` esté instalado:
   ```bash
   pnpm add -D @tailwindcss/postcss
   ```
3. Reinicia el servidor de desarrollo

### Errores de TypeScript

1. Verifica que todas las dependencias estén instaladas:
   ```bash
   pnpm install
   ```
2. Ejecuta el compilador de TypeScript:
   ```bash
   pnpm tsc --noEmit
   ```

### Puerto ya en uso

Si el puerto 5173 está ocupado, Vite automáticamente usará el siguiente disponible. También puedes especificar un puerto:

```bash
pnpm dev -- --port 3000
```

## 📝 Convenciones de Código

- **Componentes**: PascalCase (ej: `Sidebar.tsx`)
- **Utilidades**: camelCase (ej: `cn.ts`)
- **Archivos de configuración**: kebab-case o camelCase según el estándar
- **Imports de tipos**: Usar `import type` cuando sea solo para tipos

## 🚀 Build para Producción

Para crear una build optimizada para producción:

```bash
pnpm build
```

Los archivos se generarán en la carpeta `dist/`. Para previsualizar la build:

```bash
pnpm preview
```

## 👥 Equipo

Este proyecto es desarrollado por:

- **Néstor Bravo Chuqui**
- **Matías Errazuriz Mendoza**
- **Carlos Videla Fritz**

### Tutoría

Bajo la tutoría del **Profesor Gustavo Matamala**, dentro del programa de **Magíster en Ciencia de Datos** de la **Pontificia Universidad Católica de Chile**.

## 📄 Licencia

Este proyecto es parte de una investigación académica de maestría en Ciencia de Datos.

---
