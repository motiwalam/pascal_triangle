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
C C C C
R R R
I I I I
P P P
T T`,

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

pascal:`$pascal ROW

replace "ROW" above with row number then click Create to generate Pascal's triangle up to that row
`,

forbidden: `S
1 1
1 2 1
1 3 3 1
1 4 @X 4 @X
@X 5 4 4 4 @X
@X 5 9 8 8 @X @X`,

skip: `A
B B
C C C
D @D @D D
E E E E E
@D F F @D
G G @D G G
H H H H H H`,

invert:`#$invert
$pascal 15
delete the hashtag and click create to see what happens`,
custom: ''
}

//              lavender              maize               greeen                topaz
COLORS = [ [214, 179, 243, 255], [249, 202, 72, 255], [148, 210, 145, 255], [65, 223, 208, 255] ];
COLORIDX = 0;

CURRENT_ARRANGEMENT = [];
NUMPATHS = 0;

PATHS_READY = false;
TOO_MANY_PATHS = false;
ANIMATION_INTERVAL_ID = -1;

BLOCKED="@X";
SKIP = "@D";

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
    var b = document.getElementById("anim_button");
    b.innerHTML = ANIMATION_INTERVAL_ID === -1 ? "Animate" : "Stop Animating";
    b.disabled = false;
    b.style.width = 110;
}

function toggle_animate() {
  if (ANIMATION_INTERVAL_ID === -1) {
    ANIMATION_INTERVAL_ID = setInterval(draw_next_path, slider.value);
    document.getElementById("anim_button").innerHTML = "Stop Animating";
  } else {
    clearInterval(ANIMATION_INTERVAL_ID);
    ANIMATION_INTERVAL_ID = -1;
    document.getElementById("anim_button").innerHTML = "Animate";
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
  var notcurrents = _.filter(_.values(PREDEFINED_ARRANGEMENTS), s=>{return s!==i.value && s!== "";})
  var idx = parseInt(Math.random() * (notcurrents.length));
  set_arrangement(notcurrents[idx]);
  create_arrangement();
}

function set_arrangement(v) {
  _ADDING_ARR_INPUT = false;
  document.getElementById("arr_input").value = v === undefined ? "" : v;
}

function create_arrangement(compute=true, arrangement) {
    function _create_arrangement() {
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
      fragments.longest_width = {
        offsetWidth: _.max(CURRENT_ARRANGEMENT, e => e.length).length * 82
      }
      fragments.theight = CURRENT_ARRANGEMENT.length * (c.offsetHeight*0.0475);
      return fragments;
    }
    _ADDING_TRIANGLE = false;

    /* this is super hacky ; i only use the arrangement parameter for pascal triangles
    which is also the only time #wait_hint should be visibile */
    arrangement || (document.getElementById("wait_hint").style.visibility = "hidden");

    if (ANIMATION_INTERVAL_ID !== -1) {
      toggle_animate()
    }

    CURRENT_ARRANGEMENT = (arrangement === undefined)
                          ? parseInput(document.getElementById("arr_input").value,
                            {
                              doInvert: false,
                              doCompute: compute
                            })
                          : arrangement;

    var c = document.getElementById("tri_container");
    var fragments = _create_arrangement();
    var idx = 0;
    c.innerHTML = "";
    _ADDING_TRIANGLE = true;
    setTimeout(function add_fragments_onebyone() {

          if (idx < fragments.length && _ADDING_TRIANGLE) {
            c.appendChild(fragments[idx]);
            if (idx <= 2)  // only center the first three fragments - centering all of them looks weird
              center_arrangement();
            idx++;
            setTimeout(add_fragments_onebyone, 100);
          } else {
            center_arrangement();
            on_lookup_input_changed();
          }

    }, 0);

    var pl = document.getElementById("pathscount");

    PATHS_READY = false;
    TOO_MANY_PATHS = false;
    if (compute) {
      if (row_length_differences_are_1(CURRENT_ARRANGEMENT)) {
        pl.innerHTML="computing...";
        computer.postMessage({
          type: "computePaths",
          current_arrangement: CURRENT_ARRANGEMENT,
          blocked: BLOCKED,
          skip: SKIP,
          memlimit: get_memlimit()
        });
      } else {
        pl.innerHTML = "? (arrangement is not Pascal-esque; row lengths must differ by 1)"
      }
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

    cont.scrollLeft = cont.scrollLeftMax / 2;

  }
}

function row_length_differences_are_1(tri) {
  for ([r1, r2] of _.zip(tri, tri.slice(1))) {
    if (r2 !== undefined) {
      if (Math.abs(r2.length - r1.length) !== 1) { return false; }
    }
  }

  return true;
}

function test_can_animate() {
    var b = document.getElementById("anim_button");
    if (!row_length_differences_are_1(CURRENT_ARRANGEMENT)) {
      b.style.width="auto";
      b.disabled = true;
      b.innerHTML = "Invalid Pascal-esque triangle. Row differences are not 1.";
    } else if (!PATHS_READY) {
      b.style.width="auto";
      b.disabled = true;
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
      var n = parseInt(_.filter(s.split(" "), c=>{return c!== ""})[1]);
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
              : _.filter(_.map(lines, e=>{return e.trim().split(" ").filter(c=>{return c!==""})}), l=>{return l.length>0})
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
      (e.getElementsByTagName("pre")[0].innerHTML !== "@D") && (e.style.backgroundColor = cycle ? get_next_color() : color);
    }
}


function draw_next_path() {
  computer.postMessage({type: "getNextPath"});
}

function add_per_block_counts(pbc) {
  for (var row of cont.children) {
    for (var e of row.children) {
      var id = e.id;

      var c = document.createElement("span");
      c.className = "pbc";
      var paths   = _.has(pbc, id) ? pbc[id] : 0;
      c.innerHTML = paths;

      e.numpaths = paths;
      e.appendChild(c);
    }
  }
}

function add_pascal_arrangement() {
  var wh = document.getElementById("wait_hint");
  wh.innerHTML = "adding..";

  if (!_ADDING_ARR_INPUT) {
    _ADDING_ARR_INPUT = true;
    var t = _PASCAL_ARRANGEMENT

    // create batches
    var s = [];
    var cur_s = "";
    var count = 0;
    for (var r of t) {
      for (var e of r) {
        var temp = e + " ";
        cur_s += temp;
        count += temp.length;
        if (count >= 10000) {
          s.push(cur_s);
          count = 0;
          cur_s = "";
        }
      }
      cur_s += "\n";
      count++;
    }
    s.push(cur_s);

    t = null;
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

function main() {

  document.getElementById("anim_button").addEventListener("mouseleave", _on_anim_button_mouseleave);
  document.getElementById("anim_button").addEventListener("mouseover", test_can_animate);

  document.getElementById("anim_button").addEventListener("click", toggle_animate);
  document.getElementById("arr_button").addEventListener("click", toggle_arrangement);
  document.getElementById("create_wpaths").addEventListener("click", () => {create_arrangement(true)});
  document.getElementById("create_wopaths").addEventListener("click", () => {create_arrangement(false)});
  document.getElementById("create_random").addEventListener("click", choose_random_arrangement);
  document.getElementById("wait_hint").addEventListener("click", add_pascal_arrangement);

  document.getElementById("n_input").addEventListener("change", on_lookup_input_changed);
  document.getElementById("r_input").addEventListener("change", on_lookup_input_changed);

  cont = document.getElementById("tri_container");

  computer = new Worker("/pascal_triangle/pascalesque/computer.js?" + Math.random());
  computer.onmessage = m => {
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

      case "tooManyPaths":
      console.log("too many paths: " + m.data.max + " " + m.data.length);
      // a precaution
      if (!TOO_MANY_PATHS) {
        document.getElementById("pathscount").innerHTML = "aborted.. not enough memory";
        computer.postMessage({type: "destroyPaths"});
      }

      TOO_MANY_PATHS = true;
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

      case "test":
      console.log(m);
      break;
    }
  }

  choose_random_arrangement();

  aselect = document.getElementById("pre_options");

  for (k of _.keys(PREDEFINED_ARRANGEMENTS)) {
    var o = document.createElement("option");
    o.value = k;
    o.innerHTML = k.toUpperCase();
    o.addEventListener('click', function (e) {
      set_arrangement(PREDEFINED_ARRANGEMENTS[aselect.value]);
      create_arrangement();
    });

    aselect.appendChild(o);
  }

  slider = document.getElementById("anim_speed");
  slider.onchange = () => {toggle_animate(); toggle_animate()}
}

window.addEventListener("load", main);
