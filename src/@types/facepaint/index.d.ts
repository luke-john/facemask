declare module "facepaint" {
  // vendored from styled-components
  interface Styles {
    [ruleOrSelector: string]: string | number | Styles;
  }

  interface MqStyles {
    [ruleOrSelector: string]: string | string[] | number | number[] | Styles;
  }

  type Mq = (styles: object) => Styles;

  interface FacepaintSettings {
    literal?: boolean;
    overlap?: boolean;
  }

  type Facepaint = (
    /** media queries to be applied across */
    mediaQueries: [string, string],
    settings?: FacepaintSettings
  ) => Mq;

  const facepaint: Facepaint;

  export = facepaint;
}
