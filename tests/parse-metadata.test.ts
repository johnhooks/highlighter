import { parseMetadata } from "../src/parse-metadata/index.js";

describe("parseMetadata", () => {
  describe("code fence", () => {
    describe("with title", () => {
      const title = "hello testing";
      const metastring = `js title="${title}"`;

      it("should return an object with a title property of type string", () => {
        const metadata = parseMetadata(metastring);
        expect(typeof metadata.title).toEqual("string");
      });

      it("should return an object with the correct title property value", () => {
        const metadata = parseMetadata(metastring);
        expect(metadata.title).toEqual(title);
      });
    });

    describe("without a title property", () => {
      it("should return an object with an undefined title property", () => {
        const metadata = parseMetadata(`js`);
        expect(typeof metadata.title).toEqual("undefined");
      });
    });
  });
});
