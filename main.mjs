import md5 from 'md5';

trans();

function trans() {

    let originalText;
    let element;

    if (typeof document !== "undefined" && document.getElementById) {
        // 前端（浏览器）环境
        element = document.getElementById("pageTitle");
        if (element) {
            originalText = element.innerText;
        } else {
            originalText = "页面标题未找到！";
        }
    } else {
        // 后端（Node.js）环境
        originalText = "你好，世界！";
    }
    // 百度翻译API接口信息
    let appid = '20240911002147778';  // 替换为你的AppID
    let key = 'AaYsHo7Fs5dtURwYi9hq';       // 替换为你的密钥
    let salt = (new Date).getTime();  // 随机数
    let from = 'auto';  // 自动检测语言
    let to = 'en';      // 目标语言为英语

    // 生成签名
    function generateSign(query, salt, appid, key) {
        let str = appid + query + salt + key;
        return md5(str) // 使用 crypto 模块进行 MD5 哈希
    }

    // 调用百度翻译API
    async function translateText(text, targetLanguage) {
        let sign = generateSign(text, salt, appid, key);

        let url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(text)}&from=${from}&to=${targetLanguage}&appid=${appid}&salt=${salt}&sign=${sign}`;
        let urlTest = "https://fanyi-api.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4";
        console.log(url);

        let response = await fetch(url);
        let result = await response.json();
        console.log(result);
        return result.trans_result[0].dst;
    }


    // 调用翻译函数并输出结果
    translateText(originalText, to).then(translatedText => {
        console.log(translatedText);
        if (typeof document !== "undefined") {
            element.innerHTML = `<h2>${translatedText}</h2>`;
        }
    }).catch(error => {
        console.error("Translation error:", error);
    });

}