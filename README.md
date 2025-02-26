#  Simple IRC Bot

Probably not secure

## build container

```
podman build --tag eval --dns 1.1.1.1 ./eval
```

## run

```
IRCSERVER=irc.something.com IRCCHANNEL="#botroom" npm start
```

## Credit

Ideas taken from [kirjavascript/eval](https://github.com/kirjavascript/eval) and [kirjavascript/nibblrjr](https://github.com/kirjavascript/nibblrjr)
