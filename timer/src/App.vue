<template>
    <audio
        ref="audioTip"
        style="display: none"
        controls="controls"
        preload="auto"
    >
        <source :src="audio" />
    </audio>
    <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
        <n-scrollbar style="max-height: calc(100vh)">
            <n-card style="width: 85%; margin: 1.5% 7.5% -1% 7.5%">
                <n-button
                    round
                    size=""
                    quaternary
                    type="default"
                    style="padding: 10px; float: right"
                    @click="editTitle = !editTitle"
                >
                    <n-icon size="15">
                        <PencilOutline />
                    </n-icon>
                </n-button>
                <n-space justify="space-around">
                    <h1
                        v-if="!editTitle"
                        style="margin-top: -1%; margin-bottom: -1%"
                    >
                        {{ title }}
                    </h1>
                    <n-input
                        v-if="editTitle"
                        v-model:value="title"
                        style="width: 60vw; text-align: center"
                        label="Title"
                        placeholder="输入标题"
                        clearable
                        @keydown.enter="editTitle = false"
                    />
                </n-space>
            </n-card>
            <n-space justify="center" size="large" style="margin-top: 3%">
                <n-card
                    class="main"
                    :class="
                        ('main',
                        {
                            act:
                                (active1 && tab == '倒计时') ||
                                (!stop1 && tab == '秒表'),
                            end: end1,
                        })
                    "
                    ><n-tabs
                        type="line"
                        animated
                        size="large"
                        style="margin: 0 -4px; color: #70c0e8"
                        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                        class="card-tabs"
                        v-model:value="tab"
                        justify-content="space-evenly"
                        @update:value="
                            tab == '倒计时'
                                ? (end1 = end1)
                                : (end1 = end2 = false)
                        "
                    >
                        <template #suffix>
                            <div v-show="!stop1 && tab == '倒计时'">
                                <n-tag :bordered="false" type="info"
                                    >秒表运行中</n-tag
                                >
                            </div>
                            <div v-show="active1 && tab == '秒表'">
                                <n-tag :bordered="false" type="info"
                                    >倒计时运行中</n-tag
                                >
                            </div>
                            <div v-show="!active1 && tab == '秒表' && end1">
                                <n-tag :bordered="false" type="error"
                                    >倒计时已结束 !
                                </n-tag>
                            </div>
                        </template>
                        <n-tab-pane
                            name="倒计时"
                            tab="倒计时"
                            display-directive="show"
                        >
                            <div class="countdown" style="margin-top: 20%">
                                <n-countdown
                                    :duration="
                                        (h1 * 3600 + m1 * 60 + s1) * 1000
                                    "
                                    :active="active1"
                                    ref="countdownRef1"
                                    :precision="2"
                                    :on-finish="finish1"
                                />
                            </div>
                            <n-space
                                justify="space-around"
                                size="large"
                                style="margin-top: 20%"
                            >
                                <n-button
                                    strong
                                    secondary
                                    type="info"
                                    @click="
                                        (active1 = !active1), (end1 = false)
                                    "
                                    :disabled="
                                        (h1 <= 0 && m1 <= 0 && s1 <= 0) ||
                                        end1 ||
                                        !canStart1
                                    "
                                    class="countdown-btn"
                                >
                                    <div v-if="active1">&emsp;暂停&emsp;</div>
                                    <div v-if="!active1">&emsp;开始&emsp;</div>
                                </n-button>
                                <n-button
                                    strong
                                    secondary
                                    type="default"
                                    :disabled="active1"
                                    class="countdown-btn"
                                    @click="resetCountdown1()"
                                >
                                    <div>&emsp;重置&emsp;</div>
                                </n-button>
                            </n-space>
                            <n-space vertical>
                                <n-button
                                    round
                                    size="large"
                                    quaternary
                                    type="default"
                                    style="
                                        float: left;
                                        margin: 10px 0 0;
                                        padding: 10px;
                                    "
                                    @click="show1 = !show1"
                                >
                                    <n-icon size="20">
                                        <SettingsOutline />
                                    </n-icon>
                                </n-button>
                                <n-collapse-transition :show="show1">
                                    <n-form
                                        :disabled="active1"
                                        class="time-form"
                                        label-placement="left"
                                        label-width="auto"
                                    >
                                        <n-form-item
                                            label="小时"
                                            v-bind:validation-status="h1Status"
                                        >
                                            <n-input-number
                                                v-model:value="h1"
                                                clearable
                                                placeholder="小时"
                                                :disabled="active1"
                                                style="width: 70%"
                                                @change="resetCountdown1()"
                                            />
                                            <template #feedback>
                                                {{ hFeedback(h1) }}
                                            </template>
                                        </n-form-item>
                                        <n-form-item
                                            label="分钟"
                                            v-bind:validation-status="m1Status"
                                        >
                                            <n-input-number
                                                v-model:value="m1"
                                                clearable
                                                placeholder="分钟"
                                                style="width: 70%"
                                                @change="resetCountdown1()"
                                            />
                                            <template #feedback>
                                                {{ mFeedback(m1) }}
                                            </template>
                                        </n-form-item>
                                        <n-form-item
                                            label="秒钟"
                                            v-bind:validation-status="s1Status"
                                        >
                                            <n-input-number
                                                v-model:value="s1"
                                                clearable
                                                placeholder="秒钟"
                                                style="width: 70%"
                                                @change="resetCountdown1()"
                                            />
                                            <template #feedback>
                                                {{ sFeedback(s1) }}
                                            </template>
                                        </n-form-item>
                                    </n-form>
                                </n-collapse-transition>
                            </n-space>
                        </n-tab-pane>
                        <n-tab-pane name="秒表" tab="秒表">
                            <div class="timer">
                                {{ f(t1)[0] }}:{{ f(t1)[1] }}:{{ f(t1)[2] }}
                            </div>
                            <n-button
                                @click="(stop1 = !stop1), timer1(stop1)"
                                class="btn-timer"
                                type="info"
                            >
                                <div v-if="!stop1">停止</div>
                                <div v-else>开始</div>
                            </n-button>
                            <n-button
                                @click="t1 = 0"
                                secondary
                                class="btn-timer"
                                type="info"
                                :disabled="!stop1"
                            >
                                重置
                            </n-button>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
                <div style="width: 0.7vw"></div>
                <n-card
                    class="main"
                    :class="
                        ('main',
                        {
                            act:
                                (active2 && tab == '倒计时') ||
                                (!stop2 && tab == '秒表'),
                            end: end2,
                        })
                    "
                    ><n-tabs
                        type="line"
                        animated
                        size="large"
                        style="margin: 0 -4px"
                        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                        class="card-tabs"
                        justify-content="space-evenly"
                        v-model:value="tab"
                        @update:value="
                            tab == '倒计时'
                                ? (end2 = end2)
                                : (end1 = end2 = false)
                        "
                    >
                        <template #suffix>
                            <div v-show="!stop2 && tab == '倒计时'">
                                <n-tag :bordered="false" type="info"
                                    >秒表运行中</n-tag
                                >
                            </div>
                            <div v-show="active2 && tab == '秒表'">
                                <n-tag :bordered="false" type="info"
                                    >倒计时运行中</n-tag
                                >
                            </div>
                            <div v-show="!active2 && tab == '秒表' && end2">
                                <n-tag :bordered="false" type="error"
                                    >倒计时已结束 !
                                </n-tag>
                            </div>
                        </template>
                        <n-tab-pane
                            name="倒计时"
                            tab="倒计时"
                            display-directive="show"
                        >
                            <div class="countdown" style="margin-top: 20%">
                                <n-countdown
                                    :duration="
                                        (h2 * 3600 + m2 * 60 + s2) * 1000
                                    "
                                    :active="active2"
                                    :precision="2"
                                    ref="countdownRef2"
                                    :on-finish="finish2"
                                />
                            </div>
                            <n-space
                                justify="space-around"
                                size="large"
                                style="margin-top: 20%"
                            >
                                <n-button
                                    strong
                                    secondary
                                    type="info"
                                    @click="
                                        (active2 = !active2), (end2 = false)
                                    "
                                    :disabled="
                                        (h2 <= 0 && m2 <= 0 && s2 <= 0) ||
                                        end2 ||
                                        !canStart2
                                    "
                                    class="countdown-btn"
                                >
                                    <div v-if="active2">&emsp;暂停&emsp;</div>
                                    <div v-if="!active2">&emsp;开始&emsp;</div>
                                </n-button>
                                <n-button
                                    strong
                                    secondary
                                    type="default"
                                    :disabled="active2"
                                    @click="resetCountdown2()"
                                    class="countdown-btn"
                                >
                                    <div>&emsp;重置&emsp;</div>
                                </n-button>
                            </n-space>
                            <n-space vertical>
                                <n-button
                                    round
                                    size="large"
                                    quaternary
                                    type="default"
                                    style="
                                        float: left;
                                        margin: 10px 0 0;
                                        padding: 10px;
                                    "
                                    @click="show2 = !show2"
                                >
                                    <n-icon size="20">
                                        <SettingsOutline />
                                    </n-icon>
                                </n-button>
                                <n-collapse-transition :show="show2">
                                    <n-form
                                        :disabled="active2"
                                        class="time-form"
                                        label-placement="left"
                                        label-width="auto"
                                    >
                                        <n-form-item
                                            label="小时"
                                            v-bind:validation-status="h2Status"
                                        >
                                            <n-input-number
                                                v-model:value="h2"
                                                clearable
                                                placeholder="小时"
                                                style="width: 70%"
                                                @change="resetCountdown2()"
                                            />
                                            <template #feedback>
                                                {{ hFeedback(h2) }}
                                            </template>
                                        </n-form-item>
                                        <n-form-item
                                            label="分钟"
                                            v-bind:validation-status="m2Status"
                                        >
                                            <n-input-number
                                                v-model:value="m2"
                                                clearable
                                                placeholder="分钟"
                                                style="width: 70%"
                                                @change="resetCountdown2()"
                                            />
                                            <template #feedback>
                                                {{ mFeedback(m2) }}
                                            </template>
                                        </n-form-item>
                                        <n-form-item
                                            label="秒钟"
                                            v-bind:validation-status="s2Status"
                                        >
                                            <n-input-number
                                                v-model:value="s2"
                                                clearable
                                                placeholder="分钟"
                                                style="width: 70%"
                                                @change="resetCountdown2()"
                                            />
                                            <template #feedback>
                                                {{ sFeedback(s2) }}
                                            </template>
                                        </n-form-item>
                                    </n-form>
                                </n-collapse-transition>
                            </n-space>
                        </n-tab-pane>
                        <n-tab-pane name="秒表" tab="秒表">
                            <div class="timer">
                                {{ f(t2)[0] }}:{{ f(t2)[1] }}:{{ f(t2)[2] }}
                            </div>
                            <n-button
                                class="btn-timer"
                                type="info"
                                @click="(stop2 = !stop2), timer2(stop2)"
                            >
                                <div v-if="!stop2">停止</div>
                                <div v-else>开始</div>
                            </n-button>
                            <n-button
                                :disabled="!stop2"
                                type="info"
                                class="btn-timer"
                                secondary
                                @click="t2 = 0"
                            >
                                重置
                            </n-button>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </n-space>
            <n-card style="width: 85%; margin: 2% 7.5% 2% 7.5%">
                <div
                    style="
                        margin-left: 20px;
                        margin-bottom: -1%;
                        margin-top: -0.5%;
                        font-size: 1rem;
                        font-weight: 900;
                    "
                >
                    同步操作
                </div>
                <n-divider style="width: 98%; margin-left: 1%" />
                <n-button
                    type="default"
                    style="margin: 0px 20px"
                    tertiary
                    :disabled="
                        (active1 && active2) ||
                        (h2 <= 0 && m2 <= 0 && s2 <= 0) ||
                        end2 ||
                        !canStart2 ||
                        (h1 <= 0 && m1 <= 0 && s1 <= 0) ||
                        end1 ||
                        !canStart1
                    "
                    v-show="tab === '倒计时'"
                    @click="(active1 = true), (active2 = true)"
                    >启动所有倒计时</n-button
                >
                <n-button
                    type="default"
                    @click="(active1 = false), (active2 = false)"
                    style="margin: 0px 20px"
                    tertiary
                    :disabled="!active1 && !active2"
                    v-show="tab === '倒计时'"
                    >暂停所有倒计时</n-button
                >
                <n-button
                    type="default"
                    @click="(active1 = !active1), (active2 = !active2)"
                    style="margin: 0px 20px"
                    tertiary
                    v-show="tab === '倒计时'"
                    :disabled="
                        (h2 <= 0 && m2 <= 0 && s2 <= 0) ||
                        end2 ||
                        !canStart2 ||
                        (h1 <= 0 && m1 <= 0 && s1 <= 0) ||
                        end1 ||
                        !canStart1
                    "
                    >切换所有倒计时状态</n-button
                >
                <n-button
                    type="default"
                    @click="resetCountdown1(), resetCountdown2()"
                    style="margin: 0px 20px"
                    tertiary
                    :disabled="active1 && active2"
                    v-show="tab === '倒计时'"
                    >重置所有倒计时</n-button
                >

                <n-button
                    type="default"
                    @click="
                        ((stop1 = false), (stop2 = false), timer1(stop1)),
                            timer2(stop2)
                    "
                    style="margin: 0px 20px"
                    tertiary
                    :disabled="!stop1 && !stop2"
                    v-show="tab === '秒表'"
                    >启动所有秒表</n-button
                >
                <n-button
                    type="default"
                    @click="
                        ((stop1 = true), (stop2 = true), timer1(stop1)),
                            timer2(stop2)
                    "
                    style="margin: 0px 20px"
                    tertiary
                    :disabled="stop1 || stop2"
                    v-show="tab === '秒表'"
                    >暂停所有秒表</n-button
                >
                <n-button
                    type="default"
                    @click="
                        ((stop1 = !stop1), (stop2 = !stop2), timer1(stop1)),
                            timer2(stop2)
                    "
                    style="margin: 0px 20px"
                    tertiary
                    v-show="tab === '秒表'"
                    >切换所有秒表状态</n-button
                >
                <n-button
                    type="default"
                    @click="(t1 = 0), (t2 = 0)"
                    style="margin: 0px 20px"
                    tertiary
                    v-show="tab === '秒表'"
                    >重置所有秒表</n-button
                >
                <n-collapse-transition :show="tab == '倒计时'">
                    <n-divider style="width: 101%; margin-left: -0.5%" />
                    <div
                        style="
                            margin-left: 20px;
                            margin-bottom: -1%;
                            font-size: 1rem;
                            font-weight: 900;
                        "
                    >
                        倒计时快捷操作
                    </div>
                    <n-divider style="width: 98%; margin-left: 1%" />
                    <n-button
                        type="default"
                        style="margin: 0 20px"
                        tertiary
                        :disabled="active1 || active2"
                        @click="setTime(0, 0, 1, 1, 0, 0)"
                        >倒计时 1 分钟</n-button
                    >
                    <n-button
                        type="default"
                        style="margin: 0 20px"
                        tertiary
                        :disabled="active1 || active2"
                        @click="setTime(0, 0, 1, 1, 30, 30)"
                        >倒计时 1 分 30 秒</n-button
                    >
                    <n-button
                        type="default"
                        style="margin: 0 20px"
                        tertiary
                        :disabled="active1 || active2"
                        @click="setTime(0, 0, 3, 3, 0, 0)"
                        >倒计时 3 分钟</n-button
                    >
                    <n-button
                        type="default"
                        style="margin: 0 20px"
                        tertiary
                        :disabled="active1 || active2"
                        @click="setTime(0, 0, 5, 5, 0, 0)"
                        >倒计时 5 分钟</n-button
                    >
                    <n-button
                        type="default"
                        style="margin: 0 20px"
                        tertiary
                        :disabled="active1 || active2"
                        @click="setTime(0, 0, 7, 7, 0, 0)"
                        >倒计时 7 分钟</n-button
                    >
                    <n-button
                        type="default"
                        style="margin: 0 20px"
                        tertiary
                        :disabled="active1 || active2"
                        @click="setTime(0, 0, 10, 10, 0, 0)"
                        >倒计时 10 分钟</n-button
                    >
                </n-collapse-transition>
            </n-card>
            <n-button
                style="float: right; margin-top: -0.8vw; margin-right: 7.5vw"
                text
                tag="a"
                href="/Debate-Timer-1.1.7-setup.exe"
                target="_blank"
                >下载 Windows 平台离线版安装包</n-button
            >
            <br />
        </n-scrollbar>
        <n-global-style />
    </n-config-provider>
