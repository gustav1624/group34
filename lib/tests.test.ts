import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
    TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
    ph_lookup, 
    Category} from "./exports";

import { create_project, create_task, generate_id, alphabetical_sort, priority_sort } from "./Functions";


test("Create project", () => {
    const test_project = create_project("Project 1");
    const test_task_table = create_empty_hash(43, quadratic_probing_function(hash_function));
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
    expect(JSON.stringify(test_task_expected)).toEqual(JSON.stringify(test_task));
});

test("Generate ID", () => {
    const t1 = generate_id(false);
    const t2 = generate_id(false);
    const t3 = generate_id(false);
    expect(t1 === t2 || t2 === t3 || t1 === t3).toBeFalsy();
});

test("Alphabetical sort, priority sort", () => {
    const proj = create_project("test project");
    const t1 = create_task("alpha", "desc", 1);
    const t2 = create_task("beta", "desc", 2);
    const t3 = create_task("zulu", "desc", 3);
    const t4 = create_task("gamma", "desc", 5);
    const t5 = create_task("aalpha", "desc", 9);

    const tasks1 = [t1, t2, t3, t4, t5];
    const expected1 = [t5, t1, t2, t4, t3];
    expect(alphabetical_sort(tasks1)).toEqual(expected1);

    const expected2 = [t5, t4, t3, t2, t1];
    expect(priority_sort(tasks1)).toEqual(expected2);
})