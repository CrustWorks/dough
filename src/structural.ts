/**
 * Calculates the second moment of area (area moment of inertia) for a rectangle.
 * @param width - The width of the rectangle.
 * @param height - The height of the rectangle.
 * @returns The second moment of area for the rectangle.
 */
export function rectangleSecondMomentOfArea(width: number, height: number): number {
    return (width * Math.pow(height, 3)) / 12;
}

/**
 * Calculates the second moment of area (area moment of inertia) for a circle.
 * @param radius - The radius of the circle.
 * @returns The second moment of area for the circle.
 */
export function circleSecondMomentOfArea(radius: number): number {
    return (Math.PI * Math.pow(radius, 4)) / 4;
}

/**
 * Calculates the second moment of area (area moment of inertia) for a hollow rectangle.
 * @param outerWidth - The outer width of the hollow rectangle.
 * @param outerHeight - The outer height of the hollow rectangle.
 * @param innerWidth - The inner width of the hollow rectangle.
 * @param innerHeight - The inner height of the hollow rectangle.
 * @returns The second moment of area for the hollow rectangle.
 */
export function hollowRectangleSecondMomentOfArea(outerWidth: number, outerHeight: number, innerWidth: number, innerHeight: number): number {
    const outerMoment = rectangleSecondMomentOfArea(outerWidth, outerHeight);
    const innerMoment = rectangleSecondMomentOfArea(innerWidth, innerHeight);
    return outerMoment - innerMoment;
}

/**
 * Calculates the second moment of area (area moment of inertia) for a hollow circle.
 * @param outerRadius - The outer radius of the hollow circle.
 * @param innerRadius - The inner radius of the hollow circle.
 * @returns The second moment of area for the hollow circle.
 */
export function hollowCircleSecondMomentOfArea(outerRadius: number, innerRadius: number): number {
    const outerMoment = circleSecondMomentOfArea(outerRadius);
    const innerMoment = circleSecondMomentOfArea(innerRadius);
    return outerMoment - innerMoment;
}
