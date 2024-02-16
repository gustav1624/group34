import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
         TaskStorage, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
         ph_lookup } from "./exports";

export function create_project(title: string): Project {
    return { title: title, task_table: create_empty_hash(43, quadratic_probing_function(hash_function)) };
}

function generate_id() {
    return Date.now();
}

export function create_task(title: string, description: string, priority: number): Task {
    return { 
        title: title, 
        id: generate_id(),
        description: description,
        subtasks: undefined,
        status: false,
        priority: priority
    };
}
