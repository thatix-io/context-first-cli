export declare const featureCommands: {
    start: (issueId: string, options: {
        repos?: string;
    }) => Promise<void>;
    list: () => Promise<void>;
    switch: (issueId: string) => Promise<void>;
    end: (issueId: string, options: {
        force?: boolean;
    }) => Promise<void>;
};
//# sourceMappingURL=feature.d.ts.map