BLOCKED="@X";
SKIP = "@S";

PREDEFINED_ARRANGEMENTS = {
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

replace "ROW" above with row number then click Create to generate Pascal's triangle up to that row
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

invert:`#$invert
$pascal 15
delete the hashtag and click create to see what happens`,

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

mrkwan:
`M
R R
. . .
C C C C
H H H
I I
T
A A
T T T
K K K K
W W W
A A
N`,

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

//              lavender              maize               greeen                topaz
COLORS = [ [214, 179, 243, 255], [249, 202, 72, 255], [148, 210, 145, 255], [65, 223, 208, 255] ];
COLORIDX = 0;

CURRENT_ARRANGEMENT = [];
NUMPATHS = 0;

PATHS_READY = false;
TOO_MANY_PATHS = false;

ANIMATION_INTERVAL_ID = -1;
_TRI_ADDER_IDS = [];


/*
if set_arrangement() is called while the setTimeout sequence for adding
the pascal triangle to the arrangement input, then _ADDING_ARR_INPUT will change
back to false
likewise for _ADDING_TRIANGLE while setTimeout sequence for arrangements is ongoing
*/
_ADDING_ARR_INPUT = false;
_ADDING_TRIANGLE = false;

_PASCAL_ARRANGEMENT = [];  // lolll really committing to the global variable approach eh

function _on_anim_button_mouseleave() {
    console.log("mouseleave")
    var b = document.getElementById("anim_button");
    b.innerHTML = ANIMATION_INTERVAL_ID === -1 ? "Animate" : "Stop Animating";
    b.disabled = false;
    b.style.opacity = "100%";
    b.style.width = 110;
}

function toggle_animate() {
  if (PATHS_READY) {
    if (ANIMATION_INTERVAL_ID === -1) {
      var speed = parseInt(document.getElementById("anim_speed").value);
      speed = isNaN(speed) ? 500 : speed;
      ANIMATION_INTERVAL_ID = setInterval(draw_next_path, speed);
      document.getElementById("anim_button").innerHTML = "Stop Animating";
    } else {
      clearInterval(ANIMATION_INTERVAL_ID);
      ANIMATION_INTERVAL_ID = -1;
      document.getElementById("anim_button").innerHTML = "Animate";
    }

  }
}


function toggle_arrangement() {
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
  create_arrangement();
}

function set_arrangement(v) {
  _ADDING_ARR_INPUT = false;
  document.getElementById("arr_input").value = v === undefined ? "" : v;
}

function create_arrangement(compute=true, arrangement) {
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
    /* this is super hacky ; i only use the arrangement parameter for pascal triangles
    which is also the only time #wait_hint should be visibile */
    arrangement || (document.getElementById("wait_hint").style.visibility = "hidden");

    if (ANIMATION_INTERVAL_ID !== -1) {
      toggle_animate()
    }

    var input = document.getElementById("arr_input").value;
    CURRENT_ARRANGEMENT = (arrangement === undefined)
                          ? parseInput(input,
                            {
                              doInvert: false,
                              doCompute: compute
                            })
                          : arrangement;

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

    PATHS_READY = false;
    TOO_MANY_PATHS = false;
    // sooo many hacks i swear this is DISGUSTING
    if (compute && !(document.getElementById("arr_input").value.startsWith("computing pascal row"))) {
        pl.innerHTML="computing...";
        computer.postMessage({
          type: "computePaths",
          current_arrangement: CURRENT_ARRANGEMENT,
          blocked: BLOCKED,
          skip: SKIP,
          memlimit: get_memlimit()
        });
    } else {
      pl.innerHTML="not computing..";
    }

}

function center_arrangement() {

  const cont = document.getElementById("tri_container");
  const rows = cont.children;

  if (rows.length > 0) {
    const longest_width = _.max(rows, (r)=>{return r.offsetWidth});

    // horizontally offset each row if no horizontal overflow in container
    const hoffset = (cont.scrollWidth - longest_width.offsetWidth) / 2;

    // vertically offset each row if no vertical overflow in container
    const theight = rows.length * (rows[0].offsetHeight);
    const voffset = theight > cont.offsetHeight ? 0 : (cont.offsetHeight - theight) /2;

    for (var r of rows) {
      r.style.left = (longest_width.offsetWidth - (r.offsetWidth)) / 2 + hoffset;
      r.style.top  = voffset;
    }

    cont.scrollLeft = (cont.scrollWidth - cont.offsetWidth) / 2;

  }
}

function row_length_differences_are_odd(tri) {
  for ([r1, r2] of _.zip(tri, tri.slice(1))) {
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
      b.innerHTML = "no paths.. did you click create w/ paths?"
    }

}

function get_memlimit() {
  var m_limit = parseInt(document.getElementById("m_input").value);
  return isNaN(m_limit) ? 1e+9 : m_limit * (1e+6);
}

function parseInput(s, opts) {
  s = s.trim();
  var lines = s.split("\n");
  if (s.startsWith("$pascal ")) {
    try {
      var n = parseInt(s.split(" ").filter(c => c!== "")[1]);
      if (!isNaN(n)) {
        computer.postMessage({
          type: "computePascal",
          row: n,
          doreverse: opts.doInvert,
          docompute: opts.doCompute
        });
        set_arrangement(`computing pascal row ${n}`)
        return parseInput(`computing pascal row ${n}`);
      }
    } catch (e) {console.log("exception in parseInput"); console.log(e)}
    return parseInput("pascal row");
  }
  return lines[0].trim() === "$invert"
              ? (parseInput(lines.slice(1).join("\n"), _.extend(opts, {doInvert: true}))).reverse()
              : lines
                  .map( e => e
                              .trim()
                              .split(" ")
                              .filter(c => c!=="") )
                  .filter(l => l.length>0)
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
      n.id = `${ridx};${eidx}`

      n.cell_value = e;
      n.numpaths = "N/A";

      if (e === BLOCKED) {n.style.backgroundColor="rgb(185, 185, 185)"}
      if (e === SKIP) {n.style.backgroundColor="rgb(185, 185, 185)"}  // TODO: different color?

      var idx = document.createElement("span");
      idx.className = "idx";
      idx.innerHTML = n.id;

      var np = document.createElement("pre");
      np.innerHTML = `${e}`;

      n.appendChild(idx);
      n.appendChild(np);

      out.appendChild(n);
    }

    return out;
}


