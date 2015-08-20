FROM azukiapp/node:0.10

MAINTAINER Julio Saito <saitodisse@gmail.com>

RUN    apt-get update                     \
    && apt-get install -y                 \
                          graphicsmagick  \
                          # phantomjs       \
                          pkgconf         \
                          libcairo2-dev   \
                          libjpeg8-dev    \
    && npm cache clear
