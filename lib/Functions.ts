import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
         TaskStorage, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
         ph_lookup } from "./exports";

export function create_project(title: string): Project {
    return { title: title, task_table: create_empty_hash(43, quadratic_probing_function(hash_function)) };
}

function generate_id(is_subtask: boolean) {
    const num = Date.now();
    return is_subtask ? parseInt("9".concat(num.toString()))
                      : parseInt("1".concat(num.toString()));
}

export function create_task(title: string, description: string, priority: number): Task {
    return { 
        title: title, 
        id: generate_id(false),
        description: description,
        subtasks: undefined,
        status: false,
        priority: priority
    };
}

export function add_subtask(title: string, id: number, description: string, Task: Task): void {
    const st = { title: title, id: id, description: description, status: false };
    Task.subtasks === undefined ? Task.subtasks = [st] : Task.subtasks.concat([st]);
}