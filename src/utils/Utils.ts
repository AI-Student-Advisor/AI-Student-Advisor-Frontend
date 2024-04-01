// eslint-disable-next-line
export function safeEvaluate<F extends (...args: any[]) => any>(
    f: F | undefined,
    args: Parameters<F>
): ReturnType<F> | undefined {
    return f ? f(...args) : undefined;
}

export function toQueryString(
    // eslint-disable-next-line
    object: Record<string, any>,
    questionMark: boolean
) {
    const queryString = Object.keys(object)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
        )
        .join("&");

    if (questionMark) {
        return `?${queryString}`;
    }
    return queryString;
}

export function asyncSleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
