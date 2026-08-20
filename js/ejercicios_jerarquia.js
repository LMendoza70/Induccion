/* ============ normalizacion y evaluacion de expresiones ============ */

function norm(s){
  s = (s || "").toLowerCase();
  s = s.replace(/²/g,"^2").replace(/³/g,"^3").replace(/⁴/g,"^4").replace(/⁵/g,"^5");
  s = s.replace(/[×·∙＊]/g,"*");
  s = s.replace(/÷/g,"/");
  s = s.replace(/[–—−]/g,"-");
  s = s.replace(/\s+/g,"");
  return s;
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
    id: "c",
    title: "① Convertir en expresión algorítmica",
    intro: "Convierte cada expresión algebraica a una <strong>expresión aritmética algorítmica</strong> " +
           "(solo con los símbolos de la computadora: + − * / ^).",
    ejercicios: [
      {
        titulo: "Ejercicio 1",
        formula: "5 ∙ (x + y)",
        nota: "El símbolo ∙ representa una multiplicación.",
        pasos: [
          { label: "Expresión algorítmica", tipo: "text", esp: ["5*(x+y)","5(x+y)"] }
        ]
      },
      {
        titulo: "Ejercicio 2",
        formula: "a² + b²",
        nota: "La potencia se escribe con el símbolo ^.",
        pasos: [
          { label: "Expresión algorítmica", tipo: "text", esp: ["a^2+b^2","a**2+b**2","a2+b2"] }
        ]
      },
      {
        titulo: "Ejercicio 3",
        formula: "xy ∙ (z + w)",
        nota: "Implicitamente xy significa x · y; escríbelo con *.",
        pasos: [
          { label: "Expresión algorítmica", tipo: "text", esp: ["x*y*(z+w)","x*y(z+w)","x*(y)*(z+w)","xy*(z+w)","xy(z+w)"] }
        ]
      }
    ]
  },
  {
    id: "e",
    title: "② Convertir en caso necesario y evaluar",
    intro: "Evalúa las siguientes expresiones <strong>paso a paso</strong>. Valores fijos: " +
           "<span class=\"callout-yellow\">A = 2, B = 2, C = 1, X = 3</span>.",
    ejemplo: {
      titulo: "Ejemplo resuelto en clase",
      formula: "x/6 + 2x/12 − x/15 + 2",
      lineas: [
        ["Paso 1 · Linealizar", "x/6 + 2*x/12 − x/15 + 2"],
        ["Paso 2 · Sustituir X = 3", "3/6 + 2*3/12 − 3/15 + 2"],
        ["Paso 3 · Operar paréntesis", "3/6 + 6/12 − 3/15 + 2"],
        ["Paso 4 · Divisiones", "0.5 + 0.5 − 0.2 + 2"],
        ["Paso 5 · Sumas y restas", "0.8 + 2"],
        ["Resultado final", "2.8"]
      ]
    },
    ejercicios: [
      {
        titulo: "Ejercicio 1",
        formula: "A * (B + 3)",
        pasos: [
          { label: "Sustituye los valores", tipo: "text", esp: ["2*(2+3)","2(2+3)"] },
          { label: "Resuelve el paréntesis", tipo: "text", esp: ["2*5"] },
          { label: "Resultado final", tipo: "num", esp: [10] }
        ]
      },
      {
        titulo: "Ejercicio 2",
        formula: "7ab⁴ − 3ab⁴",
        nota: "Recuerda que ab⁴ = a · b⁴.",
        pasos: [
          { label: "Sustituye a = 2, b = 2", tipo: "text", esp: ["7*2*2^4-3*2*2^4","7*2*2**4-3*2*2**4"] },
          { label: "Calcula la potencia 2⁴ = 16", tipo: "text", esp: ["7*2*16-3*2*16"] },
          { label: "Resultado final", tipo: "num", esp: [128] }
        ]
      },
      {
        titulo: "Ejercicio 3",
        formula: "7 DIV 2",
        nota: "DIV significa división entera (se toma la parte entera del cociente).",
        pasos: [
          { label: "Resultado de 7 DIV 2", tipo: "num", esp: [3] }
        ]
      },
      {
        titulo: "Ejercicio 4",
        formula: "B * A − B² / 4 * C",
        nota: "Respeta la jerarquía: primero ^, luego * y / de izquierda a derecha.",
        pasos: [
          { label: "Sustituye los valores", tipo: "text", esp: ["2*2-2^2/4*1","2*2-2**2/4*1"] },
          { label: "Calcula la potencia B² = 4", tipo: "text", esp: ["2*2-4/4*1"] },
          { label: "Multiplicaciones y divisiones (izq. a der.)", tipo: "text", esp: ["4-1","4-1*1"] },
          { label: "Resultado final", tipo: "num", esp: [3] }
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
    html += "<h2" + (sec.id === "e" ? " class=\"c2\"" : "") + ">" + sec.title + "</h2>";
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
        if (p.tipo === "num") {
          html += "<li>" + p.label + ": <strong>" + p.esp[0] + "</strong></li>";
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
      var box = app.querySelector(".exercise .solution-box");
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
