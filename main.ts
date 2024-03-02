import { Console, clear } from "console";
import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
    TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
    ph_lookup, Category } from "./lib/exports";

import { add_subtask, create_project, create_task, generate_id, alphabetical_sort, priority_sort, 
    empty_category, get_task_progress, edit_task, assign_task, complete_task, filter_completed, 
    task_to_project, access_task, remove_task_from_project, view_task, overview_project, edit_task_user_input, tasks_to_array } from "./lib/Functions";


//Main data
let global_projects: Array<Project> = [];

/**
 * Function that displays different alternatives to the user which can be selected in the terminal
 * @param alternatives An array of strings representing the alternatives that can be selected
 * @returns Returns a number corresponding to the selected alternative
 */
function choose(alternatives: Array<string>): number {
    let input = 0;
    let numbers = [];
    for (let i = 0; i < alternatives.length; i++) {
        numbers.push(i + 1); 
    }

    while (numbers.filter((n) => n !== input).length === numbers.length) {
        console.log("");
        for (let i = 0; i < alternatives.length; i++) {
            console.log(i + 1, alternatives[i]);
        }
        input = +prompt("Choose an option: ");
    }
    return input;
}

/**
 * Menu function. Calls the main menu for the project planner
 */
function menu() {
    console.log("");
    console.log("PROJECT PLANNER");
    console.log("");
    console.log("MAIN MENU");

    if (global_projects.length > 0) {
        console.log("Current projects:");
        for (let i = 0; i < global_projects.length; i++) {
            console.log(global_projects[i].title);
        }
    }

    const choice = choose(["Open project", "Create new project", "Exit"]);
    if (choice === 1) {
        open_project();
    }
    else if (choice === 2) {
        create_new_project();
    } 
    else if (choice === 3) {
        return;
    }
    
}

/**
 * Open project function. Calls a menu for opening projects
 */
function open_project() {
    console.log("");
    console.log("opening project");
    let current: Project = create_project("placeholder");
    if (global_projects.length === 0) {
        console.log("You have no projects! Consider creating some.");
        menu();
    }
    else if (global_projects.length === 1) {
        current = global_projects[0];
        console.log("");
        overview_project(current);
    }
    else {
        console.log("Choose a project:");
        const choices: Array<string> = [];
        const choices_index: Array<number> = [];
        for (let i = 0; i < global_projects.length; i++) {
            if (global_projects[i] !== undefined) {
                choices.push(global_projects[i].title);
                choices_index.push(i);
            }
        }
        current = global_projects[choices_index[choose(choices) - 1]];
        console.log("");
        overview_project(current);
        
    }
    console.log("");
    console.log("Choose an action: ");
    const choice = choose(["Modify project", "Choose a different project", "View task",
                           "View category", "Sort tasks", "Show users", "Back"]);
    if (choice === 1) {
        edit_project(current);
    }
    else if (choice === 2) {
        open_project();
    }
    else if(choice === 3) {
        console.log("")
        console.log("Choose task to view: ")
        task_to_modify(current, view_task);
    }
    else if (choice === 4) {
        //category
    }
    else if (choice === 5) {
        const sort_alg = choose(["A-Z", "Z-A", "High Prio", "Low Prio"]);
        const input = tasks_to_array(current.task_ids, current.task_table);
        if (sort_alg === 1) {
            const sorted = alphabetical_sort(input);
            let new_task_ids: Array<number> = [];
            for (let i = 0; i < sorted.length; i++) {
                new_task_ids.push(sorted[i].id);
            }
            current.task_ids = new_task_ids;
        }
        else if (sort_alg === 2) {
            const sorted = alphabetical_sort(input).reverse();
            let new_task_ids: Array<number> = [];
            for (let i = 0; i < sorted.length; i++) {
                new_task_ids.push(sorted[i].id);
            }
            current.task_ids = new_task_ids;
        }
        else if (sort_alg === 3) {
            const sorted = priority_sort(input);
            let new_task_ids: Array<number> = [];
            for (let i = 0; i < sorted.length; i++) {
                new_task_ids.push(sorted[i].id);
            }
            current.task_ids = new_task_ids;
        }
        else if (sort_alg === 4) {
            const sorted = priority_sort(input).reverse();
            let new_task_ids: Array<number> = [];
            for (let i = 0; i < sorted.length; i++) {
                new_task_ids.push(sorted[i].id);
            }
            current.task_ids = new_task_ids;
        }
    }
    else if (choice === 6) {
        user_function(current);
    }
    else if (choice === 7) {
        menu();
    }
}

