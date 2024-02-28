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
    let current = null;
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
    const choice = choose(["Edit project", "Choose a different project", "Back"]);
    if (choice === 1) {
        edit_project();
    }
    else if (choice === 2) {
        open_project();
    }
    else if (choice === 3) {
        menu();
    }
}

/**
 * Calls a menu for creating a new project
 */
function create_new_project() {
    console.log("");
    console.log("Creating a new project");
    const input: string = prompt("Choose a title for the project: ");
    global_projects.push(create_project(input));
    console.log("Project " + input + " created succesfully");
    menu();
}

/**
 * Rebuilds an array of projects to not contain any undefined
 * @param arr An array of projects
 * @returns an array of projects
 */
function rebuild_project_array(arr: Array<Project>): Array<Project> {
    let new_arr: Array<Project> = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
            new_arr.push(arr[i]);
        }
    }
    return new_arr;
}

/**
 * Calls the edit project menu which allows editing projects
 */
function edit_project() {
    console.log("edit project");
}

//main call
menu();