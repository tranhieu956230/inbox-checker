const puppeteer = require("puppeteer");
const rp = require("request-promise");

const Username = "";
const Password = "";

async function getPollingLink() {
    try {

        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })

        const page = await browser.newPage();

        await page.goto("https://www.facebook.com", {
            waitUntil: 'networkidle0'
        });

        await page.hover("#email");
        await page.focus("#email");
        await page.type("#email", Username, {
            delay: 10
        });

        await page.hover("#pass");
        await page.focus("#pass");
        await page.type("#pass", Password, {
            delay: 15
        });

        await page.hover("#loginbutton");
        await page.click("#loginbutton", {
            delay: 300
        });

        await page.waitForNavigation({
            waitUntil: 'domcontentloaded'
        })

        await page.setRequestInterception(true);

        const cookies = await page.cookies();

        let cookieString = "";
        for (let cookie of cookies) {
            cookieString += `${cookie.name}=${cookie.value}; `
        }
        let link = await new Promise((resolve, reject) => {
            page.on("request", async request => {
                let url = request.url();
                let regex = /-edge-chat.facebook.com\/pull/
                if (regex.test(url.substring(0, url.indexOf("?")))) {
                    if (url.includes("sticky_token") && url.includes("sticky_pool")) {
                        await browser.close();
                        resolve(url);
                    }
                }
                request.continue();
            })
        })

        let data = {
            link,
            cookie: cookieString
        }
        return data;


    } catch (err) {
        console.log(err.message);
    }
}

async function polling(link, cookie) {
    console.log("Polling:", link);
    console.log("Cookie", cookie);
    let host = link.substring(0, link.indexOf("?"));
    let params = paramsParser(link);
    params.seq = parseInt(params.seq);
    params.iris_enabled = true;

    while (1) {
        try {
            let data = await doPoll(host, params, cookie);
            params.seq++;
            let response = parseResponse(data);
            if (response.t == "msg") {
                if (response.ms[0].ofd_ts && response.ms[0].delta.body) {
                    console.log("Sender:", response.ms[0].delta.messageMetadata.actorFbId);
                    console.log("Content:", response.ms[0].delta.body);
                    console.log("=========================================");
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

}

function parseResponse(data) {
    let response = data.substring(data.indexOf("{"));
    return JSON.parse(response);
}

async function doPoll(host, params, cookie) {
    return rp({
        uri: host,
        qs: params,
        method: "GET",
        headers: {
            origin: "https://wwww.facebook.com",
            referer: "https://www.facebook.com/",
            'user-agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36",
            cookie
        },
        json: true
    }).catch(err => {
        console.log("doPoll", err.message);
    })
}

function paramsParser(link) {
    let params = link.substring(link.indexOf("?") + 1);
    let p1 = params.split("&");
    for (let i = 0; i < p1.length; i++) {
        p1[i] = p1[i].split("=");
    }
    let paramsObj = {};

    for (let param of p1) {
        paramsObj[param[0]] = param[1];
    }
    return paramsObj;
}

async function main() {
    const data = await getPollingLink();
    console.log("Done Getting Link");
    // let data = {
    //     link: "https://1-edge-chat.facebook.com/pull?channel=p_100020958637507&seq=0&partition=-2&clientid=7f3971be-12d5-4940-9d86-25a098901758&cb=18ln&idle=0&qp=y&cap=8&iris_enabled=false&pws=fresh&isq=64451&msgs_recv=0&uid=100020958637507&viewer_uid=100020958637507&request_batch=1&msgr_region=FRC&state=active",
    //     cookie: "pl=n; fr=12JahFae3lbvjjUNL.AWXwpf6SF-Ei9lEyDi-5ECXiRZk.Bcf0oV.3d.AAA.0.0.Bcf0od.AWWD60D2; xs=6%3Ai0pkfqnosbCZ0w%3A2%3A1551845917%3A4507%3A6383; c_user=100020958637507; spin=r.4823343_b.trunk_t.1551845918_s.1_v.2_; wd=800x600; datr=FUp_XF8EO3TQjYNWrGjFWfkD; sb=FUp_XFU9vpz8snG-QmJwiYYi;"
    // };
    await polling(data.link, data.cookie);
}

main();