var BLOCKED="@X";
var SKIP = "@S";

var HELPTEXT = {
  SHADERS:
`Define a function that will take a DOM object '<b>cell</b>' as input and will return a valid CSS color.

The 'cell' object will also have two fields: '<b>numpaths</b>' and '<b>cell_value</b>' which indicate the number of paths to the cell and the actual contents of the cell respectively.`,

  COMMANDS:
`Define a function that will take two arguments,'<b>argv</b>', and '<b>lines</b>'.

Any line that starts with $CMDNAME is split on the spaces and passed as '<b>argv</b>'.

Every line that occurs after the line starting with $CMDNAME is passed as '<b>lines</b>'.

The function must return an array that represents the parsed state for the rest of the lines.

In most cases, you will not want to parse the rest of the input yourself. 'parseInput(lines.join('\\n'))' will parse the rest of the lines.

You will get to choose CMDNAME when you click 'Create Command'`

}
var CSS_COLOR_NAMES = [
  "AliceBlue",
  "AntiqueWhite",
  "Aqua",
  "Aquamarine",
  "Azure",
  "Beige",
  "Bisque",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "GoldenRod",
  "Gray",
  "Grey",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenRodYellow",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "White",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen",
];

var PREDEFINED_ARRANGEMENTS = {
patterns:
`P
A A
T T T
T T T T
E E E E E
R R R R R R
N N N N N N N
S S S S S S S S`,

mathematics:
`M
A A
T T T
H H H H
E E E E E
M M M M M M
A A A A A A A
T T T T T T
I I I I I
C C C C
S S S`,

triangle:
`T
R R
I I I
A A A A
N N N
G G
L L L
E E E E`,

pascal:`$pascal ROW

[#] replace "ROW" above with row number then click Create to generate Pascal's triangle up to that row
`,

forbidden: `S
1 1
1 2 1
1 3 3 1
1 4 ${BLOCKED} 4 ${BLOCKED}
${BLOCKED} 5 4 4 4 ${BLOCKED}
${BLOCKED} 5 9 8 8 ${BLOCKED} ${BLOCKED}`,

skip: `A
B B
C C C
D ${SKIP} ${SKIP} D
E E E E E
${SKIP} F F ${SKIP}
G G ${SKIP} G G
H H H H H H`,

invert:`[#] $invert
$pascal 15

[#] delete the '[#]' on the first line and click create to see what happens`,

mustafa:
`M
U U
S S S
T T T T
A A A A A
F F F F F F
A A A A A A A
M M M M M M M M
O O O O O O O
T T T T T T
I I I I I
W W W W
A A A
L L
A`,

javascript:
`J
A A
V V V
A A A A
S S S S S
C C C C C
R R R R
I I I
P P
T`,

punctuation:`.
\\ \\
< < <
<< << << <<
$ $ $ $ $
>> >> >> >>
> > >
/ /
.`,

datamgmt:`D D D D
A A A
T T
A
M M
A A A
N N N N
A A A A A
G G G G G G
E E E E E
M M M M
E E E
N N
T`,


emoji:[[9729],
 [128330, 128330],
 [128140, 128140, 128140],
 [128139, 128139, 128139, 128139],
 [127851, 127851, 127851],
 [128059, 128059, 128059],
 [127810, 127810, 127810, 127810],
 [127803, 127803, 127803, 127803, 127803, ],
 [127855, 127855, 127855, 127855],
 [128157, 128157],
 [127800,127800,127800],
 [128152,128152,128152,128152],
 [128142,128142,128142,128142,128142],
 [127758,127758,127758,127758],
 [128032,128032,128032,128032,128032],
 [127811,127811,127811,127811,127811,127811],
 [129361,129361,129361,129361,129361],
 [128012,128012,128012,128012],
 [129344,129344],
 [127873,127873,127873],
 [128081,128081],
 [127853]]
 .map(r => r.map(c => String.fromCodePoint(c))
            .join(" "))
 .join("\n"),

custom: ''
};
var PREDEFINED_SHADERS = {
even_odd:
`return cell.numpaths%2==0 ? 'red' : 'blue'`,

even_odd_pascal:
`return BigInt(cell.cell_value)%BigInt(2)==0 ? 'red' : 'blue'`,

modn:
`let n=3;
let chunk = Math.floor(CSS_COLOR_NAMES.length/n);
return CSS_COLOR_NAMES[(cell.numpaths%n)*chunk]`,

modn_pascal:
`let n=3;
let chunk = BigInt(Math.floor(CSS_COLOR_NAMES.length/n));

let bigint_n = BigInt(n);
return CSS_COLOR_NAMES[(BigInt(cell.cell_value)%bigint_n)*chunk]`,

random:
`return CSS_COLOR_NAMES[Math.floor(Math.random()*CSS_COLOR_NAMES.length)]`,

rgbcmyk:
`var map = {
  R: 'red',
  G: 'green',
  B: 'blue',
  C: 'cyan',
  M: 'magenta',
  Y: 'yellow',
  K: 'black',
};

var v = cell.cell_value.toUpperCase();
return map.hasOwnProperty(v) ? map[v] : "";`

};
var PREDEFINED_COMMANDS = {
invert:
`// this is the actual code used in parser.js
return parseInput(lines.join('\\n')).reverse()
`,

pascalian:
`// this is the actual code used in parser.js
var n = parseInt(argv[1]);
if (!isNaN(n)&&n>=0) {
  var seq = argv.slice(2);
  var offidx = 0;
  seq = seq.length > 0 ? seq : parseInput(lines[offidx++]).filter(r=>r.length>0)[0];
  return pascalian(n, seq).concat(parseInput(lines.slice(offidx).join("\\n")));
}
else
  return parseInput(lines.join("\\n"));`,

pascalianI_custom:
`// much like pascalianI, except you define how two terms are added

function add(a, b) {
  /* define addition here */
}

argv = argv.slice(1);
var offidx = 0;
var seq = argv.length > 0 ? argv : parseInput(lines[offidx++]).filter(r=>r.length>0)[0].map(e=>e.toString());

return pascalianI_w_custom_adder(seq, add).concat(parseInput(lines.slice(offidx).join("\n")));`,

rgb_pascal:
`/*
This reduces a sequence containing 'R', 'B', and 'Y' according to the rules
defined in this Mathologer video https://www.youtube.com/watch?v=9JN5f7_3YmQ

Best used along with the RGBCMYK shader.
Not error tolerant.
*/

var universe = ["R", "B", "Y"]
var seq = argv.map(e=>e.toUpperCase()).filter(e => universe.includes(e));

return pascalianI_w_custom_adder(seq, (a, b) => a==b ? a : universe.filter(e => ![a, b].includes(e))[0])
       .concat(parseInput(lines.join("\\n")));`,

};
var SAVED_FUNCTIONS = _.object(_.keys(window.localStorage).map(k => [k, window.localStorage.getItem(k)]));

