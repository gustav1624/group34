import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
         TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
         ph_lookup } from "./exports";

/**
 * Creates an empty project
 * @param title string - The title of the project
 * @returns Project - an empty project
 */
export function create_project(title: string): Project {
    return { title: title, task_table: create_empty_hash(43, quadratic_probing_function(hash_function)) };
}

/**
 * Generates an id for a task
 * @param is_subtask boolean - Specifies if the task is a subtask or not
 * @returns number - returns a number beginning in 9 if task is a subtask and 1 if not
 */
function generate_id(is_subtask: boolean) {
    const num = Date.now();
    return is_subtask ? parseInt("9".concat(num.toString()))
                      : parseInt("1".concat(num.toString()));
}

/**
 * Creates a task
 * @param title string - The title for the task
 * @param description string - The description of the task
 * @param priority number - the priority of the task
 * @returns returns an unfinished task with a randomly generated id, without subtasks
 */
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

/**
 * Adds a subtask to a valid task
 * @param title string - the title of the subtask
 * @param description string - the description of the subtask
 * @param Task Task - the task where the subtask will be added
 * @modifies - Modifies the input Task by changing the subtasks array in the task.
 */
export function add_subtask(title: string, description: string, Task: Task): void {
    const st = { title: title, id: generate_id(true), description: description, status: false };
    Task.subtasks === undefined ? Task.subtasks = [st] : Task.subtasks.concat([st]);
}

/**
 * Takes an array of task ID's and returns an array of tasks from a hashtable.
 * @param IDS Array - an array of task id's
 * @param task_table TaskStorage - a TaskStorage with corresponding tasks
 * @returns Array - returns an array of tasks fetched from the TaskStorage.
 */
export function tasks_to_array(IDS: Array<number>, task_table: TaskStorage): Array<Task> {
    const res: Array<Task> = [];
    for (let i = 0; i < IDS.length; i++) {
        const val = ph_lookup(task_table, IDS[i]);
        if (val !== undefined) {
            res.push(val);
        }
    }
    return res;
}

/**
 * Returns the progress of a task in percent. 
 * @param Task Task - A Valid task
 * @returns number - 1 if task is completed, otherwise a number inbetween 0 and 1 calcuated as the number of 
 * completed subtasks divided by the number of subtasks
 */
export function get_task_progress(Task: Task): number {
    if (Task.subtasks === undefined || Task.status === true) {
        return Task.status === false ? 0 : 1;
    }
    else {
        let total = 0;
        let completed = 0;
        for (let i = 0; i < Task.subtasks.length; i++) {
            Task.subtasks[i].status === true ? completed++ : completed = completed;
            total++
        } 
        return completed / total;
    }
}

/**
 * Assigns a task to a user
 * @param user User - The user which the task will be assigned to
 * @param task Task - The task to assign the user
 * @modifies user - adds the task id to the users task id's
 */
export function assign_task(user: User, task: Task): void {
    user.task_ids.push(task.id);
}

export function edit_task(task: Task, new_title: string, new_description: string, reset_subtasks: boolean,
    new_status: boolean, new_priority: number): void {
        task.title = new_title;
        task.description = new_description;
        if (reset_subtasks) {
            task.subtasks = [];
        }
        task.status = new_status;
        task.priority = new_priority;
}

export function edit_task_user_input(task: Task | any): void {
}