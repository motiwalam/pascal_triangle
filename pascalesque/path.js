class Elem {
  constructor (n, r, direction, context) {
    this.n = n;
    this.r = r;
    this.direction = direction;
    this.context = context;

  }

  compute_paths(curpath) {
    // return if too many paths (i.e too much memory consumption)
    if (this.context.PATHS.length >= this.context.MAX_PATHS
        && this.context.DO_TRIM) {
      // if (!this.context.DO_TRIM)
      //   postMessage({type: "tooManyPaths", max: this.context.MAX_PATHS, length: this.context.PATHS.length});
      // else {
      //   this.halve_paths();
      // }
      this.halve_paths();
      this.compute_paths(curpath);
      return;
    }

    this.cell_value = this.context.CURRENT_ARRANGEMENT[this.n][this.r];

    // return if cell is invalid
    if (this.cell_value === this.context.BLOCKED
        || this.r < 0
        || this.r >= this.context.CURRENT_ARRANGEMENT[this.n].length) {
      return;
    }

    // cell is not invalid, so increment count in PBC
    var id = this.id();
    if (this.cell_value === this.context.SKIP) {
      this.context.PER_BLOCK_COUNT[id] = 0;
    } else {
      if (_.has(this.context.PER_BLOCK_COUNT, id))
        this.context.PER_BLOCK_COUNT[id] += 1;
      else
        this.context.PER_BLOCK_COUNT[id] = 1;
    }

    // return if cell is the end of path
    if (this.n == this.context.CURRENT_ARRANGEMENT.length-1) {
      if (this.cell_value !== this.context.SKIP) {
          if (this.context.PATH_COUNT % this.context.EVERYNTHPATH == 0
              && this.context.PATH_COUNT < this.context.MAX_PATHS) {
            this.context.PATHS.push(new Path(curpath));
          }
          this.context.PATH_COUNT++;
        }
        return;
      }

    const map = {
      "-1": ["left", "right"],  // ne1 is left, ne2 is right
       "1": ["right", "left"]   // ne2 is left, ne1 is right
    }

    var cur_row_length = this.context.CURRENT_ARRANGEMENT[this.n].length,
        next_row_length = this.context.CURRENT_ARRANGEMENT[this.n+1].length,

        offset = cur_row_length === next_row_length ? 0 : Math.ceil((Math.abs(cur_row_length - next_row_length)-1)/2),
        diffIsOdd = Math.abs((cur_row_length-next_row_length))%2==1,
        dir = cur_row_length > next_row_length ? -1 : 1,

        ne0 = new Elem(this.n+1, this.r + dir*offset, diffIsOdd ? map[`${dir}`][0] : "up", this.context),
        ne1 = diffIsOdd && new Elem(this.n+1, this.r + dir*(offset+1), map[`${dir}`][1], this.context)

    // cells in the front row should be skippable from all directions
    if (this.cell_value === this.context.SKIP && this.n > 0) {
      var ne = [ne0, ne1].filter(e => e.direction == this.direction)[0];
      ne && ne.compute_paths(curpath.concat(ne));
    } else {
      ne0.compute_paths(curpath.concat(ne0));
      if (diffIsOdd)
        ne1.compute_paths(curpath.concat(ne1));
    }

  }

  simplify() {
    return [this.n, this.r];
  }

  id() {
    return `${this.n};${this.r}`
  }

  halve_paths() {
    this.context.PATHS = _.pairs(this.context.PATHS)
                          .filter( ([i, v]) => i%2==0 )
                          .map( ([i, v]) => v);
  }

}

class Path {
  constructor(path) {
    this.path = path;
  }

  simplify() {
    return this.path.map(e => e.simplify())
  }

}