//              lavender              maize               greeen                topaz
var COLORS = [ [214, 179, 243, 255], [249, 202, 72, 255], [148, 210, 145, 255], [65, 223, 208, 255] ];
var COLORIDX = 0;

var CURRENT_ARRANGEMENT = [];
var NUMPATHS = 0;

var PATHS_READY = false,
    PATHS_COMPUTING = false,
    TOO_MANY_PATHS = false,
    IS_SHADING = false,
    IS_SHADED = false,
    IS_SWITCHING = false,
    IS_ZOOMED = false;

var ANIMATION_INTERVAL_ID = -1;
var _TRI_ADDER_IDS = [];


/*
if set_arrangement() is called while the setTimeout sequence for adding
the pascal triangle to the arrangement input, then _ADDING_ARR_INPUT will change
back to false
likewise for _ADDING_TRIANGLE while setTimeout sequence for arrangements is ongoing
*/
var _ADDING_ARR_INPUT = false;
var _ADDING_TRIANGLE = false;

var _PASCAL_ARRANGEMENT = [];  // lolll really committing to the global variable approach eh

function _on_anim_button_mouseleave() {
    // console.log("mouseleave")
    var b = document.getElementById("anim_button");
    b.innerHTML = ANIMATION_INTERVAL_ID === -1 ? "Animate" : "Stop Animating";
    b.disabled = false;
    b.style.opacity = "100%";
    b.style.width = 110;
}

function toggle_animate() {
  if (PATHS_READY) {
    if (ANIMATION_INTERVAL_ID === -1) {
      var speed = get_animspeed();
      ANIMATION_INTERVAL_ID = setInterval(draw_next_path, speed);
      document.getElementById("anim_button").innerHTML = "Stop Animating";
    } else {
      clearInterval(ANIMATION_INTERVAL_ID);
      ANIMATION_INTERVAL_ID = -1;
      document.getElementById("anim_button").innerHTML = "Animate";
    }

  }

}

