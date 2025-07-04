export enum Visibility {
    PUBLIC = "public",
    PRIVATE = "private",
}
export enum CommentType {
    NOTE = "note",
    SYSTEM = "system",
    APPROVAL = "approval",
}


export interface Comment {
    text: string;
    pinned: boolean;
    visibility: Visibility;
    commentType: CommentType;
    attachments: Attachment[];
}

export interface Attachment {
    url: string;
}