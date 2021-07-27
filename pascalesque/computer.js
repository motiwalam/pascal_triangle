_CURRENT_ARRANGEMENT = [];
_PATHS = [];

MEMSIZE_ELEM = 25;  // bytes

PREVIDX = CURIDX = 0;

importScripts("https://cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js");
importScripts("/pascal_triangle/pascalesque/path.js?" + Math.random());

function compute_paths(opts) {
    _PATHS = [];

    var c = {
      CURRENT_ARRANGEMENT: opts.current_arrangement,
      PATHS: _PATHS,
      PER_BLOCK_COUNT: {},
      BLOCKED: opts.blocked,
      SKIP: opts.skip,
      MAX_PATHS: (opts.memlimit / MEMSIZE_ELEM) / (opts.current_arrangement.length),
      PATH_COUNT: 0,
      EVERYNTHPATH: opts.everynthpath,
      DO_TRIM: opts.dotrim,
    };

    if (opts.current_arrangement.length > 0) {
      for (i of _.range(opts.current_arrangement[0].length)) {
        var start = new Elem(0, i, "right", c);
        start.compute_paths([start]);
      }

      PREVIDX = CURIDX = 0;
      postMessage({
        type: "pathsComputed",
        numpaths: c.PATH_COUNT,
        pbc: c.PER_BLOCK_COUNT
      });

      _PATHS = c.PATHS;

    }
}

function pascal(n) {

    function rowpascal(row_n) {
      var out = [1].concat(Array(row_n));

      ndiv2 = Math.floor(row_n/2);
      var rcoeff = BigInt(1);

      _.range(1, row_n+1)
       .forEach(i => {
         out[i] = (i > ndiv2)
                    ? out[row_n -i]
                    : rcoeff = (rcoeff * BigInt(row_n-i+1))/BigInt(i)
       })

      return out;
    }

    return _.range(n)
            .map(j => rowpascal(j))
}


addEventListener('message', m => {
  switch (m.data.type) {
    case "computePaths":
    compute_paths({
      memlimit: m.data.memlimit,
      current_arrangement: m.data.current_arrangement,
      blocked: m.data.blocked,
      skip: m.data.skip,
      everynthpath: m.data.everynthpath,
      dotrim: m.data.dotrim,
    });
    break;

    case "getNextPath":
    if (_PATHS.length > 0) {
      postMessage({
        type: "nextPath",
        prevpath: _PATHS[PREVIDX].simplify(),
        path: _PATHS[CURIDX].simplify()
      });
      PREVIDX = CURIDX;
      CURIDX = (CURIDX + 1) % _PATHS.length;

    }
    break;

    case "destroyPaths":
    _PATHS = null;
    break;

    case "computePascal":
    var doReverse = m.data.doreverse;
    var t = pascal(m.data.row);
    postMessage({
      type: "pascalComputed",
      tri: doReverse ? t.reverse() : t,
      docompute: m.data.docompute,
      doreverse: doReverse,
    });
    break;

  }
})
