declare module 'culori' {
  export function oklch(color: any): any;
  export function rgb(color: any): any;
  export function hsl(color: any): any;
  export function lab(color: any): any;
  export function lch(color: any): any;
  export function oklab(color: any): any;
  export function xyz65(color: any): any;
  export function formatHex(color: any): string | undefined;
  export function formatRgb(color: any): string | undefined;
  export function formatHsl(color: any): string | undefined;
  export function parse(color: string): any;
  export function formatCss(color: any): string | undefined;
  export function differenceCie76(): (c1: any, c2: any) => number;
}
