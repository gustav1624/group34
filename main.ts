import { Project, Task, SubTask, User, HashFunction, hash_function, ProbingFunction, 
    TaskStorage, prompt, quadratic_probing_function, create_empty_hash, ph_delete, ph_insert, 
    ph_lookup, Category } from "./lib/exports";

import { add_subtask, create_project, create_task, generate_id, alphabetical_sort, priority_sort, 
    empty_category, get_task_progress, edit_task, assign_task, complete_task, filter_completed, 
    task_to_project, access_task, remove_task_from_project, view_task } from "./lib/Functions";

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

function menu() {
    console.log("");
    console.log("PROJECT PLANNER");
    console.log("");
    console.log("MAIN MENU");

    const choice = choose(["Open project", "Create new project"]);
    if (choice === 1) {
        open_project();
    }
    else if (choice === 2) {
        create_new_project();
    }
    
}

function open_project() {
    console.log("opening project");
}

function create_new_project() {
    console.log("creating a new project");
}

menu();