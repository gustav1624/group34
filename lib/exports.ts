/**
 * A record representing a project
 * @param title the name of the project
 * @param task_table a hashtable of tasks
 */
export type Project = { title: string, task_table: TaskStorage };

/**
 * A record representing a task
 * @param title the name of the task
 * @param id a unique number for each task
 * @param description a description of the task and all necessary information
 * @param subtasks a structure of smaller tasks
 * @param status true if the task is completed
 * @param priority a number representing the priority of the task
 * @invariant the priority number must be a positive integer
 */
export type Task = { 
    title: string, 
    id: number, 
    description: string, 
    subtasks: string, 
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


export type ProbingFunction<K> = (length: number, key: K, i: number) => number;

export type HashFunction<K> = (key: K) => number;

export type TaskStorage = Hashtable<number, Task>;

export function quadratic_probing_function<K>(hash_function: HashFunction<K>): ProbingFunction<K> {
    return (length: number, key: K, i: number) => (hash_function(key) + i*i) % length;
}

export function hash_function(key: number): number {
    return key; //change this later
}

export function create_empty_hash<K, V>(length: number, probe: ProbingFunction<K>): Hashtable<K, V> {
    return { keys: new Array(length), data: new Array(length), probe: probe, size: 0 };
}

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

export function ph_lookup<K, V>(tab: Hashtable<K,V>, key: K): V | undefined {
    const index = probe_from(tab, key, 0);
    return index === undefined
           ? undefined
           : tab.data[index];
}

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

