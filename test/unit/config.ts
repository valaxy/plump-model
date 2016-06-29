requirejs.config({
    paths: {
        'cjs'        : 'node_modules/cjs/cjs',
        'amd-loader' : 'node_modules/amd-loader/amd-loader',
        'underscore' : 'node_modules/underscore/underscore',
        'structprint': 'node_modules/structprint'
    },

    cjs: {
        cjsPaths: [
            'structprint'
        ]
    }
})