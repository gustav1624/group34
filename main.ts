import { Console, clear } from "console";
import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
    TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
    ph_lookup, Category } from "./lib/exports";

import { add_subtask, create_project, create_task, generate_id, alphabetical_sort, priority_sort, 
    empty_category, get_task_progress, edit_task, assign_task, complete_task, filter_completed, 
    task_to_project, access_task, remove_task_from_project, view_task, overview_project } from "./lib/Functions";


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
        task_to_view(current);
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
    console.log("edit project");
    const choice1 = choose(["Edit project", "Delete project", "Choose another project", "Menu"]);
    if (choice1 === 1) {
        const choice2 = choose(["Add task", "Delete task", "Edit task", "Back"]);
        if (choice2 === 1) {
            //TODO
        }
        else if (choice2 === 2) {
            //TODO
        }
        else if (choice2 === 3) {
            //TODO
        }
        else if (choice2 === 4) {
            //TODO
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

function task_to_view(project: Project) {
    console.log("")
    console.log("Choose task to view: ")
    const arr = [];
    for(let i = 0; i < project.task_ids.length; i++) {
        const task = ph_lookup(project.task_table, project.task_ids[i]);
        if(task !== undefined) {
            arr.push(task.title);
        }
    }
    const task_choice = choose(arr);
    view_task(arr[input]);
}

//main call
menu();