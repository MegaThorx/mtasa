#!/bin/bash
set -e

if [ ! -e /mtasa/mods/deathmatch/mtaserver.conf ]; then
    echo "Copying configs..."
    cp /mtasa/config/* /mtasa/mods/deathmatch/
fi

if [ ! -e /mtasa/mods/deathmatch/resources ]; then
    echo "Downloading resources..."
    mkdir /mtasa/mods/deathmatch/resources
    wget -O /root/resources.zip http://mirror.mtasa.com/mtasa/resources/mtasa-resources-latest.zip
    unzip /root/resources.zip -d /mtasa/mods/deathmatch/resources
    rm /root/resources.zip
fi

# Start mtasa server
exec /mtasa/mta-server64 -n -t -u
