/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { query } from "./";
import { Template } from "../../types";

const getTemplates = async (): Promise<Template[]> => {
  const text = "SELECT * from templates";
  try {
    console.info("DB: Getting templates from db");

    const res = await query(text);

    return res.rows as Template[];
  } catch (err: any) {
    console.error("DB: Error getting templates from db: ", err.stack);
    throw new Error(err.stack);
  }
};

const getTemplateById = async (id: string): Promise<Template> => {
  try {
    console.info(`DB: Getting template with id ${id} from db`);

    const text = "SELECT * FROM templates WHERE id = $1";
    const values = [id];

    const res = await query(text, values);

    return res.rows[0] as Template;
  } catch (err: any) {
    console.error("DB: Error getting template from db: ", err.stack);
    throw new Error(err.stack);
  }
};

const deleteTemplateById = async (id: string): Promise<void> => {
  try {
    console.info(`DB: Deleting template with id ${id} from db`);

    const text = "DELETE * FROM templates WHERE id = $1";
    const values = [id];

    await query(text, values);

    console.info(`DB: Successfully deleted template with id ${id} from db`);
  } catch (err: any) {
    console.error("DB: Error getting template from db: ", err.stack);
    throw new Error(err.stack);
  }
};

const createTemplate = async ({
  id,
  name,
  value,
}: {
  id: string;
  name: string;
  value: string;
}): Promise<Template> => {
  try {
    console.info(`DB: Saving template with id ${id} to db`);

    const text =
      "INSERT INTO templates(id, name, value) VALUES($1, $2, $3) RETURNING *";
    const values = [id, name, value];

    const res = await query(text, values);

    return res.rows[0] as Template;
  } catch (err: any) {
    console.error("DB: Error saving template to db: ", err.stack);
    throw new Error(err.stack);
  }
};

export { getTemplates, getTemplateById, createTemplate, deleteTemplateById };
