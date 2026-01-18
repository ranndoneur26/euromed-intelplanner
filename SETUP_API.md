# Configuración de la API de Google Gemini

Para que la aplicación funcione con IA real, necesitas configurar tu API key de Google Gemini.

## Paso 1: Obtener una API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key" (Crear clave API)
4. Copia la clave generada

## Paso 2: Configurar la Aplicación

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza `your_api_key_here` con tu API key real:

```
GOOGLE_AI_API_KEY=tu_clave_api_aquí
```

3. Guarda el archivo

## Paso 3: Reiniciar el Servidor

Si el servidor de desarrollo está corriendo, detenlo (Ctrl+C) y vuélvelo a iniciar:

```bash
npm run dev
```

## Verificación

Para verificar que todo funciona:

1. Abre http://localhost:3000 en tu navegador
2. Ve al módulo "Planificación Estratégica"
3. Completa el formulario e intenta generar una estrategia
4. Deberías ver resultados generados por IA real (no simulados)

## Notas Importantes

- **Seguridad**: El archivo `.env.local` está en `.gitignore` y NO se subirá a GitHub
- **Costos**: Google Gemini tiene un tier gratuito generoso, pero ten en cuenta los límites de uso
- **Límites**: Gemini 1.5 Flash tiene límites de rate (velocidad) - aproximadamente 15 solicitudes por minuto
- **Errores**: Si ves errores 429 (Too Many Requests), espera un momento antes de reintentar

## Modelo Usado

La aplicación usa **Gemini 1.5 Flash** por defecto:
- Modelo rápido y económico
- Excelente para generación de texto
- Buena relación calidad-precio

Si quieres cambiar el modelo, edita `src/lib/gemini.ts` línea 13:
```typescript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Puedes cambiarlo por: "gemini-1.5-pro" para mejor calidad (más caro)
```

## Soporte

Si tienes problemas:
1. Verifica que la API key esté correctamente copiada (sin espacios)
2. Verifica que el servidor esté reiniciado después de agregar la key
3. Revisa la consola del  navegador (F12) para ver errores específicos
4. Verifica tus límites de quota en [Google AI Studio](https://makersuite.google.com/app/apikey)
