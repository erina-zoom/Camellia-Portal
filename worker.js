export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        /*
         * =====================================
         * API
         * =====================================
         */

        if (url.pathname === "/api/health") {

            return new Response(
                JSON.stringify({
                    success: true,
                    service: "Camellia Portal",
                    status: "ok"
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                }
            );

        }


        /*
         * =====================================
         * その他のアクセス
         *
         * index.html / manager.htmlなどは
         * Cloudflare Assetsから配信
         * =====================================
         */

        return env.ASSETS.fetch(request);

    }
};