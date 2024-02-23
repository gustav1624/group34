import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
    TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
    ph_lookup, Category } from "./exports";

import { add_subtask, create_project, create_task, generate_id, alphabetical_sort, priority_sort, 
    empty_category, get_task_progress, test_sort, edit_task, assign_task } from "./Functions";

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

test("Add subtask", () => {
    let test_task = create_task("Task 1", "Task instructions", 2);
    test_task.id = 1;
    const subtask = add_subtask("St1", "Subtask instructions", test_task);
    if(test_task.subtasks !== undefined) {
        test_task.subtasks[0].id = 3;
    }
    const test_task_expected = { 
        title: "Task 1", 
        id: 1, 
        description: "Task instructions", 
        subtasks: [{title: "St1", id: 3, description: "Subtask instructions", status: false}], 
        status: false, 
        priority: 2 
    };
    expect(test_task).toEqual(test_task_expected);
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
    expect(test_sort(tasks1)).toEqual(expected1);

    const expected2 = [t5, t4, t3, t2, t1];
    expect(priority_sort(tasks1)).toEqual(expected2);
});

test("Assign task", () => {
    const test_task = create_task("Task 1", "Task instructions", 2);
    let user1 = {name: "A", task_ids: []};
    assign_task(user1, test_task);
    const expected_result = {name: "A", task_ids: [test_task.id]};
    expect(user1).toEqual(expected_result);
    const test_task2 = create_task("Task 2", "Task instructions", 2);
    const test_task3 = create_task("Task 3", "Task instructions", 2);
    assign_task(user1, test_task2);
    assign_task(user1, test_task3);
    const expected_result2 = {name: "A", task_ids: [test_task.id, test_task2.id, test_task3.id]};
    expect(user1).toEqual(expected_result2);

})

test("Task progress", () => {
    const test_task = create_task("Task 1", "Description", 1);
    add_subtask("Subtask 1", "Description", test_task);
    add_subtask("Subtask 2", "Description", test_task);
    if (test_task.subtasks !== undefined) {
        test_task.subtasks[0].status = true;
    }
    const test_progress = get_task_progress(test_task);
    const test_progress_expected = 0.5;
    expect(test_progress_expected).toEqual(test_progress);
});

test("Edit task", () => {
    const test_task = create_task("Task 1", "Bad description", 2);
    edit_task(test_task, "Task 2", "Good description", false, true, 1);
    test_task.id = 1;
    const test_task_expected = { 
        title: "Task 2", 
        id: 1, 
        description: "Good description", 
        subtasks: undefined, 
        status: true, 
        priority: 1
    };
    expect(test_task_expected).toEqual(test_task);
});