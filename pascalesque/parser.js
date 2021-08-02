importScripts("https://cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js");

function rowpascal(n) {
  var out = [1].concat(Array(n));

  var ndiv2 = Math.floor(n/2);
  var rcoeff = BigInt(1);

  _.range(1, n+1)
   .forEach(i => {
     out[i] = i > ndiv2
               ? out[n-i]
               : rcoeff = (rcoeff * BigInt(n-i+1))/BigInt(i)
   });

   return out;
}

function pascalian(n, sequence) {
  function newrow(row) {
    var out = [];
    prev = 0;
    for (var x of row) {
      x = parseFloat(x);
      x = isNaN(x) ? 0 : x
      out.push(prev + x);
      prev = x;
    }
    out.push(row[row.length-1]);
    return out;
  }

  var out = [sequence];
  prevrow = sequence;
  for (var i of _.range(n)) {
    prevrow = newrow(prevrow);
    out.push(prevrow);
  }
  return out;
}

function pascalianI_w_custom_adder(sequence, add) {
  var out = [sequence];

  while (sequence.length > 1) {
    sequence = _.zip(sequence, sequence.slice(1))
                .slice(0, -1)
                .map(([a, b]) => add(a, b))
    out.push(sequence);
  }

  return out;
}

function pascalianI(sequence) {
  return pascalianI_w_custom_adder(sequence, (a, b) => {
    a = isNaN(a = parseFloat(a)) ? 0 : a;
    b = isNaN(b = parseFloat(b)) ? 0 : b;
    return a+b;
  });
}

COMMENT = "[#]"
KEYWORDS = {
  rowpascal: {
    usage: "$rowpascal ROW",
    desc: "compute an arbitrary row of Pascal's triangle",
    method: (argv, lines) => {
      var n = parseInt(argv[1]);
      if (!isNaN(n) && n>=0)
        return [rowpascal(n)].concat(parseInput(lines.join('\n')));
      else
        return [argv].concat(parseInput(lines.join('\n')));
    },
  },

  pascal: {
    usage: "$pascal ROW",
    desc: "compute Pascal's triangle upto an arbitrary row",
    method: (argv, lines) => {
      var n = parseInt(argv[1]);
      if (!isNaN(n) && n>=0)
        return _.range(n).map(j => rowpascal(j)).concat(parseInput(lines.join('\n')));
      else
        return [argv].concat(parseInput(lines.join('\n')));
    },
  },

  invert: {
    usage: "$invert",
    desc: "inverts every line following it",
    method: (argv, lines) => parseInput(lines.join('\n')).reverse()
  },

  pascalian: {
    usage: "$pascalian ROW [SEQUENCE]",
    desc: "computes ROW rows from the starting SEQUENCE using Pascal's method.\nIf SEQUENCE is not given, it is assumed to be the next line.",
    method: (argv, lines) => {
      var n = parseInt(argv[1]);
      if (!isNaN(n)&&n>=0) {
        var seq = argv.slice(2);
        var offidx = 0;
        seq = seq.length > 0 ? seq : parseInput(lines[offidx++]).filter(r=>r.length>0)[0];
        return pascalian(n, seq).concat(parseInput(lines.slice(offidx).join("\n")));
      }
      else
        return parseInput(lines.join("\n"));
    },
  },

  pascalianI: {
    usage: "$pascalianI [SEQUENCE]",
    desc: "takes SEQUENCE and generates rows using Pascal's method until a row of length 1 is reached.\nIf SEQUENCE is not given, it is assumed to be the next line.",
    method: (argv, lines) => {
      argv = argv.slice(1);
      var offidx = 0;
      var seq = argv.length > 0 ? argv : parseInput(lines[offidx++]).filter(r=>r.length>0)[0];
      return pascalianI(seq).concat(parseInput(lines.slice(offidx).join("\n")));
    },
  },
}
function helptext() {
  var text = "";
  for ([cmd, obj] of _.pairs(KEYWORDS)) {
    text += `<h3 style="margin-bottom: 2px">$${cmd}:</h3>`;
    text += `<pre style="margin: 0px 0px; margin-left: 40px;"><b>Usage: </b>${obj.usage}</pre>`;
    text += `<pre style="margin-left: 40px; display: inline;"><b>Desc: </b></pre><pre style="display: inline-flex"">${obj.desc}</pre>`
  }

  return `<div style="text-align: left">${text}</div>`;
}

function parseInput(arrangement, opts) {
  var lines = arrangement.trim().split("\n").map(s => s.trim());
  var out = [];

  var keyword;
  for (var idx of _.range(lines.length)) {
    var l = lines[idx];

    if (l.startsWith("$")
        && KEYWORDS.hasOwnProperty(keyword = l.slice(1, (i => i==-1 ? undefined : i)(l.indexOf(" "))))) {
      var args = l.split(" ").filter(c=>c!=="");  // TODO: smarter parsing?
      try {
        return out.concat(KEYWORDS[keyword].method(args, lines.slice(idx+1)));
      } catch (e) {
        report_error(e);
      }
    }

    if (!l.startsWith(COMMENT))
      out.push(l.split(" ").filter(c => c!==""))
  }

  return out;
}

function report_error(e) {
  postMessage({
    type: "error",
    msgs: [`${e.name} in ${e.fileName} at line ${e.lineNumber}`, `<b>${e.message}</b>`],
  })
}

self.addEventListener('message', m => {
  switch (m.data.type) {
    case "parseInput":
      postMessage({
        type: "inputParsed",
        arrangement: parseInput(m.data.arrangement).filter(r => r.length>0),
        docompute: m.data.docompute,
      });
      break;

    case "getHelp":
      postMessage({
        type: "commandsHelp",
        helptext: helptext()
      });
      break;

    case "newCommand":
      try {
        KEYWORDS[m.data.keyword] = {
          usage: m.data.usage,
          desc: m.data.desc,
          method: new Function("argv", "lines", m.data.func_body),
        }

      } catch (e) {
        report_error(e);
      }
      break;
  }
});
