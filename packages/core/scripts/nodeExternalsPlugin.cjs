const path = require("path");

module.exports.nodeExternalsPlugin = {
    name: "externalize-deps",
    setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
            const id = args.path;
            if (id[0] !== "." && !path.isAbsolute(id)) {
                return {
                    external: true,
                };
            }
        });
    },
};