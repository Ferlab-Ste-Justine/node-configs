const R = require('ramda')
const { assert } = require('chai');
const config_utils = require('../index')

const fn_utils = require('@cr-ste-justine/functional-utils')
const monad_utils = fn_utils.monad

const configs = {
    'test': 'test_val',
    'test2': '{"a": 1, "b": 2}',
    'test3': ', "b": 2}'
}

const get_config = (key) => {
    return {'key': key, 'val': R.prop(key, configs)}
}

const load_mandatory_str_config = config_utils.load_mandatory_str_config(get_config)
const load_optional_str_config = config_utils.load_optional_str_config(get_config, () => "fallback")
const load_mandatory_json_config = config_utils.load_mandatory_json_config(get_config)

describe('Tests config', () => {
    it('Assert that getting a mandatory string config works with the happy path', () => {
        assert.strictEqual(
            R.compose(
                monad_utils.value,
                load_mandatory_str_config
            )('test'),
            'test_val'
        )
    })

    it('Assert that getting a mandatory string config works with failure', () => {
        assert.instanceOf(
            R.compose(
                monad_utils.value,
                load_mandatory_str_config
            )('test99'),
            config_utils.ConfigUndefinedError
        )
    })

    it('Assert that getting an optional string config works with the happy path', () => {
        assert.strictEqual(
            load_optional_str_config('test'),
            'test_val'
        )
    })

    it('Assert that getting an optional string config works with the fallback value', () => {
        assert.strictEqual(
            load_optional_str_config('test99'),
            'fallback'
        )
    })

    it('Assert that getting a mandatory json config works with the happy path', () => {
        assert.deepEqual(
            R.compose(
                monad_utils.value,
                load_mandatory_json_config
            )('test2'),
            {"a": 1, "b": 2}
        )
    })

    it('Assert that getting a mandatory json config works with failure', () => {
        assert.instanceOf(
            R.compose(
                monad_utils.value,
                load_mandatory_json_config
            )('test99'),
            config_utils.ConfigUndefinedError
        )

        assert.instanceOf(
            R.compose(
                monad_utils.value,
                load_mandatory_json_config
            )('test3'),
            config_utils.ConfigMalformatedError
        )
    })
})