</template>

<script setup>
import {
    darkTheme,
    NConfigProvider,
    NGlobalStyle,
    NCountdown,
    NButton,
    NCard,
    NSpace,
    NTabs,
    NTabPane,
    NIcon,
    NCollapseTransition,
    NInputNumber,
    NDivider,
    NInput,
    NScrollbar,
    NForm,
    NFormItem,
    NTag,
} from "naive-ui";
import { ref, computed, onMounted } from "vue";
import { SettingsOutline, PencilOutline } from "@vicons/ionicons5";

let tab = ref("倒计时");

let title = ref("");
let editTitle = ref(false);

let active1 = ref(false);
let active2 = ref(false);

let stop1 = ref(true);
let stop2 = ref(true);

let h1 = ref(0);
let h2 = ref(0);

let m1 = ref(0);
let m2 = ref(0);

let s1 = ref(0);
let s2 = ref(0);

let delay = 10;

let t1 = ref(0);
let t2 = ref(0);

let show1 = ref(false);
let show2 = ref(false);

let audio = new URL("./assets/audio/ring.m4a", import.meta.url);

let audioTip = ref();

// audioTip.load()

function timer1() {
    let timer = ref(
        setInterval(function () {
            t1.value++;
            if (stop1.value === true) {
                clearInterval(timer.value);
            }
        }, delay)
    );
}
function timer2() {
    let timer = ref(
        setInterval(function () {
            t2.value++;
            if (stop2.value === true) {
                clearInterval(timer.value);
            }
        }, delay)
    );
}

