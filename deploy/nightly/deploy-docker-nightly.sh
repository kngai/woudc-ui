# =================================================================
#
# Author: Tom Kralidis <tom.kralidis@canada.ca>
#
# Copyright (c) 2021 Tom Kralidis
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation
# files (the "Software"), to deal in the Software without
# restriction, including without limitation the rights to use,
# copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following
# conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
# OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
# OTHER DEALINGS IN THE SOFTWARE.
#
# =================================================================

BASEDIR=/data/web/gods/htdocs/woudc-2.0/nightly
GITREPO=https://github.com/woudc/woudc-ui.git
DAYSTOKEEP=7

# you should be okay from here
DATETIME=`date +%Y%m%d`
TIMESTAMP=`date +%Y%m%d.%H%M`
NIGHTLYDIR=woudc-ui-$TIMESTAMP

echo "Deleting nightly builds > $DAYSTOKEEP days old"

cd $BASEDIR

for f in `find . -type d -name "woudc-ui-20*"`
do
    DATETIME2=`echo $f | awk -F- '{print $3}' | awk -F. '{print $1}'`
    let DIFF=(`date +%s -d $DATETIME`-`date +%s -d $DATETIME2`)/86400
    if [ $DIFF -gt $DAYSTOKEEP ]; then
        rm -fr $f
    fi
done

echo "Generating nightly build for $TIMESTAMP"
rm -fr latest
mkdir $NIGHTLYDIR && cd $NIGHTLYDIR
git clone $GITREPO . -b master --depth=1

echo "Stopping/building/starting Docker setup"
docker compose -f docker-compose.yml build --no-cache
docker compose -f docker-compose.yml down
docker container rm -f woudc-ui-nightly
docker compose -f docker-compose.yml up -d

cd ..
ln -s $NIGHTLYDIR/dist latest
chgrp eccc-hpc-cmdx -R $NIGHTLYDIR # ensure usergroup
chmod -R 775 $NIGHTLYDIR # ensure group writable
