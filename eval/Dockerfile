FROM docker.io/library/archlinux:latest

RUN : && \
    pacman -Syu --noconfirm \
    base-devel \
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
    cmake \
    rinutils \
    glibc \
    recode \
    && :

# ENV CFLAGS="-Wno-implicit-function-declaration"
# RUN : \
#     && wget https://ftp.gnu.org/gnu/bash/bash-4.4.tar.gz \
#     && tar xvfz bash-4.4.tar.gz || true \
#     && cd bash-4.4 \
#     && ./configure \
#     && make \
#     && mv bash /usr/sbin/bash4.4 \
#     && cd / \
#     && rm -rf bash-4.4* \
#     && :

# RUN : \
#     && git clone https://git.savannah.gnu.org/git/bash.git \
#     && cd /bash \
#     && git checkout devel \
#     && ./configure \
#     && make \
#     && mv /bash/bash /usr/sbin/bashdevel \
#     && cd / \
#     && rm -rf /bash \
#     && :

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


# Steps & patch from https://archlinux.org/packages/extra/x86_64/fortune-mod/
ARG FORTUNE_VER="3.22.0"
COPY not-a-game.patch /
RUN : \
    && wget https://github.com/shlomif/fortune-mod/releases/download/fortune-mod-${FORTUNE_VER}/fortune-mod-${FORTUNE_VER}.tar.xz \
    && tar xvf fortune-mod-${FORTUNE_VER}.tar.xz || true \
    && cd fortune-mod-${FORTUNE_VER} \
    && patch -p1 -i ../not-a-game.patch \
    &&   cmake \
        -B build \
        -D CMAKE_INSTALL_PREFIX=/usr \
        -D NO_OFFENSIVE=OFF \
        -D LOCALDIR=/usr/share/fortune \
        -D COOKIEDIR=/usr/share/fortune \
    && cmake --build build \
    && cmake --install build \
    && cd .. \
    && rm -rf fortune-mod-${FORTUNE_VER} \
    && :

RUN : && \
    pacman -Rns --noconfirm \
    wget \
    git \
    cmake \
    rinutils \
    base-devel \
    && :

WORKDIR /root
