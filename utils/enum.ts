const ADMIN = "admin";
const MANAGER = "manager";
const USER = "user";

export const roles = [ADMIN, MANAGER, USER] as const;

const STRING = "string";
const NUMBER = "number";
const BOOLEAN = "boolean";

export const dataTypes = [STRING, NUMBER, BOOLEAN] as const;