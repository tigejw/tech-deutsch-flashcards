import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { LessonSelector } from "./LessonSelector.tsx";
import type { ModuleSummary } from "../types/vocab";
 
const modules: ModuleSummary[] = [
  {
    moduleId: 1,
    moduleTitle: "Module 1",
    lessons: [
      { lessonId: 1, lessonTitle: "Lesson 1.1" },
      { lessonId: 2, lessonTitle: "Lesson 1.2" },
    ],
  },
  {
    moduleId: 2,
    moduleTitle: "Module 2",
    lessons: [{ lessonId: 3, lessonTitle: "Lesson 2.1" }],
  },
];
 
function getModuleItem(moduleTitle: string) {
  return screen.getByText(moduleTitle).closest("li") as HTMLElement;
}
 
async function expandModule(user: ReturnType<typeof userEvent.setup>, moduleTitle: string) {
  const moduleItem = getModuleItem(moduleTitle);
  const expandButton = within(moduleItem).getByRole("button");
  await user.click(expandButton);
  return moduleItem;
}
 
describe("LessonSelector", () => {
  it("renders all modules and lessons unchecked initially", async () => {
    const user = userEvent.setup();
    render(<LessonSelector modules={modules} />);
 
    // module checkboxes start unchecked
    expect(screen.getByRole("checkbox", { name: "Module 1" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Module 2" })).not.toBeChecked();
 
    // lesson checkboxes should start unchecked
    const module1 = await expandModule(user, "Module 1");
    //here
    expect(within(module1).getByRole("checkbox", { name: "Lesson 1.1" })).toBeChecked();
    expect(within(module1).getByRole("checkbox", { name: "Lesson 1.2" })).not.toBeChecked();
  });
 
  it("checking a single lesson checks only that lesson, not the module", async () => {
    const user = userEvent.setup();
    render(<LessonSelector modules={modules} />);
 
    const module1 = await expandModule(user, "Module 1");
    const lesson1 = within(module1).getByRole("checkbox", { name: "Lesson 1.1" });
    const lesson2 = within(module1).getByRole("checkbox", { name: "Lesson 1.2" });
 
    await user.click(lesson1);
 
    expect(lesson1).toBeChecked();
    expect(lesson2).not.toBeChecked();
    // module shouldnt be checked when all its children lessons arent
    expect(within(module1).getByRole("checkbox", { name: "Module 1" })).not.toBeChecked();
  });
 
  it("checking every lesson individually reflects as the module being checked", async () => {
    const user = userEvent.setup();
    render(<LessonSelector modules={modules} />);
 
    const module1 = await expandModule(user, "Module 1");
    await user.click(within(module1).getByRole("checkbox", { name: "Lesson 1.1" }));
    await user.click(within(module1).getByRole("checkbox", { name: "Lesson 1.2" }));
    //module should be checked when all its children lessons are
    expect(within(module1).getByRole("checkbox", { name: "Module 1" })).toBeChecked();
  });
 
  it("checking the module checkbox activates all of its lessons", async () => {
    const user = userEvent.setup();
    render(<LessonSelector modules={modules} />);
 
    const module2 = await expandModule(user, "Module 2");
    const moduleCheckbox = within(module2).getByRole("checkbox", { name: "Module 2" });
    const lessonCheckbox = within(module2).getByRole("checkbox", { name: "Lesson 2.1" });
 
    expect(moduleCheckbox).not.toBeChecked();
    expect(lessonCheckbox).not.toBeChecked();
 
    await user.click(moduleCheckbox);
    
    expect(moduleCheckbox).toBeChecked();
    expect(lessonCheckbox).toBeChecked();
  });
 
  it("unchecking the module checkbox deactivates all of its lessons", async () => {
    const user = userEvent.setup();
    render(<LessonSelector modules={modules} />);
 
    const module2 = await expandModule(user, "Module 2");
    const moduleCheckbox = within(module2).getByRole("checkbox", { name: "Module 2" });
    const lessonCheckbox = within(module2).getByRole("checkbox", { name: "Lesson 2.1" });
 
    await user.click(moduleCheckbox); // turn everything on
    await user.click(moduleCheckbox); // turn everything back off
 
    expect(moduleCheckbox).not.toBeChecked();
    expect(lessonCheckbox).not.toBeChecked();
  });
});