function finish1() {
    active1.value = false;
    end1.value = true;
    canStart1.value = false;
    audioTip.value.play();
}

function finish2() {
    active2.value = false;
    end2.value = true;
    canStart2.value = false;
    audioTip.value.play();
}

// let temp = ref(0);

function setTime(h1_, h2_, m1_, m2_, s1_, s2_) {
    h1.value = h1_;
    h2.value = h2_;
    m1.value = m1_;
    m2.value = m2_;
    s1.value = s1_;
    s2.value = s2_;
    resetCountdown1();
    resetCountdown2();
}

const countdownRef1 = ref();
function resetCountdown1() {
    countdownRef1.value?.reset();
    end1.value = false;
    canStart1.value = true;
}
const countdownRef2 = ref();
function resetCountdown2() {
    countdownRef2.value?.reset();
    end2.value = false;
    canStart2.value = true;
}
function f(t) {
    let h = Math.floor((t / 360000) * 1) / 1;
    let m = Math.floor(((t % 360000) / 6000) * 1) / 1;
    let s = Math.floor((((t % 360000) % 6000) / 60) * 100) / 100;
    s = s.toString();
    m = m.toString();
    h = h.toString();
    if (m.length < 2) {
        m = "0" + m;
    }
    if (h.length < 2) {
        h = "0" + h;
    }
    if (s.indexOf(".") < 0) {
        s += ".00";
    }
    if (s.slice(0, s.indexOf(".")).length < 2) {
        s = "0" + s;
    }
    while (s.length < s.indexOf(".") + 3) {
        s += "0";
    }

    return [h, m, s];
}

