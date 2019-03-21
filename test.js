const rp = require("request-promise");


async function main() {
    const data = await rp({
        uri: `https://4-edge-chat.facebook.com/pull`,
        qs: {
            channel: 'p_100020958637507',
        seq: 97,
        partition: '-2',
        clientid: '0eff9f45-7ac9-4a97-8f98-f29c02946614',
        cb: 'ks1m',
        idle: '65',
        qp: 'y',
        cap: '8',
        iris_enabled: true,
        pws: 'fresh',
        isq: '64417',
        msgs_recv: '93',
        uid: '100020958637507',
        viewer_uid: '100020958637507',
        sticky_token: '1907',
        sticky_pool: 'rfrc0c02_chatproxy-regional'
        },
        headers: {
            cookie: "sb=47Z-XD3rZBTULdwOlDWJuT-P; datr=47Z-XG2vbd4zD4QaRgIzVIbq; c_user=100020958637507; xs=8%3A6D1gkZFf2xLm_A%3A2%3A1551808239%3A4507%3A6383; pl=n; spin=r.4820715_b.trunk_t.1551808240_s.1_v.2_; fr=18xsqYsJ6wuSmKvGf.AWWKgAY3EPXbk8IzYwDMHOoOi3A.Bcfrbj.68.Fx-.0.0.Bcfrb5.AWWvUTO0; act=1551841921446%2F0; wd=1920x523; presence=EDvF3EtimeF1551841934EuserFA21B20958637507A2EstateFDutF1551841934305CEchFDp_5f1B20958637507F2CC"
        },
        method: "GET"
    }).catch(err => {
        console.log(err);
    })

    console.log(data);
}

main()


// var request = require("request");

// var options = {
//     method: 'GET',
//     url: 'https://4-edge-chat.facebook.com/pull',
//     qs: {
//         channel: 'p_100020958637507',
//         seq: '93',
//         partition: '-2',
//         clientid: '0eff9f45-7ac9-4a97-8f98-f29c02946614',
//         cb: 'ks1m',
//         idle: '65',
//         qp: 'y',
//         cap: '8',
//         iris_enabled: 'false',
//         pws: 'fresh',
//         isq: '64417',
//         msgs_recv: '93',
//         uid: '100020958637507',
//         viewer_uid: '100020958637507',
//         sticky_token: '1907',
//         sticky_pool: 'rfrc0c02_chatproxy-regional'
//     },
//     headers: {
//         'postman-token': '7537ef35-cc85-64d0-39a5-4ba72040e048',
//         'cache-control': 'no-cache',
//         accept: '*/*',
//         'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
//         origin: 'https://www.facebook.com'
//     }
// };

// request(options, function (error, response, body) {
//     if (error) throw new Error(error);

//     console.log(body);
// });
