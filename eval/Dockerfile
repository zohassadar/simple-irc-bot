FROM docker.io/library/archlinux:latest

RUN : && \
    pacman -Syu --noconfirm \
    base-devel \
    fortune-mod \
    nodejs \
    python \
    vim \
    git \
    && :

COPY american-seq.patch /

RUN : \
    && mkdir -p src \
    && cd src \
    && git clone https://github.com/phy1729/seq \
    && cd seq \
    && git checkout 3ad43e936427b3326304660e21cc9d7cdb98f8cc \
    && git apply /american-seq.patch \
    && make \
    && mv seq /bin/wseq \
    && cd / \
    && rm -rf /src/seq/ american-seq.patch \
    && :

WORKDIR /root