const themeOverrides = {
    common: {
        primaryColor: "#70c0e8",
        primaryColorHover: "#9bcee8",
        primaryColorClick: "#70c0e8",
        primaryColorHold: "#70c0e8",
    },
};

function hCheck(value) {
    if (value * 1 > 72) {
        return "error";
    } else if (value * 1 < 0) {
        return "error";
    } else {
        return undefined;
    }
}
function mCheck(value) {
    if (value * 1 > 59) {
        return "error";
    } else if (value * 1 < 0) {
        return "error";
    } else {
        return undefined;
    }
}
function sCheck(value) {
    if (value * 1 > 59) {
        return "error";
    } else if (value * 1 < 0) {
        return "error";
    } else {
        return undefined;
    }
}
function hFeedback(value) {
    if (value * 1 > 72) {
        return "你不会需要这么多时间的……";
    } else if (value * 1 < 0) {
        return "这个计时器可没法让时间倒流……";
    } else {
        return undefined;
    }
}

function mFeedback(value) {
    if (value * 1 > 59) {
        return "这可是个六十进制的数……";
    } else if (value * 1 < 0) {
        return "你家分针逆时针转？";
    } else {
        return undefined;
    }
}

function sFeedback(value) {
    if (value * 1 > 59) {
        return "这个计时器虽然也能这么用，但是最好别……";
    } else if (value * 1 < 0) {
        return "你这么整怕不是要把秒针掰折……";
    } else {
        return undefined;
    }
}

