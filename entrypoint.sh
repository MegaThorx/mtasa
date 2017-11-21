#!/bin/bash
set -e
chown -R 2000:2000 /mtasa
su container

if [ ! -e /mtasa/mods/deathmatch/mtaserver.conf ]; then
    echo "Copying configs..."
    cp /mtasa/config/* /mtasa/mods/deathmatch/
fi

if [ ! -e /mtasa/mods/deathmatch/resources ]; then
    echo "Downloading resources..."
    mkdir /mtasa/mods/deathmatch/resources
    wget -O /home/container/resources.zip http://mirror.mtasa.com/mtasa/resources/mtasa-resources-latest.zip
    unzip /home/container/resources.zip -d /mtasa/mods/deathmatch/resources
    rm /home/container/resources.zip
fi

# Start mtasa server
exec /mtasa/mta-server64 -n -t -u