function toggle_arrangement_input_visibility() {
  var b = document.getElementById("arr_button");
  var c = document.getElementById("arr_container");
  var isShowing = Boolean(c.hidden);

  c.hidden = !isShowing;
  b.innerHTML = isShowing ? "Hide" : "Edit Arrangement";
}

function choose_random_arrangement() {
  var i = document.getElementById("arr_input");
  var notcurrents = _.values(PREDEFINED_ARRANGEMENTS)
                     .filter(s => s!==i.value && s!== "")

  var idx = parseInt(Math.random() * (notcurrents.length));
  set_arrangement(notcurrents[idx]);
  postinput_with_restart(true);
}

function set_arrangement(v) {
  _ADDING_ARR_INPUT = false;
  document.getElementById("arr_input").value = v === undefined ? "" : v;
}

function create_arrangement(compute, arrangement) {
    async function _create_arrangement() {
      var WINDOW = 1250;
      var fragments = [];

      var cur_f = document.createDocumentFragment();
      var count = 0;

      for (var ridx of _.range(CURRENT_ARRANGEMENT.length)) {
        var r = CURRENT_ARRANGEMENT[ridx];
        cur_f.appendChild(create_row(r, ridx));
        count += r.length;

        if (count >= WINDOW) {
          fragments.push(cur_f);
          cur_f = document.createDocumentFragment();
          count = 0;
        }
      }

      fragments.push(cur_f);
      return fragments;
    }
    _TRI_ADDER_IDS.forEach(i => clearTimeout(i));
    _TRI_ADDER_IDS = [];
    _ADDING_TRIANGLE = false;

    if (ANIMATION_INTERVAL_ID !== -1) {
      toggle_animate()
    }

    CURRENT_ARRANGEMENT = arrangement;

    var c = document.getElementById("tri_container");

    _create_arrangement()
      .then(fragments => {
        var idx = 0;
        c.innerHTML = "";

        _ADDING_TRIANGLE = true;
        setTimeout(function add_fragments_onebyone() {

          if (idx < fragments.length && _ADDING_TRIANGLE) {
            c.appendChild(fragments[idx]);
            if (idx < 3)  // only center the first three fragments while adding - centering all of them looks weird
              center_arrangement();
            idx++;
            _TRI_ADDER_IDS.push(setTimeout(add_fragments_onebyone, 100));
          } else {
            center_arrangement();
            on_lookup_input_changed();
          }

        }, 0);
      });

    var pl = document.getElementById("pathscount");

    TOO_MANY_PATHS = false;
    PATHS_READY = false;
    // sooo many hacks i swear this is DISGUSTING
    if (compute) {
        pl.innerHTML="computing...";

        PATHS_COMPUTING = true;
        computer.postMessage({
          type: "computePaths",
          current_arrangement: CURRENT_ARRANGEMENT,
          blocked: BLOCKED,
          skip: SKIP,
          memlimit: get_memlimit(),
          everynthpath: get_everynthpath(),
          dotrim: get_dotrim(),
        });

    }

}

function center_arrangement() {

  const cont = document.getElementById("tri_container");
  const rows = cont.children;

  if (rows.length > 0) {
    const longest_width = _.max(rows, r => r.offsetWidth);

    // horizontally offset each row if no horizontal overflow in container
    const hoffset = (cont.scrollWidth - longest_width.offsetWidth) / 2;

    // vertically offset each row if no vertical overflow in container
    const theight = rows.length * (rows[0].offsetHeight);
    const voffset = theight > cont.offsetHeight ? 0 : (cont.offsetHeight - theight) /2;

    for (var r of rows) {
      r.style.left = `${(longest_width.offsetWidth - (r.offsetWidth)) / 2 + hoffset}px`;
      r.style.top  = `${voffset}px`;
    }

    cont.scrollLeft = (cont.scrollWidth - cont.offsetWidth) / 2;

  }
}

function row_length_differences_are_odd(tri) {
  for (var [r1, r2] of _.zip(tri, tri.slice(1))) {
    if (r2 !== undefined) {
      if (Math.abs(r2.length - r1.length) %2 !== 1) { return false; }
    }
  }

  return true;
}

