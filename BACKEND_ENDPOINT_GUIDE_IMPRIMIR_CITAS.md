# Guía de Implementación: Endpoints para Citas Confirmadas (Impresión PDF)

Esta guía describe los endpoints implementados en el backend para la funcionalidad de impresión de citas confirmadas.

## Objetivo

Permitir obtener una lista de citas con estado "confirmada" filtradas por **fecha** y **área**, **ordenadas por fecha de registro** (orden de llegada) y **numeradas** para ser publicadas en la entrada del servicio.

---

## 1. Endpoints Implementados

### **GET /api/citas/confirmadas** - Lista de Citas (JSON)

Obtiene las citas confirmadas en formato JSON para vista previa.

```bash
GET /api/citas/confirmadas?fecha=2025-12-11&area_id=1
```

**Respuesta:**
```json
{
    "success": true,
    "fecha": "2025-12-11",
    "area": {
        "id": 1,
        "nombre": "Medicina General"
    },
    "total": 2,
    "citas": [
        {
            "numero": 1,
            "id": 123,
            "paciente": {...},
            "horario": {...},
            "fecha_registro": "2025-12-10T14:30:00"
        }
    ]
}
```

---

### **GET /api/citas/confirmadas/pdf** - Documento PDF

Genera un PDF listo para imprimir.

```bash
GET /api/citas/confirmadas/pdf?fecha=2025-12-11&area_id=1
```

**Respuesta:** `application/pdf` (blob)

El PDF incluye:
- Encabezado con nombre del centro de salud
- Fecha y área seleccionadas
- Tabla numerada de citas (N°, Paciente, DNI, Hora)
- Pie de página con fecha/hora de generación

---

## 2. Integración en el Frontend

### citaService.ts

```typescript
// Interfaces
export interface CitaConfirmadaParams {
    fecha: string       // YYYY-MM-DD
    area_id: number
}

export interface CitaConfirmadaItem {
    numero: number
    id: number
    paciente: PacienteConfirmada
    horario: HorarioConfirmada | null
    fecha_registro: string
}

export interface CitaConfirmadaResponse {
    success: boolean
    fecha: string
    area: { id: number; nombre: string }
    total: number
    citas: CitaConfirmadaItem[]
}

// Métodos
const citaService = {
    // ...otros métodos...

    // Obtener citas confirmadas (JSON)
    getCitasConfirmadas(params: CitaConfirmadaParams) {
        return api.get<CitaConfirmadaResponse>('/citas/confirmadas', { params })
    },

    // Descargar PDF de citas confirmadas
    descargarPDFCitasConfirmadas(params: CitaConfirmadaParams) {
        return api.get('/citas/confirmadas/pdf', {
            params,
            responseType: 'blob' as const
        })
    }
}
```

### Función para abrir PDF en nueva pestaña

```typescript
const imprimir = async () => {
  if (!filtrosImprimir.value.fecha || !filtrosImprimir.value.area_id) return

  isDownloadingPDF.value = true

  try {
    const params = {
      fecha: filtrosImprimir.value.fecha,
      area_id: filtrosImprimir.value.area_id as number
    }

    const response = await citaService.descargarPDFCitasConfirmadas(params)

    // Crear blob y abrir en nueva pestaña
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    
    // Abrir en nueva pestaña para imprimir
    window.open(url, '_blank')
    
    // Revocar URL después de un tiempo
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)

  } catch (error) {
    console.error('Error al generar PDF:', error)
    // Mostrar error al usuario
  } finally {
    isDownloadingPDF.value = false
  }
}
```

---

## 3. Flujo de Usuario

1. Usuario navega a **Citas** → tab **"Imprimir Citas Confirmadas"**
2. Selecciona **fecha** y **área**
3. Hace clic en **"Buscar Citas"** → Vista previa en tabla
4. Hace clic en **"Imprimir PDF"** → Se abre nueva pestaña con el PDF
5. Usuario imprime desde el navegador (Ctrl+P / Cmd+P)

---

## 4. Notas Importantes

| Característica | Descripción |
|----------------|-------------|
| **Ordenamiento** | Por `fecha_registro` ascendente (orden de llegada) |
| **Numeración** | Campo `numero` generado por el backend |
| **PDF** | Generado por el backend, formateado para impresión |
| **Estado** | Solo citas con estado `confirmada` |

---

## 5. Archivos Frontend Modificados

| Archivo | Cambio |
|---------|--------|
| `src/services/citaService.ts` | + método `descargarPDFCitasConfirmadas()` |
| `src/views/CitasView.vue` | Función `imprimir()` usa endpoint PDF |
