/**
 * useFetch カスタムフック
 * ===============================================
 * fetch実行とログ記録を統合したカスタムフック
 *
 * 学習ポイント:
 * - カスタムフックの作成
 * - 関数型プログラミング（純粋関数、副作用の分離）
 * - immutable state pattern
 * - 関数は20行以内、ネスト2つまで
 */

import { useCallback } from 'react';
import { HttpLog, HttpRequest, HttpResponse } from '../types/HttpLog';

type FetchOptions = {
    method: string;
    headers?: Record<string, string>;
    body?: any;
};

type UseFetchResult<T> = {
    execute: (url: string, options: FetchOptions) => Promise<T>;
};

/**
 * ユニークIDを生成する純粋関数
 */
const generateId = (): string => `${Date.now()}-${Math.random()}`;

/**
 * リクエスト情報を記録する純粋関数
 */
const createRequestLog = (url: string, options: FetchOptions): HttpRequest => ({
    method: options.method,
    url,
    headers: options.headers || {},
    body: options.body,
    timestamp: Date.now(),
});

/**
 * レスポンス情報を記録する純粋関数
 */
const createResponseLog = (status: number, statusText: string, body: any): HttpResponse => ({
    status,
    statusText,
    body,
    timestamp: Date.now(),
});

/**
 * HTTPログエントリを作成する純粋関数
 */
const createLogEntry = (id: string, request: HttpRequest): HttpLog => ({
    id,
    request,
    response: null,
    duration: null,
    expanded: false,
});

/**
 * ログエントリを更新する純粋関数（immutable）
 */
const updateLogEntry = (log: HttpLog, response: HttpResponse, duration: number): HttpLog => ({
    ...log,
    response,
    duration,
});

/**
 * fetch実行とログ記録を行うカスタムフック
 */
export const useFetch = <T = any>(onLogUpdate?: (log: HttpLog) => void): UseFetchResult<T> => {
    const execute = useCallback(async (url: string, options: FetchOptions): Promise<T> => {
        const id = generateId();
        const request = createRequestLog(url, options);
        const logEntry = createLogEntry(id, request);

        if (onLogUpdate) onLogUpdate(logEntry);

        const startTime = Date.now();
        const res = await fetch(url, {
            method: options.method,
            headers: options.headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const duration = Date.now() - startTime;
        const body = await res.json();
        const response = createResponseLog(res.status, res.statusText, body);
        const updatedLog = updateLogEntry(logEntry, response, duration);

        if (onLogUpdate) onLogUpdate(updatedLog);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        return body;
    }, [onLogUpdate]);

    return { execute };
};
