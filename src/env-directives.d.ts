// Type for the custom client:interact directive (see src/directives/interact.js).
import 'astro';
declare module 'astro' {
  interface AstroClientDirectives {
    'client:interact'?: boolean;
  }
}
