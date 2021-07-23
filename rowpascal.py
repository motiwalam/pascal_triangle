#!/usr/bin/env python3.9

import sys
import math
import struct
import shutil
from tempfile import NamedTemporaryFile

# this consistently under 300 nanoseconds for reaallly
# big numbers so i think this is fine
nbytes = lambda n: math.floor(math.log2(n)/8 + 1)
getbytes = lambda n, nb: b'\x01' if n <= 1 else (n).to_bytes(nb, "big")

def writeRow(n, fn):
    with (open(fn, "wb") if fn != "stdout" else sys.stdout.buffer) as out:

        # write 4 bytes for row number
        out.write(struct.pack(">I", n))

        # write pair for the first number 1
        out.write(struct.pack(">I", 1));
        out.write(getbytes(1, 1))

        # generate the rest of the row
        ndiv2 = n // 2;
        rcoeff = 1
        for i in range(1, n+1):
            rcoeff = (rcoeff * (n-i+1)) // (i)

            nb = nbytes(rcoeff)
            # print(rcoeff, nb)
            out.write(struct.pack(">I", nb))
            out.write(getbytes(rcoeff, nb))


def rowpascal(n):
    """create and return a row stored in memory"""
    out = [1] + [0]*n

    ndiv2 = n // 2
    rcoeff = 1

    for i in range(1, n+1):
        result = out[n-i] if i > ndiv2 else (rcoeff := rcoeff * (n-i+1)//i)
        out[i] = result

    return out


def main():
    n = int(sys.argv[1])
    fn = sys.argv[2]

    writeRow(n, fn)

if __name__ == "__main__":
    main()