function draw_path(path, color, cycle) {
    function get_corresponding_div(n, r) {
      return document.getElementById(`${n};${r}`);
    }

    for ([n, r] of path) {
      var e = get_corresponding_div(n, r);
      if (e.cell_value === SKIP) {
          e.style.opacity = (color === "") ? "" : "50%";
      } else {
        e.style.backgroundColor = cycle ? get_next_color() : color;
      }
    }
}


function draw_next_path() {
  computer.postMessage({type: "getNextPath"});
}

function add_per_block_counts(pbc) {
  for (var row of cont.children) {
    for (var e of row.children) {
      var paths   = _.has(pbc, e.id) ? pbc[e.id] : 0;
      e.numpaths = paths;

      if (paths === 0 && !(e.cell_value === BLOCKED || e.cell_value === SKIP)) {
        e.style.backgroundColor = "rgb(225, 220, 220)"
      }

      var c = document.createElement("span");
      c.className = "pbc";
      c.innerHTML = paths;

      e.appendChild(c);

    }
  }
}

function add_pascal_arrangement() {
  function add(t) {
    _ADDING_ARR_INPUT = true;

    // create batches
    var s = _.chunk(
                t.map(row => row.join(" "))
                 .join("\n"), 10000)
             .map(r => r.join(""));

    // add batches
    var i = document.getElementById("arr_input");
    i.value = "";
    var idx = 0;
    console.log(s.length);
    setTimeout( function set_arr_onebyone() {
      if (idx < s.length && _ADDING_ARR_INPUT) {
        i.value += s[idx++];
        setTimeout(set_arr_onebyone, 50);
        (idx%4==0) && (wh.innerHTML = "adding" + (new Array(idx%5+1).join(".")));
      } else {
        wh.style.visibility = "hidden";
        _PASCAL_ARRANGEMENT = [];
      }
    }, 0);

  }

  var wh = document.getElementById("wait_hint");

  if (!_ADDING_ARR_INPUT) {
    var tri = _PASCAL_ARRANGEMENT

    if (tri.length > 150) {
      Swal.fire({
        title: "Are you sure?",
        text:  "These can get really big and possibly slow down your computer",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Continue",
        denyButtonText: "Download (recommended)",
        cancelButtonText: "Abort",
      }).then(result => {
        if (result.isDenied || result.isDismissed) {
          if (result.isDenied) {
            post_download(`pascal${tri.length}.txt`);
          }
          return;
        } else {
          add(tri);
        }
      })
    } else {
      wh.innerHTML = "adding..";
      add(tri);
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
  computer.postMessage( {
    type: "createDownloadURL",
    current_arrangement: CURRENT_ARRANGEMENT,
    suggested: suggested ?? "arrangement.txt",
  });
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

function __get_all_paths() {
  computer.postMessage({
    type: "getAllPaths",
  })
}

function main() {

  // add all event listeners
  document.getElementById("anim_button").addEventListener("mouseout", _on_anim_button_mouseleave);
  document.getElementById("anim_button").addEventListener("mouseover", test_can_animate);

  document.getElementById("anim_button").addEventListener("click", toggle_animate);
  document.getElementById("arr_button").addEventListener("click", toggle_arrangement);
  document.getElementById("create_wpaths").addEventListener("click", () => create_arrangement(true));
  document.getElementById("create_wopaths").addEventListener("click", () => create_arrangement(false));
  document.getElementById("create_random").addEventListener("click", choose_random_arrangement);
  document.getElementById("wait_hint").addEventListener("click", add_pascal_arrangement);
  document.getElementById("download_button").addEventListener("click", e => post_download())

  document.getElementById("n_input").addEventListener("input", on_lookup_input_changed);
  document.getElementById("r_input").addEventListener("input", on_lookup_input_changed);
  document.getElementById("anim_speed").addEventListener("input", () => {
    toggle_animate();
    toggle_animate();
  });

  aselect = document.getElementById("pre_options");
  aselect.addEventListener('change', () => {
    set_arrangement(PREDEFINED_ARRANGEMENTS[aselect.value]);
    create_arrangement();
    aselect.selectedIndex = 0;
  })

  for (k of _.keys(PREDEFINED_ARRANGEMENTS)) {
    var o = document.createElement("option");
    o.value = k;
    o.innerHTML = k.toUpperCase();

    aselect.appendChild(o);
  }

  document.getElementById("arr_input").setAttribute("placeholder",
`Enter one row per line. Row elements are space separated.

${BLOCKED} denotes a forbidden block (see examples->FORBIDDEN).

${SKIP} denotes a skipped block (see examples->SKIP).

'$pascal ROW' can be used to create pascal triangles (see examples->PASCAL).

'$invert' as the first line will invert the following arrangement (see examples->INVERT).`)

  cont = document.getElementById("tri_container");

  // handle message from computer
  computer = new Worker("/pascal_triangle/pascalesque/computer.js?" + Math.random());
  computer.addEventListener('message', m => {
    // console.log(m);
    switch (m.data.type) {
      case "pathsComputed":
      NUMPATHS = m.data.numpaths;
      if (!TOO_MANY_PATHS) {
        PATHS_READY = true;
        document.getElementById("pathscount").innerHTML=NUMPATHS;
        add_per_block_counts(m.data.pbc);
        on_lookup_input_changed();
      }
      break;

      case "nextPath":
      // console.log(m);
      cselect = document.getElementById("colorcycle");
      draw_path(m.data.prevpath, "", false);
      draw_path(m.data.path, cselect.value === "nocycle" ? "rgba(65, 223, 208, 255)" : get_next_color(), cselect.value === "blocks");
      break;

      case "allPaths":
      console.log(m.data.paths);
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

      case "pascalComputed":
      var t = m.data.tri;
      setTimeout(create_arrangement, 0, m.data.docompute, t);

      _PASCAL_ARRANGEMENT = t;
      set_arrangement((m.data.doreverse ? "$invert\n" : "") + `$pascal ${t.length}`);
      var wh = document.getElementById("wait_hint");
      wh.innerHTML = `get text for pascal ${t.length}...`;
      wh.style.visibility = "visible";
      break;

      case "urlCreated":
      console.log(m.data.url);
      download_arrangement(m.data.url, m.data.suggested);
      break;

      case "test":
      console.log(m);
      break;
    }
  })

  // start off with a random arrangement
  // choose_random_arrangement();

}

window.addEventListener("load", main);
