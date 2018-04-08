import { tokensToRems } from "./tokens-to-rems";

const exampleTokens = {
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

it("converts pixels to rems", () => {
  expect(tokensToRems(exampleTokens)).toMatchSnapshot();
});

it("converts pixels to rems with custom base font sizes", () => {
  expect(tokensToRems(exampleTokens, [10, 15, 20])).toMatchSnapshot();
});
