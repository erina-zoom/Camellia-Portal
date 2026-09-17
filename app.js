/* =========================================
   Camellia Portal
   app.js
========================================= */

document.addEventListener("DOMContentLoaded", async () => {


    /* =====================================
       要素取得
    ===================================== */

    const menuButton =
        document.getElementById("menuButton");

    const closeMenuButton =
        document.getElementById("closeMenuButton");

    const sideMenu =
        document.getElementById("sideMenu");

    const menuOverlay =
        document.getElementById("menuOverlay");


    const scheduleTab =
        document.getElementById("scheduleTab");

    const calendarTab =
        document.getElementById("calendarTab");


    const scheduleContent =
        document.getElementById("scheduleContent");

    const calendarContent =
        document.getElementById("calendarContent");


    const previousMonth =
        document.getElementById("previousMonth");

    const nextMonth =
        document.getElementById("nextMonth");

    const calendarMonth =
        document.getElementById("calendarMonth");

    const calendarGrid =
        document.getElementById("calendarGrid");


    const eventModal =
        document.getElementById("eventModal");

    const closeEventModal =
        document.getElementById("closeEventModal");

    const eventDetail =
        document.getElementById("eventDetail");


    const menuItems =
        document.querySelectorAll(".menu-item");

    const views =
        document.querySelectorAll(".view");

const showAllEventsButton =
    document.getElementById("showAllEventsButton");
    /* =====================================
       Cloudflare API
    ===================================== */

    const API_BASE = "https://camellia-portal.tomoya19980427goku.workers.dev/api/events";

    let events = [];


    /* =====================================
       D1から催事一覧を取得
    ===================================== */

    async function loadEvents() {

        try {

            const response =
                await fetch(API_BASE);


            if (!response.ok) {

                throw new Error(
                    `API error: ${response.status}`
                );

            }


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.error ||
                    "催事データを取得できませんでした。"
                );

            }


            events =
                Array.isArray(data.events)

                    ? data.events.map(event => ({

                        id:
                            event.id,

                        title:
                            event.title || "",

                        date:
                            event.event_date || "",

                        startTime:
                            event.start_time || "",

                        endTime:
                            event.end_time || "",

                        zoomUrl:
                            event.zoom_url || "",

                        image:
                            event.image_url || "",
                        eventColor:
    event.event_color || "#d95b82",

                        description:
                            event.description || ""

                    }))

                    : [];


        } catch (error) {


            console.error(
                "催事データ取得エラー:",
                error
            );


            events = [];

        }

    }


    /* =====================================
       カレンダー現在表示月
    ===================================== */

    let calendarDate =
        new Date();


    calendarDate.setDate(1);


    /* =====================================
       メニューを開く
    ===================================== */

    function openMenu() {

        sideMenu.classList.add("show");

        menuOverlay.classList.add("show");


        sideMenu.setAttribute(
            "aria-hidden",
            "false"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================
       メニューを閉じる
    ===================================== */

    function closeMenu() {

        sideMenu.classList.remove("show");

        menuOverlay.classList.remove("show");


        sideMenu.setAttribute(
            "aria-hidden",
            "true"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        document.body.style.overflow =
            "";

    }


    menuButton.addEventListener(
        "click",
        openMenu
    );


    closeMenuButton.addEventListener(
        "click",
        closeMenu
    );


    menuOverlay.addEventListener(
        "click",
        closeMenu
    );


    /* =====================================
       Escapeキーでメニューを閉じる
    ===================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeMenu();

                closeModal();

            }

        }
    );


    /* =====================================
       メニューからページ切り替え
    ===================================== */

    menuItems.forEach(
        (item) => {

            item.addEventListener(
                "click",
                () => {

                    const menu =
                        item.dataset.menu;


                    closeMenu();


                    switchView(menu);

                }
            );

        }
    );


    /* =====================================
       ページ切り替え
    ===================================== */

    function switchView(
        viewName
    ) {

        views.forEach(
            (view) => {

                view.classList.remove(
                    "active-view"
                );

            }
        );


        if (
            viewName === "home" ||
            viewName === "schedule"
        ) {

            document
                .getElementById("homeView")
                .classList.add(
                    "active-view"
                );


            showSchedule();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }


        if (
            viewName === "calendar"
        ) {

            document
                .getElementById("homeView")
                .classList.add(
                    "active-view"
                );


            showCalendar();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }


        if (
            viewName === "iphone"
        ) {

            document
                .getElementById("iphoneView")
                .classList.add(
                    "active-view"
                );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }


        if (
            viewName === "ipad"
        ) {

            document
                .getElementById("ipadView")
                .classList.add(
                    "active-view"
                );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }


        if (
            viewName === "android"
        ) {

            document
                .getElementById("androidView")
                .classList.add(
                    "active-view"
                );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }

    }


    /* =====================================
       予定表表示
    ===================================== */

    function showSchedule() {

        scheduleTab.classList.add(
            "active"
        );

        calendarTab.classList.remove(
            "active"
        );


        scheduleContent.style.display =
    window.innerWidth >= 901
        ? "grid"
        : "block";

        calendarContent.style.display =
            "none";


        renderSchedule();

    }


    /* =====================================
       カレンダー表示
    ===================================== */

    function showCalendar() {

        scheduleTab.classList.remove(
            "active"
        );

        calendarTab.classList.add(
            "active"
        );


        scheduleContent.style.display =
            "none";

        calendarContent.style.display =
            "block";


        renderCalendar();

    }


    scheduleTab.addEventListener(
        "click",
        showSchedule
    );


    calendarTab.addEventListener(
        "click",
        showCalendar
    );


    /* =====================================
       日付フォーマット
    ===================================== */

    function formatDate(
        dateString
    ) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return dateString;

        }


        const year =
            date.getFullYear();


        const month =
            date.getMonth() + 1;


        const day =
            date.getDate();


        const weekdays = [

            "日",

            "月",

            "火",

            "水",

            "木",

            "金",

            "土"

        ];


        const weekday =
            weekdays[
                date.getDay()
            ];


        return `${year}年${month}月${day}日（${weekday}）`;

    }


    /* =====================================
       イベントカード
    ===================================== */

    function createEventCard(
    event,
    showImage = true
) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "event-card";


        card.dataset.eventId =
            event.id;


        /* =====================================
           画像
        ===================================== */

        if (event.image && showImage) {

    const image =
        document.createElement("img");

    image.className =
        "event-thumbnail";

    image.src =
        event.image;

    image.alt =
        event.title ||
        "催事画像";

    image.loading =
        "lazy";

    image.addEventListener(
        "error",
        () => {

            image.remove();

        }
    );

    card.appendChild(
        image
    );

}


        /* =====================================
           日付
        ===================================== */

        const date =
            document.createElement(
                "div"
            );


        date.className =
            "event-date";


        date.textContent =
            formatDate(
                event.date
            );


        /* =====================================
           時間
        ===================================== */

        const time =
            document.createElement(
                "div"
            );


        time.className =
            "event-time";


        if (
            event.startTime &&
            event.endTime
        ) {

            time.textContent =
                `${event.startTime} ～ ${event.endTime}`;

        }

        else if (
            event.startTime
        ) {

            time.textContent =
                event.startTime;

        }


        /* =====================================
           タイトル
        ===================================== */

        const title =
            document.createElement(
                "div"
            );


        title.className =
            "event-title";


        title.textContent =
            event.title ||
            "催事";


        
card.appendChild(
            title
        );

        card.appendChild(
            date
        );


        card.appendChild(
            time
        );


        
/* =====================================
           説明
        ===================================== */

        if (
            event.description
        ) {

            const description =
                document.createElement(
                    "div"
                );


            description.className =
                "event-description";


            description.textContent =
                event.description;


            card.appendChild(
                description
            );

        }

        /* =====================================
           Zoom参加ボタン
        ===================================== */

        if (
            event.zoomUrl
        ) {

            const zoomButton =
                document.createElement(
                    "a"
                );


            zoomButton.className =
                "zoom-btn";


            zoomButton.href =
                event.zoomUrl;


            zoomButton.target =
                "_blank";


            zoomButton.rel =
                "noopener noreferrer";


            zoomButton.textContent =
                "Zoomに参加する";


            zoomButton.addEventListener(
                "click",
                (clickEvent) => {

                    clickEvent.stopPropagation();

                }
            );


            card.appendChild(
                zoomButton
            );

        }


        /* =====================================
           カードクリック
        ===================================== */

        card.addEventListener(
            "click",
            () => {

                openEventModal(
                    event
                );

            }
        );


        return card;

    }


    /* =====================================
       予定表を描画
    ===================================== */

    function renderSchedule() {

        const todayEvents =
            document.getElementById(
                "todayEvents"
            );


        const nextEvent =
            document.getElementById(
                "nextEvent"
            );


        const allEvents =
            document.getElementById(
                "allEvents"
            );


        todayEvents.innerHTML =
            "";


        nextEvent.innerHTML =
            "";


        allEvents.innerHTML =
            "";


        if (
            !events.length
        ) {

            todayEvents.textContent =
                "現在、登録されている予定はありません。";


            nextEvent.textContent =
                "次回の予定はありません。";


            allEvents.textContent =
                "今後の予定はありません。";


            return;

        }


        const today =
            new Date();


        const todayString =

            today.getFullYear() +

            "-" +

            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            ) +

            "-" +

            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        const sortedEvents =
            [...events].sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            `${a.date}T${a.startTime}`
                        );


                    const dateB =
                        new Date(
                            `${b.date}T${b.startTime}`
                        );


                    return dateA - dateB;

                }
            );


        const todayList =
            sortedEvents.filter(
                event =>
                    event.date ===
                    todayString
            );


        if (
            todayList.length
        ) {

            todayList.forEach(
                event => {

                    todayEvents.appendChild(
                        createEventCard(
                            event
                        )
                    );

                }
            );

        }

        else {

            todayEvents.textContent =
                "本日の予定はありません。";

        }


        const now =
            new Date();


        const upcoming =
            sortedEvents.filter(
                event => {

                    const eventDate =
                        new Date(
                            `${event.date}T${event.startTime}`
                        );


                    return (
                        eventDate >
                        now
                    );

                }
            );


        if (
            upcoming.length
        ) {

            nextEvent.appendChild(
                createEventCard(
                    upcoming[0]
                )
            );

        }

        else {

            nextEvent.textContent =
                "次回の予定はありません。";

        }


        const eventsToShow =
    window.innerWidth >= 901
        ? sortedEvents.slice(0, 3)
        : sortedEvents;


