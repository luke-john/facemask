Design System based responsive styling for css-in-js.

**This component is currently under development and is not yet released...**

It currently is highly opinionated about three steps on the scale.

## The problem

You have a stepped scale for sizing and the steps don't increase by common ratios, so can't really on rems and changing the base font size. Alternatively you may use different ratio changes between sizing and spacing at different viewports.

ie.

|       key | viewport one | viewport two | viewport three |
| --------: | :----------: | :----------: | :------------: |
|   moon-xs |      4       |      6       |       10       |
| saturn-lg |      32      |      53      |       83       |
|    sun-xl |      66      |     106      |      168       |

## The solution

This tool allows you to configure it with your various scales, viewports and basefont sizes, and provides a handy interface for writing your css without having to rewrite media queries across your components.

This is based on [facepaint](https://github.com/emotion-js/facepaint) and uses facepaint under the hood.

## api

**IMPORTANT** the default api does not perform any pixel to rem conversions, this package includes a [tokens-to-rems](#tokens-to-rems) tools to assist with this.

```code
export type Tokens = {
  [scale: string]: {
      [key: string]: [number, number, number]
  }
}

/** helper to create css shorthand properties from the responsive scale tokens */
export type Shorthand = (value: ScaleCssShorthand) => string;

interface ResponsiveStyles {
  (
    options: {
      mediaQueries: string[];
      tokens: Tokens;
    },
  ): (scaledProperties: (
    // the tokens values are typed as being a single string make use
    // with styled-components easier
    tokens: ResponsiveTokens<Tokens>,
    helpers: { shorthand: Shorthand }
  ): Styles;
}
```

For more details on how to use the [scaledProperties](#scaledProperties-usage) function see the section below.

### example usage

```code
import { responsiveStyles } from 'facemask';
import styled from 'styled-components';

const scaleProperties = responsiveStyles({
  mediaQueries: ['@media(min-width: 731px)', '@media(min-width: 1695px)'],
  tokens: {
    spacing: {
      // in practice these should be rem values based off the base font size
      moon: [4, 6, 10],
      mars: [8, 13, 20],
      earth: [16, 26, 41],
      saturn: [32, 52, 82],
      sun: [66, 106, 180],
    },
  },
});

const StyledSpan = css`
  ${scaleProperties((scale, { shorthand }) => ({
    padding: shorthand([scale.spacing.moon, scale.spacing.earth]),
    margin: scale.spacing.earth,
    '& div': {
      padding: scale.spacing.saturn,
      margin: scale.spacing.sun,
    },
  }))};
`;
```

generates

```code
padding:  4 16;
margin: 16;
@media(min-width: 731px) {
  padding:  6 26;
  margin: 26;
}
@media(min-width: 1695px) {
  padding:  10 41;
  margin: 41;
}
& div {
  padding: 32;
  margin: 66;
  @media(min-width: 731px) {
    padding: 52;
    margin: 106;
  }
  @media(min-width: 1695px) {
    padding: 82;
    margin: 180;
  }
}
```

## scaledProperties usage

The function returned by the responsiveStyles method takes a function which recieves as it's arguments the converted tokens and a helper object that can be used to create a responsive style object.

```code
export const StyledSpan = styled.span`
  ${scaleProperties((tokens, helpers) => ({
    padding: tokens.spacing.earth,
    margin: helpers.shorthand([tokens.spacing.earth, tokens.spacing.mars])
  }))}
`;
```

### tokens

Tokens is the object that was passed to the `responsiveStyles` function.

When used as css property values the scaleProperties method will create scoped media queries based on the viewports and token values.

ie.

```code
export const StyledSpan = styled.span`
  ${scaleProperties(({spacing}) => ({
    padding: spacing.earth,
  }))}
`;
```

will produce

```code
padding: 1rem;
@media(min-width: 731px) {
  padding: 1.3rem;
}
@media(min-width: 1695px) {
  padding: 1.5769230769230769rem;
}
```

### helpers

#### shorthand

The shorthand helper enables setting responsive shorthand css properties, it takes an array of tokens at any of the css shorthand lengths.

ie.

```code
export const StyledSpan = styled.span`
  ${scaleProperties((tokens, {shorthand}) => ({
    margin: shorthand([tokens.spacing.earth, tokens.spacing.mars])
  }))}
`;
```

will produce

```code
margin:  1rem 0.5rem;
@media(min-width: 731px) {
  margin: 1.3rem 0.65rem;
}
@media(min-width: 1695px) {
  margin: 1.5769230769230769rem 0.7692307692307693rem;
}
```

```code
export type ScaleCssShorthand =
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];

/** helper to create css shorthand properties from the responsive scale tokens */
export type Shorthand = (value: ScaleCssShorthand) => string;
```

## tools

### tokens-to-rems

This allows you to maintain your tokens in pixel values.

It takes a set of tokens and optionally a set of base font sizes and converts your token definition into rem values

#### example usage

```code
import { tokensToRems } from 'facemask/lib/tokens-to-rems';

const tokens = {
  spacing: {
    moon: [4, 6, 10],
    mars: [8, 13, 20],
    earth: [16, 26, 41],
    saturn: [32, 52, 83],
    sun: [66, 106, 168]
  },
  type: {
    snail: [13, 16, 20],
    mouse: [16, 20, 26],
    otter: [20, 26, 32],
    dolphin: [26, 32, 41],
    hippo: [32, 41, 52],
    mammoth: [41, 52, 66],
    whale: [52, 66, 83]
  }
};

console.log(tokensToRems(tokens))
```

generates

```code
{
  spacing: {
    earth: ["1.6rem", "1.7333333333333334rem", "2.05rem"],
    mars: ["0.8rem", "0.8666666666666667rem", "1rem"],
    moon: ["0.4rem", "0.4rem", "0.5rem"],
    saturn: ["3.2rem", "3.466666666666667rem", "4.15rem"],
    sun: ["6.6rem", "7.066666666666666rem", "8.4rem"]
  },
  type: {
    dolphin: ["2.6rem", "2.1333333333333333rem", "2.05rem"],
    hippo: ["3.2rem", "2.7333333333333334rem", "2.6rem"],
    mammoth: ["4.1rem", "3.466666666666667rem", "3.3rem"],
    mouse: ["1.6rem", "1.3333333333333333rem", "1.3rem"],
    otter: ["2rem", "1.7333333333333334rem", "1.6rem"],
    snail: ["1.3rem", "1.0666666666666667rem", "1rem"],
    whale: ["5.2rem", "4.4rem", "4.15rem"]
  }
}
```
