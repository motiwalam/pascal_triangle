# pascal_triangle

Two Python scripts that can write and read individual rows of Pascal's triangle and a third that puts all of these into an actual triangle that can be viewed in a browser.

## Algorithm
`rowpascal.py` generates the target row by relying on the fact that `nCr(n, r+1) / nCr(n, r) = (n-r)/(r+1)`. Previous versions of the algorithm also made use of the fact that each row is symmetrical but that was done away with in the interest of not blowing my computer up (larger rows take literal gigabytes of space).

`pasc_latex.py` uses the recursive approach with a generator to create arbitrarily large triangles without a significant memory footprint. The code for it is not mine and comes from [here](https://www.bedroomlan.org/coding/pascals-triangle-latex/)

## File Format
Speaking of space, I store each row in a custom file format which interleaves the raw bytes of each number in the row with 4 bytes that instruct the program on how many bytes to read the get the next number. It's not much but it cuts space consumption by about 2.5.

## Speed
It is Python so, it's obviously not very fast. It takes about 12 minutes to generate 10000 rows. Not to mention, reading large rows takes much longer. In the end, I chose Python for its support of arbitrarity large integers. I experimented using Java's BigInteger class which worked pretty well. I haven't implemented the `.rpas` format in Java yet, though. I also did some cursory research into BigInteger libraries for C++ but didn't find any convenient ones that worked well. In the end, Python won for its convenience.

## Triangles
Below are links to all of the triangles available in this repository.

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
