export default json;
declare namespace json {
    const name: string;
    const uri: string;
    const associations: never[];
    const types: {
        name: string;
        extends: string[];
        properties: ({
            name: string;
            isAttr: boolean;
            type: string;
            widget: string;
        } | {
            name: string;
            isAttr: boolean;
            type: string;
            widget?: undefined;
        })[];
    }[];
    const prefix: string;
    namespace xml {
        const tagAlias: string;
    }
}
