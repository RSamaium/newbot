require('dotenv-extended').load()

const fs = require('fs')
const { assert } = require('chai')
const { ConverseTesting } = require('../index')

describe('Test Converse Testing', () => {

    let tests = []
    let dir = `${__dirname}/interpreter`

    let files = fs.readdirSync(dir)

    for (let file of files) {
        let match = /(^[^\.]+)/.exec(file)
        let [, pattern] = match
        if (tests.indexOf(pattern) >= 0) {
            continue
        }
        tests.push(pattern)
        it(`${file}`, () => {
            let converse = new ConverseTesting()
            converse.file(`${dir}/${pattern}.converse`)
            let user = converse.createUser()
            return require(`./interpreter/${pattern}.spec`)(user, assert, converse)
        })
    }

})


