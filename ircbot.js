/*
todo:

support multiple channels
add more codes
run as service
sandbox for arbitrary commands
error handling

*/

const crypto = require('crypto');
const irc = require('irc-upd');
const { spawn, spawnSync } = require('node:child_process');
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ircServer = process.env['IRCSERVER'];
if (!ircServer) {
    console.error('Specify IRCSERVER');
    process.exit(1);
}
const ircChannel = process.env['IRCCHANNEL'];
if (!ircChannel) {
    console.error('Specify IRCCHANNEL');
    process.exit(1);
}

const ircPassword = process.env['IRCPASSWORD'];
const ircPort = +process.env['IRCPORT'] || 6667;
const ircNick = process.env['IRCNICK'] || 'bot';
const ircUser = process.env['IRCUSER'] || 'zobot';
const ircName = process.env['IRCNAME'] || 'I AM BOT';

const LINELIMIT = 5;
const CHARLIMIT = 1000;

supportedLangs = {
    bash: ['bash', '-c'],
    '#': ['bash', '-c'],
    node: ['node', '-p'],
    js: ['node', '-p'],
    '>': ['node', '-p'],
    perl: ['perl', '-e'],
    python: ['python', '-c'],
    '>>>': ['python', '-c'],
};

supportedCommands = {
    help: 'not that organized',
    ping: 'pong',
    'lvha?': 'yes',
    codes: Object.keys(supportedLangs).join(','),
};

const codes = {
    // from kirjavascript/nibblrjr
    r: '04',
    dr: '05',
    w: '00',
    bl: '01',
    c: '11',
    dc: '10',
    b: '12',
    db: '02',
    g: '09',
    dg: '03',
    p: '13',
    dp: '06',
    o: '07',
    y: '08',
    gr: '15',
    dgr: '14',

    // formatting
    u: '\u001f',
    bo: '\u0002',
    i: '\u001D',

    bell: '\x07',

    // reset
    '/': '\u000f',
};

function getCode(code) {
    return `\u0003${codes[code]}`;
}

function evaluateCode(lang, script, msgCallback, errorCallback) {
    langArgs = supportedLangs[lang];

    let name = `eval-${crypto.randomUUID()}`;

    args = [
        'run',
        '--net',
        'none',
        '--memory',
        '128m',
        '--memory-swap',
        '128m',
        '--name',
        name,
        '--rm',
        'eval',
        ...langArgs,
        script,
    ];

    const ac = new AbortController();
    const signal = ac.signal;
    const charLimit = 450;

    let result = spawn('podman', args);
    let lineCounter = LINELIMIT;
    let charCounter = CHARLIMIT;
    let killed = false;
    let outputSent = false;
    let segment;

    function podmanKiller(reason) {
        killed = true;
        spawnSync('podman', ['kill', name]);
        errorCallback(reason);
    }

    function responder(data, color) {
        if (killed) return;
        outer: for (line of data.toString().trim().split(/\n/)) {
            line = line.trim().replace(/ +/g, ' ');
            if (!line.length) continue;
            outputSent = true;
            inner: for (i = 0; i < line.length; i += charLimit) {
                if (lineCounter < 1) {
                    podmanKiller(`line limit exceeded: ${LINELIMIT}`);
                    break outer;
                }
                if (charCounter < 1) {
                    podmanKiller(`char limit exceeded: ${CHARLIMIT}`);
                    break outer;
                }
                segment = line.slice(i, i + charLimit);
                lineCounter -= 1;
                charCounter -= segment.length;
                msgCallback(`${color}${segment}`);
            }
        }
    }

    setTimeoutPromise(2000, 'timeout!', { signal })
        .then(podmanKiller)
        .catch((err) => {
            if (err.name !== 'AbortError') {
                console.error(`podmanKiller Error: ${err.name} ${err.message}`);
            }
        });

    result.stdout.on('data', (data) => {
        responder(data, '');
    });

    result.stderr.on('data', (data) => {
        responder(data, getCode('r'));
    });

    result.on('close', (code) => {
        ac.abort();
        if (code && code != 137) {
            errorCallback(`exited with code ${code}`);
        }
        if (!code && !outputSent) {
            errorCallback('no output');
        }
    });
}

function messageListener(from, to, msg) {
    if (!msg.startsWith('!')) {
        console.log(`Ignoring: ${from}->${to}: ${msg}`);
        return;
    }
    let components = msg.split(/\s+/);
    let command = components[0].slice(1);
    let script = components.slice(1).join(' ');
    console.log(`Received ${from}->${to}: ${command} "${script}"`);

    let msgCallback = (response) => client.say(to, `> ${response}`);
    let errorCallback = (response) => client.say(to, `!> ${response}`);

    if (supportedCommands[command]) {
        msgCallback(supportedCommands[command]);
        return;
    }
    if (!supportedLangs[command]) {
        errorCallback('i dunno what to do with that');
        return;
    }
    if (!script.length) {
        errorCallback("you didn't give me any code silly");
        return;
    }
    evaluateCode(command, script, msgCallback, errorCallback);
}

const client = new irc.Client(ircServer, ircNick, {
    port: ircPort,
    channels: [ircChannel],
    password: ircPassword,
    realName: ircName,
    userName: ircUser,
});

client.addListener('message', messageListener);
