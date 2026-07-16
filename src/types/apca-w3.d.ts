declare module 'apca-w3' {
  export function calcAPCA(
    textColor: string | number[],
    bgColor: string | number[],
    places?: number,
    round?: boolean
  ): number | string;

  export function sRGBtoY(rgb: number[]): number;

  export function APCAcontrast(
    txtY: number,
    bgY: number,
    places?: number
  ): number;
}
