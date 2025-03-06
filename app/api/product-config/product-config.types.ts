import { dataTypes } from "@/utils/enum";

export type ProductConfig = {
    name: string;
    data_type: (typeof dataTypes)[number];
    is_required: boolean;
}