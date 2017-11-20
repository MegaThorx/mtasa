```
docker run \
    -p 22003:22003/udp \
    -p 22005:22005 \
    -p 22126:22126 \
    -v /srv/mtasa:/mtasa/mods/deathmatch \
    -d \
    --name mta-server \
    megathorx/mtasa
```
