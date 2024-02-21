//testcases

import { generate_id } from "./Functions";


test("Create project, create task", () => {

});

test("Generate ID", () => {
    const t1 = generate_id(false);
    const t2 = generate_id(false);
    const t3 = generate_id(false);
    expect(t1 === t2 && t2 === t3).toBeFalsy();
});