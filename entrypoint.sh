#!/bin/bash
set -e

if [ ! -e /mtasa/mods/deathmatch/mtaserver.conf ]; then
    echo "Copying configs..."
    cp /mtasa/config/* /mtasa/mods/deathmatch/
fi

if [ ! -e /mtasa/mods/deathmatch/resources ]; then
    echo "Downloading resources..."
    mkdir /mtasa/mods/deathmatch/resources
    wget -q -O /home/container/resources.zip http://mirror.mtasa.com/mtasa/resources/mtasa-resources-latest.zip
    unzip -q /home/container/resources.zip -d /mtasa/mods/deathmatch/resources
    rm /home/container/resources.zip
fi

# Start mtasa server
if [ -e /mtasa/mta-server64 ]; then
    exec /mtasa/mta-server64 -n -t -u
else
    exec /mtasa/mta-server -n -t -u
fi

