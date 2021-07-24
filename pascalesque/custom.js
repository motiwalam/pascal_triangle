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

pascal:
`P
A A
S S S
C C C C
A A A
L L`,

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
C C C C C C
R R R R R
I I I I
P P P
T T`,

mrkwan:
`M
R R
. . .
C C C C
H H H H H
I I I I I I
T T T T T T T
A A A A A A
T T T T T
K K K K
W W W
A A
N`,

row_n:`$pascal ROW

replace row above with row number then click Create to generate Pascal's triangle up to that row

large (> ~30) row numbers can freeze your computer due to the huge number of paths

create w/o paths to see just the triangle`,

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
ANIMATION_INTERVAL_ID = -1;

BLOCKED="@X";
SKIP = "@D";

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
  document.getElementById("arr_input").value = v === undefined ? "" : v;
}

async function create_arrangement(compute=true) {
    if (ANIMATION_INTERVAL_ID !== -1) {
      toggle_animate()
    }

    setTimeout(async () => {
      CURRENT_ARRANGEMENT = await parseInput(document.getElementById("arr_input").value);
      // clear the triangle container
      cont.innerHTML = "";
      for (var ridx of _.range(CURRENT_ARRANGEMENT.length)) {
        var r = CURRENT_ARRANGEMENT[ridx];
        cont.appendChild(create_row(r, ridx));
      }

      var pl = document.getElementById("pathscount");

      PATHS_READY = false;
      if (compute) {
        if (row_length_differences_are_1(CURRENT_ARRANGEMENT)) {
          pl.innerHTML="computing...";
          pathsComputer.postMessage({type: "computePaths", current_arrangement: CURRENT_ARRANGEMENT, blocked: BLOCKED, skip: SKIP})
        } else {
          pl.innerHTML = "? (arrangement is not Pascal-esque; row lengths must differ by 1)"
        }
      } else {
        pl.innerHTML="not computing..";
      }

      center_arrangement();

    }, 0)

}

function center_arrangement() {

  var rows = cont.children;
  var longest_width = _.max(rows, (r)=>{return r.offsetWidth}).offsetWidth;

  for (var r of rows) {
    r.style.left = (longest_width - r.offsetWidth) / 2;
  }

  cont.scrollLeft = cont.scrollLeftMax / 2;
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
      b.innerHTML = "no paths available.."
    }

}

function pascal(n) {

    function rowpascal(_n) {
      var out = [1].concat(Array(_n));

      ndiv2 = Math.floor(_n/2);
      var rcoeff = BigInt(1);

      _.map( _.range(1, _n+1), (i) => {out[i] = (i > ndiv2 ? out[_n - i] : (rcoeff = (rcoeff * BigInt(_n-i+1))/BigInt(i) ))} )

      return out;
    }

    return _.map(_.range(n), (j)=>{return rowpascal(j)});
}


async function parseInput(s) {
  s = s.trim();
  var lines = s.split("\n");
  console.log(lines);
  if (s.startsWith("$pascal ")) {
    try {
      var n = parseInt(s.split(" ")[1]);
      if (!isNaN(n)) {
        var t = pascal(n);
        setTimeout(()=>{set_arrangement( _.map(t, r=>{return r.join(" ")}).join("\n"))}, 0);
        return t;
      }
    } catch (e) {}
    return parseInput("pascal row");
  }
  return lines[0].trim() === "$invert"
              ? (await parseInput(lines.slice(1).join("\n"))).reverse()
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

      if (e === BLOCKED) {n.style.backgroundColor="rgb(185, 185, 185)"}
      if (e === SKIP) {n.style.backgroundColor="rgb(185, 185, 185)"}  // TODO: different color?

      var np = document.createElement("pre");
      np.innerHTML = np._innerHTML = e;
      np._pos = n.id;

      np.addEventListener("mouseover", (ev) =>
          {var e = ev.originalTarget; e.innerHTML = `<span style="font-size: 8px;">(${e._pos})</span>${e._innerHTML}`;})

      np.addEventListener("mouseout", (ev) => {var e = ev.originalTarget; e.innerHTML = e._innerHTML;})

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
      (e.children[0]._innerHTML !== "@D") && (e.style.backgroundColor = cycle ? get_next_color() : color);
    }
}


function draw_next_path() {
  pathsComputer.postMessage({type: "getNextPath"});
}

function add_per_block_counts(pbc) {
  for (var row of cont.children) {
    for (var e of row.children) {
      var id = e.id;

      var c = document.createElement("span");
      c.className = "pbc";
      c.innerHTML = _.has(pbc, id) ? pbc[id] : 0;

      e.appendChild(c);
    }
  }
}

function main() {

  cont = document.getElementById("tri_container");

  pathsComputer = new Worker("/pascal_triangle/pascalesque/computer.js?" + Math.random());
  pathsComputer.onmessage = m => {
    // console.log(m);
    switch (m.data.type) {
      case "pathsComputed":
      NUMPATHS = m.data.numpaths;
      PATHS_READY = true;
      document.getElementById("pathscount").innerHTML=NUMPATHS;
      add_per_block_counts(m.data.pbc);
      break;

      case "nextPath":
      // console.log(m);
      cselect = document.getElementById("colorcycle");
      draw_path(m.data.prevpath, "", false);
      draw_path(m.data.path, cselect.value === "nocycle" ? "rgba(65, 223, 208, 255)" : get_next_color(), cselect.value === "blocks");
      break;

      case "test":
      console.log(m);
      break;
    }
  }

  choose_random_arrangement();
  create_arrangement();

  aselect = document.getElementById("pre_options");
  for (k of _.keys(PREDEFINED_ARRANGEMENTS)) {
    var o = document.createElement("option");
    o.value = k;
    o.innerHTML = k.toUpperCase();

    aselect.appendChild(o);
  }
  aselect.onchange = ()=>{set_arrangement(PREDEFINED_ARRANGEMENTS[aselect.value]); create_arrangement();}

  slider = document.getElementById("anim_speed");
  slider_label = document.getElementById("anim_speed_label");
  slider_label.innerHTML = slider.value;
  slider.oninput = () => {slider_label.innerHTML = slider.value; toggle_animate(); toggle_animate()}

}
