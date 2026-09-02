export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // =====================================
        // CORS
        // =====================================

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        // =====================================
        // OPTIONS
        // =====================================

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        // =====================================
        // API HEALTH
        // GET /api/health
        // =====================================

        if (url.pathname === "/api/health") {
            return jsonResponse(
                {
                    success: true,
                    service: "Camellia Portal",
                    status: "ok"
                },
                corsHeaders
            );
        }

        // =====================================
        // 催事一覧取得
        // GET /api/events
        // =====================================

        if (
            url.pathname === "/api/events" &&
            request.method === "GET"
        ) {
            try {
                const result = await env.DB.prepare(`
                    SELECT
                        id,
                        title,
                        event_date,
                        start_time,
                        end_time,
                        zoom_url,
                        image_url,
                        event_color,
                        description,
                        created_at,
                        updated_at
                    FROM events
                    ORDER BY event_date ASC, start_time ASC
                `).all();

                return jsonResponse(
                    {
                        success: true,
                        events: result.results || []
                    },
                    corsHeaders
                );

            } catch (error) {
                return jsonResponse(
                    {
                        success: false,
                        error: error.message
                    },
                    corsHeaders,
                    500
                );
            }
        }

        // =====================================
        // 催事登録
        // POST /api/events
        // =====================================

        if (
            url.pathname === "/api/events" &&
            request.method === "POST"
        ) {
            try {
                const data = await request.json();

                if (!data.title || !data.event_date) {
                    return jsonResponse(
                        {
                            success: false,
                            error: "title and event_date are required"
                        },
                        corsHeaders,
                        400
                    );
                }

                const id = crypto.randomUUID();

                await env.DB.prepare(`
                    INSERT INTO events (
                        id,
                        title,
                        event_date,
                        start_time,
                        end_time,
                        zoom_url,
                        image_url,
                        event_color,
                        description
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `)
                    .bind(
                        id,
                        data.title,
                        data.event_date,
                        data.start_time || "",
                        data.end_time || "",
                        data.zoom_url || "",
                        data.image_url || "",
                        data.event_color || "#d95b82",
                        data.description || ""
                    )
                    .run();

                return jsonResponse(
                    {
                        success: true,
                        id
                    },
                    corsHeaders,
                    201
                );

            } catch (error) {
                return jsonResponse(
                    {
                        success: false,
                        error: error.message
                    },
                    corsHeaders,
                    500
                );
            }
        }

        // =====================================
        // /api/events/:id
        // =====================================

        const eventMatch =
            url.pathname.match(/^\/api\/events\/([^/]+)$/);

        // =====================================
        // 催事取得
        // GET /api/events/:id
        // =====================================

        if (
            eventMatch &&
            request.method === "GET"
        ) {
            try {
                const id = eventMatch[1];

                const result = await env.DB.prepare(`
                    SELECT
                        id,
                        title,
                        event_date,
                        start_time,
                        end_time,
                        zoom_url,
                        image_url,
                        event_color,
                        description,
                        created_at,
                        updated_at
                    FROM events
                    WHERE id = ?
                `)
                    .bind(id)
                    .first();

                if (!result) {
                    return jsonResponse(
                        {
                            success: false,
                            error: "Event not found"
                        },
                        corsHeaders,
                        404
                    );
                }

                return jsonResponse(
                    {
                        success: true,
                        event: result
                    },
                    corsHeaders
                );

            } catch (error) {
                return jsonResponse(
                    {
                        success: false,
                        error: error.message
                    },
                    corsHeaders,
                    500
                );
            }
        }

        // =====================================
        // 催事編集
        // PUT /api/events/:id
        // =====================================

        if (
            eventMatch &&
            request.method === "PUT"
        ) {
            try {
                const id = eventMatch[1];
                const data = await request.json();

                if (!data.title || !data.event_date) {
                    return jsonResponse(
                        {
                            success: false,
                            error: "title and event_date are required"
                        },
                        corsHeaders,
                        400
                    );
                }

                const result = await env.DB.prepare(`
                    UPDATE events
                    SET
                        title = ?,
                        event_date = ?,
                        start_time = ?,
                        end_time = ?,
                        zoom_url = ?,
                        image_url = ?,
                        event_color = ?,
                        description = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `)
                    .bind(
                        data.title,
                        data.event_date,
                        data.start_time || "",
                        data.end_time || "",
                        data.zoom_url || "",
                        data.image_url || "",
                        data.event_color || "#d95b82",
                        data.description || "",
                        id
                    )
                    .run();

                if (result.meta.changes === 0) {
                    return jsonResponse(
                        {
                            success: false,
                            error: "Event not found"
                        },
                        corsHeaders,
                        404
                    );
                }

                return jsonResponse(
                    {
                        success: true,
                        id
                    },
                    corsHeaders
                );

            } catch (error) {
                return jsonResponse(
                    {
                        success: false,
                        error: error.message
                    },
                    corsHeaders,
                    500
                );
            }
        }

        // =====================================
        // 催事削除
        // DELETE /api/events/:id
        // =====================================

        if (
            eventMatch &&
            request.method === "DELETE"
        ) {
            try {
                const id = eventMatch[1];

                const result = await env.DB.prepare(`
                    DELETE FROM events
                    WHERE id = ?
                `)
                    .bind(id)
                    .run();

                if (result.meta.changes === 0) {
                    return jsonResponse(
                        {
                            success: false,
                            error: "Event not found"
                        },
                        corsHeaders,
                        404
                    );
                }

                return jsonResponse(
                    {
                        success: true,
                        id
                    },
                    corsHeaders
                );

            } catch (error) {
                return jsonResponse(
                    {
                        success: false,
                        error: error.message
                    },
                    corsHeaders,
                    500
                );
            }
        }

        // =====================================
        // 静的ファイル
        // =====================================

        return env.ASSETS.fetch(request);
    }
};


// =====================================
// JSONレスポンス
// =====================================

function jsonResponse(
    data,
    corsHeaders = {},
    status = 200
) {
    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                ...corsHeaders
            }
        }
    );
}