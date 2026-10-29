
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentForm from "./StudentForm";
import type { Student } from "../types/student";

const student: Student = {
  id: 1,
  name: "Ananya Rao",
  email: "ananya@example.com",
  course: "TypeScript",
  grade: 90,
  status: "Active",
  photoUrl: "",
};

describe("StudentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the add student form with default values", () => {
    render(
      <StudentForm
        student={null}
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Add Student" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Full name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Email address/i)).toHaveValue("");
    expect(screen.getByLabelText("Course")).toHaveValue("React");
    expect(screen.getByLabelText(/Grade/i)).toHaveValue(80);
    expect(screen.getByLabelText("Status")).toHaveValue("Active");
  });

  it("saves a new student with trimmed name and email", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <StudentForm
        student={null}
        onSave={onSave}
        onClose={onClose}
      />
    );

    await user.type(
      screen.getByLabelText(/Full name/i),
      "  Rahul Kumar  "
    );

    await user.type(
      screen.getByLabelText(/Email address/i),
      "rahul@example.com"
    );

    await user.selectOptions(
      screen.getByLabelText("Course"),
      "Python"
    );

    await user.clear(screen.getByLabelText(/Grade/i));
    await user.type(screen.getByLabelText(/Grade/i), "85");

    await user.click(
      screen.getByRole("button", { name: "Add Student" })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: "Rahul Kumar",
        email: "rahul@example.com",
        course: "Python",
        grade: 85,
        status: "Active",
        photoUrl: "",
      });
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("loads existing student information when editing", () => {
    render(
      <StudentForm
        student={student}
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Edit Student" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Full name/i)).toHaveValue("Ananya Rao");
    expect(screen.getByLabelText(/Email address/i)).toHaveValue(
      "ananya@example.com"
    );
    expect(screen.getByLabelText("Course")).toHaveValue("TypeScript");
    expect(screen.getByLabelText(/Grade/i)).toHaveValue(90);
    expect(screen.getByLabelText("Status")).toHaveValue("Active");
  });

  it("shows an error when the name is blank", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    const { container } = render(
      <StudentForm
        student={null}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );

    fireEvent.submit(container.querySelector("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter the student's name."
    );

    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows an error when the email is invalid", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    const { container } = render(
      <StudentForm
        student={null}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );

    await user.type(
      screen.getByLabelText(/Full name/i),
      "Rahul Kumar"
    );

    await user.type(
      screen.getByLabelText(/Email address/i),
      "invalid-email"
    );

    fireEvent.submit(container.querySelector("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter a valid email address."
    );

    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows an error when the grade is outside 0 to 100", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    const { container } = render(
      <StudentForm
        student={null}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );

    await user.type(
      screen.getByLabelText(/Full name/i),
      "Rahul Kumar"
    );

    await user.type(
      screen.getByLabelText(/Email address/i),
      "rahul@example.com"
    );

    await user.clear(screen.getByLabelText(/Grade/i));
    await user.type(screen.getByLabelText(/Grade/i), "101");

    fireEvent.submit(container.querySelector("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Grade must be between 0 and 100."
    );

    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows an error when saving fails", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockRejectedValue(new Error("Save failed"));
    const onClose = vi.fn();

    render(
      <StudentForm
        student={null}
        onSave={onSave}
        onClose={onClose}
      />
    );

    await user.type(
      screen.getByLabelText(/Full name/i),
      "Rahul Kumar"
    );

    await user.type(
      screen.getByLabelText(/Email address/i),
      "rahul@example.com"
    );

    await user.click(
      screen.getByRole("button", { name: "Add Student" })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to save the student. Please try again."
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes the form when the Close form button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <StudentForm
        student={null}
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={onClose}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Close form" })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes the form when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <StudentForm
        student={null}
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes the form when the backdrop is clicked", () => {
    const onClose = vi.fn();

    const { container } = render(
      <StudentForm
        student={null}
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={onClose}
      />
    );

    const backdrop = container.querySelector(".modal-backdrop");

    expect(backdrop).not.toBeNull();

    fireEvent.mouseDown(backdrop!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close the form when the modal itself is clicked", () => {
    const onClose = vi.fn();

    render(
      <StudentForm
        student={null}
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={onClose}
      />
    );

    fireEvent.mouseDown(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("saves a student with Inactive status", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <StudentForm
        student={null}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );

    await user.type(
      screen.getByLabelText(/Full name/i),
      "Priya Sharma"
    );

    await user.type(
      screen.getByLabelText(/Email address/i),
      "priya@example.com"
    );

    await user.selectOptions(
      screen.getByLabelText("Status"),
      "Inactive"
    );

    await user.click(
      screen.getByRole("button", { name: "Add Student" })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Priya Sharma",
          email: "priya@example.com",
          status: "Inactive",
        })
      );
    });
  });

  it("shows Saving and disables buttons while the save is pending", async () => {
    const user = userEvent.setup();

    let resolveSave!: () => void;

    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        })
    );

    const onClose = vi.fn();

    render(
      <StudentForm
        student={null}
        onSave={onSave}
        onClose={onClose}
      />
    );

    await user.type(
      screen.getByLabelText(/Full name/i),
      "Rahul Kumar"
    );

    await user.type(
      screen.getByLabelText(/Email address/i),
      "rahul@example.com"
    );

    await user.click(
      screen.getByRole("button", { name: "Add Student" })
    );

    const savingButton = await screen.findByRole("button", {
      name: "Saving...",
    });

    expect(savingButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Close form" })
    ).toBeDisabled();

    resolveSave();

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
