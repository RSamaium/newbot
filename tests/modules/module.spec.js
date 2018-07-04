const assert = require('assert')
const {
    ConverseTesting,
    bot,
    user
} = require('../../testing')

describe('Module Test', () => {
    let converse, u

    beforeEach((done) => {
        converse = new ConverseTesting()
        converse.code(`
            @Event('start')
            start() {
                a = 1
                child.lazy(a)
                > Ok
                > { child.jsFunction() }
            }

            @Event('on', 'parent')
            event() {
                > event works
            }
        `)
        converse.setSkills({
            child: 'skills/child'
        })
        u = converse.createUser()
        done()
    })

    it('module test', () => {
        return u
            .conversation(
                bot `Lazy 1`,
                user `test`,
                bot `Lazy 2`,
                bot `Lazy 3`,
                user `test2`,
                bot `Lazy 4`,
                bot `Ok`,
                bot `js`
            )
    })

    it('module event', () => {
        return u
            .event('parent', testing => {
                assert.equal(testing.output(0), ['event works'])
            })
            .end()
    })

    describe('Module relation', () => {
        beforeEach((done) => {

            const hey = {
                code: `
                    @Intent(/hello/i)
                    hello() {
                        > Hey Child
                    }
                `
            }

            converse = new ConverseTesting()
            converse.code(`
                @Event('start')
                start() {
                   > Go !
                }
    
                @Intent(/hello/i)
                hello() {
                    > Hey Parent
                }
            `)
            converse.setSkills({
                hey
            })
            u = converse.createUser()
            done()
        })

        it('only hello() child is executed', () => {
            return u
                .conversation(
                    bot `Go !`,
                    user `hello`,
                    bot `Hey Child`
                )
        })
    })

})
