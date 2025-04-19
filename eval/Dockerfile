FROM docker.io/library/archlinux:latest

RUN : && \
    pacman -Syu --noconfirm \
    base-devel \
    fortune-mod \
    nodejs \
    python \
    vim \
    git \
    zsh \
    wget \
    fish \
    dash \
    zsh \
    ksh \
    && :

ENV CFLAGS="-Wno-implicit-function-declaration"
RUN : \
    && wget https://ftp.gnu.org/gnu/bash/bash-4.4.tar.gz \
    && tar xvfz bash-4.4.tar.gz || true \
    && cd bash-4.4 \
    && ./configure \
    && make \
    && mv bash /usr/sbin/bash4.4 \
    && cd / \
    && rm -rf bash-4.4* \
    && :

RUN : \
    && git clone https://git.savannah.gnu.org/git/bash.git \
    && cd /bash \
    && git checkout devel \
    && ./configure \
    && make \
    && mv /bash/bash /usr/sbin/bashdevel \
    && cd / \
    && rm -rf /bash \
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


RUN : && \
    pacman -Rns --noconfirm \
    wget \
    git \
    && :

WORKDIR /root
