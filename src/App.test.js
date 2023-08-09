import { render, fireEvent, screen } from "@testing-library/react";
import {
  getByRole,
  getByLabelText,
  getByText,
  getByTestId,
} from "@testing-library/dom";
import "@testing-library/jest-dom";
import Todo from "./components/Todo";
import "@testing-library/jest-dom";

test("checkbox click should update is_completed to true", () => {
  const todo = {
    creator: 32323,
    assigned_to: 32323,
    project: null,
    team: 7535,
    estimate: null,
    is_achived: false,
    is_logged: false,
    labels: [],
    title: " test component",
    code: null,
    due_date: null,
    completed_at: null,
    description: null,
    is_completed: false,
    list: null,
    priority: 0,
    status: "not_started",
    is_private: false,
    phase: null,
    annex: null,
  };

  const mockUpdateCompleted = jest.fn();

  const { getByTestId } = render(
    <Todo todo={todo} updateCompleted={mockUpdateCompleted} />
  );

  const checkbox = getByTestId("checkbox");
  expect(checkbox.checked).toBe(false);

  fireEvent.click(checkbox);

  expect(mockUpdateCompleted).toHaveBeenCalledWith(todo.pk, true);
});

test("checkbox click should update is_completed to false", () => {
  const todo = {
    creator: 32323,
    assigned_to: 32323,
    project: null,
    team: 7535,
    estimate: null,
    is_achived: false,
    is_logged: false,
    labels: [],
    title: " test component",
    code: null,
    due_date: null,
    completed_at: null,
    description: null,
    is_completed: true,
    list: null,
    priority: 0,
    status: "not_started",
    is_private: false,
    phase: null,
    annex: null,
  };

  const mockUpdateCompleted = jest.fn();

  const { getByTestId } = render(
    <Todo todo={todo} updateCompleted={mockUpdateCompleted} />
  );

  const checkbox = getByTestId("checkbox");
  expect(checkbox.checked).toBe(true);
  fireEvent.click(checkbox);

  expect(mockUpdateCompleted).toHaveBeenCalledWith(todo.pk, false);
});
