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

export function camelToUpper(camelCaseString: string) {
    // Use regex to match camel case pattern
    const regex = /([a-z])([A-Z])/gu;
    // Replace each lowercase letter followed by an uppercase letter with the lowercase letter + '_' + the uppercase letter
    const upperCaseString = camelCaseString.replace(regex, "$1_$2");
    // Convert the resulting string to upper case
    return upperCaseString.toUpperCase();
}
