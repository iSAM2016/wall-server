export declare class Profile {
    id: number;
    firstName: string;
    lastName?: string;
    createdDate: Date;
    updatedDate: Date;
    get fullName(): string;
}
