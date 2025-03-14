import { Field } from "@formscale/types";
import { fieldToZodSchema } from "../../validations";

describe("text field validation", () => {
  it("accepts valid text when required", () => {
    const field: Field = {
      type: "text",
      id: "name",
      name: "Name",
      required: true,
      placeholder: "Name",
      description: "Name",
    };

    const schema = fieldToZodSchema(field);
    expect(() => schema.parse("valid text")).not.toThrow();
    expect(() => schema.parse("")).toThrow("This field is required");
    expect(() => schema.parse(undefined)).toThrow();
  });

  it("accepts empty values when optional", () => {
    const field: Field = {
      type: "text",
      id: "name",
      name: "Name",
      required: false,
      placeholder: "Name",
      description: "Name",
    };

    const schema = fieldToZodSchema(field);
    expect(() => schema.parse("text")).not.toThrow();
    expect(() => schema.parse("")).not.toThrow();
    expect(() => schema.parse(undefined)).not.toThrow();
  });

  it("validates minLength constraint", () => {
    const field: Field = {
      type: "text",
      id: "name",
      name: "Name",
      required: true,
      placeholder: "Name",
      description: "Name",
      min: 3,
    };

    const schema = fieldToZodSchema(field);
    expect(() => schema.parse("abc")).not.toThrow();
    expect(() => schema.parse("abcd")).not.toThrow();
    expect(() => schema.parse("ab")).toThrow();
  });

  it("validates maxLength constraint", () => {
    const field: Field = {
      type: "text",
      id: "name",
      name: "Name",
      required: true,
      placeholder: "Name",
      description: "Name",
      max: 5,
    };

    const schema = fieldToZodSchema(field);
    expect(() => schema.parse("abc")).not.toThrow();
    expect(() => schema.parse("abcde")).not.toThrow();
    expect(() => schema.parse("abcdef")).toThrow();
  });

  it("validates both minLength and maxLength constraints", () => {
    const field: Field = {
      type: "text",
      id: "name",
      name: "Name",
      required: true,
      placeholder: "Name",
      description: "Name",
      min: 3,
      max: 5,
    };

    const schema = fieldToZodSchema(field);
    expect(() => schema.parse("abc")).not.toThrow();
    expect(() => schema.parse("abcd")).not.toThrow();
    expect(() => schema.parse("abcde")).not.toThrow();
    expect(() => schema.parse("ab")).toThrow();
    expect(() => schema.parse("abcdef")).toThrow();
  });
});
