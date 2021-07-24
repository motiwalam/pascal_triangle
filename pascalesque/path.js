class Elem {
  constructor (n, r, direction, context) {
    this.n = n;
    this.r = r;
    this.direction = direction;
    this.context = context;

    // console.log(this.context);

    if (this.r >= 0
        && this.r < this.context.CURRENT_ARRANGEMENT[this.n].length) {

      var id = this.id();
      this.cell_value = this.context.CURRENT_ARRANGEMENT[this.n][this.r];
      if (this.cell_value === this.context.BLOCKED || this.cell_value === this.context.SKIP) {
        this.context.PER_BLOCK_COUNT[id] = 0;
      } else {
        if (_.has(this.context.PER_BLOCK_COUNT, id))
          this.context.PER_BLOCK_COUNT[id] += 1;
        else
          this.context.PER_BLOCK_COUNT[id] = 1;
      }
    }
  }

  compute_paths(curpath) {
    if (this.cell_value === this.context.BLOCKED) {
      return;
    }

    if (this.n == this.context.CURRENT_ARRANGEMENT.length-1) {
      if (this.cell_value !== this.context.SKIP)
        this.context.PATHS.push(new Path(curpath));
      return;
    }

    var cur_row_length = this.context.CURRENT_ARRANGEMENT[this.n].length;
    var next_row_length = this.context.CURRENT_ARRANGEMENT[this.n+1].length;
    var offset = Math.abs(parseInt((cur_row_length - next_row_length - 1) / 2))

    if (this.cell_value === this.context.SKIP) {
      var ne = new Elem(this.n+1, this.r + (this.direction === "left" ? 1 : 0)
                                         - (cur_row_length > next_row_length ? 1 : 0),
                        this.direction, this.context)
      // curpath.pop();
      ne.compute_paths(curpath.concat(ne));
      return;
    }

    var ne1, ne2;
    var ne1_direction;
    if (cur_row_length > next_row_length) {
      ne1_direction = "left"
      ne2 = new Elem(this.n+1, this.r-1, "right", this.context);
      if (this.r !== 0){
        ne2.compute_paths(curpath.concat(ne2))
        if (this.r === cur_row_length-1){return;}
      }

    } else {
      ne1_direction = "right"
      ne2 = new Elem(this.n+1, this.r+1, "left", this.context);
      ne2.compute_paths(curpath.concat(ne2));
    }
    ne1 = new Elem(this.n+1, this.r, ne1_direction, this.context);
    ne1.compute_paths(curpath.concat(ne1));

  }

  simplify() {
    return [this.n, this.r];
  }

  id() {
    return `${this.n};${this.r}`
  }

}

class Path {
  constructor(path) {
    this.path = path;
  }

  simplify() {
    return _.map(this.path, e=>{return e.simplify()})
  }

}
