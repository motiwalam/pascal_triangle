#!/usr/bin/env python3.9

# the .rpas format is basic. the first byte is a 32 bit integer that
# is the row number n. then, there are (n+1) pairs; the first of each pair
# is a 32 bit integer denoting the number of bytes to read to get the following
# number. reading all (n+1) pairs will give you (n+1) numbers that comprise the
# row

import argparse
import struct
import sys

USAGE = f"""{sys.argv[0]} [in_file] [out_file]
If in file is not specified, read from stdin.
If out file is 'stdout' or empty, print to stdout."""

def main():
    if "-h" in sys.argv:
        print(USAGE)
        quit()

    in_fn = sys.argv[1] if (len(sys.argv) >= 2) else 'stdin'
    out_fn = sys.argv[2] if (len(sys.argv) >= 3) else 'stdout'

    read_row_to_outfile(in_fn, out_fn)


def read_row_to_outfile(infile, outfile):
    with (open(infile, "rb") if infile != 'stdin' else sys.stdin.buffer) as inf, \
      (open(outfile, "w") if outfile != 'stdout' else sys.stdout) as outf:

        n, = struct.unpack(">I", inf.read(4));

        for _ in range(n+1):
            nb, = struct.unpack(">I", inf.read(4))
            num = int.from_bytes(inf.read(nb), "big")

            outf.write(str(num) + " ")

        outf.write('\n')


# this will read the row into a list and return it
# rows can get MASSIVE so this is extremely dangerous
def read_row(infile):
    with (open(infile, "rb") if infile != "stdin" else sys.stdin.buffer) as inf:
        out = []
        n, = struct.unpack(">I", inf.read(4))

        for _ in range(n+1):
            nb, = struct.unpack(">I", inf.read(4))
            num = int.from_bytes(inf.read(nb), "big")

            out.append(num)

        return out


if __name__ == "__main__":
    main()
