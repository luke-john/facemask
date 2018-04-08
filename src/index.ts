import * as facepaint from "facepaint";

// vendored from styled-components
export interface Styles {
  [ruleOrSelector: string]: string | number | Styles;
}

// typescript and webpack handle importing differently
// this makes sure the imported value is usable by code compiled by both
// tslint:disable-next-line:no-any
if ((facepaint as any).default) {
  // tslint:disable-next-line:no-any
  (facepaint as any) = (facepaint as any).default;
}

// prettier-ignore
export type ResponsiveTokens<Tokens> = {
  [TokenKey in keyof Tokens]: Tokens[TokenKey] extends Array<string | number>
    // tslint:disable-next-line no-unused-expression
    ? string
    : ResponsiveTokens<Tokens[TokenKey]>;
}

export interface ScaleProperties<Tokens> {
  (
    applyResponsiveStyles: (
      tokens: ResponsiveTokens<Tokens>,
      helpers: { shorthand: Shorthand }
    ) => Styles
  ): Styles;
}

export interface InputTokens {
  [key: string]: InputTokens | string[] | number[];
}

export type ScaleCssShorthand =
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];

/** helper to create css shorthand properties from the responsive scale tokens */
export type Shorthand = (value: ScaleCssShorthand) => string;

export const responsiveStyles = <Tokens extends InputTokens>(options: {
  mediaQueries: [string, string];
  tokens: Tokens;
}): ScaleProperties<Tokens> => {
  const responsiveTokens = options.tokens as ResponsiveTokens<Tokens>;

  const mq = facepaint(options.mediaQueries);

  const shorthand: Shorthand = (values): string => {
    const mqProperties: string[] = ["", "", ""];

    for (const value of values) {
      mqProperties[0] = mqProperties[0] + " " + value[0];
      mqProperties[1] = mqProperties[1] + " " + value[1];
      mqProperties[2] = mqProperties[2] + " " + value[2];
    }

    // we are lying about types here as we want it to work well with the styled-components typings
    // and facepaint will do the conversion of this below
    // tslint:disable-next-line:no-any
    return (mqProperties as any) as string;
  };

  const scaleProperties = (
    scaledProperties: (
      tokens: ResponsiveTokens<Tokens>,
      helpers: { shorthand: Shorthand }
    ) => Styles
  ): Styles => {
    const stylesWithTokensApplied = mq(
      scaledProperties(responsiveTokens, { shorthand })
    );

    return stylesWithTokensApplied;
  };

  return scaleProperties;
};

export default responsiveStyles;
