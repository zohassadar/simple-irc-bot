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

RUN : \
    && mkdir -p src \
    && cd src \
    && git clone https://github.com/phy1729/seq \
    && cd seq \
    && make \
    && mv seq /bin/wseq \
    && cd / \
    && rm -rf /src/ \
    && :

WORKDIR /root
