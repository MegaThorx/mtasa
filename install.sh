#!/bin/bash

if [ $ARCH = x86 ]; then
    dpkg --add-architecture i386
fi

apt-get update
apt-get upgrade -y
apt-get install -y unzip libreadline5 libncursesw5 wget


if [ $ARCH = x86 ]; then
    apt-get install -y lib32ncursesw5 lib32stdc++6 zlib1g:i386
fi