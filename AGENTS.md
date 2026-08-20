# AGENTS.md

## What this is

Static educational site for a university induction course ("Razonamiento Lógico — Curso propedéutico"). All content is in **Spanish**.

## Structure

```
Material/
├── css/
│   ├── base.css          ← shared theme (variables, body, notebook, typography, header/footer)
│   ├── componentes.css   ← shared components (note-box, example, exercise, tables, etc.)
│   └── ejercicios.css    ← interactive exercise styles (inputs, steps, scoreboard)
├── js/
│   ├── ejercicios_operadores.js   ← self-contained (parser + data + render + events)
│   └── ejercicios_jerarquia.js    ← self-contained (parser + data + render + events)
├── index.html                     ← course landing page / table of contents
├── *_apuntes.html                 ← lecture notes (CSS only, no JS)
├── ejercicios_*.html              ← interactive exercises (CSS + JS)
└── *.docx                         ← downloadable exercise sheets (Word format)
```

No build system, no dependencies, no tests, no CI.

## Key conventions

- All HTML files link external CSS/JS (no inline `<style>` or `<script>`)
- Content uses a "notebook" visual style: CSS gradients, hand-drawn fonts (Kalam, Caveat)
- Use `lang="es"` on all HTML files
- Each HTML has a modifier class on `.notebook` for page-specific overrides (e.g. `.notebook.index`, `.notebook.ejercicios`)
- Pages that don't need JS simply don't include a `<script>` tag
- Each JS file is fully self-contained (duplicated parser logic) — no shared JS modules
- Navigation between pages is via `<a>` links at the bottom of each page
- To add a new exercise page: copy an existing `ejercicios_*.html`, create its own JS in `js/`, add page-specific CSS overrides in `componentes.css`

## CSS load order

1. `base.css` — theme foundation
2. `componentes.css` — reusable components
3. `ejercicios.css` — only on exercise pages (loaded after componentes.css)

## Git

- Branch from `main` for any changes

---

## Workflow: crear una nueva página de apuntes

1. **Crear el HTML** copiando una página de apuntes existente como plantilla
2. **Cambiar el `<title>`** y el contenido
3. **Añadir la clase del notebook** al div raíz: `<div class="notebook MI_CLASE">`
4. **Añadir overrides** en `componentes.css` si se necesitan (max-width, colores de h2, etc.)
5. **Añadir la card** en `index.html` dentro del grid `.cards` con el enlace a la nueva página
6. **No incluir `<script>`** — las páginas de apuntes son solo CSS

### Plantilla HTML para apuntes

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>TÍTULO — Apuntes</title>
<link rel="stylesheet" href="./css/base.css">
<link rel="stylesheet" href="./css/componentes.css">
</head>
<body>
<div class="notebook MI_CLASE">

  <div class="header">Tecnologías de la Información — Curso propedéutico de Razonamiento Lógico</div>

  <p style="margin:0 0 14px 0;"><a href="./index.html" class="back-link">← Volver al índice</a></p>

  <h1>TÍTULO</h1>
  <div class="subtitle"><span class="tag">Apuntes de clase</span> — breve descripción</div>

  <!-- contenido aquí -->

  <div class="doodle-divider">• • •</div>

  <div class="footer">Elaborado por: MTI. Luis Alberto Mendoza San Juan</div>

</div>
</body>
</html>
```

## Workflow: crear una nueva página de ejercicios

1. **Crear el HTML** copiando `ejercicios_operadores.html` como plantilla
2. **Crear el JS** copiando un `js/ejercicios_*.js` existente y modificar:
   - El array `DATA` con los nuevos ejercicios
   - Los campos `esp` (respuestas esperadas) de cada paso
3. **Añadir overrides** en `componentes.css` si se necesitan
4. **Añadir la card** en `index.html`
5. **Incluir los 3 CSS + 1 JS**

### Plantilla HTML para ejercicios

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>TÍTULO — Práctica interactiva</title>
<link rel="stylesheet" href="./css/base.css">
<link rel="stylesheet" href="./css/componentes.css">
<link rel="stylesheet" href="./css/ejercicios.css">
</head>
<body>
<div class="notebook ejercicios">

  <div class="header">Tecnologías de la Información — Curso propedéutico de Razonamiento Lógico</div>

  <p style="margin:0 0 14px 0;"><a href="./index.html" class="back-link">← Volver al índice</a></p>

  <h1>TÍTULO</h1>
  <div class="subtitle"><span class="tag">Práctica interactiva</span> — descripción</div>

  <div class="note-box">
    Instrucciones de uso...
  </div>

  <div class="scoreboard">
    <div class="total" id="scoreTotal">0 / 0</div>
    <div class="det">respuestas correctas en total</div>
    <div class="bar"><div class="fill" id="scoreFill"></div></div>
  </div>

  <div id="app"></div>

  <div class="doodle-divider">• • •</div>

  <div class="footer">Elaborado por: MTI. Luis Alberto Mendoza San Juan</div>

</div>
<script src="./js/MI_JS.js"></script>
</body>
</html>
```

### Estructura del DATA en los JS de ejercicios

```js
var DATA = [
  {
    id: "x",                    // ID corto único (una letra)
    title: "① Título de sección",
    intro: "Descripción con <span class=\"callout-yellow\">HTML</span>",
    ejemplo: {                   // opcional
      titulo: "Ejemplo resuelto en clase",
      formula: "expresión",
      lineas: [
        ["Paso 1", "resultado"],
        ["Paso 2", "resultado"]
      ]
    },
    ejercicios: [
      {
        titulo: "Ejercicio 1",
        formula: "expresión",
        nota: "pista opcional",
        pasos: [
          {
            label: "Descripción del paso",
            tipo: "num" | "text" | "bool",
            esp: [valor_esperado1, valor_esperado2]  // array de respuestas aceptadas
          }
        ]
      }
    ]
  }
];
```