function test_can_animate() {
    var b = document.getElementById("anim_button");

    if (!PATHS_READY) {
      b.style.width="auto";
      // b.disabled = true;
      b.style.opacity = "50%";
      b.innerHTML = "paths not ready";
    }

}

function get_int_value_by_id(id, defaultv, process) {
  var v = parseInt(document.getElementById(id).value);
  return isNaN(v) ? defaultv : (process ?? _.identity)(v);
}

function get_memlimit() {
  return get_int_value_by_id("m_input", 1e+9, v => v*1e+6, );
}

function get_everynthpath() {
  return get_int_value_by_id("nthpath_input", 1);
}

function get_animspeed() {
  return get_int_value_by_id("anim_speed", 500);
}

function get_dotrim() {
  return document.getElementById("do_trim_input").checked;
}

function get_switchpbc() {
  return document.getElementById("switch_pbc_input").checked;
}

function get_next_color() {
  var [r, g, b, a] = COLORS[COLORIDX];
  COLORIDX = (COLORIDX+1)%COLORS.length;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function create_row(r, ridx) {
    var out = document.createElement("div");
    out.className = "row";

    for (var eidx of _.range(r.length)) {
      var e = r[eidx].toString();
      var n = document.createElement("div");
      n.className = "elem";
      n.n = ridx;
      n.r = eidx;
      n.id = `${ridx};${eidx}`
      n.prevcolor = "";

      n.cell_value = e;
      n.numpaths = "N/A";

      if (e === BLOCKED) {n.style.backgroundColor="rgb(185, 185, 185)"}
      if (e === SKIP) {n.style.backgroundColor="rgb(185, 185, 185)"}  // TODO: different color?

      var idx = document.createElement("span");
      idx.className = "idx";
      idx.innerHTML = n.id;

      var np = document.createElement("pre");
      np.className = "cvalue";
      np.innerHTML = `${e}`;

      var pbc = document.createElement("span");
      pbc.className = "pbc";

      n.appendChild(idx);
      n.appendChild(np);
      n.appendChild(pbc);

      out.appendChild(n);
    }

    return out;
}

function draw_path(path, color, cycle) {
    function get_corresponding_div(n, r) {
      return document.getElementById(`${n};${r}`);
    }

    for (var [n, r] of path) {
      var e = get_corresponding_div(n, r);
      if (e.cell_value === SKIP) {
          e.style.opacity = (color === "") ? e.prevcolor : "50%";
      } else {
        if (color === "")
          e.style.backgroundColor = e.prevcolor;
        else
          e.style.backgroundColor = cycle ? get_next_color() : color;

        // e.prevcolor = e.style.backgroundColor;
      }
    }
}

function draw_next_path() {
  computer.postMessage({type: "getNextPath"});
}

 function add_per_block_counts(pbc) {
  var cont = document.getElementById("tri_container");
  for (var row of cont.children) {
    for (var e of row.children) {
      var paths   = _.has(pbc, e.id) ? pbc[e.id] : 0;
      e.numpaths = paths;

      if (paths === 0 && !(e.cell_value === BLOCKED || e.cell_value === SKIP)) {
        e.style.backgroundColor = "rgb(225, 220, 220)"
      }

      var c = e.getElementsByClassName("pbc")[0];
      c.innerHTML = paths;

    }
  }
}

function on_lookup_input_changed() {
  var n = parseInt(document.getElementById("n_input").value);
  var r = parseInt(document.getElementById("r_input").value);

  var cont = document.getElementById("tri_container");
  var c_output = document.getElementById("c_output");
  var p_output = document.getElementById("p_output");
  if ( !(isNaN(n) || isNaN(r))
      && (n >= 0 && n < cont.children.length)
      && (r >= 0 && r < cont.children[n].children.length)) {

        var elem = cont.children[n].children[r];
        c_output.innerHTML = elem.cell_value;
        p_output.innerHTML = elem.numpaths;
      }

  else {
    var err = `N/A`;
    c_output.innerHTML = err;
    p_output.innerHTML = err;
  }

}

function post_download(suggested) {
  // console.log(suggested);
  downloader.postMessage( {
    type: "createDownloadURL",
    current_arrangement: CURRENT_ARRANGEMENT,
    suggested: suggested ?? "arrangement.txt",
  });
}

function post_parse_input(docompute) {
  parser.postMessage({
    type: "parseInput",
    arrangement: document.getElementById("arr_input").value,
    docompute: docompute
  })
}

function post_new_cmd(keyword, usage, desc, func_body) {
  parser.postMessage({
    type: "newCommand",
    keyword: keyword,
    usage: usage,
    desc: desc,
    func_body: func_body,
  })
}

function get_help() {
  parser.postMessage({
    type: "getHelp"
  })
}

function download_arrangement(url, suggested) {
  var link = document.createElement("a");
  link.setAttribute("download", suggested ?? "arrangement.txt");
  link.href = url;

  document.body.appendChild(link);

  window.requestAnimationFrame(()=>{
    var e = new MouseEvent("click");
    link.dispatchEvent(e);
    document.body.removeChild(link);
  })
}

function restart_computer() {
  computer.terminate();
  computer = new Worker('/pascal_triangle/pascalesque/computer.js');
  computer.addEventListener('message', computer_message_f);
}

function switch_pbc() {
    if (!IS_SWITCHING) {
      IS_SWITCHING = true;

      var cont = document.getElementById("tri_container");
      for (var r of cont.children) {
        for (var e of r.children) {
          var cvalue = e.getElementsByClassName('cvalue')[0];
          var pbc = e.getElementsByClassName('pbc')[0];

          [cvalue.innerHTML, pbc.innerHTML] = [pbc.innerHTML, cvalue.innerHTML];
        }
      }

      IS_SWITCHING = false;
    }
}

function report_error(msgs) {
  msgs.forEach(m => console.log(m));
  Swal.fire({
    title: "Error!",
    timer: 5000,
    timerProgressBar: true,
    html: msgs.map(m => `<pre style="white-space: pre-wrap; width: 90%">${m}</pre>`).join(""),
    showConfirmButton: true,
    toast: true,
    position: "bottom"
  });
}

function get_shader() {
  try {
    return new Function("cell", js_codeMirror.getValue());
  } catch (e) {
    report_error(["exception in get_shader()", e]);
    return elt => "";
  }
}

function shade(shade) {
  if (!IS_SHADING) {
    IS_SHADING=true;

    var shader = shade && get_shader();
    var cont = document.getElementById("tri_container");
    try {
      for (var r of cont.children) {
        for (var e of r.children) {
          if (shade) {
            e.style.backgroundColor = shader(e);
            e.prevcolor = e.style.backgroundColor;
          } else {
            e.style.backgroundColor = "";
          }
        }
      }

    } catch (e) {
      report_error(["exception in shade()", e]);
    }
    IS_SHADED = shade;
    // document.getElementById("shade_button").innerHTML = IS_SHADED ? "Unshade" : "Shade";
    IS_SHADING=false;
  }
}

function get_and_post_cmd() {
  Swal.fire({
    title: "Command Definition",
    html:
      '<div style="display: grid; grid-template-columns: max-content max-content; grid-gap: 5px">' +
      `<label style="text-align: right">CMDNAME:&nbsp</label><input id="keyword">` +
      `<label style="text-align: right">Usage:&nbsp</label><input id="usage">` +
      `<label style="text-align: right">Desc:&nbsp</label><input id="desc">` +
       `</div>`,
    focusConfirm: false,
    preConfirm: () => {
      return {
        keyword: document.getElementById("keyword").value,
        usage: document.getElementById("usage").value,
        desc: document.getElementById("desc").value,
      }
    }
  }).then(({ value: { keyword, usage, desc } }) => {
    post_new_cmd(keyword, usage, desc, js_codeMirror.getValue());
  })
}

function zoom_to_fit(zoom) {
  var rules = [...[...document.styleSheets].find(s => s.href.endsWith("triangles.css")).cssRules];

  var elem_style = rules.find(r => r.selectorText=="div.elem").style,
      row_style = rules.find(r => r.selectorText=="div.row").style,
      text_visibility_style = rules.find(r => r.selectorText=="div.elem > pre, div.elem > span").style

  var c = document.getElementById("tri_container")
  if (zoom) {
    var dims = c.getBoundingClientRect(),
        max_width_in_elems = _.max(c.children, r => r.children.length).children.length,
        max_height_in_rows = c.children.length

    var new_width = dims.width / max_width_in_elems - 4,
        new_height = dims.height / max_height_in_rows - 2;

    text_visibility_style.display = "none";
    elem_style.width = `${new_width}px`;
    row_style.height = `${new_height}px`;

  } else {
    elem_style.width = "6.375em";
    row_style.height = "2.6875em";
    text_visibility_style.display = "inherit";
  }

  IS_ZOOMED = zoom;
  document.getElementById("zoom_button").innerHTML = IS_ZOOMED ? "Unzoom" : "Zoom to fit";
  [...c.children].forEach(r => r.style.left=0);
  center_arrangement();

}

function add_select_options_from_object(select, obj, doUpperCase=true) {
  for (var k of _.keys(obj)) {
    var o = document.createElement("option");
    o.value = k;
    o.innerHTML = doUpperCase ? k.toUpperCase() : k;

    select.appendChild(o);
  }
}

function save_function() {
  Swal.fire({
    title: "Enter a name for this function",
    input: "text",
    inputLabel: "Name: ",
    inputValidator: value => value=="" ? 'You need to write something' : undefined
  }).then(({value: name}) => {
    if (name) {
      var func = js_codeMirror.getValue();
      window.localStorage.setItem(name, func);

      if (!_.has(SAVED_FUNCTIONS, name)) {
        var o = document.createElement("option")
        o.value = o.innerHTML = name;
        document.getElementById("func_examples").appendChild(o);
      }

      SAVED_FUNCTIONS[name] = func;
    }
  })
}

function clear_storage() {
  window.localStorage.clear();
  SAVED_FUNCTIONS = {};

  var select = document.getElementById("func_examples");
  while (select.children[select.children.length-1].value !== "--YOURS--")
    select.removeChild(select.children[select.children.length-1]);
}
function main() {

  postinput_with_restart = _.wrap(post_parse_input, (f, compute) => {
    shade(false);
    zoom_to_fit(false);
    restart_computer();
    f(compute);
  });

  // add all event listeners
  window.addEventListener('resize', center_arrangement);
  document.addEventListener("keypress", e => e.target == document.body && e.key === "?" && get_help());

  document.getElementById("anim_button").addEventListener("mouseout", _on_anim_button_mouseleave);
  document.getElementById("anim_button").addEventListener("mouseover", test_can_animate);

  document.getElementById("anim_button").addEventListener("click", toggle_animate);
  document.getElementById("arr_button").addEventListener("click", toggle_arrangement_input_visibility);
  document.getElementById("create_wpaths").addEventListener("click", e => postinput_with_restart(true))
  document.getElementById("create_wopaths").addEventListener("click", e => postinput_with_restart(false));
  document.getElementById("create_random").addEventListener("click", choose_random_arrangement);
  document.getElementById("download_button").addEventListener("click", e => post_download());
  document.getElementById("shade_button").addEventListener("click", e => shade(true));
  document.getElementById("unshade_button").addEventListener("click", e => shade(false));
  document.getElementById("switch_pbc_button").addEventListener("click", e => switch_pbc())
  document.getElementById("zoom_button").addEventListener('click', e => zoom_to_fit(!IS_ZOOMED));
  document.getElementById("commands_help").addEventListener('click', get_help);
  document.getElementById("shader_cmd_help").addEventListener('click', e => {
    Swal.fire({
      title: "Help",
      html: `
      <h3 style="text-align: left">Shaders:</h3>
      <pre style="margin-left: 40px; text-align: left; white-space: pre-wrap; width: 90%">${HELPTEXT.SHADERS}</pre>
      <h3 style="text-align: left">Commands:</h3>
      <pre style="margin-left: 40px; text-align: left; white-space: pre-wrap; width: 90%">${HELPTEXT.COMMANDS}</pre>
      <h5 style="text-align: left">Note that in either case, everything you write is treated as the function <i>body</i>. The function signature is decided based on which button you press.</h5>
      `
    })
  });
  document.getElementById("create_cmd_button").addEventListener('click', get_and_post_cmd);
  document.getElementById("save_function_button").addEventListener('click', save_function);
  document.getElementById("clear_storage_button").addEventListener('click', clear_storage);

  document.getElementById("n_input").addEventListener("input", on_lookup_input_changed);
  document.getElementById("r_input").addEventListener("input", on_lookup_input_changed);
  document.getElementById("anim_speed").addEventListener("input", () => {
    toggle_animate();
    toggle_animate();
  });

  var create_disabled_option = name => {
    var o = document.createElement("option");
    o.setAttribute("disabled", "");
    o.innerHTML = name;
    return o;
  }

  var aselect = document.getElementById("pre_options");
  aselect.addEventListener('change', () => {
    set_arrangement(PREDEFINED_ARRANGEMENTS[aselect.value]);
    postinput_with_restart(true);
    aselect.selectedIndex = 0;
  })
  add_select_options_from_object(aselect, PREDEFINED_ARRANGEMENTS);


  var sselect = document.getElementById("func_examples");
  sselect.addEventListener('change', () => {
    var obj = _.has(PREDEFINED_SHADERS, sselect.value)
                ? PREDEFINED_SHADERS
                : _.has(PREDEFINED_COMMANDS, sselect.value)
                  ? PREDEFINED_COMMANDS
                  : SAVED_FUNCTIONS ;

    js_codeMirror.setValue(obj[sselect.value]);
    sselect.selectedIndex = 0;
  })

  sselect.appendChild(create_disabled_option("--SHADERS--"));
  add_select_options_from_object(sselect, PREDEFINED_SHADERS);

  sselect.appendChild(create_disabled_option("--COMMANDS--"));
  add_select_options_from_object(sselect, PREDEFINED_COMMANDS);

  sselect.appendChild(create_disabled_option("--YOURS--"));
  add_select_options_from_object(sselect, SAVED_FUNCTIONS, false);


  var arr_input = document.getElementById("arr_input");
  arr_input.value = "";
  arr_input.setAttribute("placeholder",
`Enter one row per line. Row elements are space separated.

'${BLOCKED}' denotes a forbidden block (see examples->FORBIDDEN).

'${SKIP}' denotes a skipped block (see examples->SKIP).

'[#]' will comment out a line

Various commands are available. Click '?' to see what they are and what they do.`)

  var cont = document.getElementById("tri_container");

  // handle message from computer
  computer = new Worker("/pascal_triangle/pascalesque/computer.js");
  computer_message_f = m => {
    // console.log(m);
    switch (m.data.type) {
      case "pathsComputed":
      NUMPATHS = m.data.numpaths;
      if (!TOO_MANY_PATHS) {
        PATHS_COMPUTING = false;
        PATHS_READY = true;
        document.getElementById("pathscount").innerHTML=NUMPATHS;

        _.wrap(() => {
          add_per_block_counts(m.data.pbc);
          on_lookup_input_changed();
        }, function c(f) {
          if (cont.children.length == CURRENT_ARRANGEMENT.length)
            f()
          else
            setTimeout(c, 10, f);
        })();
      }
      break;

      case "nextPath":
      // console.log(m);
      var cselect = document.getElementById("colorcycle");
      draw_path(m.data.prevpath, "", false);
      draw_path(m.data.path, cselect.value === "nocycle" ? "rgba(65, 223, 208, 255)" : get_next_color(), cselect.value === "blocks");
      break;

      case "tooManyPaths":
      console.log("too many paths: " + m.data.max + " " + m.data.length);
      // a precaution
      if (!TOO_MANY_PATHS) {
        document.getElementById("pathscount").innerHTML = "aborted.. not enough memory";
        computer.postMessage({type: "destroyPaths"});
      }

      TOO_MANY_PATHS = true;
      PATHS_READY = false;
      break;

      case "test":
      console.log(m);
      break;
    }
  }
  computer.addEventListener('message', computer_message_f);

  downloader = new Worker('/pascal_triangle/pascalesque/downloader.js');
  downloader.addEventListener('message', m => {
    switch (m.data.type) {
      case "urlCreated":
      console.log(m.data.url);
      download_arrangement(m.data.url, m.data.suggested);
      break;

    }
  })

  parser = new Worker("/pascal_triangle/pascalesque/parser.js?" + Math.random());
  parser.addEventListener('message', m => {
    switch (m.data.type) {
      case "inputParsed":
        create_arrangement(m.data.docompute, m.data.arrangement);
        break;

      case "commandsHelp":
        Swal.fire({
          title: "Commands",
          html: m.data.helptext,
          grow: "row",
        })
        // console.log(m.data.helptext);
        break;

      case "error":
        report_error(m.data.msgs);
        break;
    }
  })

  js_codeMirror = CodeMirror.fromTextArea(document.getElementById("js_input"), {
    lineNumbers: true,
    mode: {
      name: "javascript",
      globalVars: true,
    },
    theme: "default",
    smartIndent: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
    },
    matchBrackets: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    placeholder: `function body here...`
  });

  // start off with a random arrangement
  // choose_random_arrangement();

}

window.addEventListener("load", main);
