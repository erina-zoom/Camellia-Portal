console.log("all-events.js 読み込み成功");


const API_BASE =
    "https://camellia-portal.tomoya19980427goku.workers.dev/api/events";


const allEvents =
    document.getElementById("allEvents");


// ==============================
// 日付を表示用に整える
// ==============================

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "ja-JP",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short"
        }
    );
}


// ==============================
// イベントカード
// ==============================

function createEventCard(event) {

    const card =
        document.createElement("article");

    card.className = "event-card";


    // タイトル
    const title =
        document.createElement("div");

    title.className = "event-title";

    title.textContent =
        event.title || "Zoom予定";


    // 日付
    const date =
        document.createElement("div");

    date.className = "event-date";

    date.textContent =
        "📅 " + formatDate(event.event_date);


    // 時間
    const time =
        document.createElement("div");

    time.className = "event-time";

    time.textContent =
        "🕐 " +
        (event.start_time || "") +
        "〜" +
        (event.end_time || "");


    // 説明
    const description =
        document.createElement("div");

    description.className =
        "event-description";

    description.textContent =
        event.description || "";


    // Zoomボタン
    const zoomButton =
        document.createElement("a");

    zoomButton.className =
        "zoom-btn";

    zoomButton.href =
        event.zoom_url || "#";

    zoomButton.target =
        "_blank";

    zoomButton.rel =
        "noopener noreferrer";

    zoomButton.textContent =
        "Zoomに参加する";


    // カードに追加
    card.appendChild(title);

    card.appendChild(date);

    card.appendChild(time);

    if (event.description) {

        card.appendChild(
            description
        );

    }

    if (event.zoom_url) {

        card.appendChild(
            zoomButton
        );

    }


    return card;
}


// ==============================
// イベント読み込み
// ==============================

async function loadEvents() {

    allEvents.textContent =
        "読み込み中...";


    try {

        const response =
            await fetch(API_BASE);


        if (!response.ok) {

            throw new Error(
                "予定の取得に失敗しました"
            );

        }


        const data =
            await response.json();


        const events =
            data.events || [];


        console.log(
            "取得した予定:",
            events
        );


        allEvents.innerHTML = "";


        if (
            !Array.isArray(events) ||
            events.length === 0
        ) {

            allEvents.innerHTML =
                "<p>今後の予定はありません。</p>";

            return;

        }


        // 日付 → 開始時間の順に並べる
        const sortedEvents =
            [...events].sort(
                (a, b) => {

                    const dateA =
                        `${a.event_date} ${a.start_time || ""}`;

                    const dateB =
                        `${b.event_date} ${b.start_time || ""}`;

                    return dateA.localeCompare(
                        dateB
                    );

                }
            );


        // このページでは全予定を表示
        const futureEvents =
            sortedEvents;


        if (futureEvents.length === 0) {

            allEvents.innerHTML =
                "<p>今後の予定はありません。</p>";

            return;

        }


        futureEvents.forEach(
            event => {

                allEvents.appendChild(
                    createEventCard(event)
                );

            }
        );


    } catch (error) {

        console.error(error);

        allEvents.innerHTML =
            "<p>予定を読み込めませんでした。</p>";

    }

}


// ==============================
// メニュー
// ==============================

const menuButton =
    document.getElementById("menuButton");


const closeMenuButton =
    document.getElementById(
        "closeMenuButton"
    );


const sideMenu =
    document.getElementById("sideMenu");


const menuOverlay =
    document.getElementById("menuOverlay");


// ==============================
// メニューを開く
// ==============================

function openMenu() {

    sideMenu.classList.add(
        "show"
    );

    menuOverlay.classList.add(
        "show"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    sideMenu.setAttribute(
        "aria-hidden",
        "false"
    );

}


// ==============================
// メニューを閉じる
// ==============================

function closeMenu() {

    sideMenu.classList.remove(
        "show"
    );

    menuOverlay.classList.remove(
        "show"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    sideMenu.setAttribute(
        "aria-hidden",
        "true"
    );

}


// ==============================
// メニューボタン
// ==============================

if (menuButton) {

    menuButton.addEventListener(
        "click",
        openMenu
    );

}


// ==============================
// 閉じるボタン
// ==============================

if (closeMenuButton) {

    closeMenuButton.addEventListener(
        "click",
        closeMenu
    );

}


// ==============================
// 背景クリックで閉じる
// ==============================

if (menuOverlay) {

    menuOverlay.addEventListener(
        "click",
        closeMenu
    );

}


// ==============================
// 起動
// ==============================

loadEvents();