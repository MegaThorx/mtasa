FROM debian:latest

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y lib32gcc1 unzip curl libreadline5 libncursesw5 lib32ncursesw5 lib32stdc++6 wget && \
    mkdir /mtasa

RUN wget -O /root/multitheftauto_linux_x64.tar.gz https://nightly.mtasa.com/?multitheftauto_linux_x64-1.5-rc-latest && \
    tar -xf /root/multitheftauto_linux_x64.tar.gz -C /mtasa --strip-components=1 && \
    rm -f /root/multitheftauto_linux_x64.tar.gz && \
    mkdir /mtasa/config && \
    wget -O /root/baseconfig.tar.gz https://linux.mtasa.com/dl/baseconfig.tar.gz && \
    tar -xf /root/baseconfig.tar.gz -C /mtasa/config --strip-components=1 && \
    rm /root/baseconfig.tar.gz

EXPOSE 22003 22005 22126

COPY ./entrypoint.sh /entrypoint.sh

CMD ["/bin/bash", "/entrypoint.sh"]
