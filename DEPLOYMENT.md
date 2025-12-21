# Guía de Despliegue en Vercel - Frontend Citas Médicas

Esta guía te ayudará a desplegar el frontend del sistema de citas médicas en Vercel.

## Prerrequisitos

1. Una cuenta en [Vercel](https://vercel.com) (puedes registrarte con tu cuenta de GitHub, GitLab o Bitbucket)
2. El código del frontend subido a un repositorio Git (GitHub, GitLab o Bitbucket)
3. La URL del backend desplegado (ej: `https://tu-backend.railway.app/api`)

## Pasos para el Despliegue

### 1. Conectar el Repositorio

1. Inicia sesión en [Vercel](https://vercel.com)
2. Haz clic en **"Add New Project"** o **"Nuevo Proyecto"**
3. Selecciona el proveedor Git donde tienes tu repositorio (GitHub, GitLab, Bitbucket)
4. Busca y selecciona el repositorio `project-citas-medicas` (o como lo hayas nombrado)
5. Si el repositorio tiene múltiples carpetas, selecciona `front-citas` como **Root Directory**

### 2. Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verifica la siguiente configuración:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `front-citas` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3. Configurar Variables de Entorno

⚠️ **IMPORTANTE**: Debes configurar la variable de entorno para conectar con tu backend.

En la sección **"Environment Variables"**, añade:

| Variable | Valor de Ejemplo |
|----------|------------------|
| `VITE_API_BASE_URL` | `https://tu-backend-url.com/api` |

Reemplaza `https://tu-backend-url.com/api` con la URL real de tu backend desplegado.

### 4. Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que Vercel construya y despliegue tu aplicación
3. Una vez completado, recibirás una URL como `https://front-citas-xxxx.vercel.app`

## Configuración Adicional

### Dominio Personalizado

1. Ve a **Project Settings** → **Domains**
2. Añade tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

### Redeploy por Cambios

- **Automático**: Cada push a la rama principal (main/master) dispara un redeploy automático
- **Manual**: En el dashboard de Vercel, puedes hacer clic en "Redeploy" para forzar un nuevo despliegue

### Variables de Entorno por Ambiente

Vercel permite configurar diferentes valores para:
- **Production**: Variables para el despliegue principal
- **Preview**: Variables para despliegues de preview (PRs)
- **Development**: Variables para desarrollo local con `vercel dev`

## Archivos de Configuración Incluidos

### `vercel.json`

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

Este archivo configura:
- **rewrites**: Redirige todas las rutas a `index.html` para el funcionamiento correcto de Vue Router con history mode
- **headers**: Configura cache agresivo para los assets estáticos (CSS, JS, imágenes)

### `.env.example`

Variables de entorno requeridas:
- `VITE_API_BASE_URL`: URL base de la API del backend

## Solución de Problemas

### Error CORS

Si ves errores de CORS, asegúrate de que tu backend permita solicitudes desde tu dominio de Vercel.

En tu backend Flask, verifica que `FRONTEND_URL` en las variables de entorno incluya la URL de Vercel.

### Rutas que devuelven 404

Esto no debería ocurrir con la configuración actual de `vercel.json`, pero si sucede, verifica que los rewrites estén configurados correctamente.

### Build Fallido

1. Revisa los logs en el panel de Vercel
2. Ejecuta `npm run build` localmente para reproducir el error
3. Asegúrate de que todas las dependencias estén en `package.json`

## URLs de tu Aplicación

Una vez desplegado, tendrás:

- **URL de producción**: `https://tu-proyecto.vercel.app`
- **URLs de preview**: Se generan automáticamente para cada Pull Request

---

## Comandos Útiles (Local)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Preview local del deployment
vercel dev

# Deploy manual desde CLI
vercel --prod
```

## Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite en Vercel](https://vercel.com/docs/frameworks/vite)
- [Variables de Entorno en Vercel](https://vercel.com/docs/environment-variables)
