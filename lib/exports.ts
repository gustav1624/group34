/**
 * A record representing a project
 * @param title the name of the project
 * @param task_table a hashtable of tasks
 * @param task_ids an array of task ids belonging to the task table in the project
 * @param categories an array of categories existing within the project
 */
export type Project = { title: string, task_table: TaskStorage, task_ids: Array<number>, 
                        categories: Array<Category>, users: Array<User> };

/**
 * A record representing a category
 * @param title the name of the category
 * @param task_ids an array of task ids belonging to the category
 */
export type Category = { title: string, task_ids: Array<number> }

/**
 * A record representing a task
 * @param title the name of the task
 * @param id a unique number for each task
 * @param description a description of the task and all necessary information
 * @param subtasks a structure of smaller tasks
 * @param status true if the task is completed
 * @param priority a number representing the priority of the task
 * @invariant the priority number must be a positive integer between 1 and 5
 */
export type Task = { 
    title: string, 
    id: number, 
    description: string, 
    subtasks?: Array<SubTask>, 
    status: boolean, 
    priority: number 
};

/**
 * A record representing a subtask
 * simpler version of a task
 * @param title the name of the task
 * @param id a unique number for each task
 * @param description a description of the subtask and all necessary information
 * @param status true if the subtask is completed
 */
export type SubTask = { title: string, id: number, description: string, status: boolean };

/**
 * A record representing a person
 * @param name name of the person
 * @param task_ids an array containing ids of the tasks
 */
export type User = { name: string, task_ids: Array<number> };

//From hashtables.ts
/**
 * A hash table that resolves collisions by probing
 * @template K the type of keys
 * @template V the type of values
 * @param keys the key array. null means that a key has been deleted.
 * @param data the data associated with each key
 * @param probe the probing function
 * @param size the number of elements currently in the table
 * @invariant the key type K contains neither null nor undefined
 * @invariant If keys[i] is neither null nor undefined, 
 *     then data[i] contains a value of type V.
 * @invariant size is equal to the number of elements in keys 
 *     that are neither null nor undefined.
 */
export type Hashtable<K, V> = { 
    readonly keys: Array<K | null | undefined>, 
    readonly data: Array<V>, 
    readonly probe: ProbingFunction<K>,
    size: number
};


//from hashtables.ts
/**
 * A probing function for a probing hash table
 * @template K the type of keys
 * @param length the length of the arrays in the hash table
 * @param key the key to probe for
 * @param i the probe index (starts at 0)
 * @returns the array index to examine
 */
export type ProbingFunction<K> = (length: number, key: K, i: number) => number;

//from hashtables.ts
/**
 * A hash function for use in hash tables
 * It should have good dispersion, but does not need to be difficult to invert or predict.
 * @template K the type of keys
 * @param key the key
 * @returns the hash of the key.
 */
export type HashFunction<K> = (key: K) => number;

/**
 * Hashtable that stores all tasks
 */
export type TaskStorage = Hashtable<number, Task>;

/**
 * Defining prompt()
 */
export const prompt = require('prompt-sync')();

//from hashtables.ts
//quadratic probing with a given hash function
export function quadratic_probing_function<K>(hash_function: HashFunction<K>): ProbingFunction<K> {
    return (length: number, key: K, i: number) => (hash_function(key) + i*i) % length;
}

/**
 * Hash function
 * @param key 
 * @returns the key modulo 100
 */
export function hash_function(key: number): number {
    return key % 100; 
}

//from hashtables.ts
/**
 * Create an empty hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param length the maximum number of elements to accomodate
 * @param probe the probing function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
export function create_empty_hash<K, V>(length: number, probe: ProbingFunction<K>): Hashtable<K, V> {
    return { keys: new Array(length), data: new Array(length), probe: probe, size: 0 };
}

//from hashtables.ts
// helper function implementing probing from a given probe index i
export function probe_from<K, V>({keys, probe}: Hashtable<K, V>, key: K, i: number): number | undefined {
    function step(i: number): number | undefined {
        const index = probe(keys.length, key, i);
        return i === keys.length || keys[index] === undefined
                   ? undefined
               : keys[index] === key
                   ? index
               : step(i + 1);
    }
    return step(i);
}

//from hashtables.ts
/**
 * Search a hash table for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param tab the hash table to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
export function ph_lookup<K, V>(tab: Hashtable<K,V>, key: K): V | undefined {
    const index = probe_from(tab, key, 0);
    return index === undefined
           ? undefined
           : tab.data[index];
}

//from hashtables.ts
/**
 * Insert a key-value pair into a probing hash table.
 * Overwrites the existing value associated with the key, if any.
 * @template K the type of keys
 * @template V the type of values
 * @param tab the hash table
 * @param key the key to insert at
 * @param value the value to insert
 * @returns true if the insertion succeeded (the hash table was not full)
 */
export function ph_insert<K, V>(tab: Hashtable<K,V>, key: K, value: V): boolean {
    function insertAt(index: number): true {
        tab.keys[index] = key;
        tab.data[index] = value;
        tab.size = tab.size + 1;
        return true;
    }
    function insertFrom(i: number): boolean {
        const index = tab.probe(tab.keys.length, key, i);
        if (tab.keys[index] === key || tab.keys[index] === undefined) {
            return insertAt(index);
        } else if (tab.keys[index] === null) {
            const location = probe_from(tab, key, i);
            return insertAt(location === undefined ? index : location);
        } else {
            return insertFrom(i + 1);
        }
    }
    return tab.keys.length === tab.size ? false : insertFrom(0);
}

//from hashtables.ts
/**
 * Delete a key-value pair from a probing hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param tab the hash table
 * @param key the key to delete
 * @returns true if the key existed
 */
export function ph_delete<K, V>(tab: Hashtable<K,V>, key: K): boolean {
    const index = probe_from(tab, key, 0);
    if (index === undefined) {
        return false;
     } else { 
        tab.keys[index] = null;
        tab.size = tab.size - 1;
        return true;
    }
}