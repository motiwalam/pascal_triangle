# pascal_triangle

This repository contains:
* Two Python scripts that can write and read individual rows of Pascal's triangle and a third that puts all of these into an actual triangle that can be viewed in a browser.
* the raw data for the first 500 rows of Pascal's triangle and multiple HTML documents for the triangle, up to a certain number of rows
* a [website](https://thechosenreader.github.io/pascal_triangle/pascalesque/) to play with more generic Pascal-esque triangles


## Algorithm
`rowpascal.py` generates the target row by relying on the fact that `nCr(n, r+1) / nCr(n, r) = (n-r)/(r+1)`. Previous versions of the algorithm also made use of the fact that each row is symmetrical but that was done away with in the interest of not blowing my computer up (larger rows take literal gigabytes of space).

`pasc_latex.py` implements the recursive approach with a generator to create arbitrarily large triangles. It performs on par with `gentriangle.py` The code for it is not mine and comes from [here](https://www.bedroomlan.org/coding/pascals-triangle-latex/).

`pascalesque/computer.js` contains the javascript implementation used for the Pascal-esque website.

## File Format
Speaking of space, I store each row in a custom file format which interleaves the raw bytes of each number in the row with 4 bytes that instruct the program on how many bytes to read the get the next number. It's not much but it cuts space consumption by about 2.5, a necessity when computing large rows.


## Triangles
Below are links to all of the triangles available in this repository. If you don't mind some javascript, I recommend you use the [Pascal-esque website](https://thechosenreader.github.io/pascal_triangle/pascalesque/) instead, as it can define triangles up to an arbitrary row. Type `$pascal ROW` into the input area to create a triangle with `ROW` rows.

* [Row 12](https://thechosenreader.github.io/pascal_triangle/triangles/12.html)
* [Row 50](https://thechosenreader.github.io/pascal_triangle/triangles/50.html)
* [Row 100](https://thechosenreader.github.io/pascal_triangle/triangles/100.html)
* [Row 150](https://thechosenreader.github.io/pascal_triangle/triangles/150.html)
* [Row 200](https://thechosenreader.github.io/pascal_triangle/triangles/200.html)
* [Row 250](https://thechosenreader.github.io/pascal_triangle/triangles/250.html)
* [Row 300](https://thechosenreader.github.io/pascal_triangle/triangles/300.html)
* [Row 350](https://thechosenreader.github.io/pascal_triangle/triangles/350.html)
* [Row 400](https://thechosenreader.github.io/pascal_triangle/triangles/400.html)
* [Row 450](https://thechosenreader.github.io/pascal_triangle/triangles/450.html)
* [Row 500](https://thechosenreader.github.io/pascal_triangle/triangles/500.html)
* [Row 1000](https://thechosenreader.github.io/pascal_triangle/triangles/1000.html)


# Pascal-esque triangles
Pascal's triangle is constructed recursively cell-by-cell where each cell contains the sum of the cells directly above it. In this way, each cell in Pascal's triangle actually contains the number of paths to it starting from the initial cell, if one can only move downwards.

Pascal-esque, then, is my way of referring to any arrangement of consecutive rows that are traversed in this fashion, (i.e strictly downwards).

`./pascalesque` contains the code for a website that allows a user to define any arrangement and computes the paths from top to bottom in that arrangement. It also uses the same algorithm above to create Pascal triangles up to a user defined row.


Play around with Pascal-esque triangles [here](https://thechosenreader.github.io/pascal_triangle/pascalesque/).