---

## Chuleta de estilos

### Variables de color (`:root` en `base.css`)

| Variable | Color | Uso principal |
|---|---|---|
| `--accent` | rojo `#c0392b` | h2, borders de exercise, botones |
| `--accent2` | verde `#1e7d4f` | note-box, feedback ✓, solution-box |
| `--accent3` | morado `#7a4fa3` | borders de example, badges de ejemplo |
| `--accent4` | teal `#0e7c86` | tabla de símbolos, inputs focus |
| `--accent5` | dorado `#b8860b` | scoreboard, table.priority |
| `--ink` | azul oscuro `#1f3a5f` | h1, h3, borders principales |
| `--ink2` | gris oscuro `#2d2d2d` | texto cuerpo (body color) |
| `--highlight` | amarillo `#fff2a8` | `.callout-yellow`, `.tag` |
| `--paper` | crema `#fdfcf5` | fondo del cuaderno |
| `--line` | azul claro `#c9d8ea` | líneas del cuaderno |

### Tipografía

| Fuente | Tamaño | Uso |
|---|---|---|
| Caveat 52px | `h1` | Título principal de la página |
| Caveat 34px | `h2` | Títulos de sección (con borde inferior) |
| Caveat 26px | `h3` | Subtítulos dentro de ejemplos/ejercicios |
| Kalam 19px | `p, li` | Texto cuerpo |
| Kalam 14px | `.header`, `.footer` | Cabecera y pie de página |

### Colores de h2 con clases

```html
<h2>Título rojo (default)</h2>       <!-- --accent (rojo) -->
<h2 class="c2">Título morado</h2>     <!-- --accent3 (morado) -->
<h2 class="c3">Título teal</h2>       <!-- --accent4 (teal) -->
<h2 class="c4">Título dorado</h2>     <!-- --accent5 (dorado) -->
<h2 class="c5">Título verde</h2>      <!-- --accent2 (verde) -->
```

### Componentes de contenido

**Caja de notas importante:**
```html
<div class="note-box">
  Texto importante. Puede incluir <span class="callout-yellow">resaltado amarillo</span>.
</div>
```

**Ejemplo resuelto (morado):**
```html
<div class="example">
  <h3>Título del ejemplo <span class="badge">explicado en clase</span></h3>
  <p>Contenido...</p>
</div>
```

**Ejercicio para resolver (rojo):**
```html
<div class="exercise">
  <h3>Título del ejercicio <span class="badge">para resolver</span></h3>
  <p>Enunciado...</p>
  <div class="blank-note">✎ espacio para que el alumno resuelva</div>
</div>
```

**Checklist:**
```html
<ul class="checklist">
  <li>Primer paso</li>
  <li>Segundo paso</li>
</ul>
```

**Código / pseudocódigo:**
```html
<div class="code-block">Inicio
Leer N
R ← N MOD 2
Fin</div>
```

**Expresión centrada:**
```html
<div class="expr-box"><strong>y = 2 + 3 * 4</strong></div>
```

**Fracción (numerador/denominador):**
```html
<span class="frac">
  <span class="num">numerador</span>
  <span class="den">denominador</span>
</span>
```

**Resaltado de texto en pasos:**
```html
<span class="hl">texto resaltado</span>
```

**Separador:**
```html
<div class="doodle-divider">• • •</div>
```

**Enlace "volver al índice":**
```html
<a href="./index.html" class="back-link">← Volver al índice</a>
```

### Tablas

| Clase | Uso |
|---|---|
| `table.data` | Tabla de datos general (operadores, comparaciones) |
| `table.truth` | Tablas de verdad (borde completo, verde en th) |
| `table.priority` | Tabla de jerarquía de operadores (rojo en th) |
| `table.symbols` | Tabla de símbolos de diagramas de flujo (teal en th) |
| `table.answer-guide` | Guía de respuesta tipo salida/entrada/proceso |
| `table.steps-table` | Pasos resueltos con columna de nota |
| `table.example-steps` | Pasos de ejemplo resuelto (en ejercicios JS) |

### Overrides por página en `componentes.css`

Para personalizar una página, usar la clase del notebook como selector:

```css
/* max-width diferente */
.notebook.mi-pagina{ max-width:960px; }

/* cambiar color de h2 solo en esta página */
.notebook.mi-pagina h2{ color:var(--accent3); border-color:var(--accent3); }

/* cambiar example a color teal solo en ejercicios */
.notebook.ejercicios .example{
  border-color:var(--accent4);
  background:#eaf7f8;
}
.notebook.ejercicios .example h3{ color:var(--accent4); }
.notebook.ejercicios .example .badge{ background:var(--accent4); }
```

### Estilos de ejercicios interactivos (`ejercicios.css`)

| Clase | Uso |
|---|---|
| `.formula` | Expresión en recuadro blanco con borde |
| `.steps` / `.step` | Contenedor y fila de cada paso |
| `.step .lbl` | Etiqueta del paso (min-width:230px) |
| `.step input.answer` | Campo de respuesta del alumno |
| `.step .mini` | Botón ✓ pequeño al lado del input |
| `.fb` / `.fb.ok` / `.fb.no` | Feedback: vacío / correcto (verde) / incorrecto (rojo) |
| `.ex-actions` | Fila de botones "Verificar" y "Mostrar solución" |
| `.btn` / `.btn.ghost` | Botón sólido rojo / botón fantasma con borde rojo |
| `.solution-box` / `.show` | Caja de solución (oculta por defecto, `.show` la muestra) |
| `.scoreboard` | Panel de puntuación con barra de progreso |
