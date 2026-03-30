# Nike Description Automation — Deploy en Vercel

## Estructura del proyecto
```
nike-automation/
├── api/
│   └── claude.js        ← Proxy seguro para la API de Anthropic
├── public/
│   └── index.html       ← Aplicación web
├── vercel.json          ← Configuración de Vercel
└── package.json
```

---

## Pasos para subir a Vercel

### 1. Instala Vercel CLI (solo la primera vez)
```bash
npm install -g vercel
```

### 2. En la terminal, entra a la carpeta del proyecto
```bash
cd nike-automation
```

### 3. Despliega
```bash
vercel
```
- Te pedirá que inicies sesión (crea cuenta gratis en vercel.com si no tienes)
- Acepta las opciones por defecto cuando pregunte
- Al final te dará una URL tipo: `https://nike-automation-xxx.vercel.app`

### 4. Agrega tu API Key de Anthropic como variable de entorno

**Opción A — Por terminal:**
```bash
vercel env add ANTHROPIC_API_KEY
```
Pega tu key cuando la pida, selecciona los 3 entornos (Production, Preview, Development).

**Opción B — Por el dashboard de Vercel:**
1. Entra a vercel.com → tu proyecto → Settings → Environment Variables
2. Nombre: `ANTHROPIC_API_KEY`
3. Valor: tu key (empieza con `sk-ant-...`)
4. Guarda y haz re-deploy:
```bash
vercel --prod
```

---

## Uso de la app

1. Abre la URL que te dio Vercel
2. Arrastra tu archivo Excel (columnas: referencia / nombre / descripción)
3. Click en **INICIAR AUTOMATIZACIÓN**
4. Espera — la IA busca cada referencia en Nike.com y extrae los 4 bullets
5. Click en **DESCARGAR EXCEL** cuando termine

## Notas
- Las referencias duplicadas se procesan una sola vez (la descripción se copia automáticamente)
- El campo **Delay** controla los segundos entre requests (recomendado: 2-3s)
- El botón **DETENER** pausa el proceso en cualquier momento
- Las referencias con error se marcan en rojo — puedes volver a intentar solo esas
