import { roles } from "@/utils/enum";
import { JTDDataType } from "ajv/dist/jtd";
// import { employeeSchema } from "./employee-validation";
// import { EmployeeSchema } from "./employee-validation";

export type Employee = {
  // id: string;
  name: string;
  email: string;
  role: (typeof roles)[number];
  is_active: boolean | null | undefined;
  password: string;
}

export type UpdateEmployee = Pick<
  Partial<Employee>, "name" | "email" | "role" | "is_active">;

// export type Employee = JTDDataType<typeof employeeSchema>;
