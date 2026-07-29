import { describe, it, expect } from "vitest";

import {
  isFractionCorrect,
  isValueCorrect,
  validateAnswer,
} from "./mathsAnswerValidator.js";

describe("isFractionCorrect", () => {
  it("accepts equivalent fractions", () => {
    expect(
      isFractionCorrect(
        { numerator: "1", denominator: "2" },
        { numerator: "2", denominator: "4" },
      ),
    ).toBe(true);
  });

  it("requires an exact match when equivalent fractions are disabled", () => {
    expect(
      isFractionCorrect(
        { numerator: "1", denominator: "2" },
        { numerator: "2", denominator: "4" },
        false,
      ),
    ).toBe(false);
  });

  it("returns false for an invalid denominator", () => {
    expect(
      isFractionCorrect(
        { numerator: "1", denominator: "0" },
        { numerator: "1", denominator: "2" },
      ),
    ).toBe(false);
  });
});

describe("isValueCorrect", () => {
  it("ignores whitespace and case", () => {
    expect(isValueCorrect("  CAT ", "cat")).toBe(true);
  });
});

describe("validateAnswer", () => {
  it("validates fraction questions", () => {
    const question = {
      question_type: "fill_in",
      question_display: {
        format: "fraction_equation",
      },
      correct_answer: {
        numerator: "2",
        denominator: "4",
      },
    };

    expect(
      validateAnswer(question, {
        numerator: "1",
        denominator: "2",
      }),
    ).toBe(true);
  });

  it("validates multiple choice answers", () => {
    const question = {
      question_type: "multiple_choice",
      correct_answer: "Dog",
    };

    expect(validateAnswer(question, " dog ")).toBe(true);
  });

  it("returns false for unsupported question types", () => {
    expect(
      validateAnswer(
        {
          question_type: "essay",
          correct_answer: "anything",
        },
        "anything",
      ),
    ).toBe(false);
  });
});
