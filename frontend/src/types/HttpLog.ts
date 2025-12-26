/**
 * HTTPログの型定義
 * ===============================================
 * リクエスト/レスポンスのログ記録に使用する型
 *
 * 学習ポイント:
 * - TypeScript型定義によるコード品質向上
 * - immutable state patternの基礎
 */

/**
 * HTTPリクエスト情報
 */
export type HttpRequest = {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: any;
    timestamp: number;
};

/**
 * HTTPレスポンス情報
 */
export type HttpResponse = {
    status: number;
    statusText: string;
    body: any;
    timestamp: number;
};

/**
 * HTTPログエントリ（1件分）
 */
export type HttpLog = {
    id: string;
    request: HttpRequest;
    response: HttpResponse | null;
    duration: number | null;
    expanded: boolean;
};

/**
 * ステータスコードから色を取得
 */
export const getStatusColor = (status: number): 'success' | 'warning' | 'error' => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    return 'error';
};
