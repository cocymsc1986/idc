import { query } from "./";
import { createTemplate, getTemplates, getTemplateById } from "./templates";

jest.mock("./", () => ({
  query: jest.fn(() => ({
    rows: [
      {
        id: "test-id",
        name: "test-name",
        value: "test-value",
      },
    ],
  })),
}));

describe("templates", () => {
  describe("getTemplates", () => {
    it("should return all templates", async () => {
      const result = await getTemplates();

      expect(query).toHaveBeenCalledWith("SELECT * from templates");
      expect(result).toEqual([
        {
          id: "test-id",
          name: "test-name",
          value: "test-value",
        },
      ]);
    });
  });

  describe("getTemplateById", () => {
    it("should return template with matching id", async () => {
      const result = await getTemplateById("test-id");

      expect(query).toHaveBeenCalledWith(
        "SELECT * FROM templates WHERE id = $1",
        ["test-id"]
      );
      expect(result).toEqual({
        id: "test-id",
        name: "test-name",
        value: "test-value",
      });
    });
  });

  describe("createTemplate", () => {
    it("should return newly created template", async () => {
      const body = {
        id: "test-id",
        name: "test-name",
        value: "test-value",
      };

      const result = await createTemplate(body);

      expect(query).toHaveBeenCalledWith(
        "INSERT INTO templates(id, name, value) VALUES($1, $2, $3) RETURNING *",
        ["test-id", "test-name", "test-value"]
      );
      expect(result).toEqual(body);
    });
  });
});
