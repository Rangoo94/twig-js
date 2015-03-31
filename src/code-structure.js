/**
 * Understands structure of template
 */
export default class CodeStructure {
    constructor() {
        this.children = [];
    }

    /**
     * Add new element to this structure
     *
     * @param {String} type
     * @param {*} [data]
     * @param {CodeStructure} [codePart]
     */
    add(type, data, codePart) {
        this.children.push({
            type: type,
            data: data,
            children: codePart || null
        });
    }
}
