/* =========================================
   Camellia Portal 管理画面
   manager.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       要素取得
    ===================================== */

    const eventList =
        document.getElementById("eventList");

    const eventForm =
        document.getElementById("eventForm");

    const eventFormSection =
        document.getElementById("eventFormSection");

    const formTitle =
        document.getElementById("formTitle");

    const newEventButton =
        document.getElementById("newEventButton");

    const cancelButton =
        document.getElementById("cancelButton");

    const eventTitle =
        document.getElementById("eventTitle");

    const eventDate =
        document.getElementById("eventDate");

    const startTime =
        document.getElementById("startTime");

    const endTime =
        document.getElementById("endTime");

    const zoomUrl =
        document.getElementById("zoomUrl");

    const eventImage =
        document.getElementById("eventImage");

    const imagePreview =
        document.getElementById("imagePreview");
const removeImageButton =
    document.getElementById("removeImageButton");
    const eventDescription =
        document.getElementById("eventDescription");

    const deleteModal =
        document.getElementById("deleteModal");

    const deleteMessage =
        document.getElementById("deleteMessage");

    const cancelDeleteButton =
        document.getElementById("cancelDeleteButton");

    const confirmDeleteButton =
        document.getElementById("confirmDeleteButton");

    const managerMessage =
        document.getElementById("managerMessage");


    /* =====================================
       D1 / API
    ===================================== */

    const API_BASE = "https://camellia-portal.tomoya19980427goku.workers.dev/api/events";

    let events = [];

    let editingEventId = null;

    let deletingEventId = null;

    let selectedImageData = "";


    /* =====================================
       API通信
    ===================================== */

    async function apiRequest(url, options = {}) {

        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        let data = null;

        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        if (!response.ok || !data || data.success === false) {

            throw new Error(
                data?.error ||
                `通信エラーが発生しました。（${response.status}）`
            );
        }

        return data;
    }


    /* =====================================
       D1から催事一覧を取得
    ===================================== */

    async function loadEvents() {

        try {

            const data = await apiRequest(
                API_BASE,
                {
                    method: "GET"
                }
            );

            events = Array.isArray(data.events)
                ? data.events.map(event => ({
                    id: event.id,
                    title: event.title || "",
                    date: event.event_date || "",
                    startTime: event.start_time || "",
                    endTime: event.end_time || "",
                    zoomUrl: event.zoom_url || "",
                    image: event.image_url || "",
                    description: event.description || ""
                }))
                : [];

            renderEventList();

        } catch (error) {

            console.error(
                "催事一覧取得エラー:",
                error
            );

            events = [];

            renderEventList();

            showMessage(
                `催事データを取得できませんでした。${error.message}`,
                true
            );
        }
    }


    /* =====================================
       日付表示
    ===================================== */

    function formatDate(dateString) {

        if (!dateString) {

            return "";

        }


        const date =
            new Date(`${dateString}T00:00:00`);


        if (Number.isNaN(date.getTime())) {

            return dateString;

        }


        const weekdays = [
            "日",
            "月",
            "火",
            "水",
            "木",
            "金",
            "土"
        ];


        return (
            `${date.getFullYear()}年` +
            `${date.getMonth() + 1}月` +
            `${date.getDate()}日` +
            `（${weekdays[date.getDay()]}）`
        );

    }


    /* =====================================
       一覧表示
    ===================================== */

    function renderEventList() {

        eventList.innerHTML = "";


        if (!events.length) {

            const empty =
                document.createElement("div");

            empty.className =
                "empty-event-list";

            empty.textContent =
                "登録されている催事はありません。";

            eventList.appendChild(empty);

            return;

        }


        const sortedEvents =
            [...events].sort((a, b) => {

                const dateA =
                    new Date(
                        `${a.date}T${a.startTime || "00:00"}`
                    );

                const dateB =
                    new Date(
                        `${b.date}T${b.startTime || "00:00"}`
                    );

                return dateA - dateB;

            });


        sortedEvents.forEach((event) => {

            const card =
                createManagerEventCard(event);

            eventList.appendChild(card);

        });

    }


    /* =====================================
       管理画面用催事カード
    ===================================== */

    function createManagerEventCard(event) {

        const card =
            document.createElement("article");

        card.className =
            "event-manager-card";


        const main =
            document.createElement("div");

        main.className =
            "event-manager-main";


        const title =
            document.createElement("h3");

        title.className =
            "event-manager-title";

        title.textContent =
            event.title || "無題の催事";


        const date =
            document.createElement("div");

        date.className =
            "event-manager-date";

        date.textContent =
            formatDate(event.date);


        const time =
            document.createElement("div");

        time.className =
            "event-manager-time";


        if (event.startTime && event.endTime) {

            time.textContent =
                `${event.startTime} ～ ${event.endTime}`;

        } else if (event.startTime) {

            time.textContent =
                event.startTime;

        }


        main.appendChild(title);
        main.appendChild(date);
        main.appendChild(time);


        if (event.description) {

            const description =
                document.createElement("div");

            description.className =
                "event-manager-description";

            description.textContent =
                event.description;

            main.appendChild(description);

        }


        if (event.image) {

            const image =
                document.createElement("img");

            image.className =
                "event-manager-image";

            image.src =
                event.image;

            image.alt =
                event.title || "催事画像";

            main.appendChild(image);

        }


        const actions =
            document.createElement("div");

        actions.className =
            "event-manager-actions";


        /* 編集 */

        const editButton =
            document.createElement("button");

        editButton.type =
            "button";

        editButton.className =
            "action-button";

        editButton.textContent =
            "✏️ 編集";


        editButton.addEventListener(
            "click",
            () => {

                editEvent(event.id);

            }
        );


        /* 複製 */

        const duplicateButton =
            document.createElement("button");

        duplicateButton.type =
            "button";

        duplicateButton.className =
            "action-button";

        duplicateButton.textContent =
            "📄 複製";


        duplicateButton.addEventListener(
            "click",
            () => {

                duplicateEvent(event.id);

            }
        );


        /* 削除 */

        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "action-button delete";

        deleteButton.textContent =
            "🗑 削除";


        deleteButton.addEventListener(
            "click",
            () => {

                openDeleteModal(event);

            }
        );


        actions.appendChild(editButton);
        actions.appendChild(duplicateButton);
        actions.appendChild(deleteButton);


        card.appendChild(main);
        card.appendChild(actions);


        return card;

    }


    /* =====================================
       新規登録
    ===================================== */

    function startNewEvent() {

        editingEventId = null;

        selectedImageData = "";


        formTitle.textContent =
            "新しい催事を登録";


        eventForm.reset();


        resetImagePreview();


        eventFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        setTimeout(() => {

            eventTitle.focus();

        }, 300);

    }


    newEventButton.addEventListener(
        "click",
        startNewEvent
    );


    /* =====================================
       編集
    ===================================== */

    function editEvent(id) {

        const event =
            events.find(
                item => item.id === id
            );


        if (!event) {

            showMessage(
                "催事が見つかりません。",
                true
            );

            return;

        }


        editingEventId =
            event.id;


        selectedImageData =
            event.image || "";


        formTitle.textContent =
            "催事を編集";


        eventTitle.value =
            event.title || "";


        eventDate.value =
            event.date || "";


        startTime.value =
            event.startTime || "";


        endTime.value =
            event.endTime || "";


        zoomUrl.value =
            event.zoomUrl || "";


        eventDescription.value =
            event.description || "";


        if (event.image) {

            showImagePreview(
                event.image
            );

        } else {

            resetImagePreview();

        }


        eventFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        setTimeout(() => {

            eventTitle.focus();

        }, 300);

    }


    async function duplicateEvent(id) {

    const original =
        events.find(
            item => item.id === id
        );

    if (!original) {
        showMessage(
            "複製対象が見つかりません。",
            true
        );
        return;
    }

    try {

        await apiRequest(
            API_BASE,
            {
                method: "POST",

                body: JSON.stringify({
                    title:
                        `${original.title}（複製）`,

                    event_date:
                        original.date,

                    start_time:
                        original.startTime,

                    end_time:
                        original.endTime,

                    zoom_url:
                        original.zoomUrl,

                    image_url:
                        original.image,

                    description:
                        original.description
                })
            }
        );

        await loadEvents();

        showMessage(
            "催事を複製しました。"
        );

    } catch (error) {

        console.error(
            "催事複製エラー:",
            error
        );

        showMessage(
            `催事を複製できませんでした。${error.message}`,
            true
        );
    }
}

    /* =====================================
       削除確認
    ===================================== */

    function openDeleteModal(event) {

        deletingEventId =
            event.id;


        deleteMessage.textContent =
            `「${event.title}」を削除します。`;


        deleteModal.classList.add("show");

        deleteModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================
       削除キャンセル
    ===================================== */

    function closeDeleteModal() {

        deletingEventId =
            null;


        deleteModal.classList.remove("show");

        deleteModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    cancelDeleteButton.addEventListener(
        "click",
        closeDeleteModal
    );


    /* =====================================
       削除実行
    ===================================== */

    confirmDeleteButton.addEventListener(
    "click",
    async () => {

        if (!deletingEventId) {
            return;
        }

        const id = deletingEventId;

        try {

            confirmDeleteButton.disabled = true;

            await apiRequest(
                `${API_BASE}/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );

            closeDeleteModal();

            if (editingEventId === id) {
                startNewEvent();
            }

            await loadEvents();

            showMessage(
                "催事を削除しました。"
            );

        } catch (error) {

            console.error(
                "催事削除エラー:",
                error
            );

            showMessage(
                `催事を削除できませんでした。${error.message}`,
                true
            );

        } finally {

            confirmDeleteButton.disabled = false;
        }
    }
);

    /* =====================================
       モーダル外クリック
    ===================================== */

    deleteModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === deleteModal
            ) {

                closeDeleteModal();

            }

        }
    );


    /* =====================================
       画像選択
    ===================================== */

    eventImage.addEventListener(
        "change",
        () => {

            const file =
                eventImage.files[0];


            if (!file) {

                return;

            }


            if (
                !file.type.startsWith("image/")
            ) {

                showMessage(
                    "画像ファイルを選択してください。",
                    true
                );

                eventImage.value =
                    "";

                return;

            }


            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                showMessage(
                    "画像は5MB以下にしてください。",
                    true
                );

                eventImage.value =
                    "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                () => {

                    selectedImageData =
                        reader.result;


                    showImagePreview(
                        selectedImageData
                    );

                };


            reader.onerror =
                () => {

                    showMessage(
                        "画像を読み込めませんでした。",
                        true
                    );

                };


            reader.readAsDataURL(file);

        }
    );


    /* =====================================
       画像プレビュー
    ===================================== */

    function showImagePreview(src) {

    imagePreview.innerHTML = "";

    const image =
        document.createElement("img");

    image.src = src;

    image.alt = "催事画像プレビュー";

    imagePreview.appendChild(image);

    if (removeImageButton) {
        removeImageButton.style.display = "inline-flex";
    }
}


function resetImagePreview() {

    imagePreview.innerHTML = "";

    const text =
        document.createElement("span");

    text.textContent =
        "画像を選択するとここに表示されます";

    imagePreview.appendChild(text);

    if (removeImageButton) {
        removeImageButton.style.display = "none";
    }
}
if (removeImageButton) {

    removeImageButton.addEventListener(
        "click",
        () => {

            selectedImageData = "";

            eventImage.value = "";

            resetImagePreview();

            showMessage(
                "画像を削除しました。保存すると反映されます。"
            );

        }
    );

}

    /* =====================================
       フォーム送信
    ===================================== */

    eventForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const title =
            eventTitle.value.trim();

        const date =
            eventDate.value;

        const start =
            startTime.value;

        const end =
            endTime.value;

        const url =
            zoomUrl.value.trim();

        const description =
            eventDescription.value.trim();


        if (!title) {

            showMessage(
                "催事名を入力してください。",
                true
            );

            eventTitle.focus();

            return;
        }


        if (!date) {

            showMessage(
                "開催日を選択してください。",
                true
            );

            eventDate.focus();

            return;
        }


        if (!start) {

            showMessage(
                "開始時間を入力してください。",
                true
            );

            startTime.focus();

            return;
        }


        if (
            end &&
            end <= start
        ) {

            showMessage(
                "終了時間は開始時間より後にしてください。",
                true
            );

            endTime.focus();

            return;
        }


        if (url) {

            try {

                const parsedUrl =
                    new URL(url);

                if (
                    parsedUrl.protocol !==
                    "https:"
                ) {
                    throw new Error();
                }

            } catch {

                showMessage(
                    "Zoom URLはhttps://から始まる正しいURLを入力してください。",
                    true
                );

                zoomUrl.focus();

                return;
            }
        }


        const submitButton =
            eventForm.querySelector(
                'button[type="submit"]'
            );


        const payload = {

            title: title,

            event_date: date,

            start_time: start,

            end_time: end,

            zoom_url: url,

            image_url:
                selectedImageData || "",

            description: description
        };


        try {

            submitButton.disabled = true;


            if (!editingEventId) {

                await apiRequest(
                    API_BASE,
                    {
                        method: "POST",

                        body:
                            JSON.stringify(payload)
                    }
                );

                showMessage(
                    "催事を登録しました。"
                );

            } else {

                await apiRequest(
                    `${API_BASE}/${encodeURIComponent(editingEventId)}`,
                    {
                        method: "PUT",

                        body:
                            JSON.stringify(payload)
                    }
                );

                showMessage(
                    "催事を更新しました。"
                );
            }


            await loadEvents();

            startNewEvent();


        } catch (error) {

            console.error(
                "催事保存エラー:",
                error
            );

            showMessage(
                `催事を保存できませんでした。${error.message}`,
                true
            );

        } finally {

            submitButton.disabled = false;
        }
    }
);

    /* =====================================
       キャンセル
    ===================================== */

    cancelButton.addEventListener(
        "click",
        () => {

            startNewEvent();

        }
    );


    /* =====================================
       メッセージ表示
    ===================================== */

    function showMessage(
        message,
        isError = false
    ) {

        managerMessage.textContent =
            message;


        managerMessage.style.background =
            isError
                ? "#c62828"
                : "#247447";


        managerMessage.classList.add(
            "show"
        );


        setTimeout(
            () => {

                managerMessage.classList.remove(
                    "show"
                );

            },
            2800
        );

    }


    /* =====================================
       初期化
    ===================================== */

    loadEvents();
resetImagePreview();

});