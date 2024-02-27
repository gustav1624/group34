import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
         TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
         ph_lookup, 
         Category} from "./exports";

/**
 * Creates an empty project
 * @param title string - The title of the project
 * @returns Project - an empty project
 */
export function create_project(title: string): Project {
    return { title: title, task_table: create_empty_hash(97, quadratic_probing_function(hash_function)),
             task_ids: [], categories: [] };
}

/**
 * Generates an id for a task
 * @param is_subtask boolean - Specifies if the task is a subtask or not
 * @returns number - returns a number beginning in 9 if task is a subtask and 1 if not
 */
export function generate_id(is_subtask: boolean) {
    const num = Date.now();
    const xxxx = (Math.floor(Math.random() * 9999)).toString();
    return is_subtask ? parseInt("9".concat(num.toString()).concat(xxxx))
                      : parseInt("1".concat(num.toString()).concat(xxxx));
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
    Task.subtasks === undefined ? Task.subtasks = [st] : Task.subtasks[Task.subtasks.length] = st;
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

/**
 * Edits the parameters of an existing task
 * @param task Task - The task to be edited
 * @param new_title string - The new title
 * @param new_description string - The new descirption
 * @param reset_subtasks boolean - true if subtasks are to be reset, else false.
 * @param new_status boolean - the new status of the task
 * @param new_priority number - the new priority of the task
 * @modifies modifies the input task 
 */
export function edit_task(task: Task, new_title: string, new_description: string, reset_subtasks: boolean,
    new_status: boolean, new_priority: number): void {
        if (new_title !== "") {
            task.title = new_title;
        }
        if (new_description !== "") {
            task.description = new_description;
        }
        if (reset_subtasks) {
            task.subtasks = [];
        }
        task.status = new_status;
        task.priority = new_priority;
}

/**
 * Edits a task field by field by using prompts given to the user
 * @param task Task - the task to be edited
 * @modifies modifies the input task 
 */
export function edit_task_user_input(task: Task): void {
    const new_title = prompt("New title: ");
    const new_description = prompt("New description: ");
    let reset_subtasks = false ;
    if (prompt("Reset subtasks? (y/n): ") === "y") {
        reset_subtasks = true;
    }
    let new_status = false;
    if (prompt("New status: ") === "true") {
        new_status = true;
    }
    const new_priority = +prompt("New priority: ");
    edit_task(task, new_title, new_description, reset_subtasks, new_status, new_priority);
}

/**
 * Adds a task to the project hashtable
 * @param task Task - the task to add to the tasktable
 * @param project Project - the project to which the task will be added to
 * @modifies modifies the input project
 */
export function task_to_project(task: Task, project: Project): void {
    ph_insert(project.task_table, task.id, task);
    project.task_ids.push(task.id);
}

/**
 * Prints out all the tasks in a project as the title, id and progress for the task.
 * @param project Project - a project
 */
export function overview_project(project: Project): void {
    console.log("Tasks in project:");
    for (let i = 0; i < project.task_ids.length; i++) {
        const task = ph_lookup(project.task_table, project.task_ids[i]);
        if (task !== undefined) {
            console.log("Title: ".concat(task.title).concat(" | ID: ").concat(task.id.toString()).
                        concat(" | Progress: ").concat((Math.round(get_task_progress(task) * 100)).toString()).
                        concat("%"));
            console.log("");
        } 
    }
}

/** 
 * Removes a task from the project hashtable and the project task_ids array
 * @param task Task - the task to remove from the tasktable
 * @param project Project - the project from which the task will be removed from
 * @modified modifies the input project
 */
export function remove_task_from_project(task: Task, project: Project): void {
    ph_delete(project.task_table, task.id);
    const new_task_ids = project.task_ids.filter((a) => a !== task.id);
    project.task_ids = new_task_ids;
}

/**
 * Access a task from the project hashtable
 * @param id number - the task id
 * @param project Project - the project that the task is stored in
 * @returns returns the task
 */
export function access_task(id: number, project: Project): Task | undefined {
    return ph_lookup(project.task_table, id);
}

/**
 * Creates a new empty category
 * @param title string - the title of the new category
 * @returns returns the category
 */
export function empty_category(title: string): Category {
    return { title: title, task_ids: [] };
}

/**
 * Asks the user if it wants to add a task to each of the existing categories
 * @param task Task - the task to add to a category
 * @param project Project - the project to which a task will be added to its category array
 */
export function task_to_category(task: Task, project: Project): void {
    for (let i = 0; i < project.categories.length; i++) {
        const prompt_string = "Add to category: ".concat(project.categories[i].title).concat("(y/n)");
        const input = prompt(prompt_string);
        if (input === "y") {
            project.categories[i].task_ids.push(task.id);
        }
    }
}

/**
 * Prints out all information about chosen task
 * @param task Task - the task to show information about
 */
export function view_task(task: Task): void {
    console.log("Title:", task.title);
    console.log("ID:", task.id);
    console.log("Description:", task.description)
    console.log("Status:", task.status)
    console.log("Priority:", task.priority)
    if(task.subtasks !== undefined) {
        console.log("Subtasks:")
        for(let i = 0; i < task.subtasks.length; i++) {
            console.log("Title", task.subtasks[i].title);
            console.log("ID", task.subtasks[i].id);
            console.log("Description", task.subtasks[i].description);
            console.log("Status", task.subtasks[i].status);
        }
    } 
    else {
        console.log("No subtasks available");
    }
}

/**
 * Completes a task
 * @param task a task
 * @modifies changes the status of the task to true
 */
export function complete_task(task: Task): void {
    task.status = true;
}


/**
 * Sorts an array of tasks alphabetically in terms of the title.
 * @param task_array An array of tasks
 * @returns returns an array of tasks sorted alphabetially
 */
export function alphabetical_sort(task_array: Array<Task>): Array<Task> {
    return task_array.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        }
        else if (a.title > b.title) {
            return 1;
        }
        else {
            return 0;
        }
    });
}

/**
 * Sorts an array of tasks in order of priority.
 * @param task_array An array of tasks
 * @returns returns an array of tasks sorted in order of priority
 */
export function priority_sort(task_array: Array<Task>): Array<Task> {
    return task_array.sort((a, b) => {
        return a.priority - b.priority;
    }).reverse();
}

/**
 * Filters an array of tasks to omit completed tasks
 * @param task_array An array of tasks
 * @returns returns an array of tasks excluding any completed tasks
 */
export function filter_completed(task_array: Array<Task>): Array<Task> {
    return task_array.filter((a) => a.status === false);
}
