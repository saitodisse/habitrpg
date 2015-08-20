FROM azukiapp/node:0.10

MAINTAINER Julio Saito <saitodisse@gmail.com>

RUN    apt-get update                     \
    && apt-get install -y                 \
                          graphicsmagick  \
                          pkgconf         \
                          libcairo2-dev   \
                          libjpeg8-dev    \
    && apt-get clean -qq \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
