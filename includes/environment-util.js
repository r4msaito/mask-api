class EnvironmentUtil {
    static getCurrentEnvironment() {
        let sliceAt = 2;
        if (process.title === 'knex')
            sliceAt = 4;

        let slicedArgv = process.argv.slice(sliceAt);

        if (slicedArgv.length !== 0) {
            if (this.getAllowedEnvironments().includes(slicedArgv[0]))
                return slicedArgv[0];

            return 'development';
        }

        return 'development';
    }

    static getAllowedEnvironments() {
        return [
            'development',
            'staging',
            'production'
        ];
    }
}

module.exports = EnvironmentUtil;