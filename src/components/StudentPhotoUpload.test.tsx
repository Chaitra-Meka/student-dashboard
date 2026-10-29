
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import StudentPhotoUpload from "./StudentPhotoUpload";

class MockFileReader {
  static shouldFail = false;

  result: string | ArrayBuffer | null =
    "data:image/png;base64,test-image";

  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null =
    null;

  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null =
    null;

  readAsDataURL = vi.fn(() => {
    if (MockFileReader.shouldFail) {
      this.onerror?.call(
        this as unknown as FileReader,
        new ProgressEvent("error") as ProgressEvent<FileReader>
      );
      return;
    }

    this.onload?.call(
      this as unknown as FileReader,
      new ProgressEvent("load") as ProgressEvent<FileReader>
    );
  });
}

describe("StudentPhotoUpload", () => {
  beforeEach(() => {
    MockFileReader.shouldFail = false;
    vi.stubGlobal("FileReader", MockFileReader);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows the placeholder when no photo exists", () => {
    render(<StudentPhotoUpload value="" onChange={vi.fn()} />);

    expect(screen.getByText("👤")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Student preview" })
    ).not.toBeInTheDocument();
  });

  it("shows the existing photo preview", () => {
    render(
      <StudentPhotoUpload
        value="data:image/png;base64,existing"
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("img", { name: "Student preview" })
    ).toHaveAttribute("src", "data:image/png;base64,existing");

    expect(
      screen.getByRole("button", { name: "Remove" })
    ).toBeInTheDocument();
  });

  it("opens the file picker when Upload photo is clicked", () => {
    const { container } = render(
      <StudentPhotoUpload value="" onChange={vi.fn()} />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const clickSpy = vi.spyOn(input, "click");

    fireEvent.click(
      screen.getByRole("button", { name: "Upload photo" })
    );

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("reads a valid image and calls onChange with the image data", async () => {
    const onChange = vi.fn();

    const { container } = render(
      <StudentPhotoUpload value="" onChange={onChange} />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const file = new File(["image content"], "student.png", {
      type: "image/png",
    });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        "data:image/png;base64,test-image"
      );
    });
  });

  it("rejects an unsupported file type", () => {
    const onChange = vi.fn();
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    const { container } = render(
      <StudentPhotoUpload value="" onChange={onChange} />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const file = new File(["text"], "student.gif", {
      type: "image/gif",
    });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Choose a JPG, PNG, or WebP image."
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects an image larger than 1 MB", () => {
    const onChange = vi.fn();
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    const { container } = render(
      <StudentPhotoUpload value="" onChange={onChange} />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const largeFile = new File(
      [new Uint8Array(1024 * 1024 + 1)],
      "large.png",
      { type: "image/png" }
    );

    fireEvent.change(input, {
      target: { files: [largeFile] },
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Image size must be 1 MB or less."
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes the photo and clears the file input", () => {
    const onChange = vi.fn();

    const { container } = render(
      <StudentPhotoUpload
        value="data:image/png;base64,existing"
        onChange={onChange}
      />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [
          new File(["image"], "student.png", {
            type: "image/png",
          }),
        ],
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Remove" })
    );

    expect(onChange).toHaveBeenCalledWith("");
    expect(input.value).toBe("");
  });

  it("shows an alert when the image cannot be read", () => {
    MockFileReader.shouldFail = true;

    const onChange = vi.fn();
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    const { container } = render(
      <StudentPhotoUpload value="" onChange={onChange} />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const file = new File(["image"], "student.png", {
      type: "image/png",
    });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Unable to read this image."
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does nothing when no file is selected", () => {
    const onChange = vi.fn();

    const { container } = render(
      <StudentPhotoUpload value="" onChange={onChange} />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [] },
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
