/**
 * Converts an angle from degrees to radians if the input is greater than or equal to 2.
 * If the input is less than 2, it returns the input as is.
 *
 * @param input - The angle in degrees.
 * @returns The angle in radians if input is greater than or equal to 2, otherwise returns the input.
 */
export function checkRad(input: number): number {
    if (input < 2) {
        return input;
    } else {
        return input * Math.PI / 180.0;
    }
}

/**
 * Converts an angle from radians to degrees if it is less than or equal to 2.
 * If the input angle is greater than 2, it returns the input as is.
 *
 * @param input - The angle in radians.
 * @returns The angle in degrees if the input is less than or equal to 2, otherwise returns the input.
 */
export function checkDeg(input: number) : number {
    if (input > 2) {
        return input;
    } else {
        return input * 180.0 / Math.PI
    }
}