eventsToShow.forEach(
    event => {

        allEvents.appendChild(
            createEventCard(
                event,
                false
            )
        );

    }
);


if (window.innerWidth >= 901) {

    showAllEventsButton.style.display =
        sortedEvents.length > 3
            ? "block"
            : "none";

    showAllEventsButton.onclick = () => {

        window.location.href =
            "all-events.html";

    };

} else {

    showAllEventsButton.style.display =
        "none";

}
    }


    /* =====================================
       カレンダー描画
    ===================================== */

    function renderCalendar() {

        const year =
            calendarDate.getFullYear();


        const month =
            calendarDate.getMonth();


        calendarMonth.textContent =
            `${year}年${month + 1}月`;


        calendarGrid.innerHTML =
            "";


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const lastDay =
            new Date(
                year,
                month + 1,
                0
            );


        let firstWeekday =
            firstDay.getDay();


        /*
         * 月曜日始まりにする
         *
         * 日曜日 = 0
         * 月曜日 = 1
         */

        firstWeekday =
            firstWeekday === 0
                ? 6
                : firstWeekday - 1;


        for (
            let i = 0;
            i < firstWeekday;
            i++
        ) {

            const empty =
                document.createElement(
                    "div"
                );


            empty.className =
                "calendar-day calendar-empty";


            calendarGrid.appendChild(
                empty
            );

        }


        for (
            let day = 1;
            day <= lastDay.getDate();
            day++
        ) {

            const cell =
    document.createElement(
        "div"
    );

const dayOfWeek =
    new Date(
        year,
        month,
        day
    ).getDay();

if (dayOfWeek === 6) {
    cell.className =
        "calendar-day calendar-saturday";
}
else if (dayOfWeek === 0) {
    cell.className =
        "calendar-day calendar-sunday";
}
else {
    cell.className =
        "calendar-day";
}


            const dayNumber =
                document.createElement(
                    "div"
                );


            dayNumber.className =
                "calendar-day-number";


            dayNumber.textContent =
                day;


            cell.appendChild(
                dayNumber
            );


            const dateString =
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


            const dayEvents =
                events.filter(
                    event =>
                        event.date ===
                        dateString
                );


            dayEvents.forEach(
                event => {

                    const eventElement =
                        document.createElement(
                            "div"
                        );


                    eventElement.className =
                        "calendar-event";
                    
eventElement.style.backgroundColor =
    event.eventColor || "#d95b82";
                        
                    eventElement.textContent =
                        event.title;


                    eventElement.addEventListener(
                        "click",
                        (clickEvent) => {

                            clickEvent.stopPropagation();


                            openEventModal(
                                event
                            );

                        }
                    );


                    cell.appendChild(
                        eventElement
                    );

                }
            );


            calendarGrid.appendChild(
                cell
            );

        }

    }


    /* =====================================
       月移動
    ===================================== */

    previousMonth.addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );


            renderCalendar();

        }
    );


    nextMonth.addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );


            renderCalendar();

        }
    );


    /* =====================================
       詳細モーダル
    ===================================== */

    function openEventModal(
        event
    ) {

        eventDetail.innerHTML =
            "";


        const title =
            document.createElement(
                "h2"
            );


        title.textContent =
            event.title;


        const date =
            document.createElement(
                "p"
            );


        date.textContent =
            formatDate(
                event.date
            );


        const time =
            document.createElement(
                "p"
            );


        time.textContent =
            `${event.startTime} ～ ${event.endTime}`;


        eventDetail.appendChild(
            title
        );


        eventDetail.appendChild(
            date
        );


        eventDetail.appendChild(
            time
        );


        if (
            event.image
        ) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                event.image;


            image.alt =
                event.title;


            image.style.width =
                "100%";


            image.style.borderRadius =
                "12px";


            image.style.marginTop =
                "15px";


            eventDetail.appendChild(
                image
            );

        }


        if (
            event.description
        ) {

            const description =
                document.createElement(
                    "p"
                );


            description.textContent =
                event.description;


            description.style.marginTop =
                "15px";


            eventDetail.appendChild(
                description
            );

        }


        if (
            event.zoomUrl
        ) {

            const zoomButton =
                document.createElement(
                    "a"
                );


            zoomButton.className =
                "zoom-btn";


            zoomButton.href =
                event.zoomUrl;


            zoomButton.target =
                "_blank";


            zoomButton.rel =
                "noopener noreferrer";


            zoomButton.textContent =
                "Zoomに参加する";


            eventDetail.appendChild(
                zoomButton
            );

        }


        eventModal.classList.add(
            "show"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================
       モーダルを閉じる
    ===================================== */

    function closeModal() {

        eventModal.classList.remove(
            "show"
        );


        document.body.style.overflow =
            "";

    }


    closeEventModal.addEventListener(
        "click",
        closeModal
    );


    eventModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                eventModal
            ) {

                closeModal();

            }

        }
    );


      /* =====================================
       初期表示
    ===================================== */

    await loadEvents();

    renderSchedule();

    renderCalendar();


    /* =====================================
       自動更新
       30秒ごとにD1から最新データを取得
    ===================================== */

    setInterval(
        async () => {

            await loadEvents();

            renderSchedule();

            renderCalendar();

        },
        30000
    );

});