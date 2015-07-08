#!/usr/bin/env python
# Unpack a M[UMPS] routine transfer format (^%RO) into .m files
#
#   python unpackro.py routines.ro
#
#---------------------------------------------------------------------------
# Copyright 2011 The Open Source Electronic Health Record Agent
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#---------------------------------------------------------------------------

import sys
import os
import getopt

def unpack(ro, odir=None, out=sys.stdout):
    # Write out the two header lines for human reference.
    out.write(ro.readline())
    out.write(ro.readline())
    m = None

    for line in ro:
        if line == 'Routines\n':
            print "Skipped Routines line"
        elif line == '\n':
            # Routine terminated by blank line
            if m:
                m.close()
                m = None
        elif m:
            m.write(line)
        else:
            # Routine started by line with its name.  Some %RO
            # implementations add a '^' followed by more data;
            # ignore that.
            name,up,rest = line.partition('^')
            name = name.strip()
            rname = name+'.m'
            if odir:
              rname = os.path.join(odir, rname)
            m = open(rname,'w')
            # Report the new routine name for human reference.
            out.write('%s\n' % name)
    if m:
        m.close()
        m = None

def main(argv):
    try:
        opts, args = getopt.getopt(argv, "-h")
    except getopt.GetoptError:
        print 'unpackro.py routines.ro [output_directory]'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'unpackro.py routines.ro [output_directory]'
            sys.exit()
    print 'unpacking ', sys.argv[1]
    if len(sys.argv) > 2:
        unpack(open(sys.argv[1], 'r'), sys.argv[2])
    else:
        unpack(open(sys.argv[1], 'r'))
if __name__ == '__main__':
    main(sys.argv[1:])