let h1Status = computed(() => {
    return hCheck(h1.value);
});
let m1Status = computed(() => {
    return mCheck(m1.value);
});
let s1Status = computed(() => {
    return sCheck(s1.value);
});
let h2Status = computed(() => {
    return hCheck(h2.value);
});
let m2Status = computed(() => {
    return mCheck(m2.value);
});
let s2Status = computed(() => {
    return sCheck(s2.value);
});

let end1 = ref(false);
let end2 = ref(false);

let canStart1 = ref(false);
let canStart2 = ref(false);

onMounted(() => {
    audioTip.value.play();
    setTimeout(() => {
        audioTip.value.pause();
        audioTip.value.load();
    }, 10);
    document.onkeydown = function (e) {
        let key = window.event.keyCode;
        if (key == 39 && event.ctrlKey) {
            tab.value = "秒表";
        } else if (key == 37 && event.ctrlKey) {
            tab.value = "倒计时";
        } 
    };
});
</script>

<style>
.main {
    width: 41vw;
}
.countdown {
    text-align: center;
    font-size: 3.5rem;
    margin: 8px;
    font-weight: 600;
    letter-spacing: 0.15rem;
}
.timer {
    text-align: center;
    font-size: 3.5rem;
    margin: 8px;
    font-weight: 600;
    margin-top: 20%;
    margin-bottom: 20%;
    letter-spacing: 0.15rem;
}
.num-input {
    width: 72%;
    margin: 5px;
    margin-left: 14%;
}
.btn-timer {
    width: 70%;
    margin-left: 15%;
    margin-bottom: 5%;
}
.countdown-btn {
    width: 10vw;
}
.act {
    box-shadow: 0 0 1.5vw #3c5160;
}
.end {
    box-shadow: 0 0 1.6vw #7a4651;
}
.time-form {
    margin-left: 20%;
}
.time-form-item {
    width: 120%;
}
</style>
