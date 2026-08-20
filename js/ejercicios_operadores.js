/* ============ normalizacion y evaluacion de expresiones ============ */

function norm(s){
  s = (s || "").toLowerCase();
  s = s.replace(/²/g,"^2").replace(/³/g,"^3").replace(/⁴/g,"^4").replace(/⁵/g,"^5");
  s = s.replace(/[×·∙＊]/g,"*");
  s = s.replace(/÷/g,"/");
  s = s.replace(/[–—−]/g,"-");
  s = s.replace(/["']/g,"");
  s = s.replace(/\s+/g,"");
  return s;
}
function normBool(val){
  var n = norm(val);
  if (["verdadero","true","v","1","si"].indexOf(n) !== -1) return true;
  if (["falso","false","f","0","no"].indexOf(n) !== -1) return false;
  return null;
}

var tk = null;
function makeTokenizer(src){
  var tks = [];
  var re = /\d+(?:\.\d+)?|[a-z]+|[+\-*/%^()]/g, m;
  while ((m = re.exec(src))) tks.push({ v: m[0], i: m.index });
  tks.push({ v: "$", i: src.length });
  return { tks: tks, i: 0 };
}
function parseExpr(){
  if (tk.tks[tk.i].v === "$") return NaN;
  var v = parseTerm(), t = tk.tks[tk.i].v;
  while (t === "+" || t === "-") {
    tk.i++;
    var r = parseTerm();
    v = (t === "+") ? v + r : v - r;
    t = tk.tks[tk.i].v;
  }
  return v;
}
function parseTerm(){
  var v = parseUnary(), t = tk.tks[tk.i].v;
  while (t === "*" || t === "/" || t === "div" || t === "mod" || t === "%") {
    tk.i++;
    var r = parseUnary();
    if (t === "*") v = v * r;
    else if (t === "/") v = v / r;
    else if (t === "div") v = Math.floor(v / r);
    else v = v % r;
    t = tk.tks[tk.i].v;
  }
  return v;
}
function parseUnary(){
  if (tk.tks[tk.i].v === "-") { tk.i++; return -parseUnary(); }
  return parsePower();
}
function parsePower(){
  var b = parsePrimary();
  if (tk.tks[tk.i].v === "^") { tk.i++; return Math.pow(b, parseUnary()); }
  return b;
}
function parsePrimary(){
  var t = tk.tks[tk.i].v;
  if (t === "(") { tk.i++; var v = parseExpr(); if (tk.tks[tk.i].v === ")") tk.i++; return v; }
  if (/^\d/.test(t)) { tk.i++; return parseFloat(t); }
  return NaN;
}
function evalExpr(src){
  try {
    tk = makeTokenizer(norm(src));
    var v = parseExpr();
    if (tk.tks[tk.i].v !== "$") return NaN;
    return v;
  } catch (e) { return NaN; }
}
function isNumEqual(a, b, tol){
  if (isNaN(a) || isNaN(b)) return false;
  return Math.abs(a - b) < (tol || 1e-6);
}

/* ================= datos de los ejercicios ================= */

var DATA = [
  {
    id: "a",
    title: "① Expresiones aritméticas",
    intro: "Dadas las declaraciones <span class=\"callout-yellow\">MITAD = 0.5, numero = 2, x = 3, z = 5.2</span>, " +
           "evalúa cada expresión <strong>paso a paso</strong>: sustituye valores → opera (respetando la " +
           "jerarquía) → identifica el tipo de dato. Ejemplo rápido: numero * -4 = 2 * -4 = −8 (entero).",
    ejemplo: {
      titulo: "Ejemplo resuelto en clase",
      formula: "12 + z * MITAD",
      lineas: [
        ["Sustituyendo", "12 + 5.2 * 0.5"],
        ["Priorizando (primero la multiplicación)", "5.2 * 0.5 = 2.6"],
        ["Sumando", "12 + 2.6 = 14.6"],
        ["Resultado", "14.6 — tipo de dato: real"]
      ]
    },
    ejercicios: [
      {
        titulo: "Ejercicio 1",
        formula: "x * - numero",
        pasos: [
          { label: "Sustituye los valores", tipo: "text", esp: ["3*-2","3 * -2","3*(-2)"] },
          { label: "Resultado", tipo: "num", esp: [-6] },
          { label: "Tipo de dato resultante", tipo: "text", esp: ["entero","integer","int"] }
        ]
      },
      {
        titulo: "Ejercicio 2",
        formula: "44 MOD 7 DIV numero",
        nota: "MOD y DIV tienen la misma prioridad; se resuelven de izquierda a derecha.",
        pasos: [
          { label: "Sustituye numero = 2", tipo: "text", esp: ["44mod7div2"] },
          { label: "Calcula 44 MOD 7", tipo: "num", esp: [2] },
          { label: "Resultado: (2) DIV 2", tipo: "num", esp: [1] },
          { label: "Tipo de dato resultante", tipo: "text", esp: ["entero","integer","int"] }
        ]
      },
      {
        titulo: "Ejercicio 3",
        formula: "numero + numero DIV numero",
        nota: "Primero la división (DIV), después la suma.",
        pasos: [
          { label: "Sustituye numero = 2", tipo: "text", esp: ["2+2 div 2","2+2div2"] },
          { label: "Resuelve la división", tipo: "text", esp: ["2+1"] },
          { label: "Resultado", tipo: "num", esp: [3] },
          { label: "Tipo de dato resultante", tipo: "text", esp: ["entero","integer","int"] }
        ]
      },
      {
        titulo: "Ejercicio 4",
        formula: "MITAD * - ( x - z )",
        nota: "Primero el paréntesis y recuerda: menos por menos es más.",
        pasos: [
          { label: "Sustituye los valores", tipo: "text", esp: ["0.5*-(3-5.2)","0.5 * -(3-5.2)"] },
          { label: "Resuelve el paréntesis y el signo", tipo: "text", esp: ["0.5*2.2","0.5* -(-2.2)","0.5*2.2"] },
          { label: "Resultado", tipo: "num", esp: [1.1] },
          { label: "Tipo de dato resultante", tipo: "text", esp: ["real","decimal","flotante","float"] }
        ]
      },
      {
        titulo: "Ejercicio 5",
        formula: "9 - numero / MITAD",
        nota: "Primero la división, después la resta.",
        pasos: [
          { label: "Sustituye los valores", tipo: "text", esp: ["9-2/0.5","9 - 2 / 0.5"] },
          { label: "Resuelve la división", tipo: "text", esp: ["9-4"] },
          { label: "Resultado", tipo: "num", esp: [5] },
          { label: "Tipo de dato resultante", tipo: "text", esp: ["real","decimal","flotante","float"] }
        ]
      }
    ]
  },
  {
    id: "l",
    title: "② Expresiones lógicas",
    intro: "Dadas las declaraciones <span class=\"callout-yellow\">UNO = 1, LETRAS = \"abd\", SI = verdadero, " +
           "vocal = 'i', a = 1, b = -3, x = 4.2, z = 2.8</span>, evalúa cada expresión y escribe " +
           "<strong>verdadero</strong> o <strong>falso</strong>. Recuerda: \"no\" = NOT (negación) y \"y\" = AND.",
    ejemplo: {
      titulo: "Ejemplo resuelto en clase",
      formula: "x > z - b",
      lineas: [
        ["Sustituyendo", "4.2 > 2.8 − (−3)"],
        ["Aplicando menos por menos es más", "4.2 > 2.8 + 3"],
        ["Obteniendo", "4.2 > 5.8"],
        ["Evaluando: 4.2 NO es mayor que 5.8", "FALSO"]
      ]
    },
    ejercicios: [
      {
        titulo: "Ejercicio 1",
        formula: "no SI o falso",
        nota: "\"no\" niega el valor verdadero; \"o\" es OR (verdadero si alguna es verdadera).",
        pasos: [
          { label: "Evalúa la negación: no SI = ?", tipo: "bool", esp: [false] },
          { label: "Resultado: (falso) o falso = ?", tipo: "bool", esp: [false] }
        ]
      },
      {
        titulo: "Ejercicio 2",
        formula: "LETRAS + \"124\" = \"abd124\"",
        nota: "El operador \"+\" entre textos concatena cadenas.",
        pasos: [
          { label: "Concatena LETRAS con \"124\"", tipo: "text", esp: ["abd124","\"abd124\"","abd + 124"] },
          { label: "Compara: ¿abd124 = abd124?", tipo: "bool", esp: [true] }
        ]
      },
      {
        titulo: "Ejercicio 3",
        formula: "vocal > 'h' y UNO >= 1 ** 3",
        nota: "\"y\" es AND. Primero se evalúan las comparaciones y las potencias.",
        pasos: [
          { label: "Compara los caracteres: vocal > 'h'", tipo: "bool", esp: [true] },
          { label: "Calcula la potencia 1 ** 3", tipo: "num", esp: [1] },
          { label: "Evalúa: UNO >= 1", tipo: "bool", esp: [true] },
          { label: "Resultado: (verdadero) y (verdadero)", tipo: "bool", esp: [true] }
        ]
      }
    ]
  }
];

/* ================= estado ================= */

var state = {};

function pasoKey(secId, exIdx, stIdx){
  return secId + "_" + exIdx + "_" + stIdx;
}

function checkPaso(key, input, fb, paso){
  var val = input.value;
  if (val.trim() === "") { fb.className = "fb"; fb.textContent = "↩ completa este campo"; return; }
  var ok = false;
  if (paso.tipo === "num") {
    var got = evalExpr(val);
    ok = paso.esp.some(function(n){ return isNumEqual(got, n); });
  } else if (paso.tipo === "bool") {
    ok = paso.esp.some(function(b){ return normBool(val) === b; });
  } else {
    var n = norm(val);
    ok = paso.esp.some(function(exp){ return n === norm(exp); });
  }
  state[key] = ok;
  if (ok) {
    fb.className = "fb ok";
    fb.textContent = "✓ ¡Correcto!";
    input.style.borderColor = "var(--accent2)";
    input.style.background = "#eaf7ee";
  } else {
    fb.className = "fb no";
    fb.textContent = "✗ Inténtalo de nuevo";
    input.style.borderColor = "var(--accent)";
    input.style.background = "#fff5f2";
  }
  updateScore();
}

function updateScore(){
  var total = 0, correct = 0;
  Object.keys(state).forEach(function(k){
    total++;
    if (state[k]) correct++;
  });
  document.getElementById("scoreTotal").textContent = correct + " / " + total;
  var pct = total === 0 ? 0 : Math.round(correct / total * 100);
  document.getElementById("scoreFill").style.width = pct + "%";
}

/* ================= render ================= */

function render(){
  var app = document.getElementById("app");
  var html = "";

  DATA.forEach(function(sec){
    html += "<h2>" + sec.title + "</h2>";
    html += "<p>" + sec.intro + "</p>";

    if (sec.ejemplo) {
      html += "<div class=\"example\"><h3>" + sec.ejemplo.titulo + " <span class=\"badge\">explicado en clase</span></h3>";
      html += "<p>Expresión: <span class=\"formula\">" + sec.ejemplo.formula + "</span></p>";
      html += "<table class=\"example-steps\">";
      html += "<tr><th>Paso</th><th>Expresión</th></tr>";
      sec.ejemplo.lineas.forEach(function(f){
        html += "<tr><td>" + f[0] + "</td><td>" + f[1] + "</td></tr>";
      });
      html += "</table></div>";
    }

    sec.ejercicios.forEach(function(ex, exIdx){
      html += "<div class=\"exercise\">";
      html += "<h3>" + ex.titulo + " <span class=\"badge\">para resolver</span></h3>";
      html += "<p style=\"margin:0 0 6px 0;\">Expresión: <span class=\"formula\">" + ex.formula + "</span></p>";
      if (ex.nota) html += "<p style=\"font-size:16px;color:#777;margin:0 0 6px 0;\">✏️ " + ex.nota + "</p>";

      html += "<div class=\"steps\">";
      ex.pasos.forEach(function(p, stIdx){
        var key = pasoKey(sec.id, exIdx, stIdx);
        html += "<div class=\"step\">";
        html += "<span class=\"lbl\">" + p.label + ":</span>";
        html += "<input class=\"answer\" data-key=\"" + key + "\" data-tipo=\"" + p.tipo + "\" data-esp=\"" + encodeURIComponent(JSON.stringify(p.esp)) + "\" placeholder=\"tu respuesta\">";
        html += "<button class=\"mini\" data-key=\"" + key + "\">✓</button>";
        html += "<span class=\"fb\" data-fb=\"" + key + "\"></span>";
        html += "</div>";
      });
      html += "</div>";

      html += "<div class=\"ex-actions\">";
      html += "<button class=\"btn\" data-all=\"" + sec.id + "_" + exIdx + "\">Verificar ejercicio</button>";
      html += "<button class=\"btn ghost\" data-sol=\"" + sec.id + "_" + exIdx + "\">Mostrar solución</button>";
      html += "</div>";

      html += "<div class=\"solution-box\">";
      html += "<h4>✓ Solución</h4><ul>";
      ex.pasos.forEach(function(p){
        if (p.tipo === "bool") {
          html += "<li>" + p.label + ": <strong>" + (p.esp[0] ? "Verdadero" : "Falso") + "</strong></li>";
        } else {
          html += "<li>" + p.label + ": <strong>" + p.esp[0] + "</strong></li>";
        }
      });
      html += "</ul></div>";

      html += "</div>";
    });
  });

  app.innerHTML = html;

  app.querySelectorAll("input.answer").forEach(function(inp){
    inp.addEventListener("keydown", function(ev){
      if (ev.key === "Enter") {
        ev.preventDefault();
        var key = inp.getAttribute("data-key");
        var fb = app.querySelector(".fb[data-fb=\"" + key + "\"]");
        var paso = getPaso(key);
        checkPaso(key, inp, fb, paso);
      }
    });
  });

  app.querySelectorAll("button.mini").forEach(function(btn){
    btn.addEventListener("click", function(){
      var key = btn.getAttribute("data-key");
      var inp = app.querySelector("input[data-key=\"" + key + "\"]");
      var fb = app.querySelector(".fb[data-fb=\"" + key + "\"]");
      var paso = getPaso(key);
      checkPaso(key, inp, fb, paso);
    });
  });

  app.querySelectorAll("button[data-all]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var prefix = btn.getAttribute("data-all");
      app.querySelectorAll("input.answer").forEach(function(inp){
        var key = inp.getAttribute("data-key");
        if (key.indexOf(prefix) === 0) {
          var fb = app.querySelector(".fb[data-fb=\"" + key + "\"]");
          var paso = getPaso(key);
          checkPaso(key, inp, fb, paso);
        }
      });
    });
  });

  app.querySelectorAll("button[data-sol]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var prefix = btn.getAttribute("data-sol");
      var found = null;
      app.querySelectorAll(".exercise").forEach(function(ex){
        var first = ex.querySelector("button[data-all]");
        if (first && first.getAttribute("data-all") === prefix) found = ex;
      });
      if (found) found.querySelector(".solution-box").classList.toggle("show");
    });
  });
}

function getPaso(key){
  var parts = key.split("_");
  var secId = parts[0];
  var exIdx = parseInt(parts[1], 10);
  var stIdx = parseInt(parts[2], 10);
  var sec = DATA.filter(function(s){ return s.id === secId; })[0];
  return sec.ejercicios[exIdx].pasos[stIdx];
}

render();
