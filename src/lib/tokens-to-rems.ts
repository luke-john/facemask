import * as rem from "polished/lib/helpers/rem";

export interface PxTokens {
  [scale: string]: {
    [key: string]: number[];
  };
}

export interface RemTokens {
  [scale: string]: {
    [key: string]: string[];
  };
}

export const tokensToRems = <UsedTokens extends PxTokens>(
  tokens: UsedTokens,
  customFontSizes?: number[]
): UsedTokens => {
  const convertTokenSet = (tokenSet: { [key: string]: number[] }) => {
    const convertedTokenSet = {};
    const keys = Object.keys(tokenSet) as Array<keyof typeof tokenSet>;

    keys.forEach(tokenKey => {
      convertedTokenSet[tokenKey] = tokenSet[tokenKey].map(
        (tokenValue, index) => {
          const baseFontSize = customFontSizes ? customFontSizes[index] : 16;

          return rem(tokenValue, baseFontSize);
        }
      );
    });

    return convertedTokenSet;
  };

  const remTokens: RemTokens = {};

  Object.keys(tokens).forEach(scaleKey => {
    remTokens[scaleKey] = convertTokenSet(tokens[scaleKey]);
  });

  // The two typings are both acceptable by styled-components,
  // we use UsedTokens for better type hinting/developer experience
  // tslint:disable-next-line:no-any
  return (remTokens as any) as UsedTokens;
};
