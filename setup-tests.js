const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

require("jest-styled-components");
require("jest-enzyme/lib");

Enzyme.configure({ adapter: new Adapter() });
