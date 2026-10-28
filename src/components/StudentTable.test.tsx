
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentTable from "./StudentTable";
import type { Student } from "../types/student";

const student: Student = {
  id: 1,
  name: "Ananya Rao",
  email: "ananya@example.com",
  course: "TypeScript",
  grade: 90,
  status: "Active",
};

describe("StudentTable", () => {
  it("renders student information", () => {
    render(
      <StudentTable
        students={[student]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByText("Ananya Rao")).toBeInTheDocument();
    expect(screen.getByText("ananya@example.com")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar", {
        name: "Grade for Ananya Rao",
      })
    ).toHaveAttribute("aria-valuenow", "90");
  });

  it("shows the empty state when there are no students", () => {
    render(
      <StudentTable
        students={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByText("No students found")).toBeInTheDocument();
    expect(
      screen.getByText("Try a different search or change your filters.")
    ).toBeInTheDocument();
  });

  it("calls onEdit with the selected student", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <StudentTable
        students={[student]}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Edit Ananya Rao",
      })
    );

    expect(onEdit).toHaveBeenCalledWith(student);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete with the student ID", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <StudentTable
        students={[student]}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onStatusChange={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete Ananya Rao",
      })
    );

    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("updates the student's status through the callback", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <StudentTable
        students={[student]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={onStatusChange}
      />
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Status for Ananya Rao",
      }),
      "Inactive"
    );

    expect(onStatusChange).toHaveBeenCalledWith(1, "Inactive");
    expect(onStatusChange).toHaveBeenCalledTimes(1);
  });

  it("renders a student photo when photoUrl is provided", () => {
    const studentWithPhoto: Student = {
      ...student,
      photoUrl: "https://example.com/student.jpg",
    };

    const { container } = render(
      <StudentTable
        students={[studentWithPhoto]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    const image = container.querySelector("img.student-avatar");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://example.com/student.jpg"
    );
    expect(image).toHaveAttribute("alt", "");
  });

  it("displays initials when a student has no photo", () => {
    render(
      <StudentTable
        students={[student]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("displays the inactive status for a student", () => {
    const inactiveStudent: Student = {
      ...student,
      status: "Inactive",
    };

    render(
      <StudentTable
        students={[inactiveStudent]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("combobox", {
        name: "Status for Ananya Rao",
      })
    ).toHaveValue("Inactive");
  });

  it("handles a student name containing only whitespace", () => {
  const studentWithBlankName: Student = {
    ...student,
    name: "   ",
  };

  const { container } = render(
    <StudentTable
      students={[studentWithBlankName]}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      onStatusChange={vi.fn()}
    />
  );

  const avatar = container.querySelector(".avatar-fallback");

  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveTextContent("");
});
});
