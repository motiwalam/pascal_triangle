class Elem {
  constructor (n, r, context) {
    this.n = n;
    this.r = r;
    this.context = context;

    if (this.r >= 0 && this.r < this.context.CURRENT_ARRANGEMENT[this.n].length) {
      var id = this.id();
      if (_.has(this.context.PER_BLOCK_COUNT, id))
      this.context.PER_BLOCK_COUNT[id] += 1;
      else
      this.context.PER_BLOCK_COUNT[id] = 1;
    }
  }

  compute_paths(curpath) {

    if (this.n == this.context.CURRENT_ARRANGEMENT.length-1) {
      this.context.PATHS.push(new Path(curpath));
      return;
    }

    var cur_row_length = this.context.CURRENT_ARRANGEMENT[this.n].length;
    var next_row_length = this.context.CURRENT_ARRANGEMENT[this.n+1].length;

    var ne1, ne2;

    if (cur_row_length > next_row_length) {
      ne2 = new Elem(this.n+1, this.r-1, this.context);
      if (this.r !== 0){
        ne2.compute_paths(curpath.concat(ne2))
        if (this.r === cur_row_length-1){return;}
      }

    } else {
      ne2 = new Elem(this.n+1, this.r+1, this.context);
      ne2.compute_paths(curpath.concat(ne2));
    }
    ne1 = new Elem(this.n+1, this.r, this.context);
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
