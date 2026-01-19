export declare const featureCommands: {
    start: (issueId: string, options: {
        repos?: string;
    }) => Promise<void>;
    list: () => Promise<void>;
    switch: (issueId: string) => Promise<void>;
    remove: (issueId: string, options: {
        force?: boolean;
    }) => Promise<void>;
    status: (issueId?: string) => Promise<void>;
    merge: (issueId: string, options: {
        targetBranch?: string;
        noPush?: boolean;
        keepWorkspace?: boolean;
        force?: boolean;
    }) => Promise<void>;
    'add-repo': (issueId: string) => Promise<void>;
    end: (issueId: string, options: {
        force?: boolean;
    }) => Promise<void>;
};
//# sourceMappingURL=feature.d.ts.map