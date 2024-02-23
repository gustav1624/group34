import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
    TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
    ph_lookup, 
    Category } from "./exports";

import { create_project, create_task, generate_id, empty_category } from "./Functions";


test("Create project", () => {
    const test_project = create_project("Project 1");
    const test_task_table = create_empty_hash(97, quadratic_probing_function(hash_function));
    const test_project_expected = { title: "Project 1", task_table: test_task_table, task_ids: [], categories: [] };
    expect(JSON.stringify(test_project_expected)).toEqual(JSON.stringify(test_project));
});

test("Create task", () => {
    const test_task = create_task("Task 1", "Task instructions", 2);
    test_task.id = 1;
    const test_task_expected = { 
        title: "Task 1", 
        id: 1, 
        description: "Task instructions", 
        subtasks: undefined, 
        status: false, 
        priority: 2 
    };
    expect(test_task_expected).toEqual(test_task);
});

test("Generate ID", () => {
    const t1 = generate_id(false);
    const t2 = generate_id(false);
    const t3 = generate_id(false);
    expect(t1 === t2 || t2 === t3 || t1 === t3).toBeFalsy();
});

test("Create category", () => {
    const test_category = empty_category("Meetings");
    const test_category_expected = { title: "Meetings", task_ids: [] };
    expect(test_category_expected).toEqual(test_category);
});