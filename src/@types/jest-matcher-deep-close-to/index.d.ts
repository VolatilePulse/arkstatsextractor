declare namespace jest {
    interface Matchers<R> {
        toBeDeepCloseTo: (expected: number | number[] | Record<string, unknown>, decimals?: number) => R;
        toMatchCloseTo: (expected: number | number[] | Record<string, unknown>, decimals?: number) => R;
    }
}

declare module 'jest-matcher-deep-close-to' {
    export function toBeDeepCloseTo(
        received: number | number[] | Record<string, unknown>,
        expected: number | number[] | Record<string, unknown>,
        decimals?: number,
    ): {
        message(): string;
        pass: boolean;
    };

    export function toMatchCloseTo(
        received: number | number[] | Record<string, unknown>,
        expected: number | number[] | Record<string, unknown>,
        decimals?: number,
    ): {
        message(): string;
        pass: boolean;
    };
}
