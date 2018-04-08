import { css } from "styled-components";
import { responsiveStyles } from ".";

const scaleProperties = responsiveStyles({
  mediaQueries: ["@media(min-width: 731px)", "@media(min-width: 1695px)"],
  tokens: {
    spacing: {
      moon: [4, 6, 10],
      mars: [8, 13, 20],
      earth: [16, 26, 41],
      saturn: [32, 52, 82],
      sun: [66, 106, 180]
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
  }
});

it("scales properties", () => {
  const scaledProperties = scaleProperties(scale => ({
    padding: scale.spacing.moon,
    "& div": {
      padding: scale.spacing.saturn
    }
  }));

  expect(
    css`
      ${scaledProperties};
    `
  ).toMatchSnapshot();
});

it("builds responsive shorthand queries", () => {
  const scaledProperties = scaleProperties((scale, { shorthand }) => ({
    padding: shorthand([scale.spacing.moon, scale.spacing.earth]),
    margin: scale.spacing.earth,
    "& div": {
      padding: scale.spacing.saturn,
      margin: shorthand([
        scale.spacing.earth,
        scale.spacing.saturn,
        scale.spacing.sun,
        scale.spacing.mars
      ])
    }
  }));

  expect(
    css`
      ${scaledProperties};
    `
  ).toMatchSnapshot();
});
