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
    console.log("Opening project");
    let current: Project = create_project("placeholder");
    let chosen = false;
    if (global_projects.length === 0) {
        console.log("You have no projects! Consider creating some.");
        menu();
    }
    else if (global_projects.length === 1) {
        current = global_projects[0];
        console.log("");
        overview_project(current);
        chosen = true;
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
        chosen = true;
        
    }
    if (chosen === true) {    
        console.log("");
        console.log("Choose an action: ");
        const choice = choose(["Modify project", "Choose a different project", "View task",
                            "View categories", "Sort tasks", "Show users", "Back"]);
        if (choice === 1) {
            edit_project(current);
        }
        else if (choice === 2) {
            open_project();
        }
        else if(choice === 3) {
            console.log("");
            console.log("Choose task to view: ");
            task_to_modify(current, view_task);
            open_project();
        }
        else if (choice === 4) {
            category_function(current);
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
    console.log("Edit project: " + project.title);
    const choice1 = choose(["Edit project", "Delete project", "Choose another project", "Menu"]);
    if (choice1 === 1) {
        const choice2 = choose(["Add task", "Delete task", "Edit task", "Back"]);
        if (choice2 === 1) {
            const new_title: string = prompt("Choose a title for the task: ");
            const new_description: string = prompt("Choose a description of the task: ");
            const new_prio: number = prompt("Choose a priority for the task (0 - 10): ");
            const new_task = create_task(new_title, new_description, new_prio);
            task_to_project(new_task, project);
            edit_project(project);
        }
        else if (choice2 === 2) {
            console.log("")
            console.log("Choose task to delete: ")
            task_to_modify(project, remove_task_from_project);
            edit_project(project);
        }
        else if (choice2 === 3) {
            console.log("")
            console.log("Choose task to edit: ")
            task_to_modify(project, edit_task_user_input);
            edit_project(project);
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
    if(project.task_ids.length === 0) {
        console.log("");
        console.log("No tasks available!");
        open_project();
    }
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

/**
 * A menu that lets the user create new users and show more infromation about existing users
 * @param project the currently opened project
 */
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

/**
 * A menu with alternatives regarding users
 * Able to assign a task, to remove a task and to show all the tasks that has been assigned
 * @param project the currently opened project
 * @param user the user chosen before this function call
 */
function visit_user(project: Project, user: User): void {
    console.log("");
    console.log("User", user.name, "selected");
    console.log("What do you wish to do?");
    const choice = choose(["Show tasks", "Assign a task to user", "Remove a task from user", "Back"]);
    if (choice === 1) {
        if (user.task_ids.length !== 0) {
            for (let i = 0; i < user.task_ids.length; i++) {
                const task = ph_lookup(project.task_table, user.task_ids[i]);
                if (task !== undefined) {
                    console.log("Title: ".concat(task.title).concat(" | ID: ").concat(task.id.toString()).
                                concat(" | Progress: ").concat((Math.round(get_task_progress(task) * 100)).toString()).
                                concat("%"));
                    console.log("");
                } 
            }
        }
        else {
            console.log("There are no tasks assigned to this user");
        }
        visit_user(project, user);
    }
    else if (choice === 2) {
        console.log("");
        let filtered_task_ids_array: Array<number> = [];
        for (let i = 0; i < project.task_ids.length; i++) {
            if (user.task_ids.filter((x) => x !== project.task_ids[i]).length === user.task_ids.length) {
                filtered_task_ids_array.push(project.task_ids[i]);
            }
        }
        let task_titles_array: Array<string> = [];
        for (let i = 0; i < filtered_task_ids_array.length; i++) {
            const task = ph_lookup(project.task_table, filtered_task_ids_array[i]);
            if (task !== undefined) {
                task_titles_array.push(task.title);
            }
        }
        if (task_titles_array.length !== 0) {
            console.log("Which task do you want to assign?");
            const task_title_number = choose(task_titles_array);
            user.task_ids.push(filtered_task_ids_array[task_title_number - 1]);
            console.log(task_titles_array[task_title_number - 1], "succesfully assigned to user", user.name);
        }
        else {
            console.log("There are no tasks to be added");
        }
        visit_user(project, user);
    }
    else if (choice === 3) {
        if (user.task_ids.length !== 0) {
            let task_titles_array: Array<string> = [];
            for (let i = 0; i < user.task_ids.length; i++) {
                const task = ph_lookup(project.task_table, user.task_ids[i]);
                if (task !== undefined) {
                    task_titles_array.push(task.title);
                }
            }
            const task_title_number = choose(task_titles_array);
            user.task_ids = user.task_ids.filter((x) => x !== user.task_ids[task_title_number - 1]);
            console.log(task_titles_array[task_title_number - 1], "succesfully removed from user", user.name);
        }
        else {
            console.log("There are no tasks assigned to this user");
        }
        visit_user(project, user);
    }
    else if (choice === 4) {
        user_function(project);
    }
}

/**
 * A menu with alternatives to create a category and edit existing categories
 * @param project the currently opened project
 */
function category_function(project: Project): void {
    console.log("");
    console.log("Do you wish to edit existing categories or to create a new one?");
    const choice = choose(["Edit categories", "Create a new category", "Back"]);
    if (choice === 1) {
        console.log("");
        let categories_array = [];
        for (let i = 0; i < project.categories.length; i++) {
            categories_array.push(project.categories[i].title);
        }
        if (categories_array.length === 0) {
            console.log("There are no categories in the system")
        }
        else {
            console.log("Which category do you wish to edit?");
            const category_choice = choose(categories_array);
            visit_category(project, project.categories[category_choice - 1]);
        }
        category_function(project);
    }
    else if (choice === 2) {
        console.log("");
        console.log("Creating a new category");
        const title: string = prompt("Choose a title for the category: ");
        console.log("New category", title, "created succesfully");
        const category: Category = { title: title, task_ids: [] };
        project.categories.push(category);
        category_function(project);
    }
    else if (choice === 3) {
        open_project();
    }
}

/**
 * A menu with alternatives to add or remove a task from this category
 * @param project the currently opened project
 * @param category the category chosen before this function call
 */
function visit_category(project: Project, category: Category): void {
    console.log("");
    console.log("Category", category.title, "selected");
    console.log("What do you wish to do?");
    const choice = choose(["Add a task to this category", "Remove a task from this category", "Back"]);
    if (choice === 1) {
        console.log("");
        let filtered_task_ids_array: Array<number> = [];
        for (let i = 0; i < project.task_ids.length; i++) {
            if (category.task_ids.filter((x) => x !== project.task_ids[i]).length === category.task_ids.length) {
                filtered_task_ids_array.push(project.task_ids[i]);
            }
        }
        let task_titles_array: Array<string> = [];
        for (let i = 0; i < filtered_task_ids_array.length; i++) {
            const task = ph_lookup(project.task_table, filtered_task_ids_array[i]);
            if (task !== undefined) {
                task_titles_array.push(task.title);
            }
        }
        if (task_titles_array.length !== 0) {
            console.log("Which task do you want to add to", category.title, "?");
            const task_title_number = choose(task_titles_array);
            category.task_ids.push(filtered_task_ids_array[task_title_number - 1]);
            console.log(task_titles_array[task_title_number - 1], "succesfully added to", category.title);
        }
        else {
            console.log("There are no tasks that can be added to this category");
        }
        visit_category(project, category);
    }
    else if (choice === 2) {
        if (category.task_ids.length !== 0) {
            let task_titles_array: Array<string> = [];
            for (let i = 0; i < category.task_ids.length; i++) {
                const task = ph_lookup(project.task_table, category.task_ids[i]);
                if (task !== undefined) {
                    task_titles_array.push(task.title);
                }
            }
            const task_title_number = choose(task_titles_array);
            category.task_ids = category.task_ids.filter((x) => x !== category.task_ids[task_title_number - 1]);
            console.log(task_titles_array[task_title_number - 1], "succesfully removed from", category.title);
        }
        else {
            console.log("There are no tasks in this category");
        }
        visit_category(project, category);
    }
    else if (choice === 3) {
        category_function(project);
    }
}

//main call
menu();