/**
 * Calls a menu for creating a new project
 */
function create_new_project(): void {
    console.log("");
    console.log("Creating a new project");
    const input: string = prompt("Choose a title for the project: ");
    global_projects.push(create_project(input));
    console.log("Project " + input + " created succesfully");
    menu();
}

/**
 * Calls the edit project menu which allows editing a selected project
 * @param project The project to edit
 */
function edit_project(project: Project): void {
    console.log("Edit project");
    const choice1 = choose(["Edit project", "Delete project", "Choose another project", "Menu"]);
    if (choice1 === 1) {
        const choice2 = choose(["Add task", "Delete task", "Edit task", "Back"]);
        if (choice2 === 1) {
            //TODO
        }
        else if (choice2 === 2) {
            console.log("")
            console.log("Choose task to delete: ")
            task_to_modify(project, remove_task_from_project);
        }
        else if (choice2 === 3) {
            console.log("")
            console.log("Choose task to edit: ")
            task_to_modify(project, edit_task_user_input);
        }
        else if (choice2 === 4) {
            open_project();
        }
    }
    else if (choice1 === 2) {
        let new_arr: Array<Project> = [];
        for (let i = 0; i < global_projects.length; i++) {
            if (global_projects[i] !== project) {
                new_arr.push(global_projects[i]);
            }
        }
        global_projects = new_arr;
        menu();
    }
    else if (choice1 === 3) {
        open_project();
    }
    else if (choice1 === 4) {
        menu();
    }
}

/**
 * Allows the user to choose a task from the project to modify using another function
 * @param project the project from which a task can be chosen
 * @param fnction the function to modify the task or project
 */
function task_to_modify(project: Project, fnction: Function): void {
    const titles = [];
    for(let i = 0; i < project.task_ids.length; i++) {
        const task = ph_lookup(project.task_table, project.task_ids[i]);
        if(task !== undefined) {
            titles.push(task.title);
        }
    }
    const task_choice = choose(titles);
    for(let i = 0; i < project.task_ids.length; i++) {
        const task = ph_lookup(project.task_table, project.task_ids[i]);
        if (task !== undefined) {
            if(task.title === titles[task_choice - 1]) {
                fnction(task);
            }
        }
        
    }
}

function user_function(project: Project): void {
    console.log("");
    console.log("Do you wish to visit an existing user or to create a new one?");
    const choice = choose(["Show existing users", "Create a new user", "Back"]);
    if (choice === 1) {
        console.log("");
        let users_array = [];
        for (let i = 0; i < project.users.length; i++) {
            users_array.push(project.users[i].name);
        }
        if (users_array.length === 0) {
            console.log("There are no users in the system")
        }
        else {
            console.log("Which user do you wish to visit?");
            const person_choice = choose(users_array);
            visit_user(project, project.users[person_choice - 1]);
        }
        user_function(project);
    }
    else if (choice === 2) {
        console.log("");
        console.log("Creating a new user");
        const name: string = prompt("Choose a name for the user: ");
        console.log("User", name, "created succesfully");
        const user: User = { name: name, task_ids: [] };
        project.users.push(user);
        user_function(project);
    }
    else if (choice === 3) {
        open_project();
    }
}

function visit_user(project: Project, user: User): void {
    console.log("");
    console.log("User", user.name, "selected");
    console.log("What do you wish to do?");
    const choice = choose(["Show tasks", "Assign a task to user", "Remove a task from user", "Back"]);
    if (choice === 1) {
        //TO DO
    }
    else if (choice === 2) {
        //TO DO
    }
    else if (choice === 3) {
        //TO DO
    }
    else if (choice === 4) {
        user_function(project);
    }
}

//main call
menu();