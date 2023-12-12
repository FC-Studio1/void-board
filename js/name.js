var names = ["陈若涵", "陈雨睿", "董轶凡", "董玥含", "高菲儿", "高銘泽", "葛若曦", "扈金诺", "黄荻轩", "纪安瑞", "贾祎祯", "江浩瑜", "况子涵", "李本轩", "李明博", "李书琰", "林瑞志", "刘熙诺", "牟泽展", "平果儿", "秦绍航", "曲瑞涵", "曲智康", "孙清萱", "孙小涵", "王安睿", "王恩祺", "王峻康", "王晴楚", "王若茗", "王意瑶", "王子焕", "魏孟恩", "吴妙可", "邢越", "杨瀚俣", "杨越然", "杨梓童", "于航", "禹天心", "张峻恺", "张梓涵", "周煜皓", "朱梓骏", "祝仰岳", "邹沛辰"];

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var drawButton = document.getElementById("draw");
var resultText = document.getElementById("result");

names = shuffle(names);

var index = 0;

drawButton.addEventListener("click", function () {

    if (index >= names.length) {
        names = shuffle(names);
        index = 0;
        var name = names[index];
        resultText.textContent = name;
        return;
    }


    var name = names[index];


    resultText.textContent = name;


    index++;
});

let threshold = 500;
window.setInterval(function () {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
        window.location.href = "about:blank"
    }
}, 